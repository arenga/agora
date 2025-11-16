'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, Moon, Settings, Sun, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useTheme } from '@/lib/hooks/use-theme';
import { cn } from '@/lib/utils';

function getInitials(name?: string | null) {
  if (!name) return 'A';
  return name.slice(0, 2).toUpperCase();
}

export function UserAvatarMenu() {
  const { user, profile, signOut } = useAuthStore();
  const { theme, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!user) {
    return (
      <Button asChild size="sm" variant="default">
        <Link href="/login">
          <LogIn className="mr-2 size-4" /> 로그인
        </Link>
      </Button>
    );
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-foreground outline-none ring-ring ring-offset-2 ring-offset-background transition hover:ring-2"
        aria-expanded={open}
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.nickname ?? '사용자'}
            className="size-full rounded-full object-cover"
          />
        ) : (
          getInitials(profile?.nickname)
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-card p-2 shadow-lg">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted font-semibold">
              {getInitials(profile?.nickname)}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">{profile?.nickname ?? 'User'}</div>
              <div className="text-muted-foreground text-xs">{user.email}</div>
            </div>
          </div>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <Link
              href="/my"
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/10 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <UserIcon className="size-4" /> 내 프로필
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/10 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <Settings className="size-4" /> 설정
            </Link>
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-accent/10 hover:text-foreground"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
            >
              {mounted && theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {mounted && theme === 'dark' ? '라이트 모드' : '다크 모드'}
            </button>
            <button
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-destructive hover:bg-destructive/10 hover:text-destructive'
              )}
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            >
              <LogOut className="size-4" /> 로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
