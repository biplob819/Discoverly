-- Comprehensive Seed Data for Discoverly
-- This creates demo users (builders, early adopters, normal users) and products

-- Clear existing data (for development only)
TRUNCATE TABLE product_clicks, product_views, beta_testers, newsletter_subscriptions, 
  bookmarks, comments, product_media, products, follows, users CASCADE;

-- Demo Users (30 total: 15 builders, 10 early adopters, 5 normal users)

-- Builders (makers)
INSERT INTO users (stack_user_id, email, username, display_name, avatar_url, bio, website_url, twitter_handle, role, interests) VALUES
('stack_builder_1', 'sarah.chen@example.com', 'sarahchen', 'Sarah Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 'Building AI-powered productivity tools. Ex-Google PM.', 'https://sarahchen.dev', 'sarahchen', 'builder', ARRAY['ai', 'productivity', 'saas']),
('stack_builder_2', 'alex.kumar@example.com', 'alexkumar', 'Alex Kumar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'Full-stack developer passionate about dev tools.', 'https://alexkumar.io', 'alexkumar', 'builder', ARRAY['development', 'opensource', 'api']),
('stack_builder_3', 'emma.wilson@example.com', 'emmawilson', 'Emma Wilson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', 'Design systems enthusiast. Creating beautiful UIs.', 'https://emmawilson.design', 'emmawilson', 'builder', ARRAY['design', 'figma', 'web']),
('stack_builder_4', 'james.rodriguez@example.com', 'jamesrod', 'James Rodriguez', 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', 'Marketing automation expert. Growth hacker.', 'https://jamesrod.com', 'jamesrod', 'builder', ARRAY['marketing', 'analytics', 'automation']),
('stack_builder_5', 'lisa.park@example.com', 'lisapark', 'Lisa Park', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', 'AI/ML researcher turned entrepreneur.', 'https://lisapark.ai', 'lisapark', 'builder', ARRAY['ai', 'ml', 'analytics']),
('stack_builder_6', 'michael.brown@example.com', 'mikebrown', 'Michael Brown', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', 'Building the future of mobile apps.', 'https://mikebrown.app', 'mikebrown', 'builder', ARRAY['mobile', 'development', 'ios']),
('stack_builder_7', 'sophia.lee@example.com', 'sophialee', 'Sophia Lee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia', 'Web3 builder. Blockchain enthusiast.', 'https://sophialee.crypto', 'sophialee', 'builder', ARRAY['web3', 'blockchain', 'crypto']),
('stack_builder_8', 'david.martinez@example.com', 'davidmartinez', 'David Martinez', 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', 'Health tech innovator. Former doctor.', 'https://davidmartinez.health', 'davidmartinez', 'builder', ARRAY['health', 'fitness', 'mobile']),
('stack_builder_9', 'olivia.taylor@example.com', 'oliviataylor', 'Olivia Taylor', 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia', 'EdTech founder. Making learning accessible.', 'https://oliviataylor.edu', 'oliviataylor', 'builder', ARRAY['education', 'saas', 'mobile']),
('stack_builder_10', 'ryan.anderson@example.com', 'ryananderson', 'Ryan Anderson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan', 'FinTech builder. Disrupting traditional finance.', 'https://ryananderson.finance', 'ryananderson', 'builder', ARRAY['finance', 'api', 'security']),
('stack_builder_11', 'ava.thomas@example.com', 'avathomas', 'Ava Thomas', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ava', 'Social media innovator. Community builder.', 'https://avathomas.social', 'avathomas', 'builder', ARRAY['social', 'mobile', 'web']),
('stack_builder_12', 'ethan.white@example.com', 'ethanwhite', 'Ethan White', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan', 'SaaS entrepreneur. B2B specialist.', 'https://ethanwhite.io', 'ethanwhite', 'builder', ARRAY['saas', 'b2b', 'api']),
('stack_builder_13', 'mia.harris@example.com', 'miaharris', 'Mia Harris', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia', 'No-code advocate. Empowering non-technical builders.', 'https://miaharris.dev', 'miaharris', 'builder', ARRAY['nocode', 'automation', 'productivity']),
('stack_builder_14', 'noah.clark@example.com', 'noahclark', 'Noah Clark', 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah', 'Chrome extension wizard. Browser productivity expert.', 'https://noahclark.dev', 'noahclark', 'builder', ARRAY['chrome-extension', 'productivity', 'web']),
('stack_builder_15', 'isabella.lewis@example.com', 'isabellalewis', 'Isabella Lewis', 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella', 'API-first builder. Developer experience advocate.', 'https://isabellalewis.dev', 'isabellalewis', 'builder', ARRAY['api', 'development', 'opensource']);

-- Early Adopters (beta testers)
INSERT INTO users (stack_user_id, email, username, display_name, avatar_url, bio, role, interests) VALUES
('stack_early_1', 'john.doe@example.com', 'johndoe', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', 'Tech enthusiast. Love testing new products.', 'early_adopter', ARRAY['ai', 'productivity', 'mobile']),
('stack_early_2', 'jane.smith@example.com', 'janesmith', 'Jane Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', 'Product manager. Always looking for better tools.', 'early_adopter', ARRAY['productivity', 'saas', 'collaboration']),
('stack_early_3', 'tom.jackson@example.com', 'tomjackson', 'Tom Jackson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', 'Designer. UI/UX feedback specialist.', 'early_adopter', ARRAY['design', 'figma', 'web']),
('stack_early_4', 'amy.walker@example.com', 'amywalker', 'Amy Walker', 'https://api.dicebear.com/7.x/avataaars/svg?seed=amy', 'Developer. Open source contributor.', 'early_adopter', ARRAY['development', 'opensource', 'api']),
('stack_early_5', 'chris.hall@example.com', 'chrishall', 'Chris Hall', 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris', 'Startup founder. Product discovery enthusiast.', 'early_adopter', ARRAY['saas', 'productivity', 'marketing']),
('stack_early_6', 'laura.allen@example.com', 'lauraallen', 'Laura Allen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=laura', 'Content creator. Social media expert.', 'early_adopter', ARRAY['social', 'marketing', 'mobile']),
('stack_early_7', 'kevin.young@example.com', 'kevinyoung', 'Kevin Young', 'https://api.dicebear.com/7.x/avataaars/svg?seed=kevin', 'Data analyst. Analytics tools enthusiast.', 'early_adopter', ARRAY['analytics', 'ai', 'productivity']),
('stack_early_8', 'rachel.king@example.com', 'rachelking', 'Rachel King', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel', 'Educator. EdTech advocate.', 'early_adopter', ARRAY['education', 'mobile', 'web']),
('stack_early_9', 'mark.wright@example.com', 'markwright', 'Mark Wright', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mark', 'Fitness coach. Health tech enthusiast.', 'early_adopter', ARRAY['health', 'fitness', 'mobile']),
('stack_early_10', 'susan.lopez@example.com', 'susanlopez', 'Susan Lopez', 'https://api.dicebear.com/7.x/avataaars/svg?seed=susan', 'Finance professional. FinTech early adopter.', 'early_adopter', ARRAY['finance', 'security', 'mobile']);

-- Normal Users
INSERT INTO users (stack_user_id, email, username, display_name, avatar_url, bio, role, interests) VALUES
('stack_user_1', 'peter.green@example.com', 'petergreen', 'Peter Green', 'https://api.dicebear.com/7.x/avataaars/svg?seed=peter', 'Just exploring cool products.', 'user', ARRAY['productivity', 'web']),
('stack_user_2', 'mary.hill@example.com', 'maryhill', 'Mary Hill', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mary', 'Tech curious. Learning everyday.', 'user', ARRAY['design', 'mobile']),
('stack_user_3', 'daniel.scott@example.com', 'danielscott', 'Daniel Scott', 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel', 'Casual user. Love discovering new apps.', 'user', ARRAY['mobile', 'social']),
('stack_user_4', 'jennifer.adams@example.com', 'jenniferadams', 'Jennifer Adams', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer', 'Small business owner.', 'user', ARRAY['marketing', 'saas']),
('stack_user_5', 'robert.baker@example.com', 'robertbaker', 'Robert Baker', 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert', 'Student. Tech enthusiast.', 'user', ARRAY['education', 'productivity']);

-- Demo Products (35+ products across all categories)

-- Productivity Products (5 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'sarahchen'), 'TaskFlow AI', 'Smart task management powered by AI', 'TaskFlow AI revolutionizes how you manage your daily tasks by using advanced machine learning algorithms to prioritize your work, predict completion times, and optimize your schedule. It seamlessly integrates with all your favorite productivity tools including Notion, Trello, Asana, and Slack. The AI learns from your work patterns over time, becoming more accurate at helping you stay productive and focused on what matters most.', 'https://api.dicebear.com/7.x/shapes/svg?seed=taskflow', 'https://taskflow.ai', 'productivity', ARRAY['ai', 'productivity', 'automation', 'saas'], 'live', NOW() - INTERVAL '2 days', true, NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'miaharris'), 'FocusTime Pro', 'Pomodoro timer with deep analytics', 'FocusTime Pro is more than just a timer - it''s your personal productivity coach. Track your focus sessions with beautiful visualizations, discover your peak productivity hours, and get actionable insights to improve your work habits. Features ambient sounds, smart break reminders, and integration with your calendar to automatically schedule focus time.', 'https://api.dicebear.com/7.x/shapes/svg?seed=focustime', 'https://focustime.app', 'productivity', ARRAY['productivity', 'analytics', 'web', 'wellness'], 'live', NOW() - INTERVAL '5 days', false, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'noahclark'), 'QuickNotes Pro', 'Lightning-fast note-taking Chrome extension', 'Capture brilliant ideas the moment they strike without ever leaving your current tab. QuickNotes Pro lives in your browser and syncs instantly across all your devices. With powerful features like voice-to-text, markdown support, and integrations with Notion, Evernote, and Google Drive, your notes are always where you need them.', 'https://api.dicebear.com/7.x/shapes/svg?seed=quicknotes', 'https://quicknotes.pro', 'productivity', ARRAY['chrome-extension', 'productivity', 'web', 'nocode'], 'live', NOW() - INTERVAL '1 day', false, NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'sarahchen'), 'MeetingMaster', 'AI meeting assistant that takes notes for you', 'Never take meeting notes again. MeetingMaster joins your video calls, transcribes everything in real-time, and generates beautiful summaries with action items automatically extracted. Works with Zoom, Google Meet, and Microsoft Teams. Share notes instantly with your team.', 'https://api.dicebear.com/7.x/shapes/svg?seed=meetingmaster', 'https://meetingmaster.io', 'productivity', ARRAY['ai', 'productivity', 'collaboration', 'saas'], 'live', NOW() - INTERVAL '8 days', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'miaharris'), 'HabitStack', 'Build better habits with gamification', 'Transform your life one habit at a time. HabitStack uses proven behavioral psychology and gamification to help you build lasting habits. Track streaks, earn rewards, join challenges with friends, and visualize your progress with beautiful charts.', 'https://api.dicebear.com/7.x/shapes/svg?seed=habitstack', 'https://habitstack.app', 'productivity', ARRAY['productivity', 'mobile', 'wellness', 'gamification'], 'live', NOW() - INTERVAL '12 days', false, NOW() - INTERVAL '12 days');

-- Developer Tools (5 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'alexkumar'), 'DevDash', 'All-in-one developer dashboard', 'DevDash brings together everything developers need in one beautiful, customizable dashboard. Monitor your GitHub PRs, Jira issues, CI/CD pipelines, and team activity in real-time. Get smart notifications, track your team''s velocity, and never miss an important update again. Built by developers, for developers.', 'https://api.dicebear.com/7.x/shapes/svg?seed=devdash', 'https://devdash.dev', 'developer-tools', ARRAY['development', 'api', 'productivity', 'saas'], 'live', NOW() - INTERVAL '3 days', true, NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'isabellalewis'), 'APIHub', 'Test and document APIs effortlessly', 'APIHub is the modern API testing tool that developers love. Test endpoints, generate beautiful documentation automatically, collaborate with your team, and monitor API health - all in one place. Features include automated testing, mock servers, and OpenAPI support.', 'https://api.dicebear.com/7.x/shapes/svg?seed=apihub', 'https://apihub.io', 'developer-tools', ARRAY['api', 'development', 'collaboration', 'opensource'], 'live', NOW() - INTERVAL '4 days', false, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'alexkumar'), 'CodeSnippets', 'Personal code snippet manager with AI', 'Never lose a useful code snippet again. CodeSnippets helps you save, organize, and search your code across all languages. With AI-powered search, you can find snippets using natural language. Sync across devices with end-to-end encryption.', 'https://api.dicebear.com/7.x/shapes/svg?seed=codesnippets', 'https://codesnippets.dev', 'developer-tools', ARRAY['development', 'productivity', 'web', 'ai'], 'live', NOW() - INTERVAL '6 days', false, NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'isabellalewis'), 'GitFlow Pro', 'Visual Git workflow manager', 'Make Git simple and visual. GitFlow Pro provides a beautiful interface for managing branches, reviewing code, and understanding your repository''s history. Perfect for teams who want to streamline their Git workflow without memorizing complex commands.', 'https://api.dicebear.com/7.x/shapes/svg?seed=gitflow', 'https://gitflow.pro', 'developer-tools', ARRAY['development', 'collaboration', 'productivity', 'web'], 'live', NOW() - INTERVAL '9 days', false, NOW() - INTERVAL '9 days'),
((SELECT id FROM users WHERE username = 'alexkumar'), 'DebugAI', 'AI-powered debugging assistant', 'Stuck on a bug? DebugAI analyzes your code, error messages, and stack traces to suggest fixes. It learns from millions of open-source repositories to provide context-aware solutions. Supports 20+ programming languages.', 'https://api.dicebear.com/7.x/shapes/svg?seed=debugai', 'https://debugai.dev', 'developer-tools', ARRAY['ai', 'development', 'productivity', 'vscode'], 'live', NOW() - INTERVAL '11 days', true, NOW() - INTERVAL '11 days');

-- Design Tools (4 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'emmawilson'), 'ColorPalette Pro', 'Generate beautiful color palettes with AI', 'ColorPalette Pro uses cutting-edge AI to generate harmonious, accessible color schemes based on your brand, mood, or inspiration images. Export to Figma, Sketch, CSS, or Tailwind with one click. Features include contrast checking, color blindness simulation, and trending palettes.', 'https://api.dicebear.com/7.x/shapes/svg?seed=colorpalette', 'https://colorpalette.pro', 'design', ARRAY['design', 'ai', 'figma', 'web'], 'live', NOW() - INTERVAL '1 day', true, NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'emmawilson'), 'DesignTokens', 'Manage design tokens across platforms', 'Keep your design system in sync across Figma, code, and documentation. DesignTokens automatically syncs colors, typography, spacing, and more between your design files and codebase. Supports React, Vue, iOS, and Android.', 'https://api.dicebear.com/7.x/shapes/svg?seed=designtokens', 'https://designtokens.io', 'design', ARRAY['design', 'figma', 'development', 'collaboration'], 'live', NOW() - INTERVAL '7 days', false, NOW() - INTERVAL '7 days'),
((SELECT id FROM users WHERE username = 'emmawilson'), 'MockupStudio', 'Create stunning mockups in seconds', 'Transform your designs into professional mockups instantly. MockupStudio offers 1000+ high-quality templates for devices, print materials, and environments. Drag, drop, and export in seconds. No Photoshop required.', 'https://api.dicebear.com/7.x/shapes/svg?seed=mockupstudio', 'https://mockupstudio.design', 'design', ARRAY['design', 'web', 'marketing', 'nocode'], 'live', NOW() - INTERVAL '10 days', false, NOW() - INTERVAL '10 days'),
((SELECT id FROM users WHERE username = 'emmawilson'), 'IconCraft AI', 'Generate custom icons with AI', 'Create unique, professional icons for your projects using AI. Describe what you need in plain English, and IconCraft generates multiple variations. Export as SVG, PNG, or React components. Perfect for designers and developers.', 'https://api.dicebear.com/7.x/shapes/svg?seed=iconcraft', 'https://iconcraft.ai', 'design', ARRAY['design', 'ai', 'web', 'development'], 'live', NOW() - INTERVAL '13 days', false, NOW() - INTERVAL '13 days');

-- Marketing Tools (4 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'jamesrod'), 'EmailCraft', 'Beautiful email campaigns in minutes', 'EmailCraft makes email marketing simple and effective. Create stunning campaigns with our drag-and-drop builder, get AI-powered copy suggestions, and track detailed analytics. Integrates with all major email providers. A/B testing included.', 'https://api.dicebear.com/7.x/shapes/svg?seed=emailcraft', 'https://emailcraft.io', 'marketing', ARRAY['marketing', 'automation', 'ai', 'saas'], 'live', NOW() - INTERVAL '2 days', false, NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'jamesrod'), 'SocialScheduler', 'Schedule posts across all platforms', 'Manage all your social media from one dashboard. SocialScheduler lets you plan, schedule, and analyze content for Twitter, LinkedIn, Instagram, Facebook, and TikTok. Features include AI caption generation, best time to post suggestions, and comprehensive analytics.', 'https://api.dicebear.com/7.x/shapes/svg?seed=socialscheduler', 'https://socialscheduler.app', 'marketing', ARRAY['marketing', 'social', 'automation', 'analytics'], 'live', NOW() - INTERVAL '5 days', false, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'jamesrod'), 'SEOBoost', 'AI-powered SEO optimization', 'Rank higher on Google with SEOBoost. Get actionable SEO recommendations, track your rankings, analyze competitors, and optimize your content with AI. Features include keyword research, backlink monitoring, and technical SEO audits.', 'https://api.dicebear.com/7.x/shapes/svg?seed=seoboost', 'https://seoboost.io', 'marketing', ARRAY['marketing', 'ai', 'analytics', 'saas'], 'live', NOW() - INTERVAL '8 days', true, NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'jamesrod'), 'ConversionLab', 'A/B testing made simple', 'Optimize your website for conversions without writing code. ConversionLab makes A/B testing accessible to everyone. Create experiments visually, track results in real-time, and get AI-powered insights to boost your conversion rate.', 'https://api.dicebear.com/7.x/shapes/svg?seed=conversionlab', 'https://conversionlab.io', 'marketing', ARRAY['marketing', 'analytics', 'nocode', 'web'], 'live', NOW() - INTERVAL '14 days', false, NOW() - INTERVAL '14 days');

-- AI & ML Products (4 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'lisapark'), 'ChatGenius', 'AI chatbot builder for businesses', 'Build intelligent chatbots trained on your data in minutes, no coding required. ChatGenius helps businesses automate customer support, qualify leads, and engage visitors 24/7. Integrates with your website, Slack, WhatsApp, and more. Supports 50+ languages.', 'https://api.dicebear.com/7.x/shapes/svg?seed=chatgenius', 'https://chatgenius.ai', 'ai-ml', ARRAY['ai', 'nocode', 'saas', 'b2b'], 'live', NOW() - INTERVAL '1 day', true, NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'lisapark'), 'DataInsights AI', 'Turn data into insights with AI', 'Connect your database and get instant insights in plain English. DataInsights AI analyzes your data, identifies trends, and generates beautiful reports automatically. No SQL knowledge required. Perfect for business analysts and founders.', 'https://api.dicebear.com/7.x/shapes/svg?seed=datainsights', 'https://datainsights.ai', 'ai-ml', ARRAY['ai', 'analytics', 'b2b', 'saas'], 'live', NOW() - INTERVAL '3 days', false, NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'lisapark'), 'VoiceClone AI', 'Clone any voice with AI', 'Create realistic voice clones for podcasts, audiobooks, and content creation. VoiceClone AI requires just 30 seconds of audio to generate a high-quality voice model. Perfect for content creators and businesses. Ethical use only.', 'https://api.dicebear.com/7.x/shapes/svg?seed=voiceclone', 'https://voiceclone.ai', 'ai-ml', ARRAY['ai', 'content', 'marketing', 'saas'], 'live', NOW() - INTERVAL '6 days', false, NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'lisapark'), 'ImageGen Pro', 'Professional AI image generation', 'Generate stunning images for your projects using state-of-the-art AI. ImageGen Pro offers fine-tuned models for logos, illustrations, photos, and more. Edit with natural language, upscale to 8K, and remove backgrounds instantly.', 'https://api.dicebear.com/7.x/shapes/svg?seed=imagegen', 'https://imagegen.pro', 'ai-ml', ARRAY['ai', 'design', 'marketing', 'web'], 'live', NOW() - INTERVAL '9 days', true, NOW() - INTERVAL '9 days');

-- SaaS Products (3 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'ethanwhite'), 'TeamSync', 'Modern team collaboration platform', 'Everything your remote team needs in one place. TeamSync combines chat, video calls, project management, and file sharing in a beautiful, intuitive interface. Built for distributed teams who value simplicity and productivity.', 'https://api.dicebear.com/7.x/shapes/svg?seed=teamsync', 'https://teamsync.io', 'saas', ARRAY['saas', 'collaboration', 'b2b', 'productivity'], 'live', NOW() - INTERVAL '4 days', false, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'sarahchen'), 'CustomerHub', 'Customer feedback management made easy', 'Collect, organize, and act on customer feedback effortlessly. CustomerHub helps product teams prioritize features, share roadmaps publicly, and keep customers in the loop with beautiful changelogs. Integrates with your existing tools.', 'https://api.dicebear.com/7.x/shapes/svg?seed=customerhub', 'https://customerhub.io', 'saas', ARRAY['saas', 'b2b', 'productivity', 'analytics'], 'live', NOW() - INTERVAL '6 days', false, NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'ethanwhite'), 'DocuFlow', 'Document management for modern teams', 'Store, organize, and collaborate on documents with ease. DocuFlow offers powerful search, version control, and real-time collaboration. Perfect for teams who need more than Google Drive but less complexity than SharePoint.', 'https://api.dicebear.com/7.x/shapes/svg?seed=docuflow', 'https://docuflow.io', 'saas', ARRAY['saas', 'collaboration', 'productivity', 'b2b'], 'live', NOW() - INTERVAL '10 days', false, NOW() - INTERVAL '10 days');

