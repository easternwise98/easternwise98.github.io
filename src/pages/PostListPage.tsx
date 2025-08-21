import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BlogSidebar } from '../components/BlogSidebar';
import { BlogPost } from '../components/BlogPost';
import { AdvancedSearch } from '../components/AdvancedSearch';
import { ScrollArea } from '../components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Post } from '../App'; // Import the Post type from App.tsx

interface PostListPageProps {
  posts: Post[];
}

interface CategoryTree {
  [category: string]: {
    total: number;
    subcategories: Record<string, number>;
  };
}

export function PostListPage({ posts }: PostListPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [sidebarWidth, setSidebarWidth] = useState(320);

  // 모든 태그와 카테고리 트리 동적 생성
  const availableTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();
  
  const categoryTree: CategoryTree = posts.reduce((acc, post) => {
    const category = post.category || '미분류';
    const subcategory = post.subcategory || '';
    
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        subcategories: {}
      };
    }
    
    acc[category].total++;
    
    if (subcategory) {
      if (!acc[category].subcategories[subcategory]) {
        acc[category].subcategories[subcategory] = 0;
      }
      acc[category].subcategories[subcategory]++;
    }
    
    return acc;
  }, {} as CategoryTree);

  const handleCategorySelect = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || '');
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getGridColumns = useCallback(() => {
    const remainingWidth = window.innerWidth - sidebarWidth - 48; // padding
    if (remainingWidth > 1400) return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
    if (remainingWidth > 1000) return 'grid-cols-1 lg:grid-cols-2';
    return 'grid-cols-1';
  }, [sidebarWidth]);

  const filteredPosts = posts
    .filter(post => {
      const postCategory = post.category || '미분류';
      const postSubcategory = post.subcategory || '';
      
      const matchesCategory = selectedCategory === '전체' || postCategory === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || postSubcategory === selectedSubcategory;
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => post.tags.includes(tag));
      return matchesCategory && matchesSubcategory && matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default: // latest
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const totalPostCount = posts.length;

  const getPageTitle = () => {
    if (selectedCategory === '전체') {
      return '모든 연구글';
    } else if (selectedSubcategory) {
      return `${selectedCategory} > ${selectedSubcategory}`;
    } else {
      return selectedCategory;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <BlogSidebar
        categoryTree={categoryTree}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategorySelect={handleCategorySelect}
        onWidthChange={setSidebarWidth}
        totalPosts={totalPostCount}
      />

      <div
        className="flex-1 flex flex-col"
        style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        <div className="p-6 border-b border-border bg-background">
          <div className="max-w-none space-y-4">
            <h1 className="text-foreground font-bold text-xl">
              {getPageTitle()} ({filteredPosts.length})
            </h1>
            <AdvancedSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={availableTags}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="max-w-none">
              <motion.div
                layout
                className={`grid gap-6 ${getGridColumns()}`}
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Link to={`/post/${post.slug}`}>
                      <BlogPost
                        title={post.title}
                        excerpt={post.summary}
                        category={post.category || '미분류'}
                        date={post.date}
                        tags={post.tags}
                        imageUrl={post.imageUrl}
                        readTime={post.readTime || ''}
                        views={post.views || 0}
                        likes={post.likes || 0}
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">검색 조건에 맞는 글이 없습니다.</p>
                </motion.div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
