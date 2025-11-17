"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Eye,
  Bookmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post, Profile } from "@/types/database";

interface PostCardProps {
  post: Post & { author?: Profile };
  onUpvote?: (postId: string) => void;
  onDownvote?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  userVote?: 1 | -1 | null;
  isBookmarked?: boolean;
}

const categoryLabels: Record<string, string> = {
  discussion: "토론",
  question: "질문",
  insight: "인사이트",
  recommendation: "추천",
  free: "자유",
};

const categoryColors: Record<string, string> = {
  discussion: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  question:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  insight:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  recommendation:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  free: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function PostCard({
  post,
  onUpvote,
  onDownvote,
  onBookmark,
  userVote,
  isBookmarked,
}: PostCardProps) {
  const voteScore = post.upvotes - post.downvotes;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 min-w-[50px]">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                userVote === 1 && "text-accent bg-accent/10"
              )}
              onClick={() => onUpvote?.(post.id)}
            >
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span
              className={cn(
                "font-semibold text-sm",
                voteScore > 0 && "text-accent",
                voteScore < 0 && "text-destructive"
              )}
            >
              {voteScore}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                userVote === -1 && "text-blue-600 bg-blue-100"
              )}
              onClick={() => onDownvote?.(post.id)}
            >
              <ArrowBigDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  categoryColors[post.category] || categoryColors.free
                )}
              >
                {categoryLabels[post.category] || post.category}
              </Badge>
              {post.is_pinned && (
                <Badge variant="default" className="text-xs bg-accent">
                  고정
                </Badge>
              )}
            </div>

            <Link
              href={`/community/${post.id}`}
              className="block group"
            >
              <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {post.content.replace(/<[^>]*>/g, "").slice(0, 200)}
              </p>
            </Link>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 5).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    #{tag}
                  </Badge>
                ))}
                {post.tags.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.tags.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">
                  {post.author?.nickname || "익명"}
                </span>
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comment_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.view_count}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 w-6 p-0",
                    isBookmarked && "text-accent"
                  )}
                  onClick={() => onBookmark?.(post.id)}
                >
                  <Bookmark
                    className={cn("h-4 w-4", isBookmarked && "fill-current")}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
