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

export function PostListPage({ posts }: PostListPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [sidebarWidth, setSidebarWidth] = useState(320);

  // 모든 태그와 카테고리 동적 생성
  const availableTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();
  const categories = posts.reduce((acc, post) => {
    const category = post.category || '미분류';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

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
      const matchesCategory = selectedCategory === '전체' || postCategory === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => post.tags.includes(tag));
      return matchesCategory && matchesSearch && matchesTags;
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

  return (
    <div className="flex h-screen bg-background">
      <BlogSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
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
              {selectedCategory === '전체' ? '모든 연구글' : selectedCategory} ({filteredPosts.length})
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
