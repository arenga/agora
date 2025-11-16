-- Seed data for Agora (Week 3)

-- Users/Profiles
insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'seed'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'seed'),
  ('33333333-3333-3333-3333-333333333333', 'chloe@example.com', 'seed')
on conflict (id) do nothing;

insert into profiles (id, nickname, avatar_url, bio, interests)
values
  ('11111111-1111-1111-1111-111111111111', '앨리스', null, '철학 입문자, 스토아 철학 기록 중', '{"philosophers":["Epictetus"],"themes":["stoicism","virtue"]}'),
  ('22222222-2222-2222-2222-222222222222', '밥', null, '논증과 토론을 좋아하는 직장인', '{"philosophers":["Socrates"],"themes":["ethics","dialogue"]}'),
  ('33333333-3333-3333-3333-333333333333', '클로이', null, '고전을 현대적으로 풀어내는 작가', '{"philosophers":["Marcus Aurelius"],"themes":["leadership","journal"]}')
  on conflict (id) do nothing;

-- Philosophers
insert into philosophers (id, name, name_en, era, bio, main_works, theme_tags, image_url) values
  ('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa1', '소크라테스', 'Socrates', '고대 그리스', '문답법과 무지의 지를 강조한 철학자', '{"works":["소크라테스의 변명"]}', '{"ethics","dialogue"}', null),
  ('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbb2', '에픽테토스', 'Epictetus', '스토아', '자유 의지와 통제의 이분법을 강조한 스토아 철학자', '{"works":["담화록"]}', '{"stoicism","virtue","discipline"}', null),
  ('cccccccc-cccc-4ccc-cccc-ccccccccccc3', '마르쿠스 아우렐리우스', 'Marcus Aurelius', '스토아', '명상록으로 알려진 로마 황제 철학자', '{"works":["명상록"]}', '{"leadership","resilience","stoicism"}', null)
on conflict (id) do nothing;

