"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Bell,
  Palette,
  Shield,
  LogOut,
  Save,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(20, "닉네임은 20자를 초과할 수 없습니다"),
  bio: z.string().max(200, "소개는 200자를 초과할 수 없습니다").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type SettingTab = "profile" | "notifications" | "appearance" | "account";

const philosopherOptions = [
  "소크라테스",
  "플라톤",
  "아리스토텔레스",
  "니체",
  "칸트",
  "데카르트",
  "사르트르",
  "카뮈",
  "마르쿠스 아우렐리우스",
  "에픽테토스",
];

const themeOptions = [
  "실존주의",
  "스토아철학",
  "윤리학",
  "인식론",
  "형이상학",
  "정치철학",
  "미학",
  "논리학",
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingTab>("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>(
    profile?.interests?.philosophers || []
  );
  const [selectedThemes, setSelectedThemes] = useState<string[]>(
    profile?.interests?.themes || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: profile?.nickname || "",
      bio: profile?.bio || "",
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              로그인이 필요한 페이지입니다.
            </p>
            <Link href="/login?redirectTo=/settings">
              <Button>로그인하기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "profile" as const, label: "프로필", icon: User },
    { id: "notifications" as const, label: "알림", icon: Bell },
    { id: "appearance" as const, label: "테마", icon: Palette },
    { id: "account" as const, label: "계정", icon: Shield },
  ];

  const togglePhilosopher = (philosopher: string) => {
    setSelectedPhilosophers((prev) =>
      prev.includes(philosopher)
        ? prev.filter((p) => p !== philosopher)
        : [...prev, philosopher].slice(0, 5)
    );
  };

  const toggleTheme = (themeOption: string) => {
    setSelectedThemes((prev) =>
      prev.includes(themeOption)
        ? prev.filter((t) => t !== themeOption)
        : [...prev, themeOption].slice(0, 5)
    );
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Update profile in Supabase
      console.log("Profile update:", {
        ...data,
        interests: {
          philosophers: selectedPhilosophers,
          themes: selectedThemes,
        },
      });
      toast.success("프로필이 업데이트되었습니다");
    } catch (error) {
      console.error(error);
      toast.error("프로필 업데이트 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      toast.success("로그아웃되었습니다");
    } catch (error) {
      console.error(error);
      toast.error("로그아웃 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-h2 font-bold mb-2">설정</h1>
        <p className="text-muted-foreground">
          계정과 앱 설정을 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>프로필 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmitProfile)}
                  className="space-y-6"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="프로필"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {profile?.nickname?.charAt(0) || user.email?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 p-1.5 bg-accent text-white rounded-full hover:bg-accent/90"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium">{profile?.nickname || "사용자"}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      닉네임
                    </label>
                    <Input
                      {...register("nickname")}
                      placeholder="닉네임을 입력하세요"
                    />
                    {errors.nickname && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.nickname.message}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      자기소개
                    </label>
                    <Textarea
                      {...register("bio")}
                      placeholder="간단한 자기소개를 작성해주세요"
                      rows={3}
                    />
                    {errors.bio && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* Favorite Philosophers */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      관심 철학자 (최대 5명)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {philosopherOptions.map((philosopher) => (
                        <Badge
                          key={philosopher}
                          variant={
                            selectedPhilosophers.includes(philosopher)
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedPhilosophers.includes(philosopher) &&
                              "bg-primary"
                          )}
                          onClick={() => togglePhilosopher(philosopher)}
                        >
                          {philosopher}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Themes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      관심 주제 (최대 5개)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {themeOptions.map((themeOption) => (
                        <Badge
                          key={themeOption}
                          variant={
                            selectedThemes.includes(themeOption)
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedThemes.includes(themeOption) && "bg-accent"
                          )}
                          onClick={() => toggleTheme(themeOption)}
                        >
                          {themeOption}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "저장 중..." : "변경사항 저장"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">새 Philostory 알림</p>
                    <p className="text-sm text-muted-foreground">
                      매일 새로운 철학 이야기가 등록되면 알림을 받습니다
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-accent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">댓글 알림</p>
                    <p className="text-sm text-muted-foreground">
                      내 글에 댓글이 달리면 알림을 받습니다
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-accent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">연속 읽기 알림</p>
                    <p className="text-sm text-muted-foreground">
                      연속 읽기 기록을 유지하도록 리마인드 알림을 받습니다
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-accent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">마케팅 알림</p>
                    <p className="text-sm text-muted-foreground">
                      이벤트 및 업데이트 소식을 받습니다
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-accent" />
                </div>

                <Button className="mt-4 bg-accent hover:bg-accent/90">
                  <Save className="h-4 w-4 mr-2" />
                  알림 설정 저장
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>테마 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    앱 테마
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={cn(
                        "p-4 border rounded-lg text-center transition-all",
                        theme === "light" &&
                          "border-accent ring-2 ring-accent/20"
                      )}
                    >
                      <div className="w-full h-20 bg-white border rounded mb-2" />
                      <span className="text-sm font-medium">라이트</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "p-4 border rounded-lg text-center transition-all",
                        theme === "dark" &&
                          "border-accent ring-2 ring-accent/20"
                      )}
                    >
                      <div className="w-full h-20 bg-slate-900 border rounded mb-2" />
                      <span className="text-sm font-medium">다크</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={cn(
                        "p-4 border rounded-lg text-center transition-all",
                        theme === "system" &&
                          "border-accent ring-2 ring-accent/20"
                      )}
                    >
                      <div className="w-full h-20 bg-gradient-to-r from-white to-slate-900 border rounded mb-2" />
                      <span className="text-sm font-medium">시스템</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    글꼴 크기
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">작게</span>
                    <input
                      type="range"
                      min="14"
                      max="20"
                      defaultValue="16"
                      className="flex-1 accent-accent"
                    />
                    <span className="text-sm">크게</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>계정 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      이메일
                    </label>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      가입일
                    </label>
                    <p className="text-muted-foreground">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString("ko-KR")
                        : "정보 없음"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">위험 구역</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">로그아웃</p>
                      <p className="text-sm text-muted-foreground">
                        현재 세션에서 로그아웃합니다
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="text-destructive hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">계정 삭제</p>
                      <p className="text-sm text-muted-foreground">
                        모든 데이터가 영구적으로 삭제됩니다
                      </p>
                    </div>
                    <Button variant="destructive">계정 삭제</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
