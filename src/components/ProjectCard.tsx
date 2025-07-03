
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Calendar } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  teamSize: string;
  owner: string;
  postedDate: string;
  applicants: number;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
            {project.title}
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {project.applicants} applied
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50 hover:bg-gray-100">
              {skill}
            </Badge>
          ))}
          {project.skills.length > 3 && (
            <Badge variant="outline" className="bg-gray-50">
              +{project.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{project.teamSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Posted {project.postedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs">
                {project.owner.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{project.owner}</span>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
