import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Github, Mail, Copy, Check, Building2, Code, DraftingCompass, UserCircle, Briefcase, Info } from "lucide-react";
import BeTwinsLogo from '../assets/images/BeTwinsLogo.png';
import { Separator } from './ui/separator';

interface BlogProfileProps {
  totalPosts: number;
}

export function BlogProfile({ totalPosts }: BlogProfileProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const profile = {
    name: "강동현",
    job: "토목구조",
    introduction: "",
    socialLinks: [
      {
        name: 'GitHub',
        url: "https://github.com/easternwise98",
        icon: Github,
      },
      {
        name: 'Email',
        url: "mailto:ghkdekdclsrn@gmail.com",
        copyValue: "ghkdekdclsrn@gmail.com",
        icon: Mail,
      },
    ],
    skillSets: [
      {
        category: "토픽",
        icon: Building2,
        skills: ["구조공학", "Digital Twin", "BIM"],
      },
      {
        category: "소프트웨어",
        icon: DraftingCompass,
        skills: ["Midas Civil", "Rhino", "Revit-Dynamo"],
      },
      {
        category: "프로그래밍",
        icon: Code,
        skills: ["Python", "C#", "ML-DL"],
      },
    ]
  };

  const handleCopy = (text: string, linkName: string) => {
    navigator.clipboard.writeText(text);
    setCopied(linkName);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 border-b border-sidebar-border bg-sidebar">
      <div className="flex flex-col items-center space-y-6">
        {/* 프로필 정보 */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-24 h-24 border-2 border-primary/50">
            <AvatarImage src={BeTwinsLogo} alt="BeTwins Logo" />
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-sidebar-foreground font-bold text-xl flex items-center justify-center">
              <UserCircle className="w-5 h-5 mr-2" />{profile.name}
            </h3>
            <p className="text-sidebar-foreground/80 text-sm flex items-center justify-center mt-1">
              <Briefcase className="w-4 h-4 mr-2" />{profile.job}
            </p>
          </div>
        </div>

        {/* 소개 */}
        <div className="w-full text-center p-3 bg-sidebar-accent rounded-lg">
          <h4 className="flex items-center justify-center text-sm font-semibold text-sidebar-foreground/90 mb-1">
            <Info className="w-4 h-4 mr-2" />소개
          </h4>
          <p className="text-sidebar-foreground/70 text-xs">{profile.introduction}</p>
        </div>

        {/* 기술 스택 */}
        <div className="w-full space-y-4">
          {profile.skillSets.map(({ category, icon: Icon, skills }) => (
            <div key={category}>
              <h4 className="flex items-center text-sm font-semibold text-sidebar-foreground/90 mb-2">
                <Icon className="w-4 h-4 mr-2" />
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-2" />

        {/* 소셜 링크 */}
        <div className="w-full flex justify-center space-x-2">
          {profile.socialLinks.map((link) => (
            <TooltipProvider key={link.name} delayDuration={200}>
              <div className="flex items-center gap-1 rounded-full bg-sidebar-accent p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-sidebar-border transition-colors">
                      <link.icon className="w-5 h-5 text-sidebar-foreground/70" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent><p>{link.name}</p></TooltipContent>
                </Tooltip>
                {link.copyValue && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => handleCopy(link.copyValue!, link.name)}>
                        {copied === link.name ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-sidebar-foreground/70" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{copied === link.name ? '복사됨!' : `${link.name} 주소 복사`}</p></TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          ))}
        </div>

        <Separator className="my-2" />

        {/* 총 게시글 */}
        <div className="text-center">
          <p className="text-sidebar-foreground/60 text-sm">총 게시글</p>
          <p className="text-sidebar-foreground font-medium text-lg">{totalPosts}개</p>
        </div>
      </div>
    </div>
  );
}
