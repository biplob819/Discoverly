import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Create a lazy-initialized SQL connection to avoid build-time errors
let _sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// Overloaded sql function that handles both template literals and strings
export function sql(strings: TemplateStringsArray, ...values: any[]): any;
export function sql(query: string, params?: any[]): any;
export function sql(stringsOrQuery: TemplateStringsArray | string, ...values: any[]): any {
  const db = getSql();
  
  if (typeof stringsOrQuery === 'string') {
    // Handle regular string queries
    return db(stringsOrQuery, values[0] || []);
  } else {
    // Handle template literal queries
    return db(stringsOrQuery, ...values);
  }
}

// Query helper function for compatibility with pg-style queries
// Neon serverless returns rows as an array directly
// We wrap it to match the standard pg interface { rows: [] }
export async function query(text: string, params: any[] = []) {
  try {
    const rows = await getSql()(text, params);
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

