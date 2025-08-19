import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Eye, Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BlogPostProps {
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

export function BlogPost({ 
  title, 
  excerpt, 
  category, 
  date, 
  readTime, 
  views, 
  likes, 
  tags,
  imageUrl,
  isNew = false 
}: BlogPostProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="w-full"
    >
      <Card className="bg-card border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full overflow-hidden">
        {/* 대표 이미지 */}
        {imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {isNew && (
              <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-medium">
                NEW
              </Badge>
            )}
          </div>
        )}
        
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs font-medium">
              {category}
            </Badge>
            {!imageUrl && isNew && (
              <Badge className="bg-accent text-accent-foreground text-xs font-medium">
                NEW
              </Badge>
            )}
          </div>
          <h3 className="text-yellow-title group-hover:text-yellow-title/80 transition-colors font-bold text-lg leading-tight line-clamp-2">
            {title}
          </h3>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-card-foreground/80 leading-relaxed line-clamp-3 text-sm">
            {excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="hover:bg-accent text-xs border-border/50 text-muted-foreground hover:text-accent-foreground">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{readTime}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}