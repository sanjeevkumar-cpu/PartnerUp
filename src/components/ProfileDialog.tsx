
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, X, Settings } from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

const ProfileDialog = () => {
  const [open, setOpen] = useState(false);
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
    'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Machine Learning', 'AI'
  ];

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setWorkExperience(profile.work_experience || '');
      setEducation(profile.education || '');
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfile.mutateAsync({
      full_name: fullName,
      bio,
      work_experience: workExperience,
      education,
      skills,
    });

    setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Complete your profile to get better project recommendations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
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
            <Label>Skills</Label>
            <div className="space-y-2">
              <Select value={skillInput} onValueChange={addSkill}>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