-- Mobile Apps (3 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'mikebrown'), 'FitTrack Pro', 'AI-powered fitness tracking', 'Your personal AI fitness coach in your pocket. FitTrack Pro analyzes your workouts, provides personalized recommendations, and helps you reach your fitness goals faster. Track progress with beautiful visualizations and stay motivated with achievement badges.', 'https://api.dicebear.com/7.x/shapes/svg?seed=fittrack', 'https://fittrack.app', 'mobile', ARRAY['mobile', 'health', 'fitness', 'ai'], 'live', NOW() - INTERVAL '2 days', true, NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'mikebrown'), 'BudgetBuddy', 'Simple personal finance tracking', 'Take control of your finances with BudgetBuddy. Track expenses automatically, set budgets, and reach your financial goals. Beautiful visualizations show where your money goes. Bank-level security with 256-bit encryption.', 'https://api.dicebear.com/7.x/shapes/svg?seed=budgetbuddy', 'https://budgetbuddy.app', 'mobile', ARRAY['mobile', 'finance', 'productivity', 'analytics'], 'live', NOW() - INTERVAL '5 days', false, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'mikebrown'), 'TravelPal', 'Your AI travel companion', 'Plan perfect trips with AI assistance. TravelPal creates personalized itineraries, finds the best deals, and provides offline maps and guides. Save places, track expenses, and share your adventures with friends.', 'https://api.dicebear.com/7.x/shapes/svg?seed=travelpal', 'https://travelpal.app', 'mobile', ARRAY['mobile', 'ai', 'travel', 'productivity'], 'live', NOW() - INTERVAL '7 days', false, NOW() - INTERVAL '7 days');

-- Web3 Products (2 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'sophialee'), 'CryptoPortfolio', 'Track your crypto investments', 'Monitor your entire crypto portfolio in one place. CryptoPortfolio provides real-time tracking across all wallets and exchanges, price alerts, tax reporting, and portfolio analytics. Supports 10,000+ cryptocurrencies.', 'https://api.dicebear.com/7.x/shapes/svg?seed=cryptoportfolio', 'https://cryptoportfolio.app', 'web3', ARRAY['web3', 'finance', 'mobile', 'web'], 'live', NOW() - INTERVAL '3 days', false, NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'sophialee'), 'NFTGallery', 'Showcase your NFT collection', 'Create stunning galleries to showcase your NFTs. NFTGallery automatically syncs with your wallets, displays metadata beautifully, and lets you share collections with custom URLs. Perfect for collectors and creators.', 'https://api.dicebear.com/7.x/shapes/svg?seed=nftgallery', 'https://nftgallery.io', 'web3', ARRAY['web3', 'design', 'web', 'art'], 'live', NOW() - INTERVAL '7 days', false, NOW() - INTERVAL '7 days');

-- Health & Fitness (3 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'davidmartinez'), 'MindfulMoments', 'Meditation and mindfulness app', 'Find peace in the chaos. MindfulMoments offers guided meditations, breathing exercises, sleep stories, and mindfulness reminders. Track your meditation streak and discover the mental health benefits of daily practice.', 'https://api.dicebear.com/7.x/shapes/svg?seed=mindful', 'https://mindfulmoments.app', 'health', ARRAY['health', 'mobile', 'wellness', 'meditation'], 'live', NOW() - INTERVAL '4 days', false, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'davidmartinez'), 'NutritionAI', 'AI-powered meal planning', 'Eat healthy without the hassle. NutritionAI creates personalized meal plans based on your goals, dietary restrictions, and preferences. Get recipes, shopping lists, and nutrition tracking all in one app. Supports keto, vegan, paleo, and more.', 'https://api.dicebear.com/7.x/shapes/svg?seed=nutrition', 'https://nutritionai.app', 'health', ARRAY['health', 'ai', 'mobile', 'wellness'], 'live', NOW() - INTERVAL '6 days', false, NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'davidmartinez'), 'SleepWell', 'Improve your sleep quality', 'Wake up refreshed every day. SleepWell tracks your sleep patterns, provides personalized insights, and offers science-backed techniques to improve sleep quality. Features include smart alarms, sleep sounds, and bedtime reminders.', 'https://api.dicebear.com/7.x/shapes/svg?seed=sleepwell', 'https://sleepwell.app', 'health', ARRAY['health', 'mobile', 'wellness', 'analytics'], 'live', NOW() - INTERVAL '11 days', false, NOW() - INTERVAL '11 days');

