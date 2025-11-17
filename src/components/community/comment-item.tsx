"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  MoreHorizontal,
  Flag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import type { Comment, Profile } from "@/types/database";

interface CommentItemProps {
  comment: Comment & { author?: Profile };
  onReply?: (commentId: string) => void;
  onUpvote?: (commentId: string) => void;
  onDownvote?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  userVote?: 1 | -1 | null;
  children?: React.ReactNode;
}

export function CommentItem({
  comment,
  onReply,
  onUpvote,
  onDownvote,
  onDelete,
  userVote,
  children,
}: CommentItemProps) {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const voteScore = comment.upvotes - comment.downvotes;
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const isAuthor = user?.id === comment.author_id;

  return (
    <div className={cn("group", comment.depth > 0 && "ml-6 border-l-2 pl-4")}>
      <div className="flex gap-3">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {comment.author?.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.nickname}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {comment.author?.nickname?.charAt(0) || "?"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.author?.nickname || "익명"}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {isAuthor && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                작성자
              </span>
            )}
          </div>

          {/* Comment Text */}
          <div className="text-sm whitespace-pre-wrap mb-2">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 text-sm">
            {/* Vote */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0",
                  userVote === 1 && "text-accent bg-accent/10"
                )}
                onClick={() => onUpvote?.(comment.id)}
              >
                <ArrowBigUp className="h-4 w-4" />
              </Button>
              <span
                className={cn(
                  "text-xs font-medium min-w-[20px] text-center",
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
                  "h-6 w-6 p-0",
                  userVote === -1 && "text-blue-600 bg-blue-100"
                )}
                onClick={() => onDownvote?.(comment.id)}
              >
                <ArrowBigDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Reply */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onReply?.(comment.id)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              답글
            </Button>

            {/* More Options */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

              {showMenu && (
                <div className="absolute left-0 top-full mt-1 bg-card border rounded-md shadow-lg z-10 py-1 min-w-[120px]">
                  {isAuthor && (
                    <button
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                      onClick={() => {
                        onDelete?.(comment.id);
                        setShowMenu(false);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                      삭제
                    </button>
                  )}
                  <button
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <Flag className="h-3 w-3" />
                    신고
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {children && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
}
