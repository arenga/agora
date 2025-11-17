"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface UseVoteOptions {
  targetType: "post" | "comment";
  targetId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote?: 1 | -1 | null;
}

export function useVote({
  targetType,
  targetId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote = null,
}: UseVoteOptions) {
  const { user } = useAuthStore();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<1 | -1 | null>(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);

  const vote = useCallback(
    async (voteType: 1 | -1) => {
      if (!user) {
        toast.error("로그인이 필요합니다");
        return;
      }

      if (isLoading) return;

      setIsLoading(true);

      // Optimistic update
      const previousVote = userVote;
      const previousUpvotes = upvotes;
      const previousDownvotes = downvotes;

      // 같은 투표를 다시 클릭하면 취소
      if (userVote === voteType) {
        setUserVote(null);
        if (voteType === 1) {
          setUpvotes((prev) => prev - 1);
        } else {
          setDownvotes((prev) => prev - 1);
        }
      } else {
        // 기존 투표가 있으면 먼저 취소
        if (userVote === 1) {
          setUpvotes((prev) => prev - 1);
        } else if (userVote === -1) {
          setDownvotes((prev) => prev - 1);
        }

        // 새 투표 적용
        setUserVote(voteType);
        if (voteType === 1) {
          setUpvotes((prev) => prev + 1);
        } else {
          setDownvotes((prev) => prev + 1);
        }
      }

      try {
        const supabase = createClient();

        // DB 함수 호출
        const { error } = await supabase.rpc("handle_vote", {
          p_user_id: user.id,
          p_target_type: targetType,
          p_target_id: targetId,
          p_vote_type: userVote === voteType ? 0 : voteType, // 0은 취소
        });

        if (error) throw error;
      } catch (error) {
        // Rollback on error
        setUserVote(previousVote);
        setUpvotes(previousUpvotes);
        setDownvotes(previousDownvotes);
        toast.error("투표 처리 중 오류가 발생했습니다");
        console.error("Vote error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, userVote, upvotes, downvotes, isLoading, targetType, targetId]
  );

  const upvote = useCallback(() => vote(1), [vote]);
  const downvote = useCallback(() => vote(-1), [vote]);

  return {
    upvotes,
    downvotes,
    userVote,
    score: upvotes - downvotes,
    upvote,
    downvote,
    isLoading,
  };
}
