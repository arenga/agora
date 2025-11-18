"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  MessageSquare,
  Share2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Post, Comment, Profile } from "@/types/database";

// 샘플 데이터
const samplePost: Post & { author?: Profile } = {
  id: "1",
  author_id: "user1",
  title: "What are the modern implications of Nietzsche's 'God is dead'?",
  content: `Nietzsche's proclamation that "God is dead" is one of the most famous and misunderstood statements in philosophy. He wasn't celebrating the death of God, but rather pointing out that the Enlightenment had eroded the foundations of religious faith, leaving a void in morality and meaning.

How do we see this playing out in the 21st century? Are concepts like secular humanism or individual self-creation viable replacements for the moral framework that religion once provided? I'm particularly interested in discussing its impact on art, politics, and our personal search for purpose.

Let's discuss.`,
  category: "discussion",
  tags: ["Nietzsche", "Existentialism", "Philosophy"],
  upvotes: 156,
  downvotes: 12,
  comment_count: 34,
  view_count: 1280,
  is_pinned: false,
  created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  author: {
    id: "user1",
    nickname: "PhiloLover",
    avatar_url: null,
    bio: "Exploring the forms in a formless world. Believes philosophy is not just academic, but a way of life.",
    interests: { philosophers: ["니체", "플라톤"], themes: ["실존주의"] },
    reading_streak: 12,
    total_highlights: 45,
    total_posts: 23,
    total_comments: 89,
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
      "The 'void' is the key. It's not just about morality, but about the source of value itself. If there's no divine command, where do our values come from? Nietzsche's answer, the Übermensch creating his own values, is both terrifying and liberating. We see this today in the obsession with personal branding and the 'authentic self'.",
    upvotes: 45,
    downvotes: 2,
    depth: 0,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    author: {
      id: "user2",
      nickname: "SocratesDisciple",
      avatar_url: null,
      bio: null,
      interests: { philosophers: [], themes: [] },
      reading_streak: 8,
      total_highlights: 32,
      total_posts: 15,
      total_comments: 67,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "c2",
    post_id: "1",
    author_id: "user3",
    parent_id: null,
    content:
      "I think the rise of political polarization can be seen as a direct consequence. People are clinging to political ideologies with a religious-like fervor because they offer a sense of belonging and moral certainty that was once provided by the church.",
    upvotes: 28,
    downvotes: 5,
    depth: 0,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    author: {
      id: "user3",
      nickname: "CamusFan",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["카뮈"], themes: ["부조리"] },
      reading_streak: 5,
      total_highlights: 18,
      total_posts: 9,
      total_comments: 43,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "c3",
    post_id: "1",
    author_id: "user4",
    parent_id: "c2",
    content:
      "But has secular humanism truly failed? Organizations like Doctors Without Borders operate on a purely humanist ethic, and they accomplish incredible good in the world without any need for divine justification.",
    upvotes: 19,
    downvotes: 1,
    depth: 1,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    author: {
      id: "user4",
      nickname: "SimoneDeBeauvoirFan",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["시몬 드 보부아르"], themes: ["페미니즘"] },
      reading_streak: 20,
      total_highlights: 78,
      total_posts: 31,
      total_comments: 112,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "c4",
    post_id: "1",
    author_id: "user1",
    parent_id: "c3",
    content:
      "That's a great point. But I wonder if those organizations are sustained by a kind of 'moral residue' from our religious past. Can that residue sustain itself over generations without the foundational belief?",
    upvotes: 12,
    downvotes: 0,
    depth: 2,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    author: {
      id: "user1",
      nickname: "PhiloLover",
      avatar_url: null,
      bio: null,
      interests: { philosophers: [], themes: [] },
      reading_streak: 12,
      total_highlights: 45,
      total_posts: 23,
      total_comments: 89,
      created_at: "",
      updated_at: "",
    },
  },
];

const relatedDiscussions = [
  {
    id: "r1",
    title: "Is Nihilism the answer to modern anxiety?",
  },
  {
    id: "r2",
    title: "Camus vs. Sartre: What's the more livable existentialism?",
  },
  {
    id: "r3",
    title: "The simulation hypothesis: a modern-day Plato's Cave?",
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [post, setPost] = useState<(Post & { author?: Profile }) | null>(null);
  const [comments, setComments] = useState<(Comment & { author?: Profile })[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPost(samplePost);
    setComments(sampleComments);
  }, [params.id]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }

    setIsSubmitting(true);
    // TODO: Save to Supabase
    const newCommentObj: Comment & { author?: Profile } = {
      id: crypto.randomUUID(),
      post_id: params.id as string,
      author_id: user.id,
      parent_id: null,
      content: newComment,
      upvotes: 0,
      downvotes: 0,
      depth: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: user.id,
        nickname: user.email?.split("@")[0] || "User",
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
    setComments([...comments, newCommentObj]);
    setNewComment("");
    setIsSubmitting(false);
    toast.success("댓글이 작성되었습니다");
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: false,
    locale: ko,
  });

  // Organize comments into tree structure
  const rootComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Post Header */}
        <article className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{post.author?.nickname}</span>
            <span>•</span>
            <span>{timeAgo} 전</span>
            <span>•</span>
            <span>조회 {post.view_count}</span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none mb-8">
            {post.content.split("\n").map((paragraph, index) =>
              paragraph.trim() ? (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Flag className="h-4 w-4 mr-2" />
              신고
            </Button>
          </div>
        </article>

        {/* Best Insights */}
        {rootComments.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              베스트 인사이트
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">
                    {rootComments[0].author?.nickname?.charAt(0) || "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {rootComments[0].author?.nickname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(rootComments[0].created_at), {
                        addSuffix: false,
                        locale: ko,
                      })}{" "}
                      전
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 text-xs">
                      베스트 답변
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {rootComments[0].content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      <ThumbsUp className="h-4 w-4" />
                      {rootComments[0].upvotes}
                    </button>
                    <button className="hover:text-gray-700">답글</button>
                    <button className="hover:text-gray-700">신고</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Comments */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            전체 댓글 ({post.comment_count})
          </h2>

          {/* Comment Form */}
          <div className="mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {user?.email?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="토론에 참여해보세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-gray-50 border-gray-200 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    댓글 작성
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {rootComments.slice(1).map((comment) => (
              <div key={comment.id} className="space-y-4">
                <CommentComponent
                  comment={comment}
                  replies={getReplies(comment.id)}
                  getReplies={getReplies}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <div className="space-y-6">
          {/* About the Author */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              작성자 정보
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-600">
                  {post.author?.nickname?.charAt(0) || "?"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author?.nickname}
                </p>
                <p className="text-xs text-gray-500">
                  가입일 2023
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {post.author?.bio || "소개가 없습니다"}
            </p>
            <Button
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              프로필 보기
            </Button>
          </div>

          {/* Related Discussions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              관련 토론
            </h3>
            <div className="space-y-3">
              {relatedDiscussions.map((discussion) => (
                <Link
                  key={discussion.id}
                  href={`/community/${discussion.id}`}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {discussion.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Deepen Understanding CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <h3 className="font-semibold mb-2">Deepen Your Understanding</h3>
            <p className="text-sm text-blue-100 mb-4">
              Explore our curated content on Nietzsche and other great thinkers. Includes essays and reading guides.
            </p>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
              Explore Curation
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CommentComponent({
  comment,
  replies,
  getReplies,
  depth = 0,
}: {
  comment: Comment & { author?: Profile };
  replies: (Comment & { author?: Profile })[];
  getReplies: (parentId: string) => (Comment & { author?: Profile })[];
  depth?: number;
}) {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className={cn(depth > 0 && "ml-8 pl-4 border-l-2 border-gray-100")}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-gray-600">
            {comment.author?.nickname?.charAt(0) || "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">
              {comment.author?.nickname}
            </span>
            {comment.author_id === samplePost.author_id && (
              <Badge className="bg-blue-100 text-blue-700 text-xs">작성자</Badge>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: false,
                locale: ko,
              })}{" "}
              전
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-700">
              <ArrowUp className="h-3 w-3" />
              {comment.upvotes}
            </button>
            <button className="hover:text-gray-700">답글</button>
            <button className="hover:text-gray-700">신고</button>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="mt-4">
          {showReplies && (
            <div className="space-y-4">
              {replies.map((reply) => (
                <CommentComponent
                  key={reply.id}
                  comment={reply}
                  replies={getReplies(reply.id)}
                  getReplies={getReplies}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
          {replies.length > 0 && depth === 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  !showReplies && "-rotate-90"
                )}
              />
              {showReplies ? "숨기기" : "보기"} {replies.length}개 답글
            </button>
          )}
        </div>
      )}
    </div>
  );
}
