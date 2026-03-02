import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Linking, Image, Platform
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { useTranslation } from 'react-i18next';

export default function AboutScreen() {
    const { t } = useTranslation();
    // Placeholder data
    const appVersion = "1.0.0";
    const lastUpdateDate = "18 Février 2026";

    const handleOpenLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('about.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Brand / Logo Area */}
                <View style={styles.brandSection}>
                    <View style={styles.logoContainer}>
                        <MaterialIcons name="water-drop" size={64} color={Colors.white} />
                    </View>
                    <Text style={styles.appName}>Ja-Lma</Text>
                    <Text style={styles.appTagline}>{t('about.tagline')}</Text>
                </View>

                {/* App Info */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{t('about.appVersion')}</Text>
                        <Text style={styles.infoValue}>{appVersion}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{t('about.lastUpdate')}</Text>
                        <Text style={styles.infoValue}>{lastUpdateDate}</Text>
                    </View>
                </View>

                {/* Social Media */}
                <Text style={styles.sectionTitle}>{t('about.followUs')}</Text>
                <View style={styles.socialRow}>
                    <TouchableOpacity
                        style={[styles.socialBtn, styles.facebookBtn]}
                        onPress={() => handleOpenLink('https://facebook.com')}
                    >
                        <FontAwesome name="facebook" size={24} color={Colors.white} />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialBtn, styles.instagramBtn]}
                        onPress={() => handleOpenLink('https://instagram.com')}
                    >
                        <FontAwesome name="instagram" size={24} color={Colors.white} />
                        <Text style={styles.socialText}>Instagram</Text>
                    </TouchableOpacity>
                </View>

                {/* Legal / Credits */}
                <View style={styles.footer}>
                    <Text style={styles.copyright}>{t('about.copyright')}</Text>
                </View>
            </View>
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
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...Shadows.float,
    },
    appName: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.primary,
        marginBottom: 8,
    },
    appTagline: {
        fontSize: FontSize.base,
        color: Colors.slate500,
    },
    infoCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 20,
        marginBottom: 32,
        ...Shadows.card,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: FontSize.base,
        color: Colors.slate600,
        fontWeight: FontWeight.medium,
    },
    infoValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.slate100,
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    socialRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 16,
        marginBottom: 40,
    },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: BorderRadius.md,
        gap: 10,
        ...Shadows.floatSm,
    },
    facebookBtn: {
        backgroundColor: '#1877F2',
    },
    instagramBtn: {
        backgroundColor: '#E4405F',
    },
    socialText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: FontSize.base,
    },
    footer: {
        marginTop: 'auto',
    },
    copyright: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        textAlign: 'center',
    },
});
