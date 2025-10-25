-- Comprehensive Beta Testing Seed Data
-- Run this after the main seed.sql and beta_testing_feature.sql migration

-- First, let's get some user IDs (assuming we have users from seed.sql)
-- We'll use the first few users as builders

-- Insert Beta Programs covering all categories with diverse scenarios
-- Program 1: AI-ML - Most Recent, High popularity
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'ai-ml' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1),
  'Early Access: AI Writing Assistant',
  'Help us test our revolutionary AI-powered writing assistant that understands context and tone. We need feedback on accuracy, speed, and user experience.',
  'https://beta.aiwriter.app',
  'open',
  '{"username": "beta_tester", "password": "TestAI2024!", "api_key": "test_key_123"}',
  'Please test the main writing features, try different tones (professional, casual, creative), and provide feedback on the AI suggestions quality.',
  ARRAY['UX', 'Functionality', 'AI Accuracy', 'Performance', 'Pricing'],
  'lifetime_deal',
  '{"description": "50% Lifetime Discount", "code": "BETA50LIFE", "value": 50, "type": "percentage"}',
  100,
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '60 days',
  'active',
  NOW() - INTERVAL '2 days'
);

-- Program 2: Productivity - Ending Soon, Popular
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'productivity' LIMIT 1 OFFSET 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 1),
  'Task Management 2.0 Beta',
  'Revolutionary task manager with AI-powered scheduling. We''re launching in 5 days and need final feedback!',
  'https://beta.taskmgr.io',
  'open',
  '{"username": "tester", "password": "Task123!", "invite_code": "BETA2024"}',
  'Focus on the AI scheduling feature, calendar integrations, and mobile experience. Test team collaboration features.',
  ARRAY['UX', 'Functionality', 'Design', 'Performance', 'Onboarding'],
  'free_trial',
  '{"description": "3 Months Free Pro Plan", "duration": 90, "plan": "pro"}',
  50,
  NOW() - INTERVAL '25 days',
  NOW() + INTERVAL '5 days',
  'active',
  NOW() - INTERVAL '25 days'
);

-- Program 3: Developer Tools - Recent, High Reward
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'developer-tools' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 2),
  'API Testing Platform Beta',
  'Modern API testing and monitoring platform built for developers. Help us perfect the developer experience!',
  'https://staging.apitest.dev',
  'open',
  '{"email": "beta@apitest.dev", "password": "DevTest2024", "org_id": "beta-org-001"}',
  'Please test API request builder, mock servers, and monitoring features. Try importing Postman collections.',
  ARRAY['UX', 'Functionality', 'Documentation', 'Performance', 'Developer Experience'],
  'cash',
  '{"description": "$100 Amazon Gift Card for Top 10 Contributors", "amount": 100, "currency": "USD"}',
  75,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '45 days',
  'active',
  NOW() - INTERVAL '3 days'
);

-- Program 4: Design - Most Popular, Creative Rewards
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'design' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1),
  'Figma Alternative: CollaboDesign',
  'Next-gen design collaboration tool. Help us compete with Figma by testing real-time collaboration features!',
  'https://beta.collabodesign.com',
  'open',
  '{"username": "beta", "password": "Design2024!", "workspace": "beta-workspace"}',
  'Test real-time collaboration, prototyping tools, and design systems. Compare with Figma and share honest feedback.',
  ARRAY['UX', 'Functionality', 'Design', 'Performance', 'Collaboration'],
  'lifetime_deal',
  '{"description": "Lifetime Pro Plan (Worth $299/year)", "value": 299, "plan": "pro"}',
  150,
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '50 days',
  'active',
  NOW() - INTERVAL '10 days'
);

-- Program 5: Marketing - Ending Soon
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'marketing' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 1),
  'Social Media Analytics Dashboard',
  'All-in-one social media analytics. Launching next week - need your feedback NOW!',
  'https://app-beta.socialytics.io',
  'open',
  '{"email": "test@socialytics.io", "password": "Social123!"}',
  'Connect your social accounts (Instagram, Twitter, LinkedIn) and test the analytics dashboard. Focus on data accuracy and insights.',
  ARRAY['UX', 'Functionality', 'Data Accuracy', 'Design', 'Pricing'],
  'discount',
  '{"description": "40% Off First Year", "percentage": 40, "duration": 365}',
  60,
  NOW() - INTERVAL '23 days',
  NOW() + INTERVAL '7 days',
  'active',
  NOW() - INTERVAL '23 days'
);

