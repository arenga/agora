"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface UseBookmarkOptions {
  targetType: "philostory" | "post";
  targetId: string;
  initialIsBookmarked?: boolean;
}

export function useBookmark({
  targetType,
  targetId,
  initialIsBookmarked = false,
}: UseBookmarkOptions) {
  const { user } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = useCallback(async () => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      const supabase = createClient();

      if (previousState) {
        // 북마크 삭제
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("target_type", targetType)
          .eq("target_id", targetId);

        if (error) throw error;
        toast.success("북마크를 해제했습니다");
      } else {
        // 북마크 추가
        const { error } = await supabase.from("bookmarks").insert({
          user_id: user.id,
          target_type: targetType,
          target_id: targetId,
        });

        if (error) throw error;
        toast.success("북마크에 추가했습니다");
      }
    } catch (error) {
      // Rollback on error
      setIsBookmarked(previousState);
      toast.error("북마크 처리 중 오류가 발생했습니다");
      console.error("Bookmark error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isBookmarked, isLoading, targetType, targetId]);

  return {
    isBookmarked,
    toggleBookmark,
    isLoading,
  };
}
