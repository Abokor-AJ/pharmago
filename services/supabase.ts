import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@env';
import { createClient } from '@supabase/supabase-js';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL:', SUPABASE_URL);
  console.error('Supabase Anon Key:', SUPABASE_ANON_KEY ? '***' : 'undefined');
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database types for the new schema
export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          username: string;
          email: string | null;
          password_hash: string;
          must_change_password: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email?: string | null;
          password_hash: string;
          must_change_password?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string | null;
          password_hash?: string;
          must_change_password?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          address: string;
          latitude: number | null;
          longitude: number | null;
          password_hash: string;
          role: 'pharmacy' | 'delivery' | 'customer';
          must_change_password: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          address: string;
          latitude?: number | null;
          longitude?: number | null;
          password_hash: string;
          role: 'pharmacy' | 'delivery' | 'customer';
          must_change_password?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          address?: string;
          latitude?: number | null;
          longitude?: number | null;
          password_hash?: string;
          role?: 'pharmacy' | 'delivery' | 'customer';
          must_change_password?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      pharmacies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string;
          phone: string;
          logo_url: string | null;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          address: string;
          phone: string;
          logo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          address?: string;
          phone?: string;
          logo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 