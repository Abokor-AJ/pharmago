import { Database, supabase } from './supabase';

type Admin = Database['public']['Tables']['admins']['Row'];
type User = Database['public']['Tables']['users']['Row'];

// Union type for both admin and user
type AuthUser = (Admin & { type: 'admin' }) | (User & { type: 'user' });

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export class AuthService {
  // Login with username and password (checks both admin and user tables)
  static async login(username: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // First, try to find admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (adminData && adminData.password_hash === password) {
        console.log('Admin login successful:', username);
        return { user: { ...adminData, type: 'admin' as const }, error: null };
      }

      // If not admin, try to find user by phone number
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', username)
        .eq('is_active', true)
        .single();

      if (userError) {
        console.log('User query error:', userError);
        return { user: null, error: 'User not found' };
      }

      if (!userData) {
        console.log('No user found with username:', username);
        return { user: null, error: 'User not found' };
      }

      // Check if password matches
      if (userData.password_hash === password) {
        console.log('User login successful:', username);
        return { user: { ...userData, type: 'user' as const }, error: null };
      } else {
        console.log('Password mismatch for user:', username);
        return { user: null, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { user: null, error: 'Login failed' };
    }
  }

  // Change password (works for both admin and user)
  static async changePassword(userId: string, newPassword: string, userType: 'admin' | 'user'): Promise<{ success: boolean; error: string | null }> {
    try {
      const table = userType === 'admin' ? 'admins' : 'users';
      const { error } = await supabase
        .from(table)
        .update({ 
          password_hash: newPassword, // In production, hash this
          must_change_password: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        return { success: false, error: 'Failed to update password' };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Password change failed' };
    }
  }

  // Get current user (works for both admin and user)
  static async getCurrentUser(userId: string, userType: 'admin' | 'user'): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const table = userType === 'admin' ? 'admins' : 'users';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        return { user: null, error: 'User not found' };
      }

      return { user: { ...data, type: userType }, error: null };
    } catch (error) {
      return { user: null, error: 'Failed to get user' };
    }
  }

  // Logout (clear local storage)
  static async logout(): Promise<void> {
    // In a real app, you might want to call an API to invalidate tokens
    // For now, we'll just clear local storage
    try {
      // Clear any stored user data
      // This will be handled by the store
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
} 