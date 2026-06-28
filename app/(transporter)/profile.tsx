import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../src/i18n';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function TransporterProfileScreen() {
    const { t, i18n } = useTranslation();
    const { profile, signOut } = useAuth();
    const [langModalVisible, setLangModalVisible] = useState(false);
    const [docsSubmitted, setDocsSubmitted] = useState(true); // assume true until checked

    // Check if documents have been submitted
    useEffect(() => {
        AsyncStorage.getItem('docs_submitted').then(val => {
            setDocsSubmitted(val === 'true');
        }).catch(() => { });
    }, []);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const displayName = profile
        ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || t('transporter.driver')
        : t('transporter.driver');

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === i18n.language) {
            setLangModalVisible(false);
            return;
        }

        setLangModalVisible(false);
        const needsReload = await changeLanguage(langCode);
        if (needsReload) {
            Alert.alert(
                t('lang.title'),
                t('lang.changeLangRestart'),
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('profile.title')}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.avatar}>
                    <MaterialIcons name="person" size={48} color={Colors.white} />
                </View>
                <Text style={styles.name}>{displayName}</Text>
                <Text style={styles.role}>{t('profile.transporterRole', { capacity: '5000' })}</Text>

                <View style={styles.menuList}>
                    {[
                        { icon: 'edit' as const, label: t('profile.editProfile'), action: () => router.push('/transporter-edit-profile') },
                        { icon: 'description' as const, label: t('profile.myDocuments'), action: () => router.push('/my-documents'), badge: !docsSubmitted },
                        { icon: 'notifications' as const, label: t('profile.notifications'), badge: !docsSubmitted, action: () => router.push('/notifications') },
                        { icon: 'language' as const, label: `${t('profile.language')} (${currentLang.flag} ${currentLang.label})`, action: () => setLangModalVisible(true) },
                        { icon: 'help-outline' as const, label: t('profile.helpSupport'), action: () => router.push('/help-support') },
                    ].map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={item.action}
                        >
                            <View style={styles.menuIconBg}>
                                <MaterialIcons name={item.icon} size={20} color={Colors.primary} />
                                {item.badge && (
                                    <View style={styles.badgeDot} />
                                )}
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            {item.badge && (
                                <View style={styles.badgePill}>
                                    <Text style={styles.badgePillText}>1</Text>
                                </View>
                            )}
                            <MaterialIcons name="chevron-right" size={20} color={Colors.slate400} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={signOut}
                >
                    <MaterialIcons name="logout" size={20} color={Colors.statusRed} />
                    <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                </TouchableOpacity>
            </View>

            {/* Language Picker Modal */}
            <Modal
                visible={langModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setLangModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setLangModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{t('lang.title')}</Text>
                            {LANGUAGES.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.langOption,
                                        lang.code === i18n.language && styles.langOptionActive,
                                    ]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                >
                                    <Text style={styles.langFlag}>{lang.flag}</Text>
                                    <Text style={[
                                        styles.langLabel,
                                        lang.code === i18n.language && styles.langLabelActive,
                                    ]}>
                                        {lang.label}
                                    </Text>
                                    {lang.code === i18n.language && (
                                        <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
    },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary },
    content: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 24 },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, ...Shadows.float,
    },
    name: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.primary, marginBottom: 4 },
    role: { fontSize: FontSize.sm, color: Colors.slate500, marginBottom: 32 },
    menuList: {
        width: '100%', gap: 4,
        backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
        padding: 8, ...Shadows.soft,
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 12, gap: 12,
    },
    menuIconBg: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.slate800 },
    badgeDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.statusRed,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    badgePill: {
        backgroundColor: Colors.statusRed,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        marginRight: 4,
    },
    badgePillText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    logoutButton: {
        flexDirection: 'row', alignItems: 'center',
        gap: 8, marginTop: 32,
        paddingVertical: 12, paddingHorizontal: 24,
        borderRadius: BorderRadius.lg, backgroundColor: Colors.red50,
    },
    logoutText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.statusRed },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 24,
        ...Shadows.float,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: BorderRadius.lg,
        gap: 12,
        marginBottom: 8,
    },
    langOptionActive: {
        backgroundColor: `${Colors.primary}10`,
    },
    langFlag: {
        fontSize: 24,
    },
    langLabel: {
        flex: 1,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: Colors.slate700,
    },
    langLabelActive: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
});
