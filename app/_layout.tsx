import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark" />
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
        </>
    );
}
