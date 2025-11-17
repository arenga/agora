"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth";
import { ThemeToggle } from "./theme-toggle";
import { Menu, Bell, User, BookOpen, Users, Archive } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "오늘의 철학", icon: BookOpen },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/archive", label: "아카이브", icon: Archive },
];

export function Header() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-h4 font-bold text-primary">아고라</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 text-body-sm transition-colors ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/my-archive">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="hidden md:flex"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button size="sm">로그인</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-body py-2"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <hr />
                {user ? (
                  <>
                    <Link
                      href="/my-archive"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-body py-2"
                    >
                      <User className="h-5 w-5" />
                      <span>내 아카이브</span>
                    </Link>
                    <Button variant="outline" onClick={() => signOut()}>
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">로그인</Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
