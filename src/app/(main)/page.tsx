import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

interface Philosopher {
  id: string;
  name: string;
  name_en: string;
}

interface Philostory {
  id: string;
  title: string;
  book_title: string;
  reading_time_minutes: number;
  publish_date: string;
  philosopher: Philosopher;
  modern_interpretation: string;
}

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch the latest philostory
  const { data } = await supabase
    .from("philostories")
    .select(
      `
      *,
      philosopher:philosophers(id, name, name_en)
    `
    )
    .order("publish_date", { ascending: false })
    .limit(1)
    .single();

  const todayPhilostory = data as unknown as Philostory;

  // Extract key points from modern_interpretation
  const keyPoints = todayPhilostory?.modern_interpretation
    .split(".")
    .filter((s) => s.trim().length > 10)
    .slice(0, 3)
    .map((s) => s.trim() + ".");

  const formattedDate = todayPhilostory
    ? new Date(todayPhilostory.publish_date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <div className="space-y-8">
      {/* Hero Section - Full Width Dark Background */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-12">
        <div className="relative h-[500px] bg-[#1a1a2e] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/nietzsche.jpg"
              alt={todayPhilostory.philosopher.name}
              fill
              className="object-cover object-center opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
              <div className="max-w-2xl text-white">
                <p className="text-sm text-gray-300 mb-4">
                  {formattedDate}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 whitespace-nowrap">
                  오늘의 Philostory: {todayPhilostory.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-300 mb-6">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {todayPhilostory.reading_time_minutes}분 읽기 | {todayPhilostory.philosopher.name}
                  </span>
                </div>

                {/* Key Points */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-200 mb-3">핵심 요약:</p>
                  <ol className="space-y-2 text-sm text-gray-300">
                    {keyPoints?.map((point, index) => (
                      <li key={index}>
                        {index + 1}. {point}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Link href={`/philostory/${todayPhilostory.id}`}>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      읽기 시작하기
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 px-6"
                    >
                      토론 참여하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Progress Section - Removed for now as it requires user-specific data */}
    </div>
  );
}
