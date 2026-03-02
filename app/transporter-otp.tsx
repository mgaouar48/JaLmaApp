import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function TransporterOtpScreen() {
    const { phone } = useLocalSearchParams();
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(59);
    const { t } = useTranslation();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVerify = () => {
        // Simulate OTP verification
        router.push('/transporter-reset-password');
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
                <Text style={styles.headerTitle}>{t('auth.verificationTitle')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBg}>
                        <MaterialIcons name="sms" size={48} color={Colors.primary} />
                    </View>
                </View>

                <Text style={styles.title}>{t('auth.verificationCode')}</Text>
                <Text style={styles.subtitle}>
                    {t('auth.codeSentTo')}{phone || '6 00 00 00 00'}.
                </Text>

                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <AppTextInput
                            placeholder="• • • • • •"
                            keyboardType="number-pad"
                            value={code}
                            onChangeText={setCode}
                            maxLength={6}
                            style={styles.otpInput}
                            textAlign="center"
                        />
                    </View>

                    <View style={styles.timerRow}>
                        <Text style={styles.timerText}>
                            {t('auth.resendCodeIn')}{timer < 10 ? `00:0${timer}` : `00:${timer}`}
                        </Text>
                        {timer === 0 && (
                            <TouchableOpacity onPress={() => setTimer(59)}>
                                <Text style={styles.resendLink}>{t('auth.resend')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <PrimaryButton
                        title={t('auth.verify')}
                        onPress={handleVerify}
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
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
        gap: 24,
    },
    fieldGroup: {
        gap: 8,
    },
    otpInput: {
        fontSize: 24,
        letterSpacing: 8,
        fontWeight: 'bold',
        paddingVertical: 16,
    },
    timerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    timerText: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
    },
    resendLink: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    submitButton: {
        marginTop: 16,
    },
});
