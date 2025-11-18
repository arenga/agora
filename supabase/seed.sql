-- Seed data for Agora (Extended with Nietzsche, Schopenhauer, and more content)

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

-- Philosophers (Extended)
insert into philosophers (id, name, name_en, era, bio, main_works, theme_tags, image_url) values
  ('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa1', '소크라테스', 'Socrates', '고대 그리스 (BC 469-399)', '문답법과 무지의 지를 강조한 철학자. 자신이 아무것도 모른다는 것을 안다는 유명한 역설로 알려져 있다.', '{"works":["소크라테스의 변명","크리톤"]}', '{"ethics","dialogue","virtue","knowledge"}', null),
  ('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbb2', '에픽테토스', 'Epictetus', '스토아 (55-135)', '자유 의지와 통제의 이분법을 강조한 스토아 철학자. 노예에서 철학자가 된 특별한 이력을 가지고 있다.', '{"works":["담화록","엥케이리디온"]}', '{"stoicism","virtue","discipline","freedom"}', null),
  ('cccccccc-cccc-4ccc-cccc-ccccccccccc3', '마르쿠스 아우렐리우스', 'Marcus Aurelius', '스토아 (121-180)', '명상록으로 알려진 로마 황제 철학자. 철인왕의 이상을 실현한 인물로 평가받는다.', '{"works":["명상록"]}', '{"leadership","resilience","stoicism","duty"}', null),
  ('dddddddd-dddd-4ddd-dddd-ddddddddddd4', '프리드리히 니체', 'Friedrich Nietzsche', '근대 (1844-1900)', '신은 죽었다고 선언하며 전통 도덕을 비판한 철학자. 위버멘쉬와 영원회귀 사상으로 유명하다.', '{"works":["차라투스트라는 이렇게 말했다","선악의 저편","도덕의 계보"]}', '{"nihilism","will-to-power","eternal-return","perspectivism"}', null),
  ('eeeeeeee-eeee-4eee-eeee-eeeeeeeeee05', '아르투어 쇼펜하우어', 'Arthur Schopenhauer', '근대 (1788-1860)', '의지와 표상으로서의 세계를 통해 염세주의 철학을 펼친 독일 철학자. 불교 사상에 영향을 받았다.', '{"works":["의지와 표상으로서의 세계","여록과 보유"]}', '{"pessimism","will","suffering","aesthetics"}', null)
on conflict (id) do nothing;

