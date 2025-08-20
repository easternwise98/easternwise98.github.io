import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { X, Plus, Save, Eye, Image, Link } from "lucide-react";

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    content: string;
    imageUrl?: string;
  }) => void;
}

export function WritePostModal({ isOpen, onClose, onSubmit }: WritePostModalProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const categories = [
    "구조설계",
    "내진공학", 
    "구조해석",
    "건설기술",
    "연구방법론",
    "학회발표",
    "일상"
  ];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (title && excerpt && category && content) {
      onSubmit({
        title,
        excerpt,
        category,
        tags,
        content,
        imageUrl: imageUrl.trim() || undefined
      });
      
      // 폼 초기화
      setTitle("");
      setExcerpt("");
      setCategory("");
      setContent("");
      setTags([]);
      setNewTag("");
      setImageUrl("");
      setIsPreview(false);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
            <DialogTitle className="text-yellow-title">새 연구글 작성</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? "편집" : "미리보기"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!title || !excerpt || !category || !content}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                발행하기
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex flex-1 overflow-hidden">
            {/* 왼쪽 편집 영역 */}
            <div className={`${isPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-border`}>
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* 메타데이터 섹션 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 제목 */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-foreground">제목</label>
                      <Input
                        placeholder="연구글 제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    {/* 카테고리 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">연구 분야</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="분야를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 태그 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">태그</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="태그를 입력하고 Enter"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1"
                        />
                        <Button type="button" size="icon" onClick={addTag}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge key={tag} className="bg-primary text-primary-foreground">
                              #{tag}
                              <X 
                                className="w-3 h-3 ml-1 cursor-pointer" 
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 대표 이미지 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      대표 이미지 URL (선택사항)
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open('https://unsplash.com', '_blank')}
                          title="Unsplash에서 이미지 찾기"
                        >
                          <Link className="w-4 h-4" />
                        </Button>
                      </div>
                      {imageUrl && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                          <ImageWithFallback
                            src={imageUrl}
                            alt="대표 이미지 미리보기"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 요약 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">연구 요약</label>
                    <Textarea
                      placeholder="연구 내용의 요약을 작성하세요 (2-3줄)"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* 본문 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">본문 내용</label>
                    <Textarea
                      placeholder="연구 내용을 자세히 작성하세요..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* 오른쪽 미리보기 영역 */}
            {isPreview && (
              <div className="w-1/2 flex flex-col">
                <div className="px-4 py-3 border-b border-border bg-muted">
                  <h3 className="font-medium text-foreground">미리보기</h3>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-6">
                    <div className="max-w-none">
                      {/* 미리보기 카드 */}
                      <div className="bg-card border border-border rounded-lg overflow-hidden">
                        {/* 대표 이미지 미리보기 */}
                        {imageUrl && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <ImageWithFallback
                              src={imageUrl}
                              alt={title || "미리보기"}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-medium">
                              NEW
                            </Badge>
                          </div>
                        )}
                        
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            {category && (
                              <Badge className="bg-primary text-primary-foreground">
                                {category}
                              </Badge>
                            )}
                            {!imageUrl && (
                              <Badge className="bg-accent text-accent-foreground">
                                NEW
                              </Badge>
                            )}
                          </div>
                          
                          {title && (
                            <h1 className="text-yellow-title font-bold text-2xl leading-tight">
                              {title}
                            </h1>
                          )}
                          
                          {excerpt && (
                            <p className="text-card-foreground/80 leading-relaxed">
                              {excerpt}
                            </p>
                          )}
                          
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {content && (
                            <div className="border-t border-border pt-4">
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-card-foreground">
                                  {content}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
