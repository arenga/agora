'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuthStore } from '@/store/auth';
import { useTheme } from '@/lib/hooks/use-theme';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  navLinks: { href: string; label: string }[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="메뉴 열기">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-4">
        <SheetHeader className="pb-0">
          <SheetTitle>Agora</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-foreground',
                pathname === link.href && 'bg-accent/10 text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="text-sm font-medium">테마</span>
          <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2">
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="text-xs">{theme === 'dark' ? '라이트로' : '다크로'}</span>
          </Button>
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t pt-4">
          {user ? (
            <Button variant="outline" size="sm" className="justify-start gap-2" onClick={signOut}>
              <LogOut className="size-4" /> 로그아웃
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="default" size="sm" className="flex-1 gap-2">
                <Link href="/login">
                  <LogIn className="size-4" /> 로그인
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
