-- Agora database schema (Week 3)
-- Run via Supabase migration

create extension if not exists "pgcrypto";

-- 1. profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname varchar(15) unique not null,
  avatar_url text,
  bio text,
  interests jsonb default '{"philosophers": [], "themes": []}',
  notification_settings jsonb default '{"daily_philostory": true, "comments": true, "best_selected": true}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. philosophers
create table if not exists philosophers (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null,
  name_en varchar(50),
  era varchar(50),
  bio text not null,
  main_works jsonb,
  theme_tags text[],
  image_url text,
  created_at timestamptz default now()
);

-- 3. philostories
create table if not exists philostories (
  id uuid primary key default gen_random_uuid(),
  philosopher_id uuid references philosophers(id),
  title varchar(200) not null,
  book_title varchar(200),
  book_year integer,
  original_text text not null,
  modern_interpretation text not null,
  real_life_application text not null,
  reflection_prompts jsonb not null,
  theme_tags text[],
  difficulty varchar(10) check (difficulty in ('easy','medium','hard')),
  reading_time_minutes integer default 5,
  publish_date date unique,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title varchar(100) not null,
  content text not null,
  category varchar(30) not null check (category in ('daily_question','agora_square','philosopher_talk')),
  philosopher_tags text[],
  theme_tags text[],
  upvote_count integer default 0,
  downvote_count integer default 0,
  comment_count integer default 0,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  is_anonymous boolean default false,
  upvote_count integer default 0,
  downvote_count integer default 0,
  is_best boolean default false,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. votes
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  target_type varchar(10) not null check (target_type in ('post','comment')),
  target_id uuid not null,
  vote_type varchar(10) not null check (vote_type in ('upvote','downvote')),
  created_at timestamptz default now(),
  unique(user_id, target_type, target_id)
);

-- 7. bookmarks
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  philostory_id uuid references philostories(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, philostory_id)
);

-- 8. highlights
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  philostory_id uuid references philostories(id) on delete cascade,
  highlighted_text text not null,
  position_start integer,
  position_end integer,
  created_at timestamptz default now()
);

-- 9. reading_history
create table if not exists reading_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  philostory_id uuid references philostories(id) on delete cascade,
  last_read_at timestamptz default now(),
  progress integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, philostory_id)
);

-- 10. notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type varchar(50) not null,
  title varchar(200) not null,
  message text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 11. reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade,
  target_type varchar(20) not null check (target_type in ('post','comment','user')),
  target_id uuid not null,
  reason varchar(100) not null,
  description text,
  status varchar(20) default 'pending' check (status in ('pending','reviewed','resolved')),
  created_at timestamptz default now()
);

-- indexes
create index if not exists idx_posts_category on posts(category);
create index if not exists idx_posts_created_at on posts(created_at desc);
create index if not exists idx_comments_post_id on comments(post_id);
create index if not exists idx_comments_parent_id on comments(parent_id);
create index if not exists idx_philostories_publish_date on philostories(publish_date desc);
create index if not exists idx_philostories_philosopher on philostories(philosopher_id);
create index if not exists idx_votes_target on votes(target_type, target_id);
create index if not exists idx_bookmarks_user on bookmarks(user_id);
create index if not exists idx_highlights_user on highlights(user_id);
create index if not exists idx_notifications_user on notifications(user_id, is_read);
create index if not exists idx_reports_target on reports(target_type, target_id);

-- updated_at helper
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create trigger tr_philostories_updated_at
  before update on philostories
  for each row execute function update_updated_at_column();

create trigger tr_posts_updated_at
  before update on posts
  for each row execute function update_updated_at_column();

create trigger tr_comments_updated_at
  before update on comments
  for each row execute function update_updated_at_column();

create trigger tr_reading_history_updated_at
  before update on reading_history
  for each row execute function update_updated_at_column();

-- handle_vote: insert/update/delete vote and sync counters
create or replace function handle_vote(
  p_user_id uuid,
  p_target_type text,
  p_target_id uuid,
  p_vote_type text
) returns void
language plpgsql security definer set search_path = public as $$
declare
  existing votes;
