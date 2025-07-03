
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Clock, Users, User, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useApplyToProject } from '@/hooks/useApplications';
import { Project } from '@/hooks/useProjects';

interface RealProjectCardProps {
  project: Project;
}

const RealProjectCard = ({ project }: RealProjectCardProps) => {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const applyToProject = useApplyToProject();

  const handleApply = async () => {
    await applyToProject.mutateAsync({
      projectId: project.id,
      message: applicationMessage,
    });
    setApplicationMessage('');
    setIsApplyDialogOpen(false);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {project.profiles?.full_name || 'Anonymous'}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {project.required_skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{project.team_size}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
          
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={project.status !== 'open'}>
                <Send className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply to "{project.title}"</DialogTitle>
                <DialogDescription>
                  Send an application to join this project. Include a message about why you'd be a good fit.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Tell the project owner why you'd be a great addition to their team..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsApplyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={applyToProject.isPending}
                  >
                    {applyToProject.isPending ? 'Sending...' : 'Send Application'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealProjectCard;