-- Philostories (Extended with Nietzsche and Schopenhauer)
insert into philostories (id, philosopher_id, title, book_title, book_year, original_text, modern_interpretation, real_life_application, reflection_prompts, theme_tags, difficulty, reading_time_minutes, publish_date, view_count)
values
  -- Socrates
  ('d1111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa1', '무지의 지, 질문에서 시작하다', '변명', -399, '나는 내가 아무것도 모른다는 것을 안다 (Ἓν οἶδα ὅτι οὐδὲν οἶδα)', '무지의 인정은 열린 학습 태도를 만든다. 자신이 모른다는 것을 아는 사람만이 진정으로 배울 수 있다.', '팀 논의에서 확신보다 질문을 던진다. "이것이 정말 맞을까?"라는 질문으로 시작하기', '{"prompts":["최근에 확신했던 것이 틀렸던 경험은?","질문이 대화를 어떻게 바꾸었나?","내가 가장 모르는 분야는 무엇인가?"]}', '{"dialogue","humility","knowledge"}', 'easy', 5, '2025-01-10', 12),

  -- Epictetus
  ('d2222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbb2', '통제할 수 있는 것과 없는 것', '담화록', 108, '어떤 것은 우리 권한 안에 있고, 어떤 것은 우리 권한 밖에 있다 (Τὰ μὲν ἐφ'' ἡμῖν, τὰ δὲ οὐκ ἐφ'' ἡμῖν)', '외부 사건보다 내 반응과 선택에 집중하라. 에너지를 통제 가능한 것에만 쓰는 것이 평온의 비결이다.', '업무 스트레스 상황에서 내가 통제 가능한 목록을 적는다: 나의 태도, 노력, 반응', '{"prompts":["오늘 내가 통제할 수 있는 것은?","집착을 내려놓을 대상은?","통제할 수 없는 것에 얼마나 에너지를 쓰고 있나?"]}', '{"stoicism","focus","control"}', 'easy', 4, '2025-01-11', 18),

  -- Marcus Aurelius
  ('d3333333-3333-4333-8333-333333333333', 'cccccccc-cccc-4ccc-cccc-ccccccccccc3', '리더의 일기, 하루를 정리하는 힘', '명상록', 175, '매일 아침 스스로에게 말하라: 오늘 나는 참견하기 좋아하는 사람, 배은망덕한 사람, 폭력적인 사람을 만날 것이다', '저널링을 통해 가치와 행동을 정렬하고, 하루를 준비한다. 예상과 대비가 평정심을 만든다.', '퇴근 전 5분 일지로 배운 점/감사/개선 1가지씩 적기. 아침에는 오늘의 챌린지를 예상하기', '{"prompts":["오늘 가장 배운 점은?","내일 바꾸고 싶은 행동은?","예상했던 어려움이 실제로 일어났을 때 어떻게 대처했나?"]}', '{"leadership","journal","preparation"}', 'medium', 6, '2025-01-12', 9),

  -- Nietzsche
  ('d4444444-4444-4444-8444-444444444444', 'dddddddd-dddd-4ddd-dddd-ddddddddddd4', '신은 죽었다 - 그 후 우리는 무엇을 해야 하는가', '즐거운 학문', 1882, '신은 죽었다. 신은 죽은 채로 있다. 그리고 우리가 그를 죽였다 (Gott ist tot)', '전통적 가치 체계의 붕괴 후, 우리는 스스로 의미를 창조해야 한다. 허무주의를 넘어서는 것이 과제다.', '내 삶의 의미를 외부(종교, 사회)가 아닌 내가 직접 정의하기. "나는 무엇을 위해 사는가?" 질문하기', '{"prompts":["내가 따르는 가치는 누가 만든 것인가?","스스로 만든 의미는 무엇인가?","허무를 느낄 때 어떻게 대처하는가?"]}', '{"nihilism","meaning","values","modernity"}', 'hard', 8, '2025-01-13', 3),

  ('d5555555-5555-4555-8555-555555555555', 'dddddddd-dddd-4ddd-dddd-ddddddddddd4', '영원회귀 - 이 순간을 다시 살 수 있는가', '차라투스트라는 이렇게 말했다', 1883, '너의 삶이 무한히 반복된다면, 너는 그것을 견딜 수 있겠는가? (Ewige Wiederkunft)', '삶의 모든 순간을 영원히 반복할 가치가 있게 살아라. 이것이 궁극적 삶의 긍정이다.', '중요한 선택 앞에서 "이 선택을 영원히 반복하고 싶은가?" 질문하기', '{"prompts":["영원히 반복해도 좋을 순간은?","후회 없이 살고 있는가?","어떤 순간을 바꾸고 싶은가?"]}', '{"eternal-return","affirmation","choice"}', 'hard', 7, '2025-01-14', 1),

  ('d6666666-6666-4666-8666-666666666666', 'dddddddd-dddd-4ddd-dddd-ddddddddddd4', '힘에의 의지 - 성장의 원동력', '권력에의 의지', 1901, '삶이란 무엇인가? 삶이란 힘에의 의지이다 (Der Wille zur Macht)', '인간의 근본 동력은 힘을 키우려는 의지다. 성장, 극복, 창조가 삶의 본질이다.', '정체된 영역을 찾아 도전 과제를 설정하기. 매주 하나씩 comfort zone 벗어나기', '{"prompts":["최근에 성장을 느낀 순간은?","두려워서 피한 도전은?","힘을 키우고 싶은 분야는?"]}', '{"will-to-power","growth","challenge"}', 'medium', 6, '2025-01-15', 5),

  -- Schopenhauer
  ('d7777777-7777-4777-8777-777777777777', 'eeeeeeee-eeee-4eee-eeee-eeeeeeeeee05', '세상은 나의 표상이다', '의지와 표상으로서의 세계', 1818, '세상은 나의 표상이다 (Die Welt ist meine Vorstellung)', '우리가 경험하는 세계는 우리의 인식이 구성한 것이다. 객관적 실재가 아닌 주관적 표상을 본다.', '갈등 상황에서 "이것은 나의 해석일 뿐"이라고 인식하기. 다른 관점도 존재함을 받아들이기', '{"prompts":["최근 내 해석이 틀렸던 경험은?","같은 사건을 다르게 본 경우는?","나의 필터는 무엇인가?"]}', '{"perception","reality","subjectivity"}', 'hard', 7, '2025-01-16', 2),

  ('d8888888-8888-4888-8888-888888888888', 'eeeeeeee-eeee-4eee-eeee-eeeeeeeeee05', '욕망은 고통의 근원', '의지와 표상으로서의 세계', 1818, '모든 욕망은 결핍에서 나온다. 그리고 모든 욕망은 고통이다', '욕망의 충족은 일시적 만족일 뿐, 곧 새로운 욕망이 생긴다. 욕망의 순환을 인식하는 것이 첫걸음이다.', '쇼핑 전 "이것이 진짜 필요한가, 욕망인가?" 구분하기. 24시간 규칙 적용하기', '{"prompts":["최근 채워지지 않는 욕망은?","충족 후 허무했던 경험은?","진정한 만족은 언제 느꼈나?"]}', '{"suffering","desire","buddhism"}', 'medium', 6, '2025-01-17', 4),

  ('d9999999-9999-4999-8999-999999999999', 'eeeeeeee-eeee-4eee-eeee-eeeeeeeeee05', '예술, 의지로부터의 해방', '의지와 표상으로서의 세계', 1818, '예술은 의지의 노역에서 벗어나 순수 직관의 상태로 들어가는 것이다', '예술 감상은 욕망과 고통에서 벗어나 순간적 평온을 준다. 몰입은 치유다.', '일주일에 한 번 순수하게 감상하는 시간 갖기: 음악, 미술, 자연', '{"prompts":["최근 완전히 몰입한 순간은?","예술이 위로가 된 경험은?","일상에서 미적 경험을 어떻게 만들까?"]}', '{"aesthetics","contemplation","relief"}', 'medium', 5, '2025-01-18', 3),

  -- More Stoic content
  ('da000000-a000-4a00-8a00-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbb2', '자유는 내 마음의 상태', '담화록', 108, '자유인은 외부의 것에 흔들리지 않는다', '타인의 평가에 흔들리지 않는 내적 기준 세우기. 진정한 자유는 내면에서 온다.', '피드백을 들을 때 사실/의견을 분리해 기록. 내적 기준으로 판단하기', '{"prompts":["최근 감정이 요동친 순간은?","내가 세운 기준은 무엇인가?","타인의 시선에서 자유로운가?"]}', '{"resilience","self-control","freedom"}', 'medium', 6, '2025-01-19', 7)
  on conflict (id) do nothing;

