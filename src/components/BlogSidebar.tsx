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
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryTree {
  [category: string]: {
    total: number;
    subcategories: Record<string, number>;
  };
}

interface BlogSidebarProps {
  categoryTree: CategoryTree;
  selectedCategory: string;
  selectedSubcategory: string;
  onCategorySelect: (category: string, subcategory?: string) => void;
  onWidthChange?: (width: number) => void;
  totalPosts: number;
}

export function BlogSidebar({ categoryTree, selectedCategory, selectedSubcategory, onCategorySelect, onWidthChange, totalPosts }: BlogSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(280, Math.min(500, startWidth + (e.clientX - startX)));
      setSidebarWidth(newWidth);
      onWidthChange?.(newWidth);
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
    onWidthChange?.(newWidth);
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
            {/* 전체 카테고리 */}
            <Link to="/">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategorySelect('전체')}
                className={`
                  flex items-center justify-between p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedCategory === '전체'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className={selectedCategory === '전체' ? 'text-sidebar-primary-foreground' : 'text-foreground'}>
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium">전체</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`
                    text-xs
                    ${selectedCategory === '전체'
                      ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                      : 'bg-sidebar-accent text-sidebar-accent-foreground'
                    }
                  `}
                >
                  {totalPosts}
                </Badge>
              </motion.div>
            </Link>

            {/* 카테고리와 서브카테고리 트리 */}
            {Object.keys(categoryTree).sort().map((categoryName, index) => {
              const categoryData = categoryTree[categoryName];
              const isExpanded = expandedCategories.has(categoryName);
              const isSelected = selectedCategory === categoryName && !selectedSubcategory;
              const hasSubcategories = Object.keys(categoryData.subcategories).length > 0;

              return (
                <div key={categoryName}>
                  {/* 메인 카테고리 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center justify-between p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200
                      ${isSelected
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <div 
                      className="flex items-center space-x-3 flex-1"
                      onClick={() => onCategorySelect(categoryName)}
                    >
                      <span className={isSelected ? 'text-sidebar-primary-foreground' : 'text-foreground'}>
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-medium">{categoryName}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`
                          text-xs
                          ${isSelected
                            ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                            : 'bg-sidebar-accent text-sidebar-accent-foreground'
                          }
                        `}
                      >
                        {categoryData.total}
                      </Badge>
                      
                      {hasSubcategories && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(categoryName);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </motion.div>

                  {/* 서브카테고리들 */}
                  {hasSubcategories && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 space-y-1"
                    >
                      {Object.entries(categoryData.subcategories).sort().map(([subcategoryName, count]) => {
                        const isSubSelected = selectedCategory === categoryName && selectedSubcategory === subcategoryName;
                        
                        return (
                          <motion.div
                            key={`${categoryName}-${subcategoryName}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ x: 4, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onCategorySelect(categoryName, subcategoryName)}
                            className={`
                              flex items-center justify-between p-2 mx-2 rounded-lg cursor-pointer transition-all duration-200
                              ${isSubSelected
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                                : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                              }
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <span className={isSubSelected ? 'text-sidebar-primary-foreground' : 'text-muted-foreground'}>
                                <FileText className="w-3 h-3" />
                              </span>
                              <span className="text-xs font-medium">{subcategoryName}</span>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`
                                text-xs
                                ${isSubSelected
                                  ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                                  : 'bg-sidebar-accent text-sidebar-accent-foreground'
                                }
                              `}
                            >
                              {count}
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