-- Education (3 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'oliviataylor'), 'LearnPath', 'Personalized learning platform', 'Master any skill with AI-powered personalized learning paths. LearnPath adapts to your pace, identifies knowledge gaps, and provides targeted exercises. Track progress, earn certificates, and learn from expert-created content.', 'https://api.dicebear.com/7.x/shapes/svg?seed=learnpath', 'https://learnpath.io', 'education', ARRAY['education', 'ai', 'saas', 'mobile'], 'live', NOW() - INTERVAL '1 day', true, NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'oliviataylor'), 'QuizMaster', 'Create interactive quizzes easily', 'Engage students with interactive quizzes. QuizMaster helps educators create beautiful quizzes with multiple question types, automatic grading, and detailed analytics. Students love the gamified experience with leaderboards and achievements.', 'https://api.dicebear.com/7.x/shapes/svg?seed=quizmaster', 'https://quizmaster.edu', 'education', ARRAY['education', 'web', 'saas', 'gamification'], 'live', NOW() - INTERVAL '5 days', false, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'oliviataylor'), 'StudyBuddy AI', 'Your AI study companion', 'Study smarter, not harder. StudyBuddy AI helps students with homework, generates practice questions, explains complex concepts, and creates study schedules. Available 24/7 for all subjects and grade levels.', 'https://api.dicebear.com/7.x/shapes/svg?seed=studybuddy', 'https://studybuddy.ai', 'education', ARRAY['education', 'ai', 'mobile', 'productivity'], 'live', NOW() - INTERVAL '8 days', false, NOW() - INTERVAL '8 days');

