import { useState, useCallback } from "react";
import { BlogSidebar } from "./components/BlogSidebar";
import { BlogPost } from "./components/BlogPost";
import { AdvancedSearch } from "./components/AdvancedSearch";
import { WritePostModal } from "./components/WritePostModal";
import { ScrollArea } from "./components/ui/scroll-area";
import { motion } from "motion/react";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  tags: string[];
  imageUrl?: string;
  isNew?: boolean;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "고층건물의 내진 설계 최신 동향 및 성능기반 설계법",
      excerpt: "최근 국내외 고층건물 내진설계 기준의 변화와 성능기반 설계법(Performance-Based Design)의 적용 사례를 분석합니다. 비선형 해석 방법과 실무 적용 방안을 구체적으로 다룹니다.",
      category: "내진공학",
      date: "2024.12.20",
      readTime: "15분 읽기",
      views: 2341,
      likes: 156,
      tags: ["내진설계", "고층건물", "성능기반설계", "비선형해석"],
      imageUrl: "https://images.unsplash.com/photo-1700257908452-582cb156b037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aHF1YWtlJTIwc2ltdWxhdGlvbiUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzU1NTYzMzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isNew: true
    },
    {
      id: 2,
      title: "강구조 접합부 설계: 볼트접합과 용접접합의 비교 분석",
      excerpt: "강구조 건물에서 핵심적인 접합부 설계에 대해 볼트접합과 용접접합의 장단점을 구조적, 경제적 관점에서 비교 분석합니다. 실제 프로젝트 사례를 통한 설계 가이드라인을 제공합니다.",
      category: "구조설계",
      date: "2024.12.18",
      readTime: "12분 읽기",
      views: 1876,
      likes: 98,
      tags: ["강구조", "접합부", "볼트", "용접", "설계기준"],
      imageUrl: "https://images.unsplash.com/photo-1717133107197-6e65b372b765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHN0cnVjdHVyZSUyMGJ1aWxkaW5nJTIwZnJhbWV3b3JrfGVufDF8fHx8MTc1NTU2MzM0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isNew: true
    },
    {
      id: 3,
      title: "MIDAS Civil을 활용한 교량 구조해석 실무 가이드",
      excerpt: "MIDAS Civil 프로그램을 이용한 교량 구조해석의 전 과정을 단계별로 설명합니다. 모델링부터 하중조합, 결과 해석까지 실무에서 활용할 수 있는 노하우를 공유합니다.",
      category: "구조해석",
      date: "2024.12.15",
      readTime: "20분 읽기",
      views: 3124,
      likes: 187,
      tags: ["MIDAS", "교량", "구조해석", "실무가이드"],
      imageUrl: "https://images.unsplash.com/photo-1598789392666-406be85bc973?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBlbmdpbmVlcmluZyUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NTU1NjMzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 4,
      title: "콘크리트 구조물의 내구성 평가 및 보수·보강 방법론",
      excerpt: "기존 콘크리트 구조물의 내구성 평가 방법과 효과적인 보수·보강 기술을 소개합니다. 탄산화, 염해, 알칼리골재반응 등 열화 메커니즘별 대응 방안을 제시합니다.",
      category: "건설기술",
      date: "2024.12.12",
      readTime: "18분 읽기",
      views: 1654,
      likes: 112,
      tags: ["콘크리트", "내구성", "보수보강", "열화진단"],
      imageUrl: "https://images.unsplash.com/photo-1568621943755-ae11abdcc295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGJ1aWxkaW5nJTIwc3RydWN0dXJlfGVufDF8fHx8MTc1NTU2MzM0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 5,
      title: "BIM 기반 구조설계 프로세스 혁신과 협업 체계",
      excerpt: "Building Information Modeling(BIM)을 활용한 구조설계 프로세스의 혁신 사례와 건축, 기계, 전기 분야와의 효율적인 협업 체계 구축 방안을 논의합니다.",
      category: "건설기술",
      date: "2024.12.10",
      readTime: "14분 읽기",
      views: 2198,
      likes: 143,
      tags: ["BIM", "구조설계", "협업", "디지털화"],
      imageUrl: "https://images.unsplash.com/photo-1721244654394-36a7bc2da288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwYmx1ZXByaW50JTIwZGVzaWdufGVufDF8fHx8MTc1NTQ5OTUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 6,
      title: "면진 및 제진 시스템의 원리와 국내 적용 현황",
      excerpt: "지진으로부터 건물을 보호하는 면진(Base Isolation)과 제진(Damping) 시스템의 작동 원리와 국내 적용 사례를 분석합니다. 각 시스템의 효과와 경제성을 비교 검토합니다.",
      category: "내진공학",
      date: "2024.12.08",
      readTime: "16분 읽기",
      views: 1432,
      likes: 89,
      tags: ["면진", "제진", "지진보호", "동적해석"]
    },
    {
      id: 7,
      title: "구조공학 연구자로서의 3년차 회고",
      excerpt: "박사과정을 마치고 구조공학 연구에 매진한 지 3년이 되었습니다. 연구의 어려움과 보람, 그리고 앞으로의 방향성에 대한 솔직한 이야기를 나눕니다.",
      category: "일상",
      date: "2024.12.05",
      readTime: "8분 읽기",
      views: 967,
      likes: 67,
      tags: ["연구생활", "박사과정", "회고", "구조공학"]
    },
    {
      id: 8,
      title: "유한요소해석의 기초: 이론부터 실무 적용까지",
      excerpt: "구조해석의 핵심인 유한요소법(Finite Element Method)의 기본 이론과 실무에서의 올바른 적용 방법을 설명합니다. 해석 모델의 검증과 결과 해석에 대한 가이드라인을 제공합니다.",
      category: "구조해석",
      date: "2024.12.02",
      readTime: "22분 읽기",
      views: 2876,
      likes: 198,
      tags: ["유한요소법", "FEM", "구조해석", "이론"],
      imageUrl: "https://images.unsplash.com/photo-1748273491101-9d1db5d1814d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGNvbnN0cnVjdGlvbiUyMHNpdGV8ZW58MXx8fHwxNzU1NDk2OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]);

  // 모든 태그 추출
  const availableTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleWritePost = (newPost: {
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    content: string;
    imageUrl?: string;
  }) => {
    const post: Post = {
      id: Math.max(...posts.map(p => p.id)) + 1,
      title: newPost.title,
      excerpt: newPost.excerpt,
      category: newPost.category,
      date: new Date().toLocaleDateString('ko-KR').replace(/\s/g, ''),
      readTime: `${Math.ceil(newPost.content.length / 200)}분 읽기`,
      views: 0,
      likes: 0,
      tags: newPost.tags,
      imageUrl: newPost.imageUrl,
      isNew: true
    };
    
    setPosts(prev => [post, ...prev]);
  };

  // 사이드바 크기에 따른 카드 그리드 컬럼 계산
  const getGridColumns = useCallback(() => {
    const remainingWidth = window.innerWidth - sidebarWidth - 48; // 패딩 고려
    
    if (remainingWidth > 1200) {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else if (remainingWidth > 800) {
      return "grid-cols-1 md:grid-cols-2";
    } else {
      return "grid-cols-1";
    }
  }, [sidebarWidth]);

  // 필터링 및 정렬
  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag));
      
      return matchesCategory && matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        default: // latest
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  return (
    <div className="flex h-screen bg-background">
      <BlogSidebar 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onWritePost={() => setShowWriteModal(true)}
        onWidthChange={setSidebarWidth}
      />
      
      <div 
        className="flex-1 flex flex-col"
        style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        <div className="p-6 border-b border-border bg-background">
          <div className="max-w-none space-y-4">
            <h1 className="text-foreground font-bold text-xl">
              {selectedCategory === "전체" ? "모든 연구글" : selectedCategory} ({filteredPosts.length})
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
                    key={post.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BlogPost {...post} />
                  </motion.div>
                ))}
              </motion.div>
              
              {filteredPosts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">검색 조건에 맞는 글이 없습니다.</p>
                </motion.div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
      
      <WritePostModal
        isOpen={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSubmit={handleWritePost}
      />
    </div>
  );
}