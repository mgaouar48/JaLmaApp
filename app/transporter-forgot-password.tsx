import React, { useState } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios-new" size={20} color={Colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('auth.forgotPasswordTitle')}</Text>
                <View style={{ width: 40 }} />
            </View>

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
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
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
