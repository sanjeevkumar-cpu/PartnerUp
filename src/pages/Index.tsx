
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, LogOut, User, FolderOpen, Plus } from "lucide-react";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import RealProjectCard from "@/components/RealProjectCard";
import ProfileDialog from "@/components/ProfileDialog";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: profile, isLoading: profileLoading } = useProfile();

  console.log('Index page - User:', user);
  console.log('Index page - Profile:', profile);
  console.log('Index page - Projects:', projects);
  console.log('Index page - Loading states:', { loading, profileLoading, projectsLoading });

  // Redirect logic for authentication and profile completion
  useEffect(() => {
    if (loading || profileLoading) return;
    
    if (!user) {
      console.log('User not authenticated, redirecting to landing');
      navigate('/landing');
      return;
    }

    // Check if profile needs to be completed
    const hasCompleteProfile = profile?.full_name && profile?.skills && profile.skills.length > 0;
    if (!hasCompleteProfile) {
      console.log('Profile incomplete, redirecting to profile setup');
      navigate('/profile-setup');
      return;
    }
  }, [user, profile, loading, profileLoading, navigate]);

  const handleSignOut = async () => {
    console.log('Sign out initiated');
    await signOut();
    navigate('/landing');
  };

  // Show loading state while checking authentication and profile
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or profile incomplete (will redirect)
  if (!user || !profile?.full_name || !profile?.skills || profile.skills.length === 0) {
    return null;
  }

  // Show error state if projects failed to load
  if (projectsError) {
    console.error('Projects loading error:', projectsError);
  }

  // Filter projects based on user's skills and search criteria
  const userSkills = profile.skills || [];
  
  // Create comprehensive dummy projects if none exist or very few exist
  const createDummyProjects = () => [
    {
      id: 'dummy-1',
      title: 'E-commerce Mobile App',
      description: 'Looking for developers to build a modern e-commerce mobile application with React Native and Node.js backend. We need someone experienced in payment integration and real-time features.',
      required_skills: ['React Native', 'Node.js', 'JavaScript', 'MongoDB'],
      duration: '3-4 months',
      team_size: '3-4 developers',
      status: 'open',
      owner_id: 'dummy-owner-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        full_name: 'Sarah Johnson',
        email: 'sarah@example.com'
      }
    },
    {
      id: 'dummy-2',
      title: 'AI-Powered Analytics Platform',
      description: 'Building an AI-powered analytics platform for small businesses. Looking for Python developers with machine learning experience and frontend developers.',
      required_skills: ['Python', 'Machine Learning', 'React', 'PostgreSQL'],
      duration: '6 months',
      team_size: '2-3 developers',
      status: 'open',
      owner_id: 'dummy-owner-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        full_name: 'Michael Chen',
        email: 'michael@example.com'
      }
    },
    {
      id: 'dummy-3',
      title: 'Blockchain Voting System',
      description: 'Developing a secure blockchain-based voting system. Need developers with blockchain experience, smart contract development, and web3 integration.',
      required_skills: ['Blockchain', 'Solidity', 'Web3', 'JavaScript'],
      duration: '4-5 months',
      team_size: '2-3 developers',
      status: 'open',
      owner_id: 'dummy-owner-3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        full_name: 'Alex Rivera',
        email: 'alex@example.com'
      }
    },
    {
      id: 'dummy-4',
      title: 'React Dashboard Project',
      description: 'Creating a comprehensive React dashboard for data visualization. Looking for React developers with experience in charts, tables, and responsive design.',
      required_skills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
      duration: '2-3 months',
      team_size: '2-3 developers',
      status: 'open',
      owner_id: 'dummy-owner-4',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        full_name: 'Emily Davis',
        email: 'emily@example.com'
      }
    },
    {
      id: 'dummy-5',
      title: 'Mobile Fitness App',
      description: 'Building a mobile fitness tracking app with React Native. Need developers with experience in mobile development and health data integration.',
      required_skills: ['React Native', 'JavaScript', 'Firebase', 'Mobile Development'],
      duration: '4 months',
      team_size: '3-4 developers',
      status: 'open',
      owner_id: 'dummy-owner-5',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        full_name: 'David Wilson',
        email: 'david@example.com'
      }
    }
  ];

  // Always show projects - real ones first, then dummy if needed
  const allProjects = projects.length > 0 ? projects : createDummyProjects();

  const matchingProjects = allProjects.filter(project => {
    // Don't show user's own projects
    if (project.owner_id === user.id) return false;
    
    // Check if project requires skills that user has
    const hasMatchingSkill = project.required_skills.some(skill => userSkills.includes(skill));
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !selectedSkill || project.required_skills.includes(selectedSkill);
    
    return hasMatchingSkill && matchesSearch && matchesSkill;
  });

  // Get all unique skills from projects for filter dropdown
  const allSkills = Array.from(new Set(allProjects.flatMap(project => project.required_skills)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PartnerUp</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/my-projects')}>
                <FolderOpen className="h-4 w-4 mr-2" />
                My Projects
              </Button>
              <ProfileDialog />
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
                <User className="h-4 w-4" />
                <span>{profile.full_name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name?.split(' ')[0]}!</h2>
          <p className="text-gray-600">Find projects that match your skills and collaborate with amazing developers.</p>
        </div>

        {/* User Skills Display */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-skills">All Skills</SelectItem>
                {allSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateProjectDialog />
          </div>
        </div>

        {/* Projects Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Projects Matching Your Skills ({matchingProjects.length})
            </h2>
          </div>
          
          {projectsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white animate-pulse rounded-lg shadow-sm"></div>
              ))}
            </div>
          ) : projectsError ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-red-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading projects</h3>
              <p className="text-gray-500">There was an issue loading the projects. Please try refreshing the page.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matchingProjects.map((project) => (
                <RealProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {!projectsLoading && !projectsError && matchingProjects.length === 0 && allProjects.length > 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching projects found</h3>
              <p className="text-gray-500 mb-4">
                No projects found that match your skills and search criteria. Try adjusting your search or creating your own project!
              </p>
              <CreateProjectDialog />
            </div>
          )}

          {!projectsLoading && !projectsError && allProjects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
              <p className="text-gray-500 mb-4">
                Be the first to create a project and start finding collaborators!
              </p>
              <CreateProjectDialog />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