-- Finance (3 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'ryananderson'), 'InvoiceFlow', 'Invoicing made simple', 'Create professional invoices in seconds. InvoiceFlow helps freelancers and small businesses manage invoicing, track payments, send reminders, and get paid faster. Supports multiple currencies and payment methods.', 'https://api.dicebear.com/7.x/shapes/svg?seed=invoiceflow', 'https://invoiceflow.app', 'finance', ARRAY['finance', 'saas', 'b2b', 'productivity'], 'live', NOW() - INTERVAL '2 days', false, NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'ryananderson'), 'StockAlerts', 'Real-time stock price alerts', 'Never miss a trading opportunity. StockAlerts sends instant notifications when your stocks hit target prices. Set custom alerts, track your portfolio, and get market news. Supports stocks, crypto, and forex.', 'https://api.dicebear.com/7.x/shapes/svg?seed=stockalerts', 'https://stockalerts.app', 'finance', ARRAY['finance', 'mobile', 'web', 'analytics'], 'live', NOW() - INTERVAL '4 days', false, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'ryananderson'), 'ExpenseTracker Pro', 'Business expense management', 'Simplify expense tracking for your business. Scan receipts with OCR, categorize expenses automatically, generate reports, and export for accounting. Multi-user support with approval workflows.', 'https://api.dicebear.com/7.x/shapes/svg?seed=expensetracker', 'https://expensetracker.pro', 'finance', ARRAY['finance', 'saas', 'b2b', 'mobile'], 'live', NOW() - INTERVAL '9 days', false, NOW() - INTERVAL '9 days');

