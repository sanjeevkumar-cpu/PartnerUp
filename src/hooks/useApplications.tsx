import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Application {
  id: string;
  project_id: string;
  applicant_id: string;
  status: string;
  message: string | null;
  applied_at: string;
  profiles: {
    full_name: string;
    email: string;
    skills: string[] | null;
    bio: string | null;
    work_experience: string | null;
    education: string | null;
  };
  projects?: {
    title: string;
  };
}

export const useApplyToProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, message }: { projectId: string; message?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_applications')
        .insert([
          {
            project_id: projectId,
            applicant_id: user.id,
            message: message || null,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-applications'] });
      toast({
        title: "Application Sent!",
        description: "Your application has been sent to the project owner.",
      });
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate key')) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this project.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send application. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
};

export const useProjectApplications = (projectId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['project-applications', projectId],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('project_applications')
        .select(`
          *,
          profiles (
            full_name,
            email,
            skills,
            bio,
            work_experience,
            education
          )
        `)
        .eq('project_id', projectId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user && !!projectId,
  });
};

export const useMyApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('project_applications')
        .select(`
          *,
          projects (
            title
          )
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ applicationId, status, projectTitle, applicantName }: { 
      applicationId: string; 
      status: string;
      projectTitle?: string;
      applicantName?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_applications')
        .update({ status })
        .eq('id', applicationId)
        .select(`
          *,
          profiles (full_name),
          projects (title, owner_id)
        `)
        .single();

      if (error) throw error;

      // Create notification for the applicant
      if (data && user) {
        const notificationTitle = status === 'accepted' 
          ? 'Application Accepted!' 
          : 'Application Update';
        
        const notificationMessage = status === 'accepted'
          ? `Your application for "${data.projects?.title}" has been accepted!`
          : `Your application for "${data.projects?.title}" has been ${status}.`;

        await supabase
          .from('notifications')
          .insert([
            {
              user_id: data.applicant_id,
              title: notificationTitle,
              message: notificationMessage,
              type: 'application_status'
            }
          ]);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-applications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Application Updated",
        description: `Application ${variables.status}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    },
  });
};
