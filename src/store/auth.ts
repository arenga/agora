import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  interests: {
    philosophers: string[];
    themes: string[];
  };
  created_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    if (get().initialized) return;

    const supabase = createClient();

    // 현재 세션 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      set({ user });

      // 프로필 정보 가져오기
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        set({ profile });
      }
    }

    // Auth 상태 변경 리스너 설정
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({ user: session.user });

        // 프로필 정보 갱신
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({ profile });
        }
      } else {
        set({ user: null, profile: null });
      }
    });

    set({ loading: false, initialized: true });
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
