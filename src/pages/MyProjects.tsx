
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMyProjects } from '@/hooks/useProjects';
import { Clock, Users, User, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ApplicationsDialog from '@/components/ApplicationsDialog';
import CreateProjectDialog from '@/components/CreateProjectDialog';

const MyProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useMyProjects();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <h1 className="text-2xl font-bold text-blue-600">My Projects</h1>
            </div>
            <CreateProjectDialog />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-4">Create your first project to start finding collaborators!</p>
            <CreateProjectDialog />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {project.profiles?.full_name || 'You'}
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

                  <div className="flex items-center gap-2">
                    <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                    <ApplicationsDialog 
                      projectId={project.id} 
                      projectTitle={project.title}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProjects;
