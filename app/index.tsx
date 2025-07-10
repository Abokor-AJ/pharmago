import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function IndexPage() {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      // Redirect to login
      router.replace('/(auth)/login');
    } else if (user.must_change_password) {
      // Redirect to password change
      router.replace('/(auth)/change-password');
    } else {
      // Redirect to main app
      router.replace('/(tabs)');
    }
  }, [user]);

  // This component doesn't render anything, it just handles routing
  return null;
} 