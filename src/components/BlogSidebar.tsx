import { useState } from "react";
import { BlogProfile } from "./BlogProfile";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Building, 
  Calculator, 
  Hammer, 
  Zap, 
  FlaskConical, 
  BookOpen,
  Lightbulb,
  Coffee,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface BlogSidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onWritePost: () => void;
  onWidthChange: (width: number) => void;
}

export function BlogSidebar({ selectedCategory, onCategorySelect, onWritePost, onWidthChange }: BlogSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(320); // 픽셀 단위
  const [isResizing, setIsResizing] = useState(false);

  const categories: Category[] = [
    { name: "전체", count: 67, icon: <BookOpen className="w-4 h-4" />, color: "text-foreground" },
    { name: "구조설계", count: 18, icon: <Building className="w-4 h-4" />, color: "text-primary" },
    { name: "내진공학", count: 15, icon: <Zap className="w-4 h-4" />, color: "text-accent" },
    { name: "구조해석", count: 12, icon: <Calculator className="w-4 h-4" />, color: "text-primary" },
    { name: "건설기술", count: 9, icon: <Hammer className="w-4 h-4" />, color: "text-accent" },
    { name: "연구방법론", count: 8, icon: <FlaskConical className="w-4 h-4" />, color: "text-primary" },
    { name: "학회발표", count: 6, icon: <Lightbulb className="w-4 h-4" />, color: "text-accent" },
    { name: "일상", count: 4, icon: <Coffee className="w-4 h-4" />, color: "text-muted-foreground" },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(280, Math.min(500, startWidth + (e.clientX - startX)));
      setSidebarWidth(newWidth);
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleSidebar = () => {
    const newWidth = sidebarWidth > 280 ? 280 : 400;
    setSidebarWidth(newWidth);
    onWidthChange(newWidth);
  };

  return (
    <div 
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col relative"
      style={{ width: sidebarWidth }}
    >
      {/* 크기 조절 핸들 */}
      <div
        className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${
          isResizing ? 'bg-primary/40' : ''
        }`}
        onMouseDown={handleMouseDown}
      />
      
      {/* 사이드바 토글 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 w-6 h-6 bg-sidebar border border-sidebar-border hover:bg-sidebar-accent z-10"
      >
        {sidebarWidth > 320 ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </Button>

      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-sidebar-foreground font-semibold">Structural Research</h2>
        <ThemeToggle />
      </div>
      
      <BlogProfile />
      
      <div className="p-4 border-b border-sidebar-border">
        <Button 
          onClick={onWritePost}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 글 작성
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h4 className="text-sidebar-foreground mb-4 font-medium">연구 분야</h4>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => onCategorySelect(category.name)}
                className={`
                  flex items-center justify-between p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedCategory === category.name 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                    : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className={selectedCategory === category.name ? 'text-sidebar-primary-foreground' : category.color}>
                    {category.icon}
                  </span>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`
                    text-xs
                    ${selectedCategory === category.name 
                      ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground' 
                      : 'bg-sidebar-accent text-sidebar-accent-foreground'
                    }
                  `}
                >
                  {category.count}
                </Badge>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}