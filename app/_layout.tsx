import { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { PromoProvider } from '../src/context/PromoContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n, { loadSavedLanguage } from '../src/i18n';

// After login/logout, route based on role — only if not already on the right screen
function AuthGuard() {
    const { session, profile, loading } = useAuth();
    const segments = useSegments();

    useEffect(() => {
        if (loading) return;

        const inClientArea = segments[0] === '(client)';
        const inTransporterArea = segments[0] === '(transporter)';
        // Also include root-level screens that require authentication
        const inProtectedRootScreen = [
            'order-config',
            'live-tracking',
            'active-delivery',
            'new-mission',
            'rating',
            'edit-profile',
            'transporter-edit-profile',
            'help-support',
            'about',
            'my-documents',
            'notifications',
            'promos',
        ].includes(segments[0] ?? '');
        const inProtectedArea = inClientArea || inTransporterArea || inProtectedRootScreen;

        if (session && profile && !inProtectedArea) {
            // Logged in but not yet on the right screen — redirect once
            if (profile.role === 'driver') {
                router.replace('/(transporter)/home');
            } else {
                router.replace('/(client)');
            }
        } else if (!session && inProtectedArea) {
            // Logged out but still in protected area — redirect to login
            if (inTransporterArea) {
                router.replace('/transporter-login');
            } else {
                router.replace('/login');
            }
        }
        // No session → stay on the public screens (splash, onboarding, login)
    }, [session, profile, loading, segments]);

    return null;
}

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        loadSavedLanguage().then(() => setIsReady(true));
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#1A73E8" />
            </View>
        );
    }

    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <PromoProvider>
                    <StatusBar style="dark" />
                    {/* AuthGuard watches session and routes after login */}
                    <AuthGuard />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: 'slide_from_right',
                        }}
                    >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="onboarding" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="register" />
                        <Stack.Screen name="transporter-login" />
                        <Stack.Screen name="transporter-register" />
                        <Stack.Screen name="(client)" options={{ headerShown: false }} />
                        <Stack.Screen name="(transporter)" options={{ headerShown: false }} />
                        <Stack.Screen name="order-config" />
                        <Stack.Screen name="live-tracking" />
                        <Stack.Screen name="active-delivery" />
                        <Stack.Screen name="rating" />
                        <Stack.Screen name="new-mission" />
                        <Stack.Screen name="edit-profile" />
                        <Stack.Screen name="transporter-edit-profile" />
                        <Stack.Screen name="help-support" />
                        <Stack.Screen name="about" />
                        <Stack.Screen name="my-documents" />
                        <Stack.Screen name="notifications" />
                        <Stack.Screen name="promos" />
                        <Stack.Screen name="transporter-forgot-password" />
                        <Stack.Screen name="transporter-otp" />
                        <Stack.Screen name="transporter-reset-password" />
                    </Stack>
                </PromoProvider>
            </AuthProvider>
        </I18nextProvider>
    );
}
