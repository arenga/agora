import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(_: NextRequest) {
  // 임시로 인증 미들웨어를 비활성화하여 초기 500 오류를 차단합니다.
  // 추후 Supabase Auth 연동 시 다시 활성화하세요.
  return NextResponse.next();
}

// 미들웨어 완전 비활성화
export const config = {};
