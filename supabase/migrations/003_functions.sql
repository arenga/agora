-- 데이터베이스 함수 및 트리거
-- Supabase SQL Editor에서 실행하세요

-- 1. 회원가입 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'user_' || LEFT(NEW.id::text, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 새 사용자 생성 시 프로필 자동 생성 트리거
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. 투표 처리 함수
CREATE OR REPLACE FUNCTION handle_vote(
  p_user_id UUID,
  p_target_type VARCHAR(20),
  p_target_id UUID,
  p_vote_type INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_existing_vote INTEGER;
  v_result JSONB;
BEGIN
  -- 기존 투표 확인
  SELECT vote_type INTO v_existing_vote
  FROM votes
  WHERE user_id = p_user_id
    AND target_type = p_target_type
    AND target_id = p_target_id;

  IF v_existing_vote IS NULL THEN
    -- 새 투표
    INSERT INTO votes (user_id, target_type, target_id, vote_type)
    VALUES (p_user_id, p_target_type, p_target_id, p_vote_type);

    -- 대상 테이블 업데이트
    IF p_target_type = 'post' THEN
      IF p_vote_type = 1 THEN
        UPDATE posts SET upvotes = upvotes + 1 WHERE id = p_target_id;
      ELSE
        UPDATE posts SET downvotes = downvotes + 1 WHERE id = p_target_id;
      END IF;
    ELSIF p_target_type = 'comment' THEN
      IF p_vote_type = 1 THEN
        UPDATE comments SET upvotes = upvotes + 1 WHERE id = p_target_id;
      ELSE
        UPDATE comments SET downvotes = downvotes + 1 WHERE id = p_target_id;
      END IF;
    END IF;

    v_result := jsonb_build_object('action', 'voted', 'vote_type', p_vote_type);

  ELSIF v_existing_vote = p_vote_type THEN
    -- 같은 투표 취소
    DELETE FROM votes
    WHERE user_id = p_user_id
      AND target_type = p_target_type
      AND target_id = p_target_id;

    IF p_target_type = 'post' THEN
      IF p_vote_type = 1 THEN
        UPDATE posts SET upvotes = upvotes - 1 WHERE id = p_target_id;
      ELSE
        UPDATE posts SET downvotes = downvotes - 1 WHERE id = p_target_id;
      END IF;
    ELSIF p_target_type = 'comment' THEN
      IF p_vote_type = 1 THEN
        UPDATE comments SET upvotes = upvotes - 1 WHERE id = p_target_id;
      ELSE
        UPDATE comments SET downvotes = downvotes - 1 WHERE id = p_target_id;
      END IF;
    END IF;

    v_result := jsonb_build_object('action', 'unvoted');

  ELSE
    -- 투표 변경
    UPDATE votes
    SET vote_type = p_vote_type
    WHERE user_id = p_user_id
      AND target_type = p_target_type
      AND target_id = p_target_id;

    IF p_target_type = 'post' THEN
      IF p_vote_type = 1 THEN
        UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = p_target_id;
      ELSE
        UPDATE posts SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = p_target_id;
      END IF;
    ELSIF p_target_type = 'comment' THEN
      IF p_vote_type = 1 THEN
        UPDATE comments SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = p_target_id;
      ELSE
        UPDATE comments SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = p_target_id;
      END IF;
    END IF;

    v_result := jsonb_build_object('action', 'changed', 'vote_type', p_vote_type);
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 댓글 수 자동 업데이트
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    UPDATE profiles SET total_comments = total_comments + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    UPDATE profiles SET total_comments = total_comments - 1 WHERE id = OLD.author_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- 4. 게시글 수 자동 업데이트
CREATE OR REPLACE FUNCTION update_profile_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET total_posts = total_posts + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET total_posts = total_posts - 1 WHERE id = OLD.author_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_post_change
  AFTER INSERT OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_profile_post_count();

-- 5. 하이라이트 수 자동 업데이트
CREATE OR REPLACE FUNCTION update_highlight_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET total_highlights = total_highlights + 1 WHERE id = NEW.user_id;
    UPDATE philostories SET highlight_count = highlight_count + 1 WHERE id = NEW.philostory_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET total_highlights = total_highlights - 1 WHERE id = OLD.user_id;
    UPDATE philostories SET highlight_count = highlight_count - 1 WHERE id = OLD.philostory_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_highlight_change
  AFTER INSERT OR DELETE ON highlights
  FOR EACH ROW EXECUTE FUNCTION update_highlight_counts();

-- 6. 오늘의 Philostory 가져오기
CREATE OR REPLACE FUNCTION get_today_philostory()
RETURNS SETOF philostories AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM philostories
  WHERE published_date <= CURRENT_DATE
  ORDER BY published_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