-- Social (2 products)
INSERT INTO products (maker_id, name, tagline, description, logo_url, website_url, category, tags, status, launch_date, is_featured, created_at) VALUES
((SELECT id FROM users WHERE username = 'avathomas'), 'ConnectHub', 'Professional networking reimagined', 'Build meaningful professional relationships. ConnectHub focuses on quality over quantity with features like virtual coffee chats, skill-based matching, and interest groups. Less noise, more genuine connections.', 'https://api.dicebear.com/7.x/shapes/svg?seed=connecthub', 'https://connecthub.social', 'social', ARRAY['social', 'web', 'mobile', 'networking'], 'live', NOW() - INTERVAL '3 days', false, NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'avathomas'), 'EventMeet', 'Discover and host local events', 'Find amazing events happening near you. EventMeet helps you discover concerts, meetups, workshops, and more. Host your own events, sell tickets, and build community. Available in 100+ cities worldwide.', 'https://api.dicebear.com/7.x/shapes/svg?seed=eventmeet', 'https://eventmeet.app', 'social', ARRAY['social', 'mobile', 'web', 'events'], 'live', NOW() - INTERVAL '6 days', false, NOW() - INTERVAL '6 days');

-- Add some comments to products
INSERT INTO comments (product_id, user_id, content, created_at) VALUES
((SELECT id FROM products WHERE name = 'TaskFlow AI'), (SELECT id FROM users WHERE username = 'johndoe'), 'This is amazing! The AI predictions are incredibly accurate. Saved me hours already! The Slack integration works flawlessly.', NOW() - INTERVAL '1 day'),
((SELECT id FROM products WHERE name = 'TaskFlow AI'), (SELECT id FROM users WHERE username = 'janesmith'), 'Great product! Would love to see Microsoft Teams integration next.', NOW() - INTERVAL '12 hours'),
((SELECT id FROM products WHERE name = 'TaskFlow AI'), (SELECT id FROM users WHERE username = 'tomjackson'), 'Been using this for a week. Game changer for managing multiple projects!', NOW() - INTERVAL '6 hours'),
((SELECT id FROM products WHERE name = 'DevDash'), (SELECT id FROM users WHERE username = 'amywalker'), 'As a developer, this is exactly what I needed. Clean UI and fast performance. The GitHub integration is perfect.', NOW() - INTERVAL '2 days'),
((SELECT id FROM products WHERE name = 'DevDash'), (SELECT id FROM users WHERE username = 'johndoe'), 'Love the real-time updates! Makes code review so much easier.', NOW() - INTERVAL '1 day'),
((SELECT id FROM products WHERE name = 'ColorPalette Pro'), (SELECT id FROM users WHERE username = 'tomjackson'), 'The AI color generation is mind-blowing. Using it for all my projects now. Export to Figma is seamless!', NOW() - INTERVAL '6 hours'),
((SELECT id FROM products WHERE name = 'ColorPalette Pro'), (SELECT id FROM users WHERE username = 'janesmith'), 'Finally, a color tool that understands accessibility! The contrast checker is invaluable.', NOW() - INTERVAL '4 hours'),
((SELECT id FROM products WHERE name = 'ChatGenius'), (SELECT id FROM users WHERE username = 'chrishall'), 'Implemented this for our customer support. Response time cut in half! ROI was immediate.', NOW() - INTERVAL '18 hours'),
((SELECT id FROM products WHERE name = 'ChatGenius'), (SELECT id FROM users WHERE username = 'jenniferadams'), 'Easy to set up and train. Our customers love the instant responses.', NOW() - INTERVAL '8 hours'),
((SELECT id FROM products WHERE name = 'FitTrack Pro'), (SELECT id FROM users WHERE username = 'markwright'), 'Best fitness app I''ve used. The AI coaching is like having a personal trainer in your pocket!', NOW() - INTERVAL '1 day'),
((SELECT id FROM products WHERE name = 'FitTrack Pro'), (SELECT id FROM users WHERE username = 'susanlopez'), 'The workout recommendations are spot on. Lost 10 pounds in a month!', NOW() - INTERVAL '10 hours'),
((SELECT id FROM products WHERE name = 'LearnPath'), (SELECT id FROM users WHERE username = 'rachelking'), 'Perfect for self-paced learning. The personalization really works! My students love it.', NOW() - INTERVAL '8 hours'),
((SELECT id FROM products WHERE name = 'LearnPath'), (SELECT id FROM users WHERE username = 'robertbaker'), 'Using this to learn web development. The adaptive learning is impressive.', NOW() - INTERVAL '5 hours'),
((SELECT id FROM products WHERE name = 'MeetingMaster'), (SELECT id FROM users WHERE username = 'janesmith'), 'No more manual note-taking! This saves me at least 2 hours per day.', NOW() - INTERVAL '1 day'),
((SELECT id FROM products WHERE name = 'SEOBoost'), (SELECT id FROM users WHERE username = 'jenniferadams'), 'Helped us rank #1 for our main keyword in just 3 weeks. Incredible tool!', NOW() - INTERVAL '12 hours'),
((SELECT id FROM products WHERE name = 'ImageGen Pro'), (SELECT id FROM users WHERE username = 'tomjackson'), 'The quality of generated images is stunning. Perfect for client presentations.', NOW() - INTERVAL '9 hours'),
((SELECT id FROM products WHERE name = 'DebugAI'), (SELECT id FROM users WHERE username = 'amywalker'), 'Saved me countless hours of debugging. The AI suggestions are surprisingly accurate!', NOW() - INTERVAL '7 hours'),
((SELECT id FROM products WHERE name = 'QuickNotes Pro'), (SELECT id FROM users WHERE username = 'johndoe'), 'This extension is always open in my browser. Voice-to-text feature is a lifesaver!', NOW() - INTERVAL '3 hours'),
((SELECT id FROM products WHERE name = 'BudgetBuddy'), (SELECT id FROM users WHERE username = 'petergreen'), 'Finally understanding where my money goes. The visualizations are beautiful and insightful.', NOW() - INTERVAL '14 hours'),
((SELECT id FROM products WHERE name = 'SocialScheduler'), (SELECT id FROM users WHERE username = 'lauraallen'), 'Managing 5 social accounts is now a breeze. The AI captions are surprisingly good!', NOW() - INTERVAL '11 hours');