-- Program 6: SaaS - Multiple Reward Types
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'saas' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 2),
  'Customer Support Platform Beta',
  'Modern customer support with AI-powered ticket routing. Help us build the best support platform!',
  'https://beta.supportly.app',
  'restricted',
  '{"username": "beta_support", "password": "Support2024!!", "company_code": "BETA"}',
  'Create test tickets, try AI routing, test knowledge base, and live chat features. Invite your team!',
  ARRAY['UX', 'Functionality', 'AI Accuracy', 'Performance', 'Onboarding', 'Integrations'],
  'gift_card',
  '{"description": "$50 Gift Card (Amazon/Starbucks)", "amount": 50, "options": ["Amazon", "Starbucks"]}',
  80,
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '45 days',
  'active',
  NOW() - INTERVAL '15 days'
);

-- Program 7: Mobile - Early Access Focus
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'mobile' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1),
  'Fitness Tracking App Beta',
  'AI-powered fitness app with personalized workout plans. Available on iOS and Android!',
  'https://testflight.apple.com/fitness-beta',
  'open',
  '{"testflight_code": "FIT2024BETA", "android_code": "BETA-FITNESS-001"}',
  'Download via TestFlight (iOS) or Play Store Beta (Android). Test workout tracking, meal planning, and social features.',
  ARRAY['UX', 'Functionality', 'Design', 'Performance', 'Onboarding', 'Mobile Experience'],
  'early_access',
  '{"description": "Free Premium for 1 Year + Early Access to New Features", "duration": 365}',
  200,
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '90 days',
  'active',
  NOW() - INTERVAL '5 days'
);

-- Program 8: Web3 - Specialized Testing
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'web3' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 1),
  'NFT Marketplace Beta',
  'Creator-first NFT marketplace with zero gas fees. Help us revolutionize NFT trading!',
  'https://beta.nftcreator.market',
  'invite_only',
  '{"wallet_required": true, "invite_code": "CREATOR2024", "network": "Polygon Testnet"}',
  'Connect your wallet (MetaMask recommended), create test NFTs, try buying/selling. Use testnet only!',
  ARRAY['UX', 'Functionality', 'Design', 'Performance', 'Security', 'Web3 Experience'],
  'lifetime_deal',
  '{"description": "Zero Commission for Lifetime (Worth $5000+)", "value": 5000}',
  100,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '60 days',
  'active',
  NOW() - INTERVAL '7 days'
);

-- Program 9: Health - Medical/Wellness Focus
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'health' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 2),
  'Mental Wellness App Beta',
  'AI-powered mental health companion. Help us make mental wellness accessible to everyone.',
  'https://beta.mindful.health',
  'open',
  '{"username": "beta_user", "password": "Mindful2024!", "therapist_code": "BETA-THERAPIST"}',
  'Try mood tracking, AI chat companion, guided meditations, and journal features. Provide feedback on sensitivity and usefulness.',
  ARRAY['UX', 'Functionality', 'Design', 'Onboarding', 'Privacy', 'Effectiveness'],
  'free_trial',
  '{"description": "6 Months Free Premium + Exclusive Wellness Content", "duration": 180, "extras": "premium_content"}',
  120,
  NOW() - INTERVAL '12 days',
  NOW() + INTERVAL '48 days',
  'active',
  NOW() - INTERVAL '12 days'
);

-- Program 10: Education - EdTech Beta
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'education' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1),
  'Interactive Learning Platform',
  'Gamified learning platform for coding and tech skills. Make learning fun and effective!',
  'https://beta.codemaster.edu',
  'open',
  '{"email": "beta@codemaster.edu", "password": "Learn2024!", "course_code": "BETA-ACCESS"}',
  'Take test courses in Python, JavaScript, and Web Development. Try interactive coding challenges and projects.',
  ARRAY['UX', 'Functionality', 'Content Quality', 'Design', 'Onboarding', 'Learning Experience'],
  'lifetime_deal',
  '{"description": "Lifetime Access to All Courses (Worth $999)", "value": 999, "includes": "all_courses"}',
  180,
  NOW() - INTERVAL '8 days',
  NOW() + INTERVAL '52 days',
  'active',
  NOW() - INTERVAL '8 days'
);

-- Program 11: Finance - FinTech Beta
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'finance' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 1),
  'Investment Portfolio Tracker',
  'Track stocks, crypto, and real estate in one place. Help us build the ultimate portfolio manager!',
  'https://app-beta.wealthtrack.io',
  'open',
  '{"username": "beta_investor", "password": "Invest2024!", "portfolio_id": "BETA-PORTFOLIO"}',
  'Add test investments, connect demo broker accounts, try the AI insights feature. Use sandbox data only!',
  ARRAY['UX', 'Functionality', 'Data Accuracy', 'Performance', 'Pricing', 'Security'],
  'cash',
  '{"description": "$75 for Completing Full Testing + Detailed Feedback", "amount": 75, "currency": "USD"}',
  90,
  NOW() - INTERVAL '6 days',
  NOW() + INTERVAL '44 days',
  'active',
  NOW() - INTERVAL '6 days'
);

