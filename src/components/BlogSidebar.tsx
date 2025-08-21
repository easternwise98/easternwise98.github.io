import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogProfile } from './BlogProfile';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogSidebarProps {
  categories: Record<string, number>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onWidthChange: (width: number) => void;
  totalPosts: number;
}

export function BlogSidebar({ categories, selectedCategory, onCategorySelect, onWidthChange, totalPosts }: BlogSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const categoryList = ['전체', ...Object.keys(categories).sort()];

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
      <div
        className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${
          isResizing ? 'bg-primary/40' : ''
        }`}
        onMouseDown={handleMouseDown}
      />

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
        <Link to="/">
          <h2 className="text-sidebar-foreground font-semibold hover:text-primary transition-colors">BeTwins's Blog</h2>
        </Link>
        <ThemeToggle />
      </div>

      <BlogProfile totalPosts={totalPosts} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <h4 className="text-sidebar-foreground mb-4 font-medium">목차</h4>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {categoryList.map((categoryName, index) => {
              const categoryItem = (
                <motion.div
                  key={categoryName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategorySelect(categoryName)}
                  className={`
                    flex items-center justify-between p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200
                    ${selectedCategory === categoryName
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className={selectedCategory === categoryName ? 'text-sidebar-primary-foreground' : 'text-foreground'}>
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium">{categoryName}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`
                      text-xs
                      ${selectedCategory === categoryName
                        ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                        : 'bg-sidebar-accent text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    {categoryName === '전체' ? totalPosts : categories[categoryName]}
                  </Badge>
                </motion.div>
              );

              if (categoryName === '전체') {
                return <Link key="home-link" to="/">{categoryItem}</Link>;
              }
              return categoryItem;
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}