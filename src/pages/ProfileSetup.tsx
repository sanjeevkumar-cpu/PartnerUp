
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, X, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const availableSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
    'HTML/CSS', 'PHP', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Flutter', 'React Native', 'Vue.js', 'Angular', 'Django', 'Flask',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker',
    'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Machine Learning', 'AI',
    'Blockchain', 'Solidity', 'Web3', 'DevOps', 'GraphQL', 'REST API'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (profile) {
      setFullName(profile.full_name || user.user_metadata?.full_name || '');
      setBio(profile.bio || '');
      setWorkExperience(profile.work_experience || '');
      setEducation(profile.education || '');
      setSkills(profile.skills || []);
    }
  }, [profile, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || skills.length === 0) {
      return;
    }
    
    try {
      await updateProfile.mutateAsync({
        full_name: fullName,
        bio,
        work_experience: workExperience,
        education,
        skills,
      });

      navigate('/');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const canSkip = profile?.full_name && profile?.skills && profile.skills.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Let's set up your profile to find the perfect project matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full-name">Full Name *</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label>Skills * (Select at least one)</Label>
              <div className="space-y-3">
                <Select value="" onValueChange={addSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills
                      .filter(skill => !skills.includes(skill))
                      .map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="work-experience">Work Experience</Label>
              <Textarea
                id="work-experience"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                placeholder="Describe your work experience..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Describe your educational background..."
                rows={2}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {canSkip && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
              )}
              <Button
                type="submit"
                disabled={updateProfile.isPending || !fullName.trim() || skills.length === 0}
                className="flex-1"
              >
                {updateProfile.isPending ? (
                  'Saving...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
