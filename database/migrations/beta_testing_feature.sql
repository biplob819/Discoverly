-- Beta Testing Feature Migration
-- Comprehensive schema for beta testing, feedback, rewards, and gamification

-- Beta Programs (product listings for beta testing)
CREATE TABLE beta_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  builder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  
  -- Access & Credentials
  test_url TEXT NOT NULL,
  access_type VARCHAR(20) DEFAULT 'open' CHECK (access_type IN ('open', 'restricted', 'invite_only')),
  test_credentials JSONB, -- {username, password, api_key, etc.}
  test_instructions TEXT,
  
  -- Feedback Categories
  feedback_categories TEXT[] DEFAULT ARRAY['UX', 'Functionality', 'Design', 'Performance', 'Pricing', 'Onboarding'], -- customizable
  
  -- Reward Structure
  reward_type VARCHAR(30) CHECK (reward_type IN ('discount', 'free_trial', 'lifetime_deal', 'gift_card', 'cash', 'early_access', 'none')),
  reward_value JSONB, -- {amount, currency, percentage, description}
  max_testers INTEGER, -- NULL = unlimited
  
  -- Dates
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id) -- one beta program per product
);

-- Enhanced Beta Testers (user participation in beta programs)
DROP TABLE IF EXISTS beta_testers CASCADE;
CREATE TABLE beta_testers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  beta_program_id UUID NOT NULL REFERENCES beta_programs(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE, -- denormalized for easier queries
  
  -- Tester Profile
  skillset TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['UX', 'QA', 'Tech', 'Marketing']
  device_type VARCHAR(50), -- 'Desktop', 'Mobile', 'Tablet', 'All'
  experience_level VARCHAR(20) DEFAULT 'intermediate' CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  
  -- Status & Progress
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'rejected')),
  progress INTEGER DEFAULT 0, -- 0-100%
  hours_spent DECIMAL(5,2) DEFAULT 0,
  
  -- Points & Rewards
  points_earned INTEGER DEFAULT 0,
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_claimed_at TIMESTAMP WITH TIME ZONE,
  
  -- Dates
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, beta_program_id)
);

-- Feedback Submissions (categorized feedback from testers)
CREATE TABLE beta_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beta_tester_id UUID NOT NULL REFERENCES beta_testers(id) ON DELETE CASCADE,
  beta_program_id UUID NOT NULL REFERENCES beta_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Feedback Details
  category VARCHAR(50) NOT NULL, -- from beta_programs.feedback_categories
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  
  -- Additional Info
  screenshots TEXT[], -- array of image URLs
  is_critical BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  
  -- Builder Response
  builder_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature Voting Board (community-driven feature decisions)
CREATE TABLE feature_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beta_program_id UUID NOT NULL REFERENCES beta_programs(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50), -- 'Feature', 'Bug Fix', 'Improvement', 'Design Change'
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'proposed' CHECK (status IN ('proposed', 'planned', 'in_progress', 'shipped', 'declined')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Voting
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  
  -- Builder notes
  builder_notes TEXT,
  estimated_date TIMESTAMP WITH TIME ZONE,
  shipped_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature Votes (track who voted for what)
CREATE TABLE feature_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_request_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(feature_request_id, user_id)
);

-- Rewards Distribution (track reward claims and distribution)
CREATE TABLE beta_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beta_tester_id UUID NOT NULL REFERENCES beta_testers(id) ON DELETE CASCADE,
  beta_program_id UUID NOT NULL REFERENCES beta_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  reward_type VARCHAR(30) NOT NULL,
  reward_details JSONB NOT NULL, -- {code, amount, expiry, instructions}
  
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired', 'revoked')),
  
  claimed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tester Points Ledger (track points for gamification)
CREATE TABLE tester_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  beta_program_id UUID REFERENCES beta_programs(id) ON DELETE CASCADE,
  
  action_type VARCHAR(50) NOT NULL, -- 'joined_beta', 'submitted_feedback', 'critical_bug', 'feature_vote', 'completed_beta'
  points INTEGER NOT NULL,
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard View (materialized for performance)
CREATE MATERIALIZED VIEW tester_leaderboard AS
SELECT 
  u.id as user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  COALESCE(SUM(tp.points), 0) as total_points,
  COUNT(DISTINCT bt.beta_program_id) as beta_tests_joined,
  COUNT(DISTINCT bf.id) as feedback_submissions,
  COUNT(DISTINCT CASE WHEN bt.status = 'completed' THEN bt.id END) as completed_tests
