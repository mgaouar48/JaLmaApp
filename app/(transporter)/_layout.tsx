import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants';
import { useTranslation } from 'react-i18next';

export default function TransporterTabLayout() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.gray400,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.slate100,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    // Add bottom safe area inset to base padding
                    paddingBottom: 8 + insets.bottom,
                    // Add bottom safe area inset to base height (64)
                    height: 64 + insets.bottom,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -10 },
                    shadowOpacity: 0.1,
                    shadowRadius: 40,
                    elevation: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dashboard" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="missions"
                options={{
                    title: t('tabs.missions'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="list-alt" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="revenue"
                options={{
                    title: t('tabs.revenue'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="account-balance-wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
