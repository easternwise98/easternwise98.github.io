import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function AdvancedSearch({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  sortBy,
  onSortChange,
}: AdvancedSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState<{start?: Date, end?: Date}>({});

  const clearFilters = () => {
    onSearchChange("");
    selectedTags.forEach(tag => onTagToggle(tag));
    setDateRange({});
    onSortChange("latest");
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || dateRange.start || dateRange.end;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors duration-200" />
          <Input
            placeholder="제목, 내용, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Filter className="w-4 h-4" />
            </motion.div>
          </Button>
        </motion.div>
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showAdvanced && (
        <motion.div
          key="advanced-search"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-lg p-4 space-y-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 정렬 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">정렬</label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                    <SelectItem value="views">조회수순</SelectItem>
                    <SelectItem value="likes">좋아요순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 날짜 범위 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">작성일</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start ? (
                        dateRange.end ? (
                          `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                        ) : (
                          dateRange.start.toLocaleDateString()
                        )
                      ) : (
                        "날짜 선택"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dateRange.start,
                        to: dateRange.end,
                      }}
                      onSelect={(range) => {
                        setDateRange({
                          start: range?.from,
                          end: range?.to,
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* 태그 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">태그 필터</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <motion.div
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-md"
                      onClick={() => onTagToggle(tag)}
                    >
                      #{tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 선택된 필터 표시 */}
            {hasActiveFilters && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">활성 필터</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-all duration-200"
                        onClick={() => onTagToggle(tag)}
                      >
                        #{tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
    </div>
  );
}
