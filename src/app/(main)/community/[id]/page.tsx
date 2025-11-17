"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  Share2,
  MessageSquare,
  Eye,
  Flag,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentItem } from "@/components/community/comment-item";
import { CommentForm } from "@/components/community/comment-form";
import { useBookmark } from "@/hooks/use-bookmark";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Post, Comment, Profile } from "@/types/database";

// 샘플 데이터
const samplePost: Post & { author?: Profile } = {
  id: "1",
  author_id: "user1",
  title: "니체의 '신은 죽었다'를 현대 사회에 어떻게 적용할 수 있을까요?",
  content: `니체가 말한 '신은 죽었다'는 단순히 종교의 죽음이 아니라 전통적 가치 체계의 붕괴를 의미한다고 생각합니다.

19세기 후반, 니체는 계몽주의와 과학의 발전으로 인해 기독교적 세계관이 더 이상 서구 사회의 도덕적 기반으로 기능하지 못하게 되었음을 선언했습니다. 하지만 이것은 단순한 무신론적 선언이 아니었습니다.

니체의 핵심 질문은 이것입니다: "신이 죽은 후, 우리는 어떤 가치를 기반으로 살아가야 하는가?"

현대 사회를 보면, 우리는 여전히 이 질문에 답하지 못한 것 같습니다. 전통적 가치는 약해졌지만, 그것을 대체할 새로운 가치 체계는 명확하지 않습니다. 대신 우리는:

1. **소비주의**: 물질적 풍요를 행복의 척도로 삼습니다
2. **개인주의**: 자기 자신만을 최우선으로 생각합니다
3. **상대주의**: 모든 가치가 동등하다고 주장하며 진정한 판단을 회피합니다

니체는 '위버멘쉬(초인)'의 개념을 통해 해결책을 제시했습니다. 스스로 가치를 창조하고, 삶을 긍정하며, 운명을 사랑하는 존재가 되라는 것입니다.

**여러분의 생각이 궁금합니다:**
- 현대 사회에서 우리는 어떤 새로운 가치를 만들어가야 할까요?
- 니체의 '위버멘쉬' 개념이 현실적으로 실현 가능할까요?
- 전통적 가치의 상실이 정말 문제일까요, 아니면 새로운 자유의 시작일까요?`,
  category: "discussion",
  tags: ["니체", "허무주의", "현대철학", "가치관", "위버멘쉬"],
  upvotes: 42,
  downvotes: 3,
  comment_count: 15,
  view_count: 234,
  is_pinned: true,
  created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  author: {
    id: "user1",
    nickname: "철학하는개발자",
    avatar_url: null,
    bio: "개발과 철학의 교차점에서 생각합니다",
    interests: { philosophers: ["니체", "사르트르"], themes: ["실존주의", "허무주의"] },
    reading_streak: 7,
    total_highlights: 23,
    total_posts: 12,
    total_comments: 45,
    created_at: "",
    updated_at: "",
  },
};

