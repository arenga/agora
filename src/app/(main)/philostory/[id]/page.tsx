import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  BookOpen,
  Lightbulb,
  Target,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Philosopher {
  id: string;
  name: string;
  name_en: string;
  era: string;
  bio: string;
  theme_tags: string[];
}

interface Philostory {
  id: string;
  philosopher_id: string;
  title: string;
  book_title: string;
  book_year: number | null;
  original_text: string;
  modern_interpretation: string;
  real_life_application: string;
  reflection_prompts: { prompts: string[] };
  theme_tags: string[];
  difficulty: "easy" | "medium" | "hard";
  reading_time_minutes: number;
  publish_date: string;
  view_count: number;
  philosopher: Philosopher;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hard: "bg-red-100 text-red-700 border-red-300",
};

const difficultyLabels = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default async function PhilostoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch philostory with philosopher data
  const { data } = await supabase
    .from("philostories")
    .select(
      `
      *,
      philosopher:philosophers(*)
    `
    )
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  const philostory = data as unknown as Philostory;

  // Increment view count (fire and forget)
  supabase
    .from("philostories")
    .update({ view_count: philostory.view_count + 1 })
    .eq("id", id)
    .then(() => {});

  return (
    <div className="container max-w-4xl py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/archive">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Archive로 돌아가기
          </Button>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {/* Philosopher Badge */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold shadow-md">
            {philostory.philosopher.name[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {philostory.philosopher.name}
            </h2>
            <p className="text-sm text-gray-600">{philostory.philosopher.era}</p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {philostory.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>
              {philostory.book_title}
              {philostory.book_year && ` (${philostory.book_year})`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{philostory.reading_time_minutes}분</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{philostory.view_count}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{new Date(philostory.publish_date).toLocaleDateString("ko-KR")}</span>
          </div>
        </div>

        {/* Theme Tags and Difficulty */}
        <div className="flex flex-wrap items-center gap-2">
          {philostory.theme_tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className={`text-xs ${difficultyColors[philostory.difficulty]}`}
          >
            {difficultyLabels[philostory.difficulty]}
          </Badge>
        </div>
      </header>

      {/* Philosopher Bio */}
      <section className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">철학자 소개</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {philostory.philosopher.bio}
        </p>
      </section>

      {/* Original Text */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">원문</h2>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <blockquote className="text-lg leading-relaxed text-gray-800 italic">
            &ldquo;{philostory.original_text}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Modern Interpretation */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">현대적 해석</h2>
        </div>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {philostory.modern_interpretation}
          </p>
        </div>
      </section>

      {/* Real Life Application */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Target className="h-4 w-4 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">실생활 적용</h2>
        </div>
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {philostory.real_life_application}
          </p>
        </div>
      </section>

      {/* Reflection Prompts */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">성찰 질문</h2>
        </div>
        <div className="space-y-3">
          {philostory.reflection_prompts.prompts.map(
            (prompt: string, index: number) => (
              <div
                key={index}
                className="flex gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="text-gray-700">{prompt}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          이 Philostory에 대한 생각을 나눠보세요
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          커뮤니티에서 다른 사람들과 인사이트를 공유하고 토론해보세요
        </p>
        <div className="flex gap-3">
          <Link href="/community" className="flex-1">
            <Button variant="outline" className="w-full">
              커뮤니티 둘러보기
            </Button>
          </Link>
          <Link href="/write" className="flex-1">
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              내 생각 공유하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
