import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../src/i18n';
import { useAuth } from '../../src/context/AuthContext';

const LANGUAGES = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function ProfileScreen() {
    const { t, i18n } = useTranslation();
    const { profile, signOut } = useAuth();
    const [langModalVisible, setLangModalVisible] = useState(false);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];
    const displayName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || t('profile.noName') : '';
    const displayEmail = profile?.email ?? '';

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === i18n.language) { setLangModalVisible(false); return; }
        setLangModalVisible(false);
        const needsReload = await changeLanguage(langCode);
        if (needsReload) Alert.alert(t('lang.title'), t('lang.changeLangRestart'));
    };

    const menuItems = [
        { icon: 'edit' as const, label: t('profile.editProfile'), action: () => router.push('/edit-profile') },
        { icon: 'notifications' as const, label: t('profile.notifications') },
        { icon: 'language' as const, label: `${t('profile.language')} (${currentLang.flag} ${currentLang.label})`, action: () => setLangModalVisible(true) },
        { icon: 'help-outline' as const, label: t('profile.helpSupport'), action: () => router.push('/help-support') },
        { icon: 'info-outline' as const, label: t('profile.about'), action: () => router.push('/about') },
    ];

    return (
        <View style={styles.container}>
            {/* Gradient header */}
            <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <View style={styles.headerContent}>
                    {/* Avatar */}
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={40} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.email}>{displayEmail}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Menu */}
                <View style={styles.menuCard}>
                    {menuItems.map((item, i) => (
                        <TouchableOpacity key={i} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]} onPress={item.action} activeOpacity={0.7}>
                            <View style={styles.menuIconBg}>
                                <MaterialIcons name={item.icon} size={20} color="#1A73E8" />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <MaterialIcons name="chevron-right" size={20} color={Colors.slate300} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.85}>
                    <LinearGradient colors={['#fee2e2', '#fecaca']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoutGradient}>
                        <MaterialIcons name="logout" size={20} color={Colors.statusRed} />
                        <Text style={styles.logoutText}>{t('profile.logout')}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* Language Modal */}
            <Modal visible={langModalVisible} transparent animationType="slide" onRequestClose={() => setLangModalVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHandle} />
                            <Text style={styles.modalTitle}>{t('lang.title')}</Text>
                            {LANGUAGES.map((lang) => (
                                <TouchableOpacity key={lang.code} style={[styles.langOption, lang.code === i18n.language && styles.langOptionActive]} onPress={() => handleLanguageChange(lang.code)}>
                                    <Text style={styles.langFlag}>{lang.flag}</Text>
                                    <Text style={[styles.langLabel, lang.code === i18n.language && styles.langLabelActive]}>{lang.label}</Text>
                                    {lang.code === i18n.language && <MaterialIcons name="check-circle" size={20} color="#1A73E8" />}
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
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'ios' ? 56 : 44, paddingBottom: 32, overflow: 'hidden' },
    decorCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
    decorCircle2: { position: 'absolute', bottom: -20, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' },
    headerContent: { alignItems: 'center', paddingTop: 8 },
    avatarRing: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white, marginBottom: 4 },
    email: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
    content: { padding: 20, paddingBottom: 60, gap: 16 },
    menuCard: { backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden', ...Shadows.card },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 14 },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    menuIconBg: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(26,115,232,0.1)', alignItems: 'center', justifyContent: 'center' },
    menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.slate800 },
    logoutBtn: { borderRadius: 16, overflow: 'hidden' },
    logoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
    logoutText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.statusRed },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.slate200, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.slate900, textAlign: 'center', marginBottom: 20 },
    langOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, gap: 12, marginBottom: 8 },
    langOptionActive: { backgroundColor: 'rgba(26,115,232,0.08)' },
    langFlag: { fontSize: 24 },
    langLabel: { flex: 1, fontSize: FontSize.lg, fontWeight: FontWeight.medium, color: Colors.slate700 },
    langLabelActive: { color: '#1A73E8', fontWeight: FontWeight.bold },
});