const sampleComments: (Comment & { author?: Profile })[] = [
  {
    id: "c1",
    post_id: "1",
    author_id: "user2",
    parent_id: null,
    content:
      "정말 깊이 있는 질문이네요. 저는 니체의 '신은 죽었다'가 현대 사회에서 더욱 절실하게 다가온다고 생각합니다. SNS 시대에 우리는 매 순간 '좋아요'와 '팔로워'라는 새로운 신을 숭배하고 있는 것 같아요.",
    upvotes: 18,
    downvotes: 1,
    depth: 0,
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    author: {
      id: "user2",
      nickname: "디지털노마드",
      avatar_url: null,
      bio: null,
      interests: { philosophers: [], themes: [] },
      reading_streak: 3,
      total_highlights: 12,
      total_posts: 5,
      total_comments: 28,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "c2",
    post_id: "1",
    author_id: "user3",
    parent_id: "c1",
    content:
      "동의합니다! 특히 '좋아요'를 새로운 신으로 보는 관점이 인상적이에요. 우리는 타인의 인정을 갈구하며 살고 있죠. 니체라면 이것도 '노예 도덕'의 한 형태라고 했을 것 같습니다.",
    upvotes: 12,
    downvotes: 0,
    depth: 1,
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    author: {
      id: "user3",
      nickname: "철학입문자",
      avatar_url: null,
      bio: null,
      interests: { philosophers: [], themes: [] },
      reading_streak: 1,
      total_highlights: 5,
      total_posts: 2,
      total_comments: 15,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "c3",
    post_id: "1",
    author_id: "user4",
    parent_id: null,
    content:
      "위버멘쉬의 실현 가능성에 대해 회의적입니다. 현실적으로 모든 사람이 자신만의 가치를 창조할 수 있을까요? 오히려 카뮈의 시지프스 신화가 더 현실적인 대안을 제시한다고 봅니다. 부조리를 인정하되, 그 속에서 의미를 찾는 것이죠.",
    upvotes: 25,
    downvotes: 2,
    depth: 0,
    created_at: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    author: {
      id: "user4",
      nickname: "실존주의연구자",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["카뮈"], themes: ["실존주의"] },
      reading_streak: 14,
      total_highlights: 67,
      total_posts: 8,
      total_comments: 52,
      created_at: "",
      updated_at: "",
    },
  },
];

const categoryLabels: Record<string, string> = {
  discussion: "토론",
  question: "질문",
  insight: "인사이트",
  recommendation: "추천",
  free: "자유",
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [post, setPost] = useState<(Post & { author?: Profile }) | null>(null);
  const [comments, setComments] = useState<(Comment & { author?: Profile })[]>([]);
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { isBookmarked, toggleBookmark } = useBookmark({
    targetType: "post",
    targetId: params.id as string,
    initialIsBookmarked: false,
  });

  useEffect(() => {
    // TODO: Fetch from Supabase
    setPost(samplePost);
    setComments(sampleComments);
  }, [params.id]);

  const handleVote = (voteType: 1 | -1) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    if (!post) return;

    // Optimistic update
    if (userVote === voteType) {
      setUserVote(null);
      setPost({
        ...post,
        upvotes: voteType === 1 ? post.upvotes - 1 : post.upvotes,
        downvotes: voteType === -1 ? post.downvotes - 1 : post.downvotes,
      });
    } else {
      if (userVote === 1) setPost({ ...post, upvotes: post.upvotes - 1 });
      if (userVote === -1) setPost({ ...post, downvotes: post.downvotes - 1 });

      setUserVote(voteType);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              upvotes: voteType === 1 ? prev.upvotes + 1 : prev.upvotes,
              downvotes: voteType === -1 ? prev.downvotes + 1 : prev.downvotes,
            }
          : prev
      );
    }
    // TODO: Save to Supabase
  };

  const handleCommentVote = (commentId: string, voteType: 1 | -1) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    console.log(`Vote ${voteType} on comment ${commentId}`);
    // TODO: Implement comment voting
  };

  const handleAddComment = (content: string, parentId?: string | null) => {
    if (!user) return;

    const newComment: Comment & { author?: Profile } = {
      id: crypto.randomUUID(),
      post_id: params.id as string,
      author_id: user.id,
      parent_id: parentId || null,
      content,
      upvotes: 0,
      downvotes: 0,
      depth: parentId ? 1 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: user.id,
        nickname: user.email?.split("@")[0] || "사용자",
        avatar_url: null,
        bio: null,
        interests: { philosophers: [], themes: [] },
        reading_streak: 0,
        total_highlights: 0,
        total_posts: 0,
        total_comments: 0,
        created_at: "",
        updated_at: "",
      },
    };

    if (parentId) {
      // Insert reply after parent
      const parentIndex = comments.findIndex((c) => c.id === parentId);
      const newComments = [...comments];
      newComments.splice(parentIndex + 1, 0, newComment);
      setComments(newComments);
    } else {
      setComments([...comments, newComment]);
    }

    setReplyingTo(null);
    setPost((prev) =>
      prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev
    );
    // TODO: Save to Supabase
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
    setPost((prev) =>
      prev ? { ...prev, comment_count: prev.comment_count - 1 } : prev
    );
    toast.success("댓글이 삭제되었습니다");
    // TODO: Delete from Supabase
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다");
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  const voteScore = post.upvotes - post.downvotes;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const isAuthor = user?.id === post.author_id;

  // Organize comments into tree structure
  const rootComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          커뮤니티로 돌아가기
        </Button>
      </Link>

      {/* Post Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0",
                  userVote === 1 && "text-accent bg-accent/10"
                )}
                onClick={() => handleVote(1)}
              >
                <ArrowBigUp className="h-6 w-6" />
              </Button>
              <span
                className={cn(
                  "font-bold text-lg",
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
                  "h-10 w-10 p-0",
                  userVote === -1 && "text-blue-600 bg-blue-100"
                )}
                onClick={() => handleVote(-1)}
              >
                <ArrowBigDown className="h-6 w-6" />
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">
                  {categoryLabels[post.category] || post.category}
                </Badge>
                {post.is_pinned && (
                  <Badge className="bg-accent">고정</Badge>
                )}
              </div>

              <h1 className="text-h3 font-bold mb-4">{post.title}</h1>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {post.author?.nickname?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{post.author?.nickname || "익명"}</p>
                  <p className="text-sm text-muted-foreground">
                    {timeAgo} · 조회 {post.view_count}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-slate max-w-none mb-6">
                {post.content.split("\n").map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ) : (
                    <br key={index} />
                  )
                )}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBookmark}
                  className={cn(isBookmarked && "text-accent")}
                >
                  <Bookmark
                    className={cn("h-4 w-4 mr-2", isBookmarked && "fill-current")}
                  />
                  북마크
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </Button>
                {isAuthor && (
                  <>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Flag className="h-4 w-4 mr-2" />
                  신고
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 {post.comment_count}개
          </h2>

          {/* Comment Form */}
          <div className="mb-8">
            <CommentForm
              postId={params.id as string}
              onSubmit={handleAddComment}
            />
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {rootComments.length > 0 ? (
              rootComments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem
                    comment={comment}
                    onReply={() => setReplyingTo(comment.id)}
                    onUpvote={(id) => handleCommentVote(id, 1)}
                    onDownvote={(id) => handleCommentVote(id, -1)}
                    onDelete={handleDeleteComment}
                  >
                    {/* Replies */}
                    {getReplies(comment.id).map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        onReply={() => setReplyingTo(reply.id)}
                        onUpvote={(id) => handleCommentVote(id, 1)}
                        onDownvote={(id) => handleCommentVote(id, -1)}
                        onDelete={handleDeleteComment}
                      />
                    ))}
                  </CommentItem>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 ml-11">
                      <CommentForm
                        postId={params.id as string}
                        parentId={comment.id}
                        onSubmit={handleAddComment}
                        onCancel={() => setReplyingTo(null)}
                        placeholder="답글을 작성해주세요..."
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>아직 댓글이 없습니다</p>
                <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
