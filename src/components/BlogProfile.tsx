import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Github, Mail, Linkedin, GraduationCap } from "lucide-react";

export function BlogProfile() {
  return (
    <div className="p-6 border-b border-sidebar-border bg-sidebar">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="프로필" />
          <AvatarFallback>연구자</AvatarFallback>
        </Avatar>
        
        <div className="text-center space-y-2">
          <h3 className="text-sidebar-foreground font-semibold">김구조</h3>
          <p className="text-sidebar-foreground/70 text-sm">구조공학 연구자</p>
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            Ph.D. Structural Engineering
          </Badge>
        </div>
        
        <div className="flex space-x-3">
          <Github className="w-5 h-5 text-sidebar-foreground/60 hover:text-primary cursor-pointer transition-colors" />
          <Linkedin className="w-5 h-5 text-sidebar-foreground/60 hover:text-primary cursor-pointer transition-colors" />
          <GraduationCap className="w-5 h-5 text-sidebar-foreground/60 hover:text-accent cursor-pointer transition-colors" />
          <Mail className="w-5 h-5 text-sidebar-foreground/60 hover:text-primary cursor-pointer transition-colors" />
        </div>
        
        <div className="text-center space-y-1">
          <p className="text-sidebar-foreground/60 text-sm">총 논문 & 연구글</p>
          <p className="text-sidebar-foreground font-medium">67개</p>
        </div>
      </div>
    </div>
  );
}