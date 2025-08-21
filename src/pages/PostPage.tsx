import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import posts from '../posts.json';
import { Post } from '../App';
import { BlogSidebar } from '../components/BlogSidebar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { GiscusComments } from '../components/GiscusComments';
import { Calendar, User } from 'lucide-react';

interface CategoryTree {
  [category: string]: {
    total: number;
    subcategories: Record<string, number>;
  };
}

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug) as Post | undefined;
  const [sidebarWidth, setSidebarWidth] = useState(320);

  // 카테고리 트리 생성
  const categoryTree: CategoryTree = posts.reduce((acc, post) => {
    const category = (post as Post).category || '미분류';
    const subcategory = (post as Post).subcategory || '';
    
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
    // PostPage에서는 실제 내비게이션이 필요 없으므로 빈 함수
  };

  const totalPostCount = posts.length;

  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <BlogSidebar
        categoryTree={categoryTree}
        selectedCategory={post.category || '미분류'}
        selectedSubcategory={post.subcategory || ''}
        onCategorySelect={handleCategorySelect}
        onWidthChange={setSidebarWidth}
        totalPosts={totalPostCount}
      />
      <div
        className="flex-1 flex flex-col"
        style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        <ScrollArea className="flex-1">
          <article className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12">
            <header className="mb-8">
              <Link to={`/?category=${post.category || '미분류'}`} className="text-primary font-semibold hover:underline">
                {post.category || '미분류'}
              </Link>
              <h1 className="text-yellow-title mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-4">댓글</h2>
              <GiscusComments />
            </div>
          </article>
        </ScrollArea>
      </div>
    </div>
  );
}
