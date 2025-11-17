"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import Link from "next/link";

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSubmit?: (content: string, parentId?: string | null) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  postId,
  parentId = null,
  onSubmit,
  onCancel,
  placeholder = "댓글을 작성해주세요...",
  autoFocus = false,
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }

    if (!content.trim()) {
      toast.error("댓글 내용을 입력해주세요");
      return;
    }

    if (content.length > 2000) {
      toast.error("댓글은 2000자를 초과할 수 없습니다");
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit?.(content.trim(), parentId);
      setContent("");
      toast.success(parentId ? "답글이 작성되었습니다" : "댓글이 작성되었습니다");
    } catch (error) {
      console.error("Comment submit error:", error);
      toast.error("댓글 작성 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          댓글을 작성하려면 로그인이 필요합니다
        </p>
        <Link href={`/login?redirectTo=/community/${postId}`}>
          <Button size="sm">로그인하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {user ? (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
            maxLength={2000}
            autoFocus={autoFocus}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {content.length} / 2,000
            </span>
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="bg-accent hover:bg-accent/90"
              >
                <Send className="h-3 w-3 mr-1" />
                {isSubmitting ? "작성 중..." : parentId ? "답글 작성" : "댓글 작성"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