-- Philostories
insert into philostories (id, philosopher_id, title, book_title, book_year, original_text, modern_interpretation, real_life_application, reflection_prompts, theme_tags, difficulty, reading_time_minutes, publish_date, view_count)
values
  ('d1111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa1', '무지의 지, 질문에서 시작하다', '변명', -399, '나는 내가 아무것도 모른다는 것을 안다', '무지의 인정은 열린 학습 태도를 만든다', '팀 논의에서 확신보다 질문을 던진다', '{"prompts":["최근에 확신했던 것이 틀렸던 경험은?","질문이 대화를 어떻게 바꾸었나?"]}', '{"dialogue","humility"}', 'easy', 5, '2025-01-10', 12),
  ('d2222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbb2', '통제할 수 있는 것과 없는 것', '담화록', 108, '통제 가능한 것에만 힘을 써라', '외부 사건보다 내 반응과 선택에 집중', '업무 스트레스 상황에서 내가 통제 가능한 목록을 적는다', '{"prompts":["오늘 내가 통제할 수 있는 것은?","집착을 내려놓을 대상은?"]}', '{"stoicism","focus"}', 'easy', 4, '2025-01-11', 18),
  ('d3333333-3333-4333-8333-333333333333', 'cccccccc-cccc-4ccc-cccc-ccccccccccc3', '리더의 일기, 하루를 정리하는 힘', '명상록', 175, '매일 스스로를 돌아보라', '저널링을 통해 가치와 행동을 정렬', '퇴근 전 5분 일지로 배운 점/감사/개선 1가지씩 적기', '{"prompts":["오늘 가장 배운 점은?","내일 바꾸고 싶은 행동은?"]}', '{"leadership","journal"}', 'medium', 6, '2025-01-12', 9),
  ('d4444444-4444-4444-8444-444444444444', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbb2', '자유는 내 마음의 상태', '담화록', 108, '모욕은 내 감정이 허락할 때만 상처가 된다', '타인의 평가에 흔들리지 않는 내적 기준 세우기', '피드백을 들을 때 사실/의견을 분리해 기록', '{"prompts":["최근 감정이 요동친 순간은?","내가 세운 기준은 무엇인가?"]}', '{"resilience","self-control"}', 'medium', 6, '2025-01-13', 3),
  ('d5555555-5555-4555-8555-555555555555', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa1', '정의란 무엇인가', '국가', -380, '정의는 각자가 자기 일을 하는 것', '역할 충실이 공동체 정의를 만든다', '팀 역할을 명확히 하고 교차 점검하기', '{"prompts":["내 역할의 핵심은?","경계를 넘나들 때 생기는 문제는?"]}', '{"justice","roles"}', 'hard', 8, '2025-01-14', 1)
  on conflict (id) do nothing;

-- Posts
insert into posts (id, author_id, title, content, category, philosopher_tags, theme_tags, upvote_count, downvote_count, comment_count, view_count)
values
  ('p1111111-1111-4111-9111-111111111111', '11111111-1111-1111-1111-111111111111', '오늘의 질문: 나는 무엇을 모를까?', '소크라테스식 질문을 일상에 적용해보고 싶어요.', 'daily_question', '{"Socrates"}', '{"humility"}', 2, 0, 2, 15),
  ('p2222222-2222-4222-9222-222222222222', '22222222-2222-2222-2222-222222222222', '통제 가능한 목록 써보신 분?', '에픽테토스 통제 이분법으로 업무 스트레스 줄이기 경험 공유해요.', 'agora_square', '{"Epictetus"}', '{"stoicism","focus"}', 1, 0, 1, 9),
  ('p3333333-3333-4333-9333-333333333333', '33333333-3333-3333-3333-333333333333', '리더의 저널링 루틴 공유', '아우렐리우스 명상록 기반으로 적는 질문 리스트 공유합니다.', 'philosopher_talk', '{"Marcus Aurelius"}', '{"journal","leadership"}', 0, 0, 0, 4)
  on conflict (id) do nothing;

-- Comments
insert into comments (id, post_id, author_id, content, is_anonymous, upvote_count, downvote_count, is_deleted)
values
  ('c1111111-1111-4111-a111-111111111111', 'p1111111-1111-4111-9111-111111111111', '22222222-2222-2222-2222-222222222222', '저도 질문 리스트 만들어 공유할게요!', false, 1, 0, false),
  ('c2222222-2222-4222-a222-222222222222', 'p1111111-1111-4111-9111-111111111111', '33333333-3333-3333-3333-333333333333', '모른다는 걸 인정하는 게 어렵지만 해보겠습니다.', true, 0, 0, false),
  ('c3333333-3333-4333-a333-333333333333', 'p2222222-2222-4222-9222-222222222222', '11111111-1111-1111-1111-111111111111', '통제 리스트가 마음을 차분하게 하더라고요.', false, 1, 0, false)
  on conflict (id) do nothing;

-- Votes (sample upvotes)
insert into votes (id, user_id, target_type, target_id, vote_type)
values
  ('v1111111-1111-4111-b111-111111111111', '11111111-1111-1111-1111-111111111111', 'post', 'p2222222-2222-4222-9222-222222222222', 'upvote'),
  ('v2222222-2222-4222-b222-222222222222', '22222222-2222-2222-2222-222222222222', 'post', 'p1111111-1111-4111-9111-111111111111', 'upvote'),
  ('v3333333-3333-4333-b333-333333333333', '33333333-3333-3333-3333-333333333333', 'comment', 'c1111111-1111-4111-a111-111111111111', 'upvote')
  on conflict (user_id, target_type, target_id) do nothing;

-- Bookmarks
insert into bookmarks (id, user_id, philostory_id)
values
  ('bkmk1111-1111-4111-c111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-4222-8222-222222222222'),
  ('bkmk2222-2222-4222-c222-222222222222', '22222222-2222-2222-2222-222222222222', 'd1111111-1111-4111-8111-111111111111')
  on conflict (user_id, philostory_id) do nothing;

-- Highlights
insert into highlights (id, user_id, philostory_id, highlighted_text, position_start, position_end)
values
  ('h1111111-1111-4111-d111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-4222-8222-222222222222', '통제 가능한 것에만 힘을 써라', 0, 20),
  ('h2222222-2222-4222-d222-222222222222', '33333333-3333-3333-3333-333333333333', 'd3333333-3333-4333-8333-333333333333', '매일 스스로를 돌아보라', 0, 15)
  on conflict (id) do nothing;

-- Reading history
insert into reading_history (id, user_id, philostory_id, progress)
values
  ('r1111111-1111-4111-e111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-4222-8222-222222222222', 80),
  ('r2222222-2222-4222-e222-222222222222', '22222222-2222-2222-2222-222222222222', 'd1111111-1111-4111-8111-111111111111', 40)
  on conflict (user_id, philostory_id) do update set progress = excluded.progress, updated_at = now();

-- Notifications
insert into notifications (id, user_id, type, title, message, link)
values
  ('n1111111-1111-4111-f111-111111111111', '11111111-1111-1111-1111-111111111111', 'comment', '새 댓글이 달렸어요', '질문 글에 새로운 댓글이 있습니다', '/posts/p1111111-1111-4111-9111-111111111111')
  on conflict (id) do nothing;

-- Reports
insert into reports (id, reporter_id, target_type, target_id, reason, description)
values
  ('rep11111-1111-4111-g111-111111111111', '22222222-2222-2222-2222-222222222222', 'comment', 'c1111111-1111-4111-a111-111111111111', 'abuse', '부적절한 표현 신고')
  on conflict (id) do nothing;