-- Posts (Extended)
insert into posts (id, author_id, title, content, category, philosopher_tags, theme_tags, upvote_count, downvote_count, comment_count)
values
  ('01111111-1111-4111-a111-111111111111', '11111111-1111-1111-1111-111111111111', '[오늘의 질문] 나는 무엇을 모를까?', '소크라테스식 질문을 일상에 적용해보고 싶어요. 여러분은 어떤 질문을 스스로에게 던지시나요?', 'daily_question', '{"소크라테스"}', '{"무지의지"}', 2, 0, 2),
  ('02222222-2222-4222-a222-222222222222', '22222222-2222-2222-2222-222222222222', '[아고라 광장] 통제 가능한 목록 써보신 분?', '에픽테토스 통제 이분법으로 업무 스트레스 줄이기 경험 공유해요. 저는 매일 아침 3가지씩 적고 있습니다.', 'agora_square', '{"에픽테토스"}', '{"스토아"}', 5, 0, 3),
  ('03333333-3333-4333-a333-333333333333', '33333333-3333-3333-3333-333333333333', '[철학자와 대화] 리더의 저널링 루틴 공유', '아우렐리우스 명상록 기반으로 적는 질문 리스트 공유합니다. 매일 밤 10분 투자로 하루를 정리합니다.', 'philosopher_talk', '{"마르쿠스아우렐리우스"}', '{"저널링"}', 3, 0, 1),
  ('04444444-4444-4444-a444-444444444444', '11111111-1111-1111-1111-111111111111', '[질문] 니체의 영원회귀, 어떻게 이해하시나요?', '영원히 반복된다는 개념이 너무 무섭게 느껴집니다. 긍정적으로 받아들이는 방법이 있을까요?', 'daily_question', '{"니체"}', '{"영원회귀"}', 8, 1, 5)
  on conflict (id) do nothing;