-- Add bookmarks (more realistic distribution)
INSERT INTO bookmarks (user_id, product_id, created_at) VALUES
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM products WHERE name = 'TaskFlow AI'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM products WHERE name = 'DevDash'), NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM products WHERE name = 'QuickNotes Pro'), NOW() - INTERVAL '3 hours'),
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM products WHERE name = 'MeetingMaster'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM products WHERE name = 'TaskFlow AI'), NOW() - INTERVAL '12 hours'),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM products WHERE name = 'ColorPalette Pro'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM products WHERE name = 'MeetingMaster'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM products WHERE name = 'SocialScheduler'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'tomjackson'), (SELECT id FROM products WHERE name = 'ColorPalette Pro'), NOW() - INTERVAL '6 hours'),
((SELECT id FROM users WHERE username = 'tomjackson'), (SELECT id FROM products WHERE name = 'DesignTokens'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'tomjackson'), (SELECT id FROM products WHERE name = 'MockupStudio'), NOW() - INTERVAL '10 days'),
((SELECT id FROM users WHERE username = 'tomjackson'), (SELECT id FROM products WHERE name = 'ImageGen Pro'), NOW() - INTERVAL '9 days'),
((SELECT id FROM users WHERE username = 'amywalker'), (SELECT id FROM products WHERE name = 'DevDash'), NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'amywalker'), (SELECT id FROM products WHERE name = 'APIHub'), NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'amywalker'), (SELECT id FROM products WHERE name = 'CodeSnippets'), NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'amywalker'), (SELECT id FROM products WHERE name = 'DebugAI'), NOW() - INTERVAL '11 days'),
((SELECT id FROM users WHERE username = 'chrishall'), (SELECT id FROM products WHERE name = 'ChatGenius'), NOW() - INTERVAL '18 hours'),
((SELECT id FROM users WHERE username = 'chrishall'), (SELECT id FROM products WHERE name = 'TeamSync'), NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'chrishall'), (SELECT id FROM products WHERE name = 'CustomerHub'), NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'markwright'), (SELECT id FROM products WHERE name = 'FitTrack Pro'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'markwright'), (SELECT id FROM products WHERE name = 'MindfulMoments'), NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'markwright'), (SELECT id FROM products WHERE name = 'NutritionAI'), NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'rachelking'), (SELECT id FROM products WHERE name = 'LearnPath'), NOW() - INTERVAL '8 hours'),
((SELECT id FROM users WHERE username = 'rachelking'), (SELECT id FROM products WHERE name = 'QuizMaster'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'rachelking'), (SELECT id FROM products WHERE name = 'StudyBuddy AI'), NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'susanlopez'), (SELECT id FROM products WHERE name = 'FitTrack Pro'), NOW() - INTERVAL '10 hours'),
((SELECT id FROM users WHERE username = 'susanlopez'), (SELECT id FROM products WHERE name = 'BudgetBuddy'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'susanlopez'), (SELECT id FROM products WHERE name = 'InvoiceFlow'), NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'lauraallen'), (SELECT id FROM products WHERE name = 'SocialScheduler'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'lauraallen'), (SELECT id FROM products WHERE name = 'EmailCraft'), NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'lauraallen'), (SELECT id FROM products WHERE name = 'SEOBoost'), NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'kevinyoung'), (SELECT id FROM products WHERE name = 'DataInsights AI'), NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'kevinyoung'), (SELECT id FROM products WHERE name = 'SEOBoost'), NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'petergreen'), (SELECT id FROM products WHERE name = 'QuickNotes Pro'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'petergreen'), (SELECT id FROM products WHERE name = 'BudgetBuddy'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'jenniferadams'), (SELECT id FROM products WHERE name = 'ChatGenius'), NOW() - INTERVAL '8 hours'),
((SELECT id FROM users WHERE username = 'jenniferadams'), (SELECT id FROM products WHERE name = 'SEOBoost'), NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'jenniferadams'), (SELECT id FROM products WHERE name = 'EmailCraft'), NOW() - INTERVAL '2 days');

