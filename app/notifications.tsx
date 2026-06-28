import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
    id: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
    iconBg: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    action?: () => void;
}

export default function NotificationsScreen() {
    const { t } = useTranslation();
    const [docsSubmitted, setDocsSubmitted] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('docs_submitted').then(val => {
            setDocsSubmitted(val === 'true');
        }).catch(() => { });
    }, []);

    const notifications: Notification[] = [
        // Always show document reminder if not submitted
        ...(!docsSubmitted ? [{
            id: 'docs_reminder',
            icon: 'folder-open' as const,
            iconColor: Colors.warning,
            iconBg: `${Colors.warning}18`,
            title: t('notifications.docsReminderTitle'),
            message: t('notifications.docsReminderMessage'),
            time: t('notifications.now'),
            read: false,
            action: () => router.push('/my-documents'),
        }] : []),
        // Welcome notification
        {
            id: 'welcome',
            icon: 'celebration' as const,
            iconColor: Colors.primary,
            iconBg: `${Colors.primary}12`,
            title: t('notifications.welcomeTitle'),
            message: t('notifications.welcomeMessage'),
            time: t('notifications.today'),
            read: true,
        },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
                    {unreadCount > 0 && (
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <MaterialIcons name="notifications-none" size={48} color={Colors.slate300} />
                        </View>
                        <Text style={styles.emptyTitle}>{t('notifications.emptyTitle')}</Text>
                        <Text style={styles.emptySubtitle}>{t('notifications.emptySubtitle')}</Text>
                    </View>
                ) : (
                    <View style={styles.notifList}>
                        {notifications.map((notif) => (
                            <TouchableOpacity
                                key={notif.id}
                                style={[
                                    styles.notifCard,
                                    !notif.read && styles.notifCardUnread,
                                ]}
                                onPress={notif.action}
                                activeOpacity={notif.action ? 0.7 : 1}
                            >
                                {!notif.read && <View style={styles.unreadIndicator} />}
                                <View style={[styles.notifIconBg, { backgroundColor: notif.iconBg }]}>
                                    <MaterialIcons name={notif.icon} size={24} color={notif.iconColor} />
                                </View>
                                <View style={styles.notifContent}>
                                    <Text style={[
                                        styles.notifTitle,
                                        !notif.read && styles.notifTitleUnread,
                                    ]}>{notif.title}</Text>
                                    <Text style={styles.notifMessage}>{notif.message}</Text>
                                    <Text style={styles.notifTime}>{notif.time}</Text>
                                </View>
                                {notif.action && (
                                    <MaterialIcons name="chevron-right" size={20} color={Colors.slate400} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    headerBadge: {
        backgroundColor: Colors.statusRed,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    headerBadgeText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.slate100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        textAlign: 'center',
    },
    // Notification list
    notifList: {
        gap: 10,
    },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 16,
        gap: 14,
        ...Shadows.soft,
    },
    notifCardUnread: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    unreadIndicator: {
        position: 'absolute',
        top: 16,
        left: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    notifIconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifContent: {
        flex: 1,
        gap: 4,
    },
    notifTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.slate800,
    },
    notifTitleUnread: {
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    notifMessage: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        lineHeight: 18,
    },
    notifTime: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        marginTop: 2,
    },
});
