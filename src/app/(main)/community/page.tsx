"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Post, Profile } from "@/types/database";

type CategoryType = "today" | "agora" | "philosopher" | "all";
type SortType = "newest" | "popular";

// 샘플 데이터
const samplePosts: (Post & { author?: Profile })[] = [
  {
    id: "1",
    author_id: "user1",
    title: "[오늘의 질문] 소크라테스가 말한 '악법도 법이다'에 대해 어떻게 생각하시나요?",
    content:
      "소크라테스의 존법정신을 나타내는 유명한 명언지만, 현재 사회에 시민 불복종 권리와 충돌하는 지점이 있는 거 같습니다. 여러분은 악법에도 어떻게 대응해야 한다고 생각하시나요?",
    category: "discussion",
    tags: ["소크라테스", "악법론"],
    upvotes: 45,
    downvotes: 0,
    comment_count: 12,
    view_count: 234,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    author: {
      id: "user1",
      nickname: "u/philosopher_king",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["소크라테스"], themes: ["정치철학"] },
      reading_streak: 7,
      total_highlights: 23,
      total_posts: 12,
      total_comments: 45,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "2",
    author_id: "user2",
    title: "[아고라 광장] 실존주의가 2030 세대에게 매력적인 이유는 무엇일까요?",
    content:
      "불확실한 미래와 치열한 경쟁 속에서 '나' 자신에게 집중하고 삶의 의미를 스스로 만들어가려는 경향이 강해지는 거 같습니다. 사르트르의 '실존은 본질에 앞선다'는 명제 등에 대해 토론해봐요 싶습니다.",
    category: "discussion",
    tags: ["실존주의", "사르트르론"],
    upvotes: 28,
    downvotes: 0,
    comment_count: 8,
    view_count: 189,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    author: {
      id: "user2",
      nickname: "u/existential_cat",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["사르트르"], themes: ["실존주의"] },
      reading_streak: 14,
      total_highlights: 45,
      total_posts: 8,
      total_comments: 32,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "3",
    author_id: "user3",
    title: "[철학자와 대화] 니체의 영원회귀 사상을 긍정적으로 받아들이는 법",
    content:
      "만약 우리의 삶이 무한히 반복된다면, 절망적일까요 아니면 때 순간을 더 가치있게 살 되는 계기가 될까요? '아모르 파티(Amor Fati)'의 정신으로 영원회귀를 어떻게 삶의 동력으로 삼을 수 있을지 이야기 나눠봐요.",
    category: "discussion",
    tags: ["니체", "영원회귀"],
    upvotes: 15,
    downvotes: 0,
    comment_count: 9,
    view_count: 156,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    author: {
      id: "user3",
      nickname: "u/nietzsche_fan",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["니체"], themes: ["허무주의"] },
      reading_streak: 3,
      total_highlights: 12,
      total_posts: 5,
      total_comments: 18,
      created_at: "",
      updated_at: "",
    },
  },
];

const sidebarCategories = [
  { value: "today", label: "오늘의 질문", icon: "📋" },
  { value: "agora", label: "아고라 광장", icon: "🏛️" },
  { value: "philosopher", label: "철학자와 대화", icon: "💭" },
];

const philosopherFilters = [
  "플라톤",
  "아리스토텔레스",
  "니체",
  "칸트",
  "데카르트",
];

const themeFilters = ["주제별 보기"];

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day ago`;
  }
  return `${diffHours} hours ago`;
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = samplePosts
    .filter((post) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    });

  return (
    <div className="flex gap-8">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="space-y-6">
          {/* Categories */}
          <div>
            {sidebarCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as CategoryType)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  selectedCategory === category.value
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              필터
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                <span className="text-gray-400">▼</span>
                철학자별 보기
              </button>
              <div className="pl-6 space-y-1">
                {philosopherFilters.map((philosopher) => (
                  <button
                    key={philosopher}
                    className="w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {philosopher}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                <span className="text-gray-400">▼</span>
                주제별 보기
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header with Search and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSortBy("newest")}
              className={cn(
                "text-sm font-medium",
                sortBy === "newest" ? "text-gray-900" : "text-gray-500"
              )}
            >
              최신순
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSortBy("popular")}
              className={cn(
                "text-sm font-medium",
                sortBy === "popular" ? "text-gray-900" : "text-gray-500"
              )}
            >
              인기순
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Agora..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg p-6 border border-gray-200"
            >
              <div className="flex gap-4">
                {/* Vote Count */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-orange-500">
                    {post.upvotes}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-2">
                    posted by {post.author?.nickname} • {formatTimeAgo(post.created_at)}
                  </div>
                  <Link href={`/community/${post.id}`}>
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-3">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-2 text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">{post.comment_count} Comments</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <Link href="/write" className="fixed bottom-8 right-8">
        <Button
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">글쓰기</span>
        </Button>
      </Link>
    </div>
  );
}
