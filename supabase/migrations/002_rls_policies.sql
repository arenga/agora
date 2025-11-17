-- RLS (Row Level Security) 정책
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE philosophers ENABLE ROW LEVEL SECURITY;
ALTER TABLE philostories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles 정책
CREATE POLICY "프로필은 누구나 조회 가능" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "본인 프로필만 수정 가능" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "회원가입 시 프로필 생성" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Philosophers 정책 (공개 읽기)
CREATE POLICY "철학자 정보는 누구나 조회 가능" ON philosophers
  FOR SELECT USING (true);

-- Philostories 정책 (공개 읽기)
CREATE POLICY "철학 이야기는 누구나 조회 가능" ON philostories
  FOR SELECT USING (true);

-- Posts 정책
CREATE POLICY "게시글은 누구나 조회 가능" ON posts
  FOR SELECT USING (true);

CREATE POLICY "로그인한 사용자만 게시글 작성 가능" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "본인 게시글만 수정 가능" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "본인 게시글만 삭제 가능" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Comments 정책
CREATE POLICY "댓글은 누구나 조회 가능" ON comments
  FOR SELECT USING (true);

CREATE POLICY "로그인한 사용자만 댓글 작성 가능" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "본인 댓글만 수정 가능" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "본인 댓글만 삭제 가능" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- Votes 정책
CREATE POLICY "투표 현황은 누구나 조회 가능" ON votes
  FOR SELECT USING (true);

CREATE POLICY "로그인한 사용자만 투표 가능" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 투표만 변경 가능" ON votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 투표만 삭제 가능" ON votes
  FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks 정책 (개인 데이터)
CREATE POLICY "본인 북마크만 조회 가능" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "로그인한 사용자만 북마크 추가 가능" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 북마크만 삭제 가능" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Highlights 정책 (개인 데이터)
CREATE POLICY "본인 하이라이트만 조회 가능" ON highlights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "로그인한 사용자만 하이라이트 추가 가능" ON highlights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 하이라이트만 수정 가능" ON highlights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 하이라이트만 삭제 가능" ON highlights
  FOR DELETE USING (auth.uid() = user_id);

-- Reading History 정책 (개인 데이터)
CREATE POLICY "본인 독서 기록만 조회 가능" ON reading_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "로그인한 사용자만 독서 기록 추가 가능" ON reading_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 독서 기록만 수정 가능" ON reading_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Notifications 정책 (개인 데이터)
CREATE POLICY "본인 알림만 조회 가능" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 알림만 수정 가능" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Reports 정책
CREATE POLICY "로그인한 사용자만 신고 가능" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "본인 신고 내역만 조회 가능" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);
