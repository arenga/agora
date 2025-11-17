import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Bookmark, Highlighter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-display text-primary mb-4">오늘의 철학</h1>
        <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
          매일 새로운 철학 이야기를 만나고, 깊이 있는 사색의 시간을 가져보세요.
        </p>
      </section>

      {/* Today's Philostory Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-accent" />
              <span className="text-body-sm text-muted-foreground">
                오늘의 이야기
              </span>
            </div>
            <span className="text-caption text-muted-foreground">
              5분 읽기
            </span>
          </div>
          <CardTitle className="text-h2 mt-4">
            소크라테스의 &quot;너 자신을 알라&quot;
          </CardTitle>
          <p className="text-body-sm text-muted-foreground">
            소크라테스 · 고대 그리스
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-body-lg leading-relaxed">
              고대 그리스의 델포이 신전 입구에는 &quot;너 자신을 알라(γνῶθι σεαυτόν)&quot;라는 
              격언이 새겨져 있었습니다. 소크라테스는 이 말을 자신의 철학적 탐구의 
              출발점으로 삼았습니다.
            </p>
            <p className="text-body leading-relaxed">
              소크라테스는 아테네의 거리를 돌아다니며 사람들에게 질문을 던졌습니다. 
              &quot;정의란 무엇인가?&quot;, &quot;용기란 무엇인가?&quot;, &quot;아름다움이란 무엇인가?&quot; 
              그는 답을 제시하기보다 질문을 통해 상대방이 자신의 무지를 깨닫게 했습니다.
            </p>
            <blockquote className="border-l-4 border-accent pl-4 italic text-body">
              &quot;나는 내가 아무것도 모른다는 것을 안다.&quot;
            </blockquote>
            <p className="text-body leading-relaxed">
              이것이 바로 소크라테스가 말하는 지혜의 시작입니다. 자신의 무지를 
              인정할 때, 우리는 비로소 진정한 앎을 향한 여정을 시작할 수 있습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Link href="/philostory/1">
              <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90">
                <BookOpen className="h-4 w-4 mr-2" />
                전체 읽기
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Highlighter className="h-4 w-4 mr-2" />
              하이라이트
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              북마크
            </Button>
            <Link href="/archive" className="ml-auto">
              <Button variant="ghost" size="sm">
                지난 이야기 보기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-h2 text-primary font-bold">12</div>
            <p className="text-body-sm text-muted-foreground">연속 읽기</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-h2 text-accent font-bold">47</div>
            <p className="text-body-sm text-muted-foreground">총 하이라이트</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-h2 text-primary font-bold">23</div>
            <p className="text-body-sm text-muted-foreground">북마크</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
