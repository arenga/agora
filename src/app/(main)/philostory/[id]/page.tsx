"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Eye,
  Highlighter,
  Share2,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadingContent } from "@/components/philostory/reading-content";
import { PhilosopherCard } from "@/components/philostory/philosopher-card";
import { useBookmark } from "@/hooks/use-bookmark";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Philostory, Philosopher, Highlight } from "@/types/database";

// 샘플 데이터
const samplePhilostory: Philostory & { philosopher?: Philosopher } = {
  id: "1",
  philosopher_id: "1",
  title: "소크라테스의 '너 자신을 알라' - 자기 인식의 시작",
  content: `고대 그리스 델포이 신전의 입구에는 "너 자신을 알라(γνῶθι σεαυτόν)"라는 문구가 새겨져 있었습니다. 소크라테스는 이 격언을 자신의 철학적 탐구의 출발점으로 삼았습니다.

소크라테스는 "나는 내가 아무것도 모른다는 것을 안다"라고 말했습니다. 이 역설적인 선언은 진정한 지혜의 시작이 자신의 무지를 인정하는 것임을 보여줍니다. 우리가 모든 것을 안다고 생각할 때, 우리는 더 이상 배우지 않습니다. 하지만 우리의 한계를 인식할 때, 우리는 성장할 수 있는 공간을 만듭니다.

현대 사회에서 우리는 끊임없이 외부의 기준에 맞추어 살아갑니다. SNS의 좋아요 수, 연봉, 직위 - 이런 외적인 지표들이 우리의 가치를 정의하도록 내버려둡니다. 하지만 소크라테스는 우리에게 묻습니다: "당신은 정말 자신이 누구인지 알고 있습니까?"

자기 인식의 여정은 불편할 수 있습니다. 우리의 편견, 두려움, 욕망을 직면해야 하기 때문입니다. 하지만 이 과정을 통해서만 우리는 진정한 자아를 발견하고, 더 의미 있는 삶을 살 수 있습니다.

오늘 하루, 잠시 멈추고 자신에게 물어보세요: "나는 왜 이것을 원하는가? 이것이 진정 나의 가치관에 부합하는가?" 소크라테스처럼 끊임없이 질문하는 삶을 살 때, 우리는 더 깊은 자기 이해에 도달할 수 있습니다.

진정한 지혜는 모든 답을 아는 것이 아니라, 올바른 질문을 던지는 것에서 시작됩니다.`,
  summary:
    "소크라테스의 '너 자신을 알라'는 자기 인식의 중요성을 강조합니다. 진정한 지혜는 자신의 무지를 인정하는 것에서 시작됩니다.",
  themes: ["자기인식", "겸손", "질문", "성찰"],
  reading_time: 5,
  published_date: new Date().toISOString(),
  view_count: 1234,
  highlight_count: 89,
  created_at: new Date().toISOString(),
  philosopher: {
    id: "1",
    name: "Socrates",
    name_ko: "소크라테스",
    era: "고대 그리스 (470-399 BC)",
    nationality: "아테네",
    bio: "서양 철학의 창시자 중 한 명으로, 문답법을 통한 철학적 탐구로 유명합니다. 그의 가르침은 제자 플라톤을 통해 전해졌으며, 윤리학과 인식론에 지대한 영향을 미쳤습니다.",
    image_url: null,
    created_at: "",
  },
};

export default function PhilostoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [philostory, setPhilostory] = useState<
    (Philostory & { philosopher?: Philosopher }) | null
  >(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [startTime] = useState(Date.now());

  const { isBookmarked, toggleBookmark } = useBookmark({
    targetType: "philostory",
    targetId: params.id as string,
    initialIsBookmarked: false,
  });

  // Load philostory data
  useEffect(() => {
    // TODO: Fetch from Supabase
    setPhilostory(samplePhilostory);
  }, [params.id]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track reading time when leaving
  useEffect(() => {
    return () => {
      if (user && philostory) {
        const readingTime = Math.floor((Date.now() - startTime) / 1000);
        console.log(`Reading time: ${readingTime}s`);
        // TODO: Save reading history to Supabase
      }
    };
  }, [user, philostory, startTime]);

  const handleAddHighlight = (highlight: {
    text: string;
    startOffset: number;
    endOffset: number;
    note: string | null;
    color: string;
  }) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }

    const newHighlight: Highlight = {
      id: crypto.randomUUID(),
      user_id: user.id,
      philostory_id: params.id as string,
      text: highlight.text,
      start_offset: highlight.startOffset,
      end_offset: highlight.endOffset,
      note: highlight.note,
      color: highlight.color,
      created_at: new Date().toISOString(),
    };

    setHighlights([...highlights, newHighlight]);
    // TODO: Save to Supabase
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: philostory?.title,
        text: philostory?.summary || "",
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다");
    }
  };

  if (!philostory) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            오늘의 철학으로 돌아가기
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-h2 font-bold mb-3">{philostory.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(philostory.published_date), "yyyy년 M월 d일", {
                    locale: ko,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{philostory.reading_time}분</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{philostory.view_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Highlighter className="h-4 w-4" />
                <span>{philostory.highlight_count}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleBookmark}
              className={cn(isBookmarked && "text-accent")}
            >
              <Bookmark
                className={cn("h-4 w-4", isBookmarked && "fill-current")}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Themes */}
        <div className="flex flex-wrap gap-2 mt-4">
          {philostory.themes.map((theme) => (
            <Badge key={theme} variant="secondary">
              {theme}
            </Badge>
          ))}
        </div>
      </div>

      {/* Philosopher Info */}
      {philostory.philosopher && (
        <div className="mb-8">
          <PhilosopherCard philosopher={philostory.philosopher} />
        </div>
      )}

      {/* Main Content */}
      <Card className="mb-8">
        <CardContent className="p-6 sm:p-8">
          <ReadingContent
            content={philostory.content}
            highlights={highlights.map((h) => ({
              id: h.id,
              text: h.text,
              startOffset: h.start_offset,
              endOffset: h.end_offset,
              note: h.note,
              color: h.color,
            }))}
            onAddHighlight={handleAddHighlight}
          />
        </CardContent>
      </Card>

      {/* Highlights Summary */}
      {highlights.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Highlighter className="h-5 w-5" />내 하이라이트 ({highlights.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="border-l-4 pl-4"
                style={{ borderColor: highlight.color }}
              >
                <p className="italic text-sm">&ldquo;{highlight.text}&rdquo;</p>
                {highlight.note && (
                  <p className="text-sm text-muted-foreground mt-1">
                    📝 {highlight.note}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Related Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">이 글에 대한 생각을 나눠보세요</h3>
          <div className="flex gap-3">
            <Link href="/community" className="flex-1">
              <Button variant="outline" className="w-full">
                커뮤니티에서 토론하기
              </Button>
            </Link>
            <Link href="/write" className="flex-1">
              <Button className="w-full bg-accent hover:bg-accent/90">
                내 생각 공유하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
