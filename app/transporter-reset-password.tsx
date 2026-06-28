import React, { useState } from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function TransporterResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();

    const handleReset = () => {
        if (password !== confirmPassword) {
            Alert.alert(t('common.error'), t('auth.passwordsMismatch'));
            return;
        }
        Alert.alert(t('common.success'), t('auth.passwordResetSuccess'), [
            {
                text: t('common.ok'),
                onPress: () => {
                    router.dismissAll();
                    router.replace('/transporter-login');
                },
            },
        ]);
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
                <Text style={styles.headerTitle}>{t('auth.newPasswordTitle')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBg}>
                        <MaterialIcons name="lock" size={48} color={Colors.primary} />
                    </View>
                </View>

                <Text style={styles.title}>{t('auth.secureAccount')}</Text>
                <Text style={styles.subtitle}>
                    {t('auth.newPasswordSubtitle')}
                </Text>

                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.newPassword')}</Text>
                        <AppTextInput
                            icon="lock-outline"
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? 'visibility' : 'visibility-off'}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.confirmPassword')}</Text>
                        <AppTextInput
                            icon="lock-outline"
                            placeholder="••••••••"
                            secureTextEntry={!showConfirmPassword}
                            rightIcon={showConfirmPassword ? 'visibility' : 'visibility-off'}
                            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    <PrimaryButton
                        title={t('common.confirm')}
                        onPress={handleReset}
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
    submitButton: {
        marginTop: 16,
    },
});
