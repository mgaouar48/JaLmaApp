import React, { useState } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function TransporterForgotPasswordScreen() {
    const [phone, setPhone] = useState('');
    const { t } = useTranslation();

    const handleSendCode = () => {
        // Simulate sending OTP
        router.push({
            pathname: '/transporter-otp',
            params: { phone }
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient colors={['#0f172a', '#1e293b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.glowCircle} />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.headerIconRing}>
                        <MaterialIcons name="lock-reset" size={26} color="#22c55e" />
                    </View>
                    <Text style={styles.headerTitle}>{t('auth.forgotPasswordTitle')}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBg}>
                        <MaterialIcons name="lock-reset" size={48} color={Colors.primary} />
                    </View>
                </View>

                <Text style={styles.title}>{t('auth.resetTitle')}</Text>
                <Text style={styles.subtitle}>
                    {t('auth.resetSubtitle')}
                </Text>

                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.phoneNumber')}</Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryCodeText}>+213</Text>
                            </View>
                            <AppTextInput
                                icon="phone-iphone"
                                placeholder="6 00 00 00 00"
                                keyboardType="phone-pad"
                                containerStyle={{ flex: 1 }}
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                    </View>

                    <PrimaryButton
                        title={t('auth.sendCode')}
                        onPress={handleSendCode}
                        style={styles.submitButton}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 24, overflow: 'hidden' },
    glowCircle: { position: 'absolute', top: -30, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(34,197,94,0.08)' },
    backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    headerContent: { alignItems: 'center', paddingTop: 8, gap: 6 },
    headerIconRing: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    content: {
        paddingHorizontal: 32,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconBg: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: FontSize.base,
        color: Colors.textMuted,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    form: {
        width: '100%',
        gap: 24,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textMuted,
        marginLeft: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 12,
    },
    countryCode: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.slate200,
        ...Shadows.floatSm,
    },
    countryCodeText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    submitButton: {
        marginTop: 16,
    },
});
