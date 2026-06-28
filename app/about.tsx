import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { useTranslation } from 'react-i18next';

export default function AboutScreen() {
    const { t } = useTranslation();
    const appVersion = "1.0.0";
    const lastUpdateDate = "18 Février 2026";

    const handleOpenLink = (url: string) => Linking.openURL(url).catch(err => console.error("Couldn't load page", err));

    return (
        <View style={styles.container}>
            {/* Gradient header */}
            <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <View style={styles.heroContent}>
                    <View style={styles.logoRing}>
                        <View style={styles.logoInner}>
                            <MaterialIcons name="water-drop" size={40} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.appName}>Ja-Lma</Text>
                    <Text style={styles.tagline}>{t('about.tagline')}</Text>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {/* Version info */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBg}>
                            <MaterialIcons name="info-outline" size={18} color="#1A73E8" />
                        </View>
                        <Text style={styles.infoLabel}>{t('about.appVersion')}</Text>
                        <Text style={styles.infoValue}>{appVersion}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBg}>
                            <MaterialIcons name="update" size={18} color="#1A73E8" />
                        </View>
                        <Text style={styles.infoLabel}>{t('about.lastUpdate')}</Text>
                        <Text style={styles.infoValue}>{lastUpdateDate}</Text>
                    </View>
                </View>

                {/* Social */}
                <Text style={styles.sectionLabel}>{t('about.followUs')}</Text>
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.facebookBtn} onPress={() => handleOpenLink('https://facebook.com')} activeOpacity={0.85}>
                        <LinearGradient colors={['#1877F2', '#0c5bcb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.socialBtnGradient}>
                            <FontAwesome name="facebook" size={22} color={Colors.white} />
                            <Text style={styles.socialText}>Facebook</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.instagramBtn} onPress={() => handleOpenLink('https://instagram.com')} activeOpacity={0.85}>
                        <LinearGradient colors={['#E4405F', '#c62a47']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.socialBtnGradient}>
                            <FontAwesome name="instagram" size={22} color={Colors.white} />
                            <Text style={styles.socialText}>Instagram</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <Text style={styles.copyright}>{t('about.copyright')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    hero: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 36, overflow: 'hidden' },
    decorCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
    decorCircle2: { position: 'absolute', bottom: -20, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    heroContent: { alignItems: 'center', paddingTop: 8 },
    logoRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    logoInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    appName: { fontSize: 28, fontWeight: '800' as any, color: Colors.white, letterSpacing: 1 },
    tagline: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
    content: { flex: 1, padding: 20, gap: 14 },
    infoCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 18, gap: 4, ...Shadows.card },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
    infoIconBg: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(26,115,232,0.1)', alignItems: 'center', justifyContent: 'center' },
    infoLabel: { flex: 1, fontSize: FontSize.base, color: Colors.slate600, fontWeight: FontWeight.medium },
    infoValue: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: '#1A73E8' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 4 },
    sectionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.slate500, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    socialRow: { flexDirection: 'row', gap: 12 },
    facebookBtn: { flex: 1, borderRadius: 14, overflow: 'hidden', shadowColor: '#1877F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    instagramBtn: { flex: 1, borderRadius: 14, overflow: 'hidden', shadowColor: '#E4405F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    socialBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 10 },
    socialText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.base },
    copyright: { fontSize: FontSize.xs, color: Colors.slate400, textAlign: 'center', marginTop: 'auto', paddingVertical: 16 },
});
