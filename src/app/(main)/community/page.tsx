"use client";

import { useState } from "react";
import Link from "next/link";
import { PenSquare, TrendingUp, Clock, Award, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/community/post-card";
import { cn } from "@/lib/utils";
import type { Post, Profile } from "@/types/database";

type SortType = "hot" | "new" | "top";
type CategoryType = "all" | "discussion" | "question" | "insight" | "recommendation" | "free";

// 샘플 데이터 (나중에 Supabase에서 가져옴)
const samplePosts: (Post & { author?: Profile })[] = [
  {
    id: "1",
    author_id: "user1",
    title: "니체의 '신은 죽었다'를 현대 사회에 어떻게 적용할 수 있을까요?",
    content:
      "니체가 말한 '신은 죽었다'는 단순히 종교의 죽음이 아니라 전통적 가치 체계의 붕괴를 의미한다고 생각합니다. 현대 사회에서 우리는 어떤 새로운 가치를 만들어가야 할까요? 여러분의 생각이 궁금합니다.",
    category: "discussion",
    tags: ["니체", "허무주의", "현대철학", "가치관"],
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
      bio: null,
      interests: { philosophers: ["니체"], themes: ["실존주의"] },
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
    title: "스토아 철학을 일상에 적용하는 방법을 공유합니다",
    content:
      "최근 마르쿠스 아우렐리우스의 '명상록'을 읽고 스토아 철학을 실천하고 있습니다. 특히 '우리가 통제할 수 있는 것과 없는 것을 구분하라'는 가르침이 일상의 스트레스를 줄이는 데 큰 도움이 되었습니다.",
    category: "insight",
    tags: ["스토아철학", "마르쿠스아우렐리우스", "일상철학", "명상록"],
    upvotes: 38,
    downvotes: 2,
    comment_count: 8,
    view_count: 189,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    author: {
      id: "user2",
      nickname: "일상철학자",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["마르쿠스 아우렐리우스"], themes: ["스토아철학"] },
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
    title: "칸트의 정언명령을 AI 윤리에 적용할 수 있을까요?",
    content:
      "AI 개발에서 윤리적 기준을 세울 때 칸트의 정언명령이 유용한 프레임워크가 될 수 있다고 생각합니다. '너의 행위의 준칙이 보편적 법칙이 되도록 행동하라'를 AI에 적용한다면 어떤 모습일까요?",
    category: "question",
    tags: ["칸트", "정언명령", "AI윤리", "도덕철학"],
    upvotes: 29,
    downvotes: 5,
    comment_count: 22,
    view_count: 156,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    author: {
      id: "user3",
      nickname: "테크윤리학도",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["칸트"], themes: ["윤리학", "기술철학"] },
      reading_streak: 3,
      total_highlights: 12,
      total_posts: 5,
      total_comments: 18,
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "4",
    author_id: "user4",
    title: "입문자를 위한 실존주의 철학 도서 추천",
    content:
      "실존주의에 관심이 있지만 어디서부터 시작해야 할지 모르는 분들을 위해 입문서를 추천드립니다. 1. 사르트르의 '실존주의는 휴머니즘이다' - 짧고 핵심을 잘 담고 있습니다. 2. 카뮈의 '이방인' - 소설이라 접근하기 쉽습니다.",
    category: "recommendation",
    tags: ["실존주의", "도서추천", "사르트르", "카뮈", "입문"],
    upvotes: 55,
    downvotes: 1,
    comment_count: 12,
    view_count: 312,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    author: {
      id: "user4",
      nickname: "책벌레철학도",
      avatar_url: null,
      bio: null,
      interests: { philosophers: ["사르트르", "카뮈"], themes: ["실존주의"] },
      reading_streak: 30,
      total_highlights: 89,
      total_posts: 25,
      total_comments: 67,
      created_at: "",
      updated_at: "",
    },
  },
];

const categories = [
  { value: "all", label: "전체" },
  { value: "discussion", label: "토론" },
  { value: "question", label: "질문" },
  { value: "insight", label: "인사이트" },
  { value: "recommendation", label: "추천" },
  { value: "free", label: "자유" },
];

const sortOptions = [
  { value: "hot", label: "인기", icon: TrendingUp },
  { value: "new", label: "최신", icon: Clock },
  { value: "top", label: "추천순", icon: Award },
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [sortBy, setSortBy] = useState<SortType>("hot");
  const [searchQuery, setSearchQuery] = useState("");

  // 필터링 및 정렬 로직
  const filteredPosts = samplePosts
    .filter((post) => {
      if (selectedCategory !== "all" && post.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // 고정 글은 항상 상단
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      switch (sortBy) {
        case "hot":
          // 간단한 핫 스코어: (upvotes - downvotes) / 시간
          const aScore =
            (a.upvotes - a.downvotes) /
            Math.pow(
              (Date.now() - new Date(a.created_at).getTime()) / 3600000 + 2,
              1.5
            );
          const bScore =
            (b.upvotes - b.downvotes) /
            Math.pow(
              (Date.now() - new Date(b.created_at).getTime()) / 3600000 + 2,
              1.5
            );
          return bScore - aScore;
        case "new":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "top":
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        default:
          return 0;
      }
    });

  const handleVote = (postId: string, voteType: 1 | -1) => {
    console.log(`Vote ${voteType} on post ${postId}`);
    // TODO: Supabase 투표 로직
  };

  const handleBookmark = (postId: string) => {
    console.log(`Bookmark post ${postId}`);
    // TODO: Supabase 북마크 로직
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h2 font-bold text-foreground">커뮤니티</h1>
          <p className="text-muted-foreground mt-1">
            철학적 토론과 인사이트를 나누는 공간
          </p>
        </div>
        <Link href="/write">
          <Button className="bg-accent hover:bg-accent/90 text-white">
            <PenSquare className="h-4 w-4 mr-2" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedCategory(category.value as CategoryType)
                      }
                      className={cn(
                        selectedCategory === category.value &&
                          "bg-primary text-primary-foreground"
                      )}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="flex gap-2 sm:ml-auto">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy(option.value as SortType)}
                        className="gap-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="mt-4">
                <Input
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </CardContent>
          </Card>

          {/* Post List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpvote={(id) => handleVote(id, 1)}
                  onDownvote={(id) => handleVote(id, -1)}
                  onBookmark={handleBookmark}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-muted-foreground">
                    다른 키워드로 검색하거나 카테고리를 변경해보세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">인기 태그</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "니체",
                  "스토아철학",
                  "실존주의",
                  "칸트",
                  "일상철학",
                  "도덕철학",
                  "AI윤리",
                  "명상록",
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">커뮤니티 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 게시글</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">오늘 작성</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">활성 토론</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">참여 회원</span>
                <span className="font-semibold">567</span>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">커뮤니티 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 상호 존중하는 토론 문화</li>
                <li>• 근거 있는 논증을 권장합니다</li>
                <li>• 인신공격은 금지됩니다</li>
                <li>• 출처를 명시해주세요</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
