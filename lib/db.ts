import { neon, NeonQueryFunction } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL);

// Query helper function for compatibility with pg-style queries
// Neon serverless returns rows as an array directly
// We wrap it to match the standard pg interface { rows: [] }
export async function query(text: string, params: any[] = []) {
  try {
    const rows = await sql(text, params);
    return { rows };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Database helper functions
export type User = {
  id: string;
  stack_user_id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website_url: string | null;
  twitter_handle: string | null;
  role: 'user' | 'builder' | 'early_adopter' | 'investor' | 'influencer' | 'admin';
  interests: string[];
  created_at: Date;
  updated_at: Date;
};

export type Product = {
  id: string;
  maker_id: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  website_url: string;
  category: string;
  tags: string[];
  status: 'draft' | 'scheduled' | 'live' | 'archived';
  launch_date: Date | null;
  is_featured: boolean;
  is_sponsored: boolean;
  created_at: Date;
  updated_at: Date;
};

export type Comment = {
  id: string;
  product_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: Date;
  updated_at: Date;
};

export type Bookmark = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
};

export type ProductView = {
  id: string;
  product_id: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  referrer: string | null;
  created_at: Date;
};

export type ProductClick = {
  id: string;
  product_id: string;
  user_id: string | null;
  click_type: 'website' | 'video' | 'media';
  created_at: Date;
};

// Re-export constants for backward compatibility
export { CATEGORIES, TAGS } from './constants';

