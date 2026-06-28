import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { useTranslation } from 'react-i18next';

export default function HelpSupportScreen() {
    const { t } = useTranslation();
    const supportEmail = "support@jalma.com";

    const handleContactSupport = () => Linking.openURL(`mailto:${supportEmail}?subject=Support Request`);
    const handleReportBug = () => Linking.openURL(`mailto:${supportEmail}?subject=Bug Report`);

    const handleDeleteAccount = () => {
        Alert.alert(t('help.deleteAccount'), t('help.deleteAccountConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('help.delete'), style: 'destructive', onPress: () => {
                Alert.alert(t('help.accountDeleted'), t('help.accountDeletedMsg'), [
                    { text: t('common.ok'), onPress: () => router.replace('/login') }
                ]);
            }},
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Gradient header */}
            <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.iconRing}>
                        <MaterialIcons name="help-outline" size={32} color={Colors.white} />
                    </View>
                    <Text style={styles.headerTitle}>{t('help.title')}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Contact section */}
                <Text style={styles.sectionLabel}>{t('help.contactUs')}</Text>
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <View style={styles.cardIconBg}>
                            <MaterialIcons name="email" size={22} color="#1A73E8" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardLabel}>{t('help.supportEmail')}</Text>
                            <Text style={styles.cardValue}>{supportEmail}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleContactSupport} activeOpacity={0.85}>
                        <LinearGradient colors={['#1A73E8', '#0A4FAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtnGradient}>
                            <Text style={styles.actionBtnText}>{t('help.sendEmail')}</Text>
                            <MaterialIcons name="arrow-forward" size={16} color={Colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Bug report section */}
                <Text style={styles.sectionLabel}>{t('help.reportProblem')}</Text>
                <View style={styles.card}>
                    <Text style={styles.description}>{t('help.bugDescription')}</Text>
                    <TouchableOpacity style={styles.outlineBtn} onPress={handleReportBug} activeOpacity={0.85}>
                        <MaterialIcons name="bug-report" size={20} color="#1A73E8" />
                        <Text style={styles.outlineBtnText}>{t('help.reportBug')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Danger zone */}
                <Text style={[styles.sectionLabel, { color: Colors.statusRed }]}>{t('help.dangerZone')}</Text>
                <View style={[styles.card, { borderWidth: 1, borderColor: `${Colors.statusRed}25` }]}>
                    <Text style={styles.description}>{t('help.deleteWarning')}</Text>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount} activeOpacity={0.85}>
                        <LinearGradient colors={['#ef4444', '#dc2626']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.deleteBtnGradient}>
                            <MaterialIcons name="delete-forever" size={20} color={Colors.white} />
                            <Text style={styles.deleteBtnText}>{t('help.deleteMyAccount')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 28, overflow: 'hidden' },
    decorCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
    decorCircle2: { position: 'absolute', bottom: -20, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    headerContent: { alignItems: 'center', paddingTop: 12 },
    iconRing: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    content: { padding: 20, paddingBottom: 60, gap: 8 },
    sectionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.slate500, marginTop: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    card: { backgroundColor: Colors.white, borderRadius: 18, padding: 18, gap: 14, ...Shadows.card },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    cardIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(26,115,232,0.1)', alignItems: 'center', justifyContent: 'center' },
    cardLabel: { fontSize: FontSize.xs, color: Colors.slate400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    cardValue: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.slate800 },
    actionBtn: { borderRadius: 12, overflow: 'hidden', shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    actionBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, gap: 8 },
    actionBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },
    description: { fontSize: FontSize.sm, color: Colors.slate500, lineHeight: 20 },
    outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderWidth: 1.5, borderColor: '#1A73E8', borderRadius: 12 },
    outlineBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#1A73E8' },
    deleteBtn: { borderRadius: 12, overflow: 'hidden', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    deleteBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, gap: 8 },
    deleteBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },
});
