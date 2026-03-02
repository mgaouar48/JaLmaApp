import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { PromoProvider } from '../src/context/PromoContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n, { loadSavedLanguage } from '../src/i18n';

// After login/logout, route based on role
function AuthGuard() {
    const { session, profile, loading } = useAuth();

    useEffect(() => {
        if (loading) return; // Wait for auth to resolve
        if (session && profile) {
            // Authenticated — route to the correct home
            if (profile.role === 'driver') {
                router.replace('/(transporter)/home');
            } else {
                router.replace('/(client)');
            }
        }
        // If no session, stay on current screen (index → onboarding → login flow)
    }, [session, profile, loading]);

    return null; // This component only handles side-effects
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
                        <Stack.Screen name="rating" />
                        <Stack.Screen name="new-mission" />
                    </Stack>
                </PromoProvider>
            </AuthProvider>
        </I18nextProvider>
    );
}
