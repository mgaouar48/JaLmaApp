import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    const [docsSubmitted, setDocsSubmitted] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('docs_submitted').then(val => setDocsSubmitted(val === 'true')).catch(() => {});
    }, []);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];
    const displayName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || t('transporter.driver') : t('transporter.driver');

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === i18n.language) { setLangModalVisible(false); return; }
        setLangModalVisible(false);
        const needsReload = await changeLanguage(langCode);
        if (needsReload) Alert.alert(t('lang.title'), t('lang.changeLangRestart'));
    };

    const menuItems = [
        { icon: 'edit' as const, label: t('profile.editProfile'), action: () => router.push('/transporter-edit-profile'), badge: false },
        { icon: 'description' as const, label: t('profile.myDocuments'), action: () => router.push('/my-documents'), badge: !docsSubmitted },
        { icon: 'notifications' as const, label: t('profile.notifications'), badge: !docsSubmitted, action: () => router.push('/notifications') },
        { icon: 'language' as const, label: `${t('profile.language')} (${currentLang.flag} ${currentLang.label})`, action: () => setLangModalVisible(true), badge: false },
        { icon: 'help-outline' as const, label: t('profile.helpSupport'), action: () => router.push('/help-support'), badge: false },
    ];

    return (
        <View style={styles.container}>
            {/* Dark gradient header */}
            <LinearGradient colors={['#0f172a', '#1e293b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.glowCircle} />
                <View style={styles.decorCircle1} />
                <View style={styles.headerContent}>
                    <View style={styles.avatarRingOuter}>
                        <View style={styles.avatarRingInner}>
                            <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.avatarGradient}>
                                <MaterialIcons name="person" size={36} color={Colors.white} />
                            </LinearGradient>
                        </View>
                    </View>
                    <Text style={styles.name}>{displayName}</Text>
                    <View style={styles.roleBadge}>
                        <MaterialIcons name="local-shipping" size={12} color="#22c55e" />
                        <Text style={styles.roleText}>{t('profile.transporterRole', { capacity: '5000' })}</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.menuCard}>
                    {menuItems.map((item, i) => (
                        <TouchableOpacity key={i} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]} onPress={item.action} activeOpacity={0.7}>
                            <View style={styles.menuIconBg}>
                                <MaterialIcons name={item.icon} size={20} color="#22c55e" />
                                {item.badge && <View style={styles.badgeDot} />}
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            {item.badge && (
                                <View style={styles.badgePill}>
                                    <Text style={styles.badgePillText}>1</Text>
                                </View>
                            )}
                            <MaterialIcons name="chevron-right" size={20} color={Colors.slate300} />
                        </TouchableOpacity>
                    ))}
                </View>

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
                                    {lang.code === i18n.language && <MaterialIcons name="check-circle" size={20} color="#22c55e" />}
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
    glowCircle: { position: 'absolute', top: -30, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(34,197,94,0.08)' },
    decorCircle1: { position: 'absolute', top: -20, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.03)' },
    headerContent: { alignItems: 'center', paddingTop: 8 },
    avatarRingOuter: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarRingInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center' },
    avatarGradient: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white, marginBottom: 8 },
    roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(34,197,94,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
    roleText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: '#4ade80' },
    content: { padding: 20, paddingBottom: 60, gap: 16 },
    menuCard: { backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden', ...Shadows.card },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 14 },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    menuIconBg: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center' },
    menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.slate800 },
    badgeDot: { position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.statusRed, borderWidth: 2, borderColor: Colors.white },
    badgePill: { backgroundColor: Colors.statusRed, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginRight: 4 },
    badgePillText: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white },
    logoutBtn: { borderRadius: 16, overflow: 'hidden' },
    logoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
    logoutText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.statusRed },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.slate200, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.slate900, textAlign: 'center', marginBottom: 20 },
    langOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, gap: 12, marginBottom: 8 },
    langOptionActive: { backgroundColor: 'rgba(34,197,94,0.08)' },
    langFlag: { fontSize: 24 },
    langLabel: { flex: 1, fontSize: FontSize.lg, fontWeight: FontWeight.medium, color: Colors.slate700 },
    langLabelActive: { color: '#22c55e', fontWeight: FontWeight.bold },
});
