import { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { PromoProvider } from '../src/context/PromoContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n, { loadSavedLanguage } from '../src/i18n';

/**
 * AuthGuard — watches only the session (not profile) so it can redirect
 * immediately after onAuthStateChange fires, without waiting for the profile
 * DB round-trip.  Role is read from session.user.user_metadata which Supabase
 * stores locally without an extra network call.
 */
function AuthGuard() {
    const { session, isLoading } = useAuth();
    const segments = useSegments();

    useEffect(() => {
        // Wait until Supabase has resolved the initial session check
        if (isLoading) return;

        const inClientArea = segments[0] === '(client)';
        const inTransporterArea = segments[0] === '(transporter)';
        const inProtectedRootScreen = [
            'order-config',
            'live-tracking',
            'active-delivery',
            'waiting-for-driver',
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

        if (session) {
            // Role is embedded in the JWT metadata — no extra DB call needed
            const role = session.user.user_metadata?.role;

            if (!inProtectedArea) {
                // Logged-in user is on a public screen (login, onboarding, etc.)
                // → send to their dashboard
                if (role === 'driver') {
                    router.replace('/(transporter)/home');
                } else {
                    router.replace('/(client)');
                }
            } else {
                // Already in protected area — ensure they're in the RIGHT area
                if (role === 'driver' && inClientArea) {
                    router.replace('/(transporter)/home');
                } else if (role !== 'driver' && inTransporterArea) {
                    router.replace('/(client)');
                }
            }
        } else if (!session && inProtectedArea) {
            // Logged-out user somehow in protected area → kick to login
            if (inTransporterArea) {
                router.replace('/transporter-login');
            } else {
                router.replace('/login');
            }
        }
        // No session + on public screen → stay (login, onboarding, index)
    }, [session, isLoading, segments]);

    return null;
}

/**
 * AppContent — rendered inside all providers so it can consume useAuth().
 * Shows a unified splash screen while EITHER the language pack OR the Supabase
 * session check is still loading.  Once both are ready, the Stack renders and
 * AuthGuard safely navigates to the correct screen without a flicker.
 */
function AppContent() {
    const { isLoading: authLoading } = useAuth();
    const [langReady, setLangReady] = useState(false);

    useEffect(() => {
        loadSavedLanguage().then(() => setLangReady(true));
    }, []);

    if (!langReady || authLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}
            >
                <ActivityIndicator size="large" color="#1A73E8" />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="dark" />
            {/* AuthGuard is a side-effect component — it returns null and
                handles all session-driven navigation imperatively. */}
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
                <Stack.Screen name="waiting-for-driver" options={{ animation: 'slide_from_bottom' }} />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <PromoProvider>
                    <AppContent />
                </PromoProvider>
            </AuthProvider>
        </I18nextProvider>
    );
}
