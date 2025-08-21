import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Github, Mail, Copy, Check } from "lucide-react";
import BeTwinsLogo from '../assets/images/BeTwinsLogo.png';

interface BlogProfileProps {
  totalPosts: number;
}

export function BlogProfile({ totalPosts }: BlogProfileProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const profile = {
    name: "강동현",
    job: "구조공학",
    topics: ["구조공학", "Digital Twin", "BIM", "ML-DL"],
    techStack: ["Python", "Rhino", "Revit-Dynamo", "Midas Civil", "ML-DL"],
    githubUrl: "https://github.com/easternwise98",
    email: "ghkdekdclsrn@gmail.com",
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: profile.githubUrl,
      icon: Github,
    },
    {
      name: 'Email',
      url: `mailto:${profile.email}`,
      copyValue: profile.email,
      icon: Mail,
    },
  ];

  const handleCopy = (text: string, linkName: string) => {
    navigator.clipboard.writeText(text);
    setCopied(linkName);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 border-b border-sidebar-border bg-sidebar">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24 border-2 border-primary/50">
          <AvatarImage src={BeTwinsLogo} alt="BeTwins Logo" />
          <AvatarFallback>DH</AvatarFallback>
        </Avatar>

        <div className="text-center space-y-1">
          <h3 className="text-sidebar-foreground font-bold text-xl">{profile.name}</h3>
          <p className="text-sidebar-foreground/80 text-sm">{profile.job}</p>
        </div>

        <div className="w-full pt-4 space-y-3">
          <h4 className="text-sm font-semibold text-sidebar-foreground/90">주요 토픽</h4>
          <div className="flex flex-wrap gap-2">
            {profile.topics.map(topic => (
              <Badge key={topic} variant="secondary">{topic}</Badge>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-sidebar-foreground/90 pt-2">기술 스택</h4>
          <div className="flex flex-wrap gap-2">
            {profile.techStack.map(tech => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
          </div>
        </div>

        <div className="w-full pt-4">
          <div className="flex justify-center space-x-2">
            {socialLinks.map((link) => (
              <TooltipProvider key={link.name} delayDuration={200}>
                <div className="flex items-center gap-1 rounded-full bg-sidebar-accent p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-sidebar-border transition-colors">
                        <link.icon className="w-5 h-5 text-sidebar-foreground/70" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => handleCopy(link.copyValue || link.url, link.name)}>
                        {copied === link.name ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-sidebar-foreground/70" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied === link.name ? '복사됨!' : `${link.name} 주소 복사`}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <div className="text-center space-y-1 pt-4">
          <p className="text-sidebar-foreground/60 text-sm">총 게시글</p>
          <p className="text-sidebar-foreground font-medium text-lg">{totalPosts}개</p>
        </div>
      </div>
    </div>
  );
}
