import { create } from 'zustand';
import { AuthService, AuthState } from '../services/auth';

type AuthUser = AuthState['user'];

interface AuthStore extends AuthState {
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (userId: string, newPassword: string) => Promise<boolean>;
  setUser: (user: AuthUser) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, error } = await AuthService.login(username, password);
      
      if (error) {
        set({ error, isLoading: false });
        return;
      }

      set({ user, isLoading: false });
    } catch (error) {
      set({ error: 'Login failed', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await AuthService.logout();
      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Logout failed', isLoading: false });
    }
  },

  changePassword: async (userId: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const currentUser = get().user;
      if (!currentUser) {
        set({ error: 'No user logged in', isLoading: false });
        return false;
      }

      const { success, error } = await AuthService.changePassword(userId, newPassword, currentUser.type);
      
      if (error) {
        set({ error, isLoading: false });
        return false;
      }

      if (success) {
        // Update the user in the store to reflect the password change
        set({ 
          user: { ...currentUser, must_change_password: false },
          isLoading: false 
        });
      }

      set({ isLoading: false });
      return success;
    } catch (error) {
      set({ error: 'Password change failed', isLoading: false });
      return false;
    }
  },

  setUser: (user: AuthUser) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
})); 