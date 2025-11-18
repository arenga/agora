import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Eye, BookOpen, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Archive - Agora",
  description: "Browse all Philostories",
};

interface Philosopher {
  id: string;
  name: string;
  name_en: string;
  era: string;
  theme_tags: string[];
}

type DifficultyLevel = "easy" | "medium" | "hard";

interface Philostory {
  id: string;
  philosopher_id: string;
  title: string;
  book_title: string;
  theme_tags: string[];
  difficulty: DifficultyLevel;
  reading_time_minutes: number;
  view_count: number;
  publish_date: string;
  philosopher: Philosopher;
}

const difficultyColors: Record<DifficultyLevel, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default async function ArchivePage() {
  const supabase = await createClient();

  // Fetch all philostories with philosopher data
  const { data } = await supabase
    .from("philostories")
    .select(
      `
      *,
      philosopher:philosophers(*)
    `
    )
    .order("publish_date", { ascending: false });

  const philostories = data as unknown as Philostory[] | null;

  // Get unique philosophers for filtering
  const philosophers = Array.from(
    new Set(philostories?.map((p) => p.philosopher) || [])
  ).filter(Boolean);

  // Get unique themes for filtering
  const allThemes = Array.from(
    new Set(
      philostories?.flatMap((p) => p.theme_tags || []) || []
    )
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Philostory Archive
        </h1>
        <p className="text-gray-600">
          모든 철학 이야기를 둘러보고 당신만의 인사이트를 발견하세요
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* Philosopher Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                철학자
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium">
                  전체
                </button>
                {philosophers.map((philosopher) => (
                  <button
                    key={philosopher.id}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                  >
                    {philosopher.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                난이도
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                  쉬움
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                  보통
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                  어려움
                </button>
              </div>
            </div>

            {/* Theme Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                주제 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {allThemes.slice(0, 10).map((theme: string) => (
                  <button
                    key={theme}
                    className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs text-gray-700"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Philostory Grid */}
        <main className="flex-1 min-w-0">
          {/* Stats Bar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{philostories?.length || 0}</span>개의 Philostory
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                인기순
              </Button>
              <Button variant="outline" size="sm">
                최신순
              </Button>
            </div>
          </div>

          {/* Philostory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {philostories?.map((story) => (
              <Link
                key={story.id}
                href={`/philostory/${story.id}`}
                className="group"
              >
                <article className="h-full p-6 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                  {/* Philosopher Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                      {story.philosopher.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {story.philosopher.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {story.philosopher.era.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Book Title */}
                  <p className="text-sm text-gray-600 mb-3">
                    <BookOpen className="inline h-3 w-3 mr-1" />
                    {story.book_title}
                  </p>

                  {/* Theme Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {story.theme_tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {story.reading_time_minutes}분
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {story.view_count}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        difficultyColors[story.difficulty]
                      }`}
                    >
                      {difficultyLabels[story.difficulty]}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {(!philostories || philostories.length === 0) && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">아직 Philostory가 없습니다</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