-- Program 12: Social - Social Network Beta, Ending Very Soon!
INSERT INTO beta_programs (
  product_id, builder_id, title, description, test_url,
  access_type, test_credentials, test_instructions,
  feedback_categories, reward_type, reward_value,
  max_testers, start_date, end_date, status, created_at
) VALUES (
  (SELECT id FROM products WHERE category = 'social' LIMIT 1),
  (SELECT id FROM users WHERE role = 'builder' LIMIT 1 OFFSET 2),
  'Privacy-First Social Network',
  'Social network where you own your data. Launching in 3 days - final testing phase!',
  'https://beta.privatesocial.app',
  'open',
  '{"email": "beta@privatesocial.app", "password": "Privacy2024!"}',
  'Create profile, connect with friends, try private messaging, groups, and data export features.',
  ARRAY['UX', 'Functionality', 'Design', 'Privacy', 'Performance', 'Onboarding'],
  'early_access',
  '{"description": "Founding Member Status + Free Premium Forever", "status": "founding_member"}',
  250,
  NOW() - INTERVAL '27 days',
  NOW() + INTERVAL '3 days',
  'active',
  NOW() - INTERVAL '27 days'
);

-- Now let's add some beta testers with different statuses
-- We'll add testers to the most popular programs

-- Add testers to Program 1 (AI Writing Assistant)
INSERT INTO beta_testers (user_id, beta_program_id, product_id, skillset, device_type, experience_level, status, points_earned, progress, applied_at, approved_at)
SELECT 
  u.id,
  bp.id,
  bp.product_id,
  ARRAY['UX/UI Design', 'Technical/Developer'],
  'Desktop (Mac)',
  'intermediate',
  'approved',
  (RANDOM() * 200)::INTEGER,
  (RANDOM() * 100)::INTEGER,
  NOW() - (RANDOM() * INTERVAL '48 hours'),
  NOW() - (RANDOM() * INTERVAL '24 hours')
FROM users u
CROSS JOIN beta_programs bp
WHERE bp.title = 'Early Access: AI Writing Assistant'
  AND u.role != 'builder'
LIMIT 45;

-- Add testers to Program 2 (Task Management - ending soon)
INSERT INTO beta_testers (user_id, beta_program_id, product_id, skillset, device_type, experience_level, status, points_earned, progress, applied_at, approved_at)
SELECT 
  u.id,
  bp.id,
  bp.product_id,
  ARRAY['Product Management', 'QA Testing'],
  CASE (RANDOM() * 3)::INTEGER
    WHEN 0 THEN 'Desktop (Windows)'
    WHEN 1 THEN 'Desktop (Mac)'
    ELSE 'Mobile (iOS)'
  END,
  CASE (RANDOM() * 3)::INTEGER
    WHEN 0 THEN 'beginner'
    WHEN 1 THEN 'intermediate'
    ELSE 'expert'
  END,
  'approved',
  (RANDOM() * 300)::INTEGER,
  (RANDOM() * 100)::INTEGER,
  NOW() - (RANDOM() * INTERVAL '600 hours'),
  NOW() - (RANDOM() * INTERVAL '500 hours')
FROM users u
CROSS JOIN beta_programs bp
WHERE bp.title = 'Task Management 2.0 Beta'
  AND u.role != 'builder'
LIMIT 38;

-- Add feedback for some testers
INSERT INTO beta_feedback (beta_tester_id, beta_program_id, user_id, product_id, category, rating, title, content, is_critical, created_at)
SELECT 
  bt.id,
  bt.beta_program_id,
  bt.user_id,
  bt.product_id,
  (ARRAY['UX', 'Functionality', 'Design', 'Performance'])[(RANDOM() * 3)::INTEGER + 1],
  (RANDOM() * 2 + 3)::INTEGER, -- Random rating between 3-5
  CASE (RANDOM() * 5)::INTEGER
    WHEN 0 THEN 'Great feature but needs improvement'
    WHEN 1 THEN 'Love the interface!'
    WHEN 2 THEN 'Performance issue on mobile'
    WHEN 3 THEN 'Suggestion for better UX'
    ELSE 'Overall excellent experience'
  END,
  CASE (RANDOM() * 5)::INTEGER
    WHEN 0 THEN 'The main feature works great, but I noticed some lag when loading large datasets. Consider implementing pagination or lazy loading.'
    WHEN 1 THEN 'Really impressed with the design and user experience. Very intuitive and easy to use. Keep up the good work!'
    WHEN 2 THEN 'On mobile devices, the app tends to slow down after 30 minutes of use. Memory optimization might help.'
    WHEN 3 THEN 'Would be great to have keyboard shortcuts for power users. Also, dark mode would be amazing!'
    ELSE 'This is exactly what I needed! The features are well thought out and the execution is top-notch. Minor bugs here and there but nothing major.'
  END,
  RANDOM() < 0.15, -- 15% chance of critical
  NOW() - (RANDOM() * INTERVAL '48 hours')
