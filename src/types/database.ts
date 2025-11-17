// Supabase Database Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Profile = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  interests: { philosophers: string[]; themes: string[] };
  reading_streak: number;
  total_highlights: number;
  total_posts: number;
  total_comments: number;
  created_at: string;
  updated_at: string;
};

export type Philostory = {
  id: string;
  philosopher_id: string | null;
  title: string;
  content: string;
  summary: string | null;
  themes: string[];
  reading_time: number;
  published_date: string;
  view_count: number;
  highlight_count: number;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comment_count: number;
  view_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  created_at: string;
  updated_at: string;
};

export type Highlight = {
  id: string;
  user_id: string;
  philostory_id: string;
  text: string;
  start_offset: number;
  end_offset: number;
  note: string | null;
  color: string;
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  target_type: "philostory" | "post";
  target_id: string;
  created_at: string;
};

export type Vote = {
  id: string;
  user_id: string;
  target_type: "post" | "comment";
  target_id: string;
  vote_type: 1 | -1;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export type Philosopher = {
  id: string;
  name: string;
  name_ko: string;
  era: string | null;
  nationality: string | null;
  bio: string | null;
  image_url: string | null;
  created_at: string;
};
