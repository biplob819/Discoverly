-- Beta Testing Feature Enhancements
-- Additional fields and adjustments for the comprehensive beta testing system

-- First, ensure we have the comprehensive beta programs table (if not already created)
-- Check if beta_programs table exists and create/modify as needed

-- Add missing fields to beta_programs for our enhanced modal
DO $$ BEGIN
    -- Add requirements field if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_programs' AND column_name='requirements') THEN
        ALTER TABLE beta_programs ADD COLUMN requirements JSONB DEFAULT '{}';
    END IF;
    
    -- Add evaluation_criteria field if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_programs' AND column_name='evaluation_criteria') THEN
        ALTER TABLE beta_programs ADD COLUMN evaluation_criteria JSONB DEFAULT '{}';
    END IF;
    
    -- Add target_audience field if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_programs' AND column_name='target_audience') THEN
        ALTER TABLE beta_programs ADD COLUMN target_audience TEXT;
    END IF;
    
    -- Add experience_level field if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_programs' AND column_name='experience_level') THEN
        ALTER TABLE beta_programs ADD COLUMN experience_level VARCHAR(20) DEFAULT 'all' CHECK (experience_level IN ('all', 'beginner', 'intermediate', 'expert'));
    END IF;
    
    -- Update beta_programs status constraint to include 'scheduled'
    BEGIN
        ALTER TABLE beta_programs DROP CONSTRAINT IF EXISTS beta_programs_status_check;
        ALTER TABLE beta_programs ADD CONSTRAINT beta_programs_status_check CHECK (status IN ('draft', 'active', 'paused', 'completed', 'scheduled'));
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    -- Update access_type constraint to include 'approval'
    BEGIN
        ALTER TABLE beta_programs DROP CONSTRAINT IF EXISTS beta_programs_access_type_check;
        ALTER TABLE beta_programs ADD CONSTRAINT beta_programs_access_type_check CHECK (access_type IN ('open', 'restricted', 'invite_only', 'approval'));
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
END $$;

-- Ensure REWARD_TYPES constants table exists for consistency
CREATE TABLE IF NOT EXISTS reward_types (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT
);

-- Insert reward types if they don't exist
INSERT INTO reward_types (id, name, icon, description) VALUES
    ('discount', 'Discount', '💰', 'Percentage discount on the product'),
    ('cash', 'Cash Prize', '💵', 'Cash reward for quality feedback'),
    ('gift_voucher', 'Gift Voucher', '🎁', 'Gift voucher for completing testing'),
    ('lifetime_deal', 'Lifetime Deal', '🚀', 'Lifetime access to the product'),
    ('credits', 'Credits', '⚡', 'Platform credits for early testers'),
    ('free_trial', 'Free Trial', '📅', 'Extended free trial period'),
    ('early_access', 'Early Access', '🎯', 'Early access to new features'),
    ('none', 'No Reward', '🆓', 'No monetary reward, community contribution')
ON CONFLICT (id) DO NOTHING;

-- Ensure POINTS_REWARDS constants for point system
CREATE TABLE IF NOT EXISTS points_rewards (
    action_type VARCHAR(50) PRIMARY KEY,
    points INTEGER NOT NULL,
    description TEXT
);

-- Insert points rewards if they don't exist
INSERT INTO points_rewards (action_type, points, description) VALUES
    ('joined_beta', 10, 'Points for joining a beta program'),
    ('submitted_feedback', 25, 'Points for submitting feedback'),
    ('critical_bug', 100, 'Bonus points for finding critical bugs'),
    ('feature_vote', 5, 'Points for voting on feature requests'),
    ('completed_beta', 50, 'Points for completing beta testing'),
    ('verified_feedback', 15, 'Additional points for verified quality feedback')
ON CONFLICT (action_type) DO NOTHING;

-- Create function to refresh leaderboard (if materialized view exists)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'tester_leaderboard') THEN
        -- Create function to refresh leaderboard periodically
        CREATE OR REPLACE FUNCTION refresh_leaderboard()
        RETURNS void AS $refresh$
        BEGIN
            REFRESH MATERIALIZED VIEW CONCURRENTLY tester_leaderboard;
        END;
        $refresh$ LANGUAGE plpgsql;
        
        -- Refresh the materialized view
        REFRESH MATERIALIZED VIEW tester_leaderboard;
    END IF;
END $$;

-- Ensure beta_testers has all required fields for our application
DO $$ BEGIN
    -- Add created_at to beta_testers as 'applied_at' if not exists (for consistency with migration)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_testers' AND column_name='applied_at') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_testers' AND column_name='created_at') THEN
            ALTER TABLE beta_testers RENAME COLUMN created_at TO applied_at;
        ELSE
            ALTER TABLE beta_testers ADD COLUMN applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_beta_programs_experience_level ON beta_programs(experience_level);
CREATE INDEX IF NOT EXISTS idx_beta_programs_target_audience ON beta_programs USING gin(to_tsvector('english', target_audience));

-- Update any existing beta_testers records to have proper status
UPDATE beta_testers 
SET status = 'approved' 
WHERE status = 'accepted'; -- Normalize status values

-- Create a simple view for active beta programs (useful for APIs)
CREATE OR REPLACE VIEW active_beta_programs AS
SELECT 
    bp.*,
    p.name as product_name,
    p.tagline as product_tagline,
    p.logo_url as product_logo,
    p.category as product_category,
    u.username as builder_username,
    u.display_name as builder_name,
    u.avatar_url as builder_avatar,
    COUNT(DISTINCT bt.id) FILTER (WHERE bt.status = 'approved') as tester_count,
    COUNT(DISTINCT bf.id) as feedback_count,
    AVG(bf.rating) as avg_rating
FROM beta_programs bp
JOIN products p ON bp.product_id = p.id
JOIN users u ON bp.builder_id = u.id
LEFT JOIN beta_testers bt ON bp.id = bt.beta_program_id
LEFT JOIN beta_feedback bf ON bp.id = bf.beta_program_id
WHERE bp.status = 'active'
GROUP BY bp.id, p.id, u.id;

-- Grant necessary permissions (if using different database users)
-- GRANT SELECT ON active_beta_programs TO application_user;
-- GRANT SELECT ON reward_types TO application_user;
-- GRANT SELECT ON points_rewards TO application_user;
