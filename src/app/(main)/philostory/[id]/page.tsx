import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bookmark,
  Share2,
  Type,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/" className="text-[#586a8d] dark:text-[#a0a0a0] text-sm font-medium leading-normal hover:text-[#15274c]">
          Agora
        </Link>
        <span className="text-[#586a8d] dark:text-[#a0a0a0] text-sm font-medium leading-normal">/</span>
        <Link href="/archive" className="text-[#586a8d] dark:text-[#a0a0a0] text-sm font-medium leading-normal hover:text-[#15274c]">
          Philostory
        </Link>
        <span className="text-[#586a8d] dark:text-[#a0a0a0] text-sm font-medium leading-normal">/</span>
        <span className="text-[#333333] dark:text-[#e0e0e0] text-sm font-medium leading-normal">{philostory.title}</span>
      </div>

      <article>
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-[#333333] dark:text-[#e0e0e0] text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
              {philostory.title}
            </h1>
            <p className="text-[#586a8d] dark:text-[#a0a0a0] text-lg font-normal leading-normal">
              {philostory.philosopher.name}, 『{philostory.book_title}』
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex justify-between items-center mt-6 border-y border-[#e9ecf1] dark:border-[#2a2e37] py-2">
            <div className="flex gap-1">
              <button className="p-2 text-[#586a8d] dark:text-[#a0a0a0] hover:text-[#15274c] dark:hover:text-white rounded-full transition-colors">
                <Type className="h-5 w-5" />
              </button>
              <button className="p-2 text-[#586a8d] dark:text-[#a0a0a0] hover:text-[#15274c] dark:hover:text-white rounded-full transition-colors">
                <Type className="h-6 w-6" />
              </button>
            </div>
            <div className="flex gap-1">
              <button className="p-2 text-[#586a8d] dark:text-[#a0a0a0] hover:text-[#15274c] dark:hover:text-white rounded-full transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-2 text-[#586a8d] dark:text-[#a0a0a0] hover:text-[#15274c] dark:hover:text-white rounded-full transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12 text-[#333333] dark:text-[#e0e0e0] leading-relaxed" style={{lineHeight: 1.8}}>
          {/* Original Text */}
          <section>
            <h3 className="text-[#333333] dark:text-[#e0e0e0] text-xl font-bold leading-tight tracking-[-0.015em] mb-4 border-l-4 border-[#15274c] pl-3">
              철학 원문 (The Original Text)
            </h3>
            <p className="text-[#333333] dark:text-[#e0e0e0]">
              &ldquo;{philostory.original_text}&rdquo;
            </p>
          </section>

          {/* Modern Interpretation */}
          <section>
            <h3 className="text-[#333333] dark:text-[#e0e0e0] text-xl font-bold leading-tight tracking-[-0.015em] mb-4 border-l-4 border-[#15274c] pl-3">
              현대어 해석 (Modern Interpretation)
            </h3>
            <p className="text-[#333333] dark:text-[#e0e0e0] whitespace-pre-line">
              {philostory.modern_interpretation}
            </p>
          </section>

          {/* Real Life Application */}
          <section>
            <h3 className="text-[#333333] dark:text-[#e0e0e0] text-xl font-bold leading-tight tracking-[-0.015em] mb-4 border-l-4 border-[#15274c] pl-3">
              실생활 적용 (Practical Application)
            </h3>
            <p className="text-[#333333] dark:text-[#e0e0e0] whitespace-pre-line">
              {philostory.real_life_application}
            </p>
          </section>

          {/* Reflection Prompt */}
          <section>
            <h3 className="text-[#333333] dark:text-[#e0e0e0] text-xl font-bold leading-tight tracking-[-0.015em] mb-4 border-l-4 border-[#15274c] pl-3">
              오늘의 질문 (Reflection Prompt)
            </h3>
            <div className="bg-[#f6f7f8] dark:bg-[#13171f] border-l-4 border-[#15274c]/50 p-6 rounded-lg">
              {philostory.reflection_prompts.prompts.map((prompt: string, index: number) => (
                <p key={index} className="text-lg italic text-[#333333] dark:text-[#e0e0e0] mb-2 last:mb-0">
                  &ldquo;{prompt}&rdquo;
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#e9ecf1] dark:border-[#2a2e37]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              <Link href="#" className="flex items-center gap-2 text-[#586a8d] dark:text-[#a0a0a0] hover:text-[#15274c] dark:hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>이전 글</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-[#586a8d] dark:text-[#a0a0a0] hover:text-[#15274c] dark:hover:text-white transition-colors">
                <span>다음 글</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <Link href="/community">
              <Button className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#15274c] text-white text-base font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105">
                <span className="truncate">이 주제로 토론하기</span>
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