FROM beta_testers bt
WHERE (RANDOM() < 0.6) -- 60% of testers leave feedback
LIMIT 150;

-- Add points for testers
INSERT INTO tester_points (user_id, beta_program_id, action_type, points, description, created_at)
SELECT 
  bt.user_id,
  bt.beta_program_id,
  'joined_beta',
  10,
  'Joined beta test',
  bt.applied_at
FROM beta_testers bt;

-- Add more points for feedback submission
INSERT INTO tester_points (user_id, beta_program_id, action_type, points, description, created_at)
SELECT 
  bf.user_id,
  bf.beta_program_id,
  CASE WHEN bf.is_critical THEN 'critical_bug' ELSE 'submitted_feedback' END,
  CASE WHEN bf.is_critical THEN 50 ELSE 20 END,
  'Submitted feedback for ' || bf.category,
  bf.created_at
FROM beta_feedback bf;

-- Add feature requests
INSERT INTO feature_requests (beta_program_id, product_id, created_by, title, description, category, priority, status, upvotes, downvotes, created_at)
SELECT 
  bp.id,
  bp.product_id,
  bt.user_id,
  CASE (RANDOM() * 10)::INTEGER
    WHEN 0 THEN 'Add Dark Mode'
    WHEN 1 THEN 'Keyboard Shortcuts'
    WHEN 2 THEN 'Export to CSV'
    WHEN 3 THEN 'Mobile App'
    WHEN 4 THEN 'API Integration'
    WHEN 5 THEN 'Team Collaboration'
    WHEN 6 THEN 'Advanced Search'
    WHEN 7 THEN 'Automation Rules'
    WHEN 8 THEN 'Custom Themes'
    ELSE 'Bulk Operations'
  END,
  CASE (RANDOM() * 10)::INTEGER
    WHEN 0 THEN 'Please add a dark mode option for better usability in low-light environments.'
    WHEN 1 THEN 'Would love to see keyboard shortcuts for common actions to speed up workflow.'
    WHEN 2 THEN 'Need ability to export data to CSV format for reporting and analysis.'
    WHEN 3 THEN 'A dedicated mobile app would be amazing for on-the-go access.'
    WHEN 4 THEN 'Integration with popular APIs (Zapier, Make) would be super helpful.'
    WHEN 5 THEN 'Team features like shared workspaces and real-time collaboration needed.'
    WHEN 6 THEN 'Advanced search with filters and saved searches would be great.'
    WHEN 7 THEN 'Automation rules to trigger actions based on conditions.'
    WHEN 8 THEN 'Allow users to customize colors and themes to match their brand.'
    ELSE 'Bulk operations for editing multiple items at once would save time.'
  END,
  (ARRAY['Feature', 'Improvement', 'Bug Fix'])[(RANDOM() * 2)::INTEGER + 1],
  (ARRAY['low', 'medium', 'high'])[(RANDOM() * 2)::INTEGER + 1],
  (ARRAY['proposed', 'planned', 'in_progress'])[(RANDOM() * 2)::INTEGER + 1],
  (RANDOM() * 50)::INTEGER,
  (RANDOM() * 5)::INTEGER,
  NOW() - (RANDOM() * INTERVAL '72 hours')
FROM beta_programs bp
CROSS JOIN LATERAL (
  SELECT user_id FROM beta_testers WHERE beta_program_id = bp.id ORDER BY RANDOM() LIMIT 1
) bt
LIMIT 80;

-- Refresh the materialized view for leaderboard
REFRESH MATERIALIZED VIEW tester_leaderboard;

-- Show summary
SELECT 
  'Beta Programs Created' as metric,
  COUNT(*)::TEXT as value
FROM beta_programs
UNION ALL
SELECT 
  'Beta Testers Enrolled',
  COUNT(*)::TEXT
FROM beta_testers
UNION ALL
SELECT 
  'Feedback Submissions',
  COUNT(*)::TEXT
FROM beta_feedback
UNION ALL
SELECT 
  'Feature Requests',
  COUNT(*)::TEXT
FROM feature_requests
UNION ALL
SELECT 
  'Total Points Distributed',
  SUM(points)::TEXT
FROM tester_points;