-- Add product views (realistic distribution with more views for trending products)
INSERT INTO product_views (product_id, user_id, created_at) 
SELECT 
  p.id,
  u.id,
  NOW() - (random() * INTERVAL '14 days')
FROM products p
CROSS JOIN users u
WHERE random() < 0.4; -- 40% chance of view

-- Add more views for featured products
INSERT INTO product_views (product_id, user_id, created_at) 
SELECT 
  p.id,
  u.id,
  NOW() - (random() * INTERVAL '7 days')
FROM products p
CROSS JOIN users u
WHERE p.is_featured = true AND random() < 0.6;

-- Add newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, user_id, interests, created_at) VALUES
('john.doe@example.com', (SELECT id FROM users WHERE username = 'johndoe'), ARRAY['ai', 'productivity'], NOW() - INTERVAL '5 days'),
('jane.smith@example.com', (SELECT id FROM users WHERE username = 'janesmith'), ARRAY['productivity', 'saas'], NOW() - INTERVAL '4 days'),
('tom.jackson@example.com', (SELECT id FROM users WHERE username = 'tomjackson'), ARRAY['design', 'figma'], NOW() - INTERVAL '3 days'),
('amy.walker@example.com', (SELECT id FROM users WHERE username = 'amywalker'), ARRAY['development', 'api'], NOW() - INTERVAL '6 days'),
('chris.hall@example.com', (SELECT id FROM users WHERE username = 'chrishall'), ARRAY['saas', 'productivity'], NOW() - INTERVAL '7 days'),
('newsletter1@example.com', NULL, ARRAY['ai', 'development'], NOW() - INTERVAL '10 days'),
('newsletter2@example.com', NULL, ARRAY['marketing', 'social'], NOW() - INTERVAL '8 days'),
('newsletter3@example.com', NULL, ARRAY['design', 'web'], NOW() - INTERVAL '12 days');

-- Add beta testing signups
INSERT INTO beta_testers (user_id, product_id, status, created_at) VALUES
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM products WHERE name = 'TaskFlow AI'), 'accepted', NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM products WHERE name = 'DevDash'), 'accepted', NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'tomjackson'), (SELECT id FROM products WHERE name = 'ColorPalette Pro'), 'completed', NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'amywalker'), (SELECT id FROM products WHERE name = 'ChatGenius'), 'pending', NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'chrishall'), (SELECT id FROM products WHERE name = 'FitTrack Pro'), 'accepted', NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'markwright'), (SELECT id FROM products WHERE name = 'MeetingMaster'), 'accepted', NOW() - INTERVAL '8 days'),
((SELECT id FROM users WHERE username = 'rachelking'), (SELECT id FROM products WHERE name = 'LearnPath'), 'pending', NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'kevinyoung'), (SELECT id FROM products WHERE name = 'DataInsights AI'), 'accepted', NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'lauraallen'), (SELECT id FROM products WHERE name = 'SocialScheduler'), 'completed', NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'petergreen'), (SELECT id FROM products WHERE name = 'QuickNotes Pro'), 'pending', NOW() - INTERVAL '1 day');

-- Add some follows
INSERT INTO follows (follower_id, following_id, created_at) VALUES
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM users WHERE username = 'sarahchen'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM users WHERE username = 'alexkumar'), NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'tomjackson'), (SELECT id FROM users WHERE username = 'emmawilson'), NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'amywalker'), (SELECT id FROM users WHERE username = 'lisapark'), NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'chrishall'), (SELECT id FROM users WHERE username = 'sarahchen'), NOW() - INTERVAL '7 days'),
((SELECT id FROM users WHERE username = 'markwright'), (SELECT id FROM users WHERE username = 'davidmartinez'), NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE username = 'rachelking'), (SELECT id FROM users WHERE username = 'oliviataylor'), NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE username = 'susanlopez'), (SELECT id FROM users WHERE username = 'ryananderson'), NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE username = 'lauraallen'), (SELECT id FROM users WHERE username = 'jamesrod'), NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'kevinyoung'), (SELECT id FROM users WHERE username = 'lisapark'), NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'petergreen'), (SELECT id FROM users WHERE username = 'noahclark'), NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE username = 'jenniferadams'), (SELECT id FROM users WHERE username = 'jamesrod'), NOW() - INTERVAL '8 days');

-- Add some product clicks for analytics
INSERT INTO product_clicks (product_id, user_id, click_type, created_at)
SELECT 
  p.id,
  u.id,
  'website',
  NOW() - (random() * INTERVAL '14 days')
FROM products p
CROSS JOIN users u
WHERE random() < 0.15; -- 15% chance of clicking through
