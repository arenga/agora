import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  // Mock data - 실제로는 API에서 가져올 데이터
  const todayPhilostory = {
    id: "1",
    date: "07.24.2024",
    title: "니체의 영원회귀",
    philosopher: "니체",
    readingTime: 10,
    keyPoints: [
      "모든 사건은 끝임없이 반복된다.",
      "이 사실을 인지하고 삶을 사랑하는 것이 중요하다.",
      "고통까지도 긍정하며 운명을 사랑하라.",
    ],
    progress: 30,
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Full Width Dark Background */}
      <section className="relative -mx-4 md:-mx-8 lg:-mx-12">
        <div className="relative h-[500px] bg-[#1a1a2e] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/nietzsche.jpg"
              alt={todayPhilostory.philosopher}
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
                  {todayPhilostory.date}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  오늘의 Philostory: {todayPhilostory.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-300 mb-6">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {todayPhilostory.readingTime}분 읽기 | {todayPhilostory.philosopher}
                  </span>
                </div>

                {/* Key Points */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-200 mb-3">핵심 요약:</p>
                  <ol className="space-y-2 text-sm text-gray-300">
                    {todayPhilostory.keyPoints.map((point, index) => (
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

      {/* Reading Progress Section */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {todayPhilostory.readingTime}분 읽기 | {todayPhilostory.philosopher}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">읽기 진행도</span>
          <span className="text-sm text-muted-foreground">
            {todayPhilostory.progress}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${todayPhilostory.progress}%` }}
          />
        </div>
      </section>
    </div>
  );
}
