import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  MessageSquare,
  Share2,
  Flag,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  author: Profile;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  upvotes: number;
  depth: number;
  created_at: string;
  author: Profile;
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch post with author data
  const { data: postData, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles(id, nickname, avatar_url, bio)
    `
    )
    .eq("id", id)
    .single();

  if (error || !postData) {
    console.error("Post fetch error:", error);
    notFound();
  }

  // Handle the case where profiles might be returned as an array
  const rawPost = postData as any;
  const author = Array.isArray(rawPost.profiles)
    ? rawPost.profiles[0]
    : rawPost.profiles;

  const post = {
    ...rawPost,
    author,
  } as Post;

  // Fetch comments with author data
  const { data: commentsData } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles(id, nickname, avatar_url, bio)
    `
    )
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  // Handle the case where profiles might be returned as an array for each comment
  const comments = (commentsData || []).map((comment: any) => {
    const author = Array.isArray(comment.profiles)
      ? comment.profiles[0]
      : comment.profiles;
    return {
      ...comment,
      author,
    };
  }) as Comment[];

  // Increment view count
  supabase
    .from("posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", id)
    .then(() => {});

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: false,
    locale: ko,
  });

  // Organize comments into tree structure
  const rootComments = comments.filter((c) => !c.parent_id);

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
            <span>{post.author?.nickname || "익명"}</span>
            <span>•</span>
            <span>{timeAgo} 전</span>
            <span>•</span>
            <span>조회 {post.view_count}</span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag: string) => (
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
                      {rootComments[0].author?.nickname || "익명"}
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
                      <ArrowUp className="h-4 w-4" />
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

          {/* Comments List */}
          <div className="space-y-6">
            {rootComments.slice(1).map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">
                    {comment.author?.nickname?.charAt(0) || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {comment.author?.nickname || "익명"}
                    </span>
                    {comment.author_id === post.author_id && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        작성자
                      </Badge>
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
                  {post.author?.nickname || "익명"}
                </p>
                <p className="text-xs text-gray-500">가입일 2023</p>
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
              <Link
                href="/community"
                className="block text-sm text-gray-700 hover:text-gray-900 line-clamp-2"
              >
                더 많은 토론 보기
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