begin
  if p_vote_type not in ('upvote','downvote') then
    raise exception 'invalid vote_type %', p_vote_type;
  end if;

  select * into existing
  from votes
  where user_id = p_user_id and target_type = p_target_type and target_id = p_target_id;

  if not found then
    insert into votes (user_id, target_type, target_id, vote_type)
    values (p_user_id, p_target_type, p_target_id, p_vote_type);
  elsif existing.vote_type = p_vote_type then
    delete from votes where id = existing.id;
  else
    update votes set vote_type = p_vote_type where id = existing.id;
  end if;

  if p_target_type = 'post' then
    update posts
    set upvote_count = (select count(*) from votes where target_type = 'post' and target_id = p_target_id and vote_type = 'upvote'),
        downvote_count = (select count(*) from votes where target_type = 'post' and target_id = p_target_id and vote_type = 'downvote'),
        updated_at = now()
    where id = p_target_id;
  elsif p_target_type = 'comment' then
    update comments
    set upvote_count = (select count(*) from votes where target_type = 'comment' and target_id = p_target_id and vote_type = 'upvote'),
        downvote_count = (select count(*) from votes where target_type = 'comment' and target_id = p_target_id and vote_type = 'downvote'),
        updated_at = now()
    where id = p_target_id;
  else
    raise exception 'invalid target_type %', p_target_type;
  end if;
end;
$$;

-- update post.comment_count when comments change
create or replace function update_post_comment_count()
returns trigger as $$
declare
  target_post uuid;
begin
  target_post := coalesce(new.post_id, old.post_id);
  update posts
  set comment_count = (
    select count(*) from comments where post_id = target_post and is_deleted = false
  )
  where id = target_post;
  if tg_op = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$ language plpgsql;

drop trigger if exists tr_comments_count_insert on comments;
drop trigger if exists tr_comments_count_update on comments;
drop trigger if exists tr_comments_count_delete on comments;

create trigger tr_comments_count_insert
  after insert on comments
  for each row execute function update_post_comment_count();

create trigger tr_comments_count_update
  after update of is_deleted on comments
  for each row execute function update_post_comment_count();

create trigger tr_comments_count_delete
  after delete on comments
  for each row execute function update_post_comment_count();

-- increment view count (posts or philostories)
create or replace function increment_view_count(p_target_type text, p_target_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_target_type = 'post' then
    update posts set view_count = coalesce(view_count,0) + 1 where id = p_target_id;
  elsif p_target_type = 'philostory' then
    update philostories set view_count = coalesce(view_count,0) + 1 where id = p_target_id;
  else
    raise exception 'invalid target_type %', p_target_type;
  end if;
end;
$$;

-- RLS
alter table profiles enable row level security;
alter table philosophers enable row level security;
alter table philostories enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table votes enable row level security;
alter table bookmarks enable row level security;
alter table highlights enable row level security;
alter table reading_history enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;

-- profiles policies
create policy profiles_select_all on profiles for select using (true);
create policy profiles_insert_self on profiles for insert with check (auth.uid() = id);
create policy profiles_update_self on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- philosophers policies
create policy philosophers_select_all on philosophers for select using (true);
create policy philosophers_write_service on philosophers for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- philostories policies
create policy philostories_select_all on philostories for select using (true);
create policy philostories_write_service on philostories for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- posts policies
create policy posts_select_public on posts for select using (is_deleted = false or author_id = auth.uid());
create policy posts_insert_auth on posts for insert with check (auth.uid() = author_id);
create policy posts_update_self on posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy posts_delete_self on posts for delete using (auth.uid() = author_id);

-- comments policies
create policy comments_select_public on comments for select using (is_deleted = false or author_id = auth.uid());
create policy comments_insert_auth on comments for insert with check (auth.uid() = author_id);
create policy comments_update_self on comments for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy comments_delete_self on comments for delete using (auth.uid() = author_id);

-- votes policies
create policy votes_select_self on votes for select using (auth.uid() = user_id);
create policy votes_insert_self on votes for insert with check (auth.uid() = user_id);
create policy votes_update_self on votes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy votes_delete_self on votes for delete using (auth.uid() = user_id);

-- bookmarks policies
create policy bookmarks_select_self on bookmarks for select using (auth.uid() = user_id);
create policy bookmarks_insert_self on bookmarks for insert with check (auth.uid() = user_id);
create policy bookmarks_delete_self on bookmarks for delete using (auth.uid() = user_id);

-- highlights policies
create policy highlights_select_self on highlights for select using (auth.uid() = user_id);
create policy highlights_insert_self on highlights for insert with check (auth.uid() = user_id);
create policy highlights_delete_self on highlights for delete using (auth.uid() = user_id);

-- reading_history policies
create policy reading_history_select_self on reading_history for select using (auth.uid() = user_id);
create policy reading_history_upsert_self on reading_history for insert with check (auth.uid() = user_id);
create policy reading_history_update_self on reading_history for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- notifications policies
create policy notifications_select_self on notifications for select using (auth.uid() = user_id);
create policy notifications_update_self on notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy notifications_insert_service on notifications for insert with check (auth.role() = 'service_role');

-- reports policies
create policy reports_select_self on reports for select using (auth.uid() = reporter_id);
create policy reports_insert_self on reports for insert with check (auth.uid() = reporter_id);
create policy reports_update_service on reports for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
