'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { NotificationBell } from '@/components/shared/notification-bell';
import { UserAvatarMenu } from '@/components/shared/user-avatar';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Philostory' },
  { href: '/agora-square', label: 'Agora Square' },
  { href: '/archive', label: 'Archive' },
  { href: '/my', label: 'My' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <MobileNav navLinks={navLinks} />
          <Link href="/" className="font-semibold tracking-tight">
            Agora
          </Link>
        </div>

        <nav className="hidden flex-1 items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                pathname === link.href && 'bg-accent/10 text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="hidden md:inline-flex">
            <Search className="size-4" />
            <span className="sr-only">검색</span>
          </Button>
          <NotificationBell>
            <Button variant="ghost" size="icon-sm">
              <Bell className="size-4" />
              <span className="sr-only">알림</span>
            </Button>
          </NotificationBell>
          <UserAvatarMenu />
        </div>
      </div>
    </header>
  );
}
