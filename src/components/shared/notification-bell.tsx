'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  children: React.ReactElement;
}

const mockNotifications = [
  {
    id: 'n1',
    title: '새 댓글이 달렸어요',
    message: 'Philostory 질문 글에 새로운 댓글이 있습니다.',
    href: '/posts/p1111111-1111-4111-9111-111111111111',
  },
  {
    id: 'n2',
    title: '오늘의 Philostory',
    message: '“통제할 수 있는 것과 없는 것”을 읽어보세요.',
    href: '/philostory/d2222222-2222-4222-8222-222222222222',
  },
];

export function NotificationBell({ children }: NotificationBellProps) {
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

  const trigger = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      setOpen((v) => !v);
    },
    'aria-expanded': open,
  });

  return (
    <div className="relative" ref={ref}>
      {trigger}
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-card p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-foreground">
            알림
            <Link href="/notifications" className="text-xs text-primary hover:underline">
              모두 보기
            </Link>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            {mockNotifications.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                <BellOff className="size-4" />
                <span>새 알림이 없습니다.</span>
              </div>
            ) : (
              mockNotifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 hover:bg-accent/10 hover:text-foreground',
                    'transition-colors'
                  )}
                  onClick={() => setOpen(false)}
                >
                  <div className="font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.message}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
