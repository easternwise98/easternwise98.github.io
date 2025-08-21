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

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug) as Post | undefined;
  const [sidebarWidth, setSidebarWidth] = useState(320);

  // This is needed for the sidebar, we can just use a dummy handler for now
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = posts.reduce((acc, post) => {
    const category = (post as Post).category || '미분류';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);


  const totalPostCount = posts.length;

  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <BlogSidebar
        categories={categories}
        selectedCategory={post.category || '미분류'}
        onCategorySelect={setSelectedCategory} // Dummy handler, clicking will navigate via Link
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
