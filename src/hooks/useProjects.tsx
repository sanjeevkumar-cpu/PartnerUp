import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  duration: string;
  team_size: string;
  status: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export const useProjects = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get user's skills first
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', user.id)
        .single();

      const userSkills = userProfile?.skills || [];

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter projects where user has matching skills or show all if no skills set
      const filteredData = data.filter(project => {
        // Don't show user's own projects
        if (project.owner_id === user.id) return false;
        
        // If user has no skills, show all projects
        if (userSkills.length === 0) return true;
        
        // Show projects where user has at least one matching skill
        return project.required_skills.some(skill => 
          userSkills.includes(skill)
        );
      });

      return filteredData as Project[];
    },
    enabled: !!user,
  });
};

export const useMyProjects = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    enabled: !!user,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: {
      title: string;
      description: string;
      required_skills: string[];
      duration: string;
      team_size: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            owner_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      toast({
        title: "Success!",
        description: "Your project has been posted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      console.error('Create project error:', error);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      // First delete all applications for this project
      await supabase
        .from('project_applications')
        .delete()
        .eq('project_id', projectId);

      // Then delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
      console.error('Delete project error:', error);
    },
  });
};
