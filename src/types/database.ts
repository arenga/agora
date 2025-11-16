// Auto-synced manually for Week 3 schema (keep in sync with supabase/migrations)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_url: string | null;
          bio: string | null;
          interests: Json | null;
          notification_settings: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          nickname: string;
          avatar_url?: string | null;
          bio?: string | null;
          interests?: Json | null;
          notification_settings?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [{
          foreignKeyName: 'profiles_id_fkey';
          columns: ['id'];
          referencedRelation: 'users';
          referencedColumns: ['id'];
        }];
      };
      philosophers: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          era: string | null;
          bio: string;
          main_works: Json | null;
          theme_tags: string[] | null;
          image_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          name_en?: string | null;
          era?: string | null;
          bio: string;
          main_works?: Json | null;
          theme_tags?: string[] | null;
          image_url?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['philosophers']['Insert']>;
        Relationships: [];
      };
      philostories: {
        Row: {
          id: string;
          philosopher_id: string | null;
          title: string;
          book_title: string | null;
          book_year: number | null;
          original_text: string;
          modern_interpretation: string;
          real_life_application: string;
          reflection_prompts: Json;
          theme_tags: string[] | null;
          difficulty: 'easy' | 'medium' | 'hard' | null;
          reading_time_minutes: number | null;
          publish_date: string | null;
          view_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          philosopher_id?: string | null;
          title: string;
          book_title?: string | null;
          book_year?: number | null;
          original_text: string;
          modern_interpretation: string;
          real_life_application: string;
          reflection_prompts: Json;
          theme_tags?: string[] | null;
          difficulty?: 'easy' | 'medium' | 'hard' | null;
          reading_time_minutes?: number | null;
          publish_date?: string | null;
          view_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['philostories']['Insert']>;
        Relationships: [{
          foreignKeyName: 'philostories_philosopher_id_fkey';
          columns: ['philosopher_id'];
          referencedRelation: 'philosophers';
          referencedColumns: ['id'];
        }];
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          category: 'daily_question' | 'agora_square' | 'philosopher_talk';
          philosopher_tags: string[] | null;
          theme_tags: string[] | null;
          upvote_count: number | null;
          downvote_count: number | null;
          comment_count: number | null;
          is_deleted: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          view_count: number | null;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          category: 'daily_question' | 'agora_square' | 'philosopher_talk';
          philosopher_tags?: string[] | null;
          theme_tags?: string[] | null;
          upvote_count?: number | null;
          downvote_count?: number | null;
          comment_count?: number | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
        Relationships: [{
          foreignKeyName: 'posts_author_id_fkey';
          columns: ['author_id'];
          referencedRelation: 'profiles';
          referencedColumns: ['id'];
        }];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          parent_id: string | null;
          author_id: string;
          content: string;
          is_anonymous: boolean | null;
          upvote_count: number | null;
          downvote_count: number | null;
          is_best: boolean | null;
          is_deleted: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          parent_id?: string | null;
          author_id: string;
          content: string;
          is_anonymous?: boolean | null;
          upvote_count?: number | null;
          downvote_count?: number | null;
          is_best?: boolean | null;
          is_deleted?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'comments_post_id_fkey';
            columns: ['post_id'];
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_parent_id_fkey';
            columns: ['parent_id'];
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_author_id_fkey';
            columns: ['author_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          vote_type: 'upvote' | 'downvote';
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          vote_type: 'upvote' | 'downvote';
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['votes']['Insert']>;
        Relationships: [{
          foreignKeyName: 'votes_user_id_fkey';
          columns: ['user_id'];
          referencedRelation: 'profiles';
          referencedColumns: ['id'];
        }];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          philostory_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          philostory_id: string;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['bookmarks']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'bookmarks_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookmarks_philostory_id_fkey';
            columns: ['philostory_id'];
            referencedRelation: 'philostories';
            referencedColumns: ['id'];
          }
        ];
      };
      highlights: {
        Row: {
          id: string;
          user_id: string;
          philostory_id: string;
          highlighted_text: string;
          position_start: number | null;
          position_end: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          philostory_id: string;
          highlighted_text: string;
          position_start?: number | null;
          position_end?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['highlights']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'highlights_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'highlights_philostory_id_fkey';
            columns: ['philostory_id'];
            referencedRelation: 'philostories';
            referencedColumns: ['id'];
          }
        ];
      };
      reading_history: {
        Row: {
          id: string;
          user_id: string;
          philostory_id: string;
          last_read_at: string | null;
          progress: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          philostory_id: string;
          last_read_at?: string | null;
          progress?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['reading_history']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'reading_history_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reading_history_philostory_id_fkey';
            columns: ['philostory_id'];
            referencedRelation: 'philostories';
            referencedColumns: ['id'];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string | null;
          link: string | null;
          is_read: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message?: string | null;
          link?: string | null;
          is_read?: boolean | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
        Relationships: [{
          foreignKeyName: 'notifications_user_id_fkey';
          columns: ['user_id'];
          referencedRelation: 'profiles';
          referencedColumns: ['id'];
        }];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: 'post' | 'comment' | 'user';
          target_id: string;
          reason: string;
          description: string | null;
          status: 'pending' | 'reviewed' | 'resolved' | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: 'post' | 'comment' | 'user';
          target_id: string;
          reason: string;
          description?: string | null;
          status?: 'pending' | 'reviewed' | 'resolved' | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
        Relationships: [{
          foreignKeyName: 'reports_reporter_id_fkey';
          columns: ['reporter_id'];
          referencedRelation: 'profiles';
          referencedColumns: ['id'];
        }];
      };
    };
    Functions: {
      handle_vote: {
        Args: { p_user_id: string; p_target_type: 'post' | 'comment'; p_target_id: string; p_vote_type: 'upvote' | 'downvote' };
        Returns: void;
      };
      increment_view_count: {
        Args: { p_target_type: 'post' | 'philostory'; p_target_id: string };
        Returns: void;
      };
    };
  };
};

export type PublicTables = Database['public']['Tables'];
export type TableRow<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type TableInsert<T extends keyof PublicTables> = PublicTables[T]['Insert'];
export type TableUpdate<T extends keyof PublicTables> = PublicTables[T]['Update'];
