// Categories
export const CATEGORIES = [
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'developer-tools', name: 'Developer Tools', icon: '🛠️' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'ai-ml', name: 'AI & ML', icon: '🤖' },
  { id: 'saas', name: 'SaaS', icon: '☁️' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'web3', name: 'Web3', icon: '⛓️' },
  { id: 'health', name: 'Health & Fitness', icon: '💪' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'social', name: 'Social', icon: '👥' },
] as const;

export const TAGS = [
  'ai', 'productivity', 'design', 'development', 'marketing', 
  'analytics', 'automation', 'collaboration', 'security', 'mobile', 
  'web', 'api', 'opensource', 'nocode', 'saas', 'b2b', 'b2c',
  'chrome-extension', 'slack', 'notion', 'figma', 'vscode'
] as const;

// Beta Testing Constants
export const FEEDBACK_CATEGORIES = [
  'UX',
  'Functionality', 
  'Design',
  'Performance',
  'Pricing',
  'Onboarding',
  'Documentation',
  'Bug Report',
  'Feature Request',
  'Other'
] as const;

export const REWARD_TYPES = [
  { id: 'discount', name: 'Discount', icon: '🏷️' },
  { id: 'free_trial', name: 'Extended Free Trial', icon: '⏰' },
  { id: 'lifetime_deal', name: 'Lifetime Deal', icon: '💎' },
  { id: 'gift_card', name: 'Gift Card', icon: '🎁' },
  { id: 'cash', name: 'Cash', icon: '💰' },
  { id: 'early_access', name: 'Early Access', icon: '🔑' },
  { id: 'none', name: 'No Reward', icon: '✨' },
] as const;

export const SKILLSETS = [
  'UX/UI Design',
  'QA Testing',
  'Technical/Developer',
  'Product Management',
  'Marketing',
  'Content Creation',
  'Customer Support',
  'Business Strategy'
] as const;

export const DEVICE_TYPES = [
  'Desktop (Windows)',
  'Desktop (Mac)',
  'Desktop (Linux)',
  'Mobile (iOS)',
  'Mobile (Android)',
  'Tablet',
  'All Devices'
] as const;

export const POINTS_REWARDS = {
  JOINED_BETA: 10,
  SUBMITTED_FEEDBACK: 20,
  CRITICAL_BUG: 50,
  FEATURE_VOTE: 5,
  COMPLETED_BETA: 100,
  DAILY_ACTIVE: 5
} as const;