FROM users u
LEFT JOIN tester_points tp ON u.id = tp.user_id
LEFT JOIN beta_testers bt ON u.id = bt.user_id
LEFT JOIN beta_feedback bf ON u.id = bf.user_id
GROUP BY u.id, u.username, u.display_name, u.avatar_url
ORDER BY total_points DESC, completed_tests DESC;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_tester_leaderboard_user_id ON tester_leaderboard(user_id);

-- Indexes for performance
CREATE INDEX idx_beta_programs_product_id ON beta_programs(product_id);
CREATE INDEX idx_beta_programs_builder_id ON beta_programs(builder_id);
CREATE INDEX idx_beta_programs_status ON beta_programs(status);
CREATE INDEX idx_beta_programs_created_at ON beta_programs(created_at DESC);

CREATE INDEX idx_beta_testers_user_id ON beta_testers(user_id);
CREATE INDEX idx_beta_testers_beta_program_id ON beta_testers(beta_program_id);
CREATE INDEX idx_beta_testers_product_id ON beta_testers(product_id);
CREATE INDEX idx_beta_testers_status ON beta_testers(status);

CREATE INDEX idx_beta_feedback_beta_tester_id ON beta_feedback(beta_tester_id);
CREATE INDEX idx_beta_feedback_beta_program_id ON beta_feedback(beta_program_id);
CREATE INDEX idx_beta_feedback_user_id ON beta_feedback(user_id);
CREATE INDEX idx_beta_feedback_product_id ON beta_feedback(product_id);
CREATE INDEX idx_beta_feedback_category ON beta_feedback(category);
CREATE INDEX idx_beta_feedback_rating ON beta_feedback(rating);

CREATE INDEX idx_feature_requests_beta_program_id ON feature_requests(beta_program_id);
CREATE INDEX idx_feature_requests_product_id ON feature_requests(product_id);
CREATE INDEX idx_feature_requests_created_by ON feature_requests(created_by);
CREATE INDEX idx_feature_requests_status ON feature_requests(status);

CREATE INDEX idx_feature_votes_feature_request_id ON feature_votes(feature_request_id);
CREATE INDEX idx_feature_votes_user_id ON feature_votes(user_id);

CREATE INDEX idx_beta_rewards_beta_tester_id ON beta_rewards(beta_tester_id);
CREATE INDEX idx_beta_rewards_user_id ON beta_rewards(user_id);
CREATE INDEX idx_beta_rewards_status ON beta_rewards(status);

CREATE INDEX idx_tester_points_user_id ON tester_points(user_id);
CREATE INDEX idx_tester_points_beta_program_id ON tester_points(beta_program_id);
CREATE INDEX idx_tester_points_created_at ON tester_points(created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_beta_programs_updated_at BEFORE UPDATE ON beta_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beta_feedback_updated_at BEFORE UPDATE ON beta_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at BEFORE UPDATE ON feature_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update total points when new points are added
CREATE OR REPLACE FUNCTION update_beta_tester_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE beta_testers
  SET points_earned = points_earned + NEW.points
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_beta_tester_points
AFTER INSERT ON tester_points
FOR EACH ROW EXECUTE FUNCTION update_beta_tester_points();

-- Trigger to update feature request vote counts
CREATE OR REPLACE FUNCTION update_feature_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE feature_requests SET upvotes = upvotes + 1 WHERE id = NEW.feature_request_id;
    ELSE
      UPDATE feature_requests SET downvotes = downvotes + 1 WHERE id = NEW.feature_request_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE feature_requests SET upvotes = upvotes - 1 WHERE id = OLD.feature_request_id;
    ELSE
      UPDATE feature_requests SET downvotes = downvotes - 1 WHERE id = OLD.feature_request_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.vote_type != OLD.vote_type THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE feature_requests SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.feature_request_id;
    ELSE
      UPDATE feature_requests SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.feature_request_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_feature_vote_counts
AFTER INSERT OR UPDATE OR DELETE ON feature_votes
FOR EACH ROW EXECUTE FUNCTION update_feature_vote_counts();