-- Comments (Extended)
insert into comments (id, post_id, author_id, parent_id, content, upvote_count, downvote_count)
values
  ('0a111111-1111-4111-b111-111111111111', '01111111-1111-4111-a111-111111111111', '22222222-2222-2222-2222-222222222222', null, '저도 질문 리스트 만들어 공유할게요! "이것이 정말 중요한가?"가 제 핵심 질문입니다.', 1, 0),
  ('0a222222-2222-4222-b222-222222222222', '01111111-1111-4111-a111-111111111111', '33333333-3333-3333-3333-333333333333', null, '모른다는 걸 인정하는 게 어렵지만 해보겠습니다.', 0, 0),
  ('0a333333-3333-4333-b333-333333333333', '02222222-2222-4222-a222-222222222222', '11111111-1111-1111-1111-111111111111', null, '통제 리스트가 마음을 차분하게 하더라고요. 감사합니다!', 2, 0),
  ('0a444444-4444-4444-b444-444444444444', '04444444-4444-4444-a444-444444444444', '22222222-2222-2222-2222-222222222222', null, '영원회귀는 "지금 이 순간을 최선을 다해 살아라"는 메시지로 받아들이면 어떨까요? 후회 없는 삶이 목표가 됩니다.', 5, 0)
  on conflict (id) do nothing;

-- Votes (sample upvotes)
insert into votes (id, user_id, target_type, target_id, vote_type)
values
  ('0b111111-1111-4111-c111-111111111111', '11111111-1111-1111-1111-111111111111', 'post', '02222222-2222-4222-a222-222222222222', 'upvote'),
  ('0b222222-2222-4222-c222-222222222222', '22222222-2222-2222-2222-222222222222', 'post', '01111111-1111-4111-a111-111111111111', 'upvote'),
  ('0b333333-3333-4333-c333-333333333333', '33333333-3333-3333-3333-333333333333', 'comment', '0a111111-1111-4111-b111-111111111111', 'upvote'),
  ('0b444444-4444-4444-c444-444444444444', '11111111-1111-1111-1111-111111111111', 'post', '04444444-4444-4444-a444-444444444444', 'upvote')
  on conflict (user_id, target_type, target_id) do nothing;

-- Bookmarks
insert into bookmarks (id, user_id, philostory_id)
values
  ('0c111111-1111-4111-d111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-4222-8222-222222222222'),
  ('0c222222-2222-4222-d222-222222222222', '22222222-2222-2222-2222-222222222222', 'd1111111-1111-4111-8111-111111111111'),
  ('0c333333-3333-4333-d333-333333333333', '33333333-3333-3333-3333-333333333333', 'd5555555-5555-4555-8555-555555555555')
  on conflict (user_id, philostory_id) do nothing;

-- Highlights
insert into highlights (id, user_id, philostory_id, highlighted_text, position_start, position_end)
values
  ('0d111111-1111-4111-e111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-4222-8222-222222222222', '통제 가능한 것에만 힘을 써라', 0, 20),
  ('0d222222-2222-4222-e222-222222222222', '33333333-3333-3333-3333-333333333333', 'd3333333-3333-4333-8333-333333333333', '매일 스스로를 돌아보라', 0, 15),
  ('0d333333-3333-4333-e333-333333333333', '22222222-2222-2222-2222-222222222222', 'd5555555-5555-4555-8555-555555555555', '너의 삶이 무한히 반복된다면', 0, 25)
  on conflict (id) do nothing;

-- Reading history
insert into reading_history (id, user_id, philostory_id, progress)
values
  ('0e111111-1111-4111-f111-111111111111', '11111111-1111-1111-1111-111111111111', 'd2222222-2222-4222-8222-222222222222', 80),
  ('0e222222-2222-4222-f222-222222222222', '22222222-2222-2222-2222-222222222222', 'd1111111-1111-4111-8111-111111111111', 40),
  ('0e333333-3333-4333-f333-333333333333', '33333333-3333-3333-3333-333333333333', 'd5555555-5555-4555-8555-555555555555', 100)
  on conflict (user_id, philostory_id) do update
  set progress = excluded.progress,
      updated_at = now();

-- Notifications
insert into notifications (id, user_id, type, title, message, link, is_read)
values
  ('0f111111-1111-4111-0111-111111111111', '11111111-1111-1111-1111-111111111111', 'comment', '새 댓글이 달렸어요', '질문 글에 새로운 댓글이 있습니다', '/community/01111111-1111-4111-a111-111111111111', false),
  ('0f222222-2222-4222-0222-222222222222', '22222222-2222-2222-2222-222222222222', 'daily_philostory', '오늘의 Philostory', '니체의 새로운 이야기가 도착했습니다', '/philostory/d5555555-5555-4555-8555-555555555555', true)
  on conflict (id) do nothing;
