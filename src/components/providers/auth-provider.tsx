'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // 환경 변수가 설정되어 있을 때만 초기화
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      initialize();
    } else {
      // 환경 변수가 없으면 로딩 상태만 해제
      useAuthStore.setState({ loading: false, initialized: true });
    }
  }, [initialize]);

  return <>{children}</>;
}
