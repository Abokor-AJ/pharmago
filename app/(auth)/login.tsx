import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from '../../components/LoginScreen';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const { user } = useAuthStore();

  useEffect(() => {
    // If user is logged in, check if they need to change password
    if (user) {
      if (user.must_change_password) {
        router.replace('/(auth)/change-password');
      } else {
        // Navigate to appropriate dashboard based on user type and role
        if (user.type === 'admin') {
          router.replace('/(tabs)');
        } else {
          // For regular users, navigate based on role
          switch (user.role) {
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
        }
      }
    }
  }, [user]);

  const handleLoginSuccess = () => {
    // The useEffect above will handle navigation
  };

  return (
    <View style={styles.container}>
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 