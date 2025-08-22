import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import posts from '../posts.json';
import { Post } from '../App';
import { BlogSidebar } from '../components/BlogSidebar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { GiscusComments } from '../components/GiscusComments';
import { Calendar, User, Heart, Eye } from 'lucide-react';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface CategoryTree {
  [category: string]: {
    total: number;
    subcategories: Record<string, number>;
  };
}

interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug) as Post | undefined;
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // TOC Generation Effect
  useEffect(() => {
    if (post) {
      const headingLines = post.content.split('\n').filter(line => line.startsWith('#'));
      const headings = headingLines.map(line => {
        const level = line.indexOf(' ');
        const text = line.substring(level + 1);
        const slug = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
        return { level, text, slug };
      });
      setToc(headings);
    }
  }, [post]);

  // Like status initialization from localStorage
  useEffect(() => {
    if (post) {
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      if (likedPosts.includes(post.slug)) {
        setIsLiked(true);
      }
    }
  }, [post]);

  const handleLike = () => {
    if (!post) return;
    
    setIsLiked(currentIsLiked => {
      const newIsLiked = !currentIsLiked;
      if (newIsLiked) {
        setLikes(currentLikes => currentLikes + 1);
      } else {
        setLikes(currentLikes => currentLikes - 1);
      }
      
      const likedPosts: string[] = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      if (newIsLiked) {
        localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, post.slug]));
      } else {
        localStorage.setItem('liked_posts', JSON.stringify(likedPosts.filter(s => s !== post.slug)));
      }
      return newIsLiked;
    });
  };

  const categoryTree: CategoryTree = posts.reduce((acc, post) => {
    const category = (post as Post).category || '미분류';
    const subcategory = (post as Post).subcategory || '';
    
    if (!acc[category]) {
      acc[category] = { total: 0, subcategories: {} };
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

  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <BlogSidebar
        categoryTree={categoryTree}
        selectedCategory={post.category || '미분류'}
        selectedSubcategory={post.subcategory || ''}
        onCategorySelect={() => {}}
        totalPosts={posts.length}
      />
      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="flex justify-center p-6 sm:p-8 lg:p-12">
            <main className="w-full max-w-4xl">
              <article>
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
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                       <Button variant="ghost" size="icon" onClick={handleLike} className="h-auto w-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full">
                         <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                       </Button>
                       <span className="w-4 text-center">{likes}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                </header>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}>{post.content}</ReactMarkdown>
                </div>
              </article>
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold mb-4">댓글</h2>
                <GiscusComments />
              </div>
            </main>
            <aside className="hidden xl:block w-64 ml-12 sticky top-24 self-start">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">목차</h3>
                <ul className="space-y-2">
                  {toc.map(item => (
                    <li key={item.slug} style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}>
                      <a href={`#${item.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
