"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Highlighter,
  Bookmark,
  Clock,
  TrendingUp,
  Calendar,
  MessageSquareQuote,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import type { Highlight, Bookmark as BookmarkType } from "@/types/database";

type TabType = "highlights" | "bookmarks" | "history";

// 샘플 데이터
const sampleHighlights: (Highlight & {
  philostory_title?: string;
})[] = [
  {
    id: "1",
    user_id: "user1",
    philostory_id: "1",
    text: "나는 내가 아무것도 모른다는 것을 안다",
    start_offset: 150,
    end_offset: 175,
    note: "무지의 지혜 - 겸손의 시작점",
    color: "#fef08a",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    philostory_title: "소크라테스의 '너 자신을 알라' - 자기 인식의 시작",
  },
  {
    id: "2",
    user_id: "user1",
    philostory_id: "1",
    text: "자신의 무지를 인정할 때, 우리는 성장할 수 있는 공간을 만듭니다",
    start_offset: 320,
    end_offset: 365,
    note: null,
    color: "#bbf7d0",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    philostory_title: "소크라테스의 '너 자신을 알라' - 자기 인식의 시작",
  },
  {
    id: "3",
    user_id: "user1",
    philostory_id: "2",
    text: "우리가 통제할 수 있는 것과 없는 것을 구분하라",
    start_offset: 100,
    end_offset: 135,
    note: "스토아 철학의 핵심 원리. 일상에서 실천해보자.",
    color: "#bfdbfe",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    philostory_title: "마르쿠스 아우렐리우스의 명상록",
  },
];

const sampleBookmarks: (BookmarkType & {
  title?: string;
  type_label?: string;
})[] = [
  {
    id: "1",
    user_id: "user1",
    target_type: "philostory",
    target_id: "1",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    title: "소크라테스의 '너 자신을 알라' - 자기 인식의 시작",
    type_label: "Philostory",
  },
  {
    id: "2",
    user_id: "user1",
    target_type: "post",
    target_id: "1",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    title: "니체의 '신은 죽었다'를 현대 사회에 어떻게 적용할 수 있을까요?",
    type_label: "커뮤니티 글",
  },
  {
    id: "3",
    user_id: "user1",
    target_type: "philostory",
    target_id: "2",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    title: "마르쿠스 아우렐리우스의 명상록",
    type_label: "Philostory",
  },
];

const sampleReadingHistory = [
  {
    id: "1",
    philostory_id: "1",
    title: "소크라테스의 '너 자신을 알라'",
    read_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    reading_time: 312, // seconds
    progress: 100,
  },
  {
    id: "2",
    philostory_id: "2",
    title: "마르쿠스 아우렐리우스의 명상록",
    read_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    reading_time: 420,
    progress: 100,
  },
  {
    id: "3",
    philostory_id: "3",
    title: "칸트의 정언명령",
    read_at: new Date(Date.now() - 3600000 * 50).toISOString(),
    reading_time: 180,
    progress: 65,
  },
];

export default function MyArchivePage() {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("highlights");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              로그인이 필요한 페이지입니다.
            </p>
            <Link href="/login?redirectTo=/my-archive">
              <Button>로그인하기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: "highlights" as const,
      label: "하이라이트",
      icon: Highlighter,
      count: sampleHighlights.length,
    },
    {
      id: "bookmarks" as const,
      label: "북마크",
      icon: Bookmark,
      count: sampleBookmarks.length,
    },
    {
      id: "history" as const,
      label: "읽기 기록",
      icon: Clock,
      count: sampleReadingHistory.length,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 font-bold mb-2">내 아카이브</h1>
        <p className="text-muted-foreground">
          철학적 여정의 기록을 한눈에 확인하세요.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Highlighter className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {profile?.total_highlights || sampleHighlights.length}
                </p>
                <p className="text-sm text-muted-foreground">총 하이라이트</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bookmark className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sampleBookmarks.length}</p>
                <p className="text-sm text-muted-foreground">저장된 북마크</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {profile?.reading_streak || 12}
                </p>
                <p className="text-sm text-muted-foreground">연속 읽기</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sampleReadingHistory.length}
                </p>
                <p className="text-sm text-muted-foreground">읽은 글</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "gap-2",
                activeTab === tab.id && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1",
                  activeTab === tab.id && "bg-primary-foreground/20 text-primary-foreground"
                )}
              >
                {tab.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "highlights" && (
          <>
            {sampleHighlights.length > 0 ? (
              sampleHighlights.map((highlight) => (
                <Card key={highlight.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div
                        className="w-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: highlight.color }}
                      />
                      <div className="flex-1">
                        <p className="italic mb-2">&ldquo;{highlight.text}&rdquo;</p>
                        {highlight.note && (
                          <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
                            <MessageSquareQuote className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{highlight.note}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <Link
                            href={`/philostory/${highlight.philostory_id}`}
                            className="text-accent hover:underline flex items-center gap-1"
                          >
                            {highlight.philostory_title}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(highlight.created_at), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Highlighter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">아직 하이라이트가 없습니다</h3>
                  <p className="text-muted-foreground">
                    Philostory를 읽으며 인상적인 구절을 하이라이트해보세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "bookmarks" && (
          <>
            {sampleBookmarks.length > 0 ? (
              sampleBookmarks.map((bookmark) => (
                <Card key={bookmark.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {bookmark.type_label}
                        </Badge>
                        <Link
                          href={
                            bookmark.target_type === "philostory"
                              ? `/philostory/${bookmark.target_id}`
                              : `/community/${bookmark.target_id}`
                          }
                          className="block"
                        >
                          <h3 className="font-semibold hover:text-accent transition-colors">
                            {bookmark.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(bookmark.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })}
                          에 저장됨
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4 fill-current text-accent" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">저장된 북마크가 없습니다</h3>
                  <p className="text-muted-foreground">
                    나중에 다시 읽고 싶은 글을 북마크해보세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "history" && (
          <>
            {sampleReadingHistory.length > 0 ? (
              sampleReadingHistory.map((history) => (
                <Card key={history.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link href={`/philostory/${history.philostory_id}`}>
                          <h3 className="font-semibold hover:text-accent transition-colors">
                            {history.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            {format(new Date(history.read_at), "M월 d일 HH:mm", {
                              locale: ko,
                            })}
                          </span>
                          <span>
                            {Math.floor(history.reading_time / 60)}분{" "}
                            {history.reading_time % 60}초
                          </span>
                          {history.progress < 100 && (
                            <Badge variant="secondary">
                              {history.progress}% 읽음
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {history.progress === 100 ? (
                          <Badge className="bg-green-100 text-green-800">
                            완료
                          </Badge>
                        ) : (
                          <Link href={`/philostory/${history.philostory_id}`}>
                            <Button size="sm" variant="outline">
                              이어 읽기
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">읽기 기록이 없습니다</h3>
                  <p className="text-muted-foreground">
                    오늘의 Philostory를 읽어보세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
