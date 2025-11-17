"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const postSchema = z.object({
  title: z
    .string()
    .min(5, "제목은 최소 5자 이상이어야 합니다")
    .max(100, "제목은 100자를 초과할 수 없습니다"),
  content: z
    .string()
    .min(20, "내용은 최소 20자 이상이어야 합니다")
    .max(10000, "내용은 10000자를 초과할 수 없습니다"),
  category: z.enum(
    ["discussion", "question", "insight", "recommendation", "free"],
    {
      message: "카테고리를 선택해주세요",
    }
  ),
});

type PostFormData = z.infer<typeof postSchema>;

const categories = [
  {
    value: "discussion",
    label: "토론",
    description: "철학적 주제에 대한 심도 있는 토론",
  },
  {
    value: "question",
    label: "질문",
    description: "철학에 대한 궁금증을 질문하세요",
  },
  {
    value: "insight",
    label: "인사이트",
    description: "개인적인 통찰과 깨달음을 공유",
  },
  {
    value: "recommendation",
    label: "추천",
    description: "책, 강의, 콘텐츠 추천",
  },
  {
    value: "free",
    label: "자유",
    description: "자유롭게 이야기를 나누세요",
  },
];

export default function WritePage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: undefined,
    },
  });

  const selectedCategory = watch("category");
  const contentLength = watch("content")?.length || 0;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags([...tags, newTag]);
        setTagInput("");
      } else if (tags.length >= 10) {
        toast.error("태그는 최대 10개까지 추가할 수 있습니다");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Supabase에 게시글 저장
      console.log("Post data:", { ...data, tags });

      // 임시로 성공 처리
      toast.success("게시글이 작성되었습니다");
      router.push("/community");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("게시글 작성 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/community">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </Link>
        <h1 className="text-h2 font-bold">새 글 작성</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">카테고리 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    setValue("category", category.value as PostFormData["category"], {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    selectedCategory === category.value
                      ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <div className="font-semibold mb-1">{category.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-destructive text-sm mt-2">
                {errors.category.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Title */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">제목</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              {...register("title")}
              placeholder="명확하고 구체적인 제목을 작성해주세요"
              className="text-lg"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-2">
                {errors.title.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">내용</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register("content")}
              placeholder="철학적 생각과 의견을 자유롭게 작성해주세요. 근거와 출처를 명시하면 더욱 좋습니다."
              className="min-h-[300px] resize-y"
              maxLength={10000}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.content && (
                <p className="text-destructive text-sm">
                  {errors.content.message}
                </p>
              )}
              <span
                className={cn(
                  "text-sm ml-auto",
                  contentLength > 9000
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {contentLength.toLocaleString()} / 10,000
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">태그</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="태그를 입력하고 Enter를 누르세요 (최대 10개)"
                maxLength={30}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                관련 키워드를 태그로 추가하면 다른 사용자가 글을 더 쉽게 찾을 수
                있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/community">
            <Button type="button" variant="outline">
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90"
          >
            {isSubmitting ? (
              "작성 중..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                게시하기
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
