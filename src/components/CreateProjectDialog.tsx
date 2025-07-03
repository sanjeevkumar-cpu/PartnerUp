
import { useState } from 'react';
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
import { Plus, X } from 'lucide-react';
import { useCreateProject } from '@/hooks/useProjects';

const CreateProjectDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const createProject = useCreateProject();

  const availableSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
    'HTML/CSS', 'PHP', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Flutter', 'React Native', 'Vue.js', 'Angular', 'Django', 'Flask',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker',
    'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Machine Learning', 'AI'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !duration || !teamSize) {
      return;
    }

    await createProject.mutateAsync({
      title,
      description,
      required_skills: skills,
      duration,
      team_size: teamSize,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDuration('');
    setTeamSize('');
    setSkills([]);
    setSkillInput('');
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to find collaborators with the right skills.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1 month">1 month</SelectItem>
                  <SelectItem value="2-3 months">2-3 months</SelectItem>
                  <SelectItem value="6+ months">6+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team-size">Team Size</Label>
              <Select value={teamSize} onValueChange={setTeamSize} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3 people">2-3 people</SelectItem>
                  <SelectItem value="4-5 people">4-5 people</SelectItem>
                  <SelectItem value="6+ people">6+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Required Skills</Label>
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
              disabled={createProject.isPending}
            >
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
