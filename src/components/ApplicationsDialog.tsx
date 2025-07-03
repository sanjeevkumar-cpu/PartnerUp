
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Users, User, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useProjectApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationsDialogProps {
  projectId: string;
  projectTitle: string;
}

const ApplicationsDialog = ({ projectId, projectTitle }: ApplicationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: applications = [], isLoading } = useProjectApplications(projectId);
  const updateStatus = useUpdateApplicationStatus();

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    await updateStatus.mutateAsync({ applicationId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Applications ({applications.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applications for "{projectTitle}"</DialogTitle>
          <DialogDescription>
            Review and manage applications for your project.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {application.profiles.full_name}
                    </CardTitle>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {application.profiles.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Applied {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.message && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Message:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {application.message}
                      </p>
                    </div>
                  )}

                  {application.profiles.skills && application.profiles.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.profiles.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {application.profiles.bio && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Bio:</h4>
                      <p className="text-sm text-gray-600">{application.profiles.bio}</p>
                    </div>
                  )}

                  {application.profiles.work_experience && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Work Experience:</h4>
                      <p className="text-sm text-gray-600">{application.profiles.work_experience}</p>
                    </div>
                  )}

                  {application.profiles.education && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Education:</h4>
                      <p className="text-sm text-gray-600">{application.profiles.education}</p>
                    </div>
                  )}

                  {application.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'accepted')}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationsDialog;
