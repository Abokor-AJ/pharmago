import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ChangePasswordScreen from '../../components/ChangePasswordScreen';
import { useAuthStore } from '../../store/authStore';

export default function ChangePasswordPage() {
  const { user } = useAuthStore();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }

    // If user doesn't need to change password, redirect to main app
    if (!user.must_change_password) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handlePasswordChanged = () => {
    // Navigate to appropriate dashboard based on user role
    switch (user?.role) {
      case 'admin':
        router.replace('/(tabs)');
        break;
      case 'pharmacy':
        router.replace('/(tabs)');
        break;
      case 'delivery':
        router.replace('/(tabs)');
        break;
      case 'customer':
        router.replace('/(tabs)');
        break;
      default:
        router.replace('/(tabs)');
    }
  };

  // Don't render if user is not logged in or doesn't need password change
  if (!user || !user.must_change_password) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ChangePasswordScreen onPasswordChanged={handlePasswordChanged} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 