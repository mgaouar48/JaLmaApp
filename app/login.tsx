import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

export default function LoginScreen() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert(t('common.error'), t('auth.fillAllFields'));
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });
        setLoading(false);

        if (error) {
            Alert.alert(t('common.error'), error.message);
            return;
        }
        // Auth context will auto-route based on role
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header / Brand */}
                <View style={styles.brandSection}>
                    <View style={styles.logoCircle}>
                        <MaterialIcons name="water-drop" size={40} color={Colors.primary} />
                        <View style={styles.logoGradient} />
                    </View>
                    <Text style={styles.title}>{t('auth.welcomeTitle')}</Text>
                    <Text style={styles.subtitle}>{t('auth.welcomeSubtitle')}</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.emailOrPhone')}</Text>
                        <AppTextInput
                            icon="person-outline"
                            placeholder={t('auth.emailPlaceholder')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>{t('auth.password')}</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgotLink}>{t('auth.forgotPassword')}</Text>
                            </TouchableOpacity>
                        </View>
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

                    <View style={{ height: 16 }} />

                    {/* Submit */}
                    <PrimaryButton
                        title={loading ? t('common.loading') : t('auth.login')}
                        icon="arrow-forward"
                        onPress={handleLogin}
                        disabled={loading}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('auth.noAccount')}{' '}</Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.footerLink}>{t('auth.createAccount')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Transporter link */}
                <TouchableOpacity
                    style={styles.transporterLink}
                    onPress={() => router.push('/transporter-login')}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="local-shipping" size={24} color={Colors.primary} />
                    <Text style={styles.transporterLinkText}>{t('auth.transporterSpace')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scrollContent: { flexGrow: 1, paddingHorizontal: 32, paddingTop: 60, paddingBottom: 40 },
    brandSection: { alignItems: 'center', marginBottom: 32 },
    logoCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, overflow: 'hidden',
    },
    logoGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: `${Colors.primary}08` },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.slate900, marginBottom: 8 },
    subtitle: { fontSize: FontSize.sm, color: Colors.slate500 },
    form: { gap: 24 },
    fieldGroup: { gap: 8 },
    label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.slate700, marginLeft: 4 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    forgotLink: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primary },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingVertical: 24, borderTopWidth: 1, borderTopColor: Colors.slate100 },
    footerText: { fontSize: FontSize.sm, color: Colors.slate600 },
    footerLink: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
    transporterLink: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
        paddingVertical: 16, paddingHorizontal: 24, marginHorizontal: 24, marginBottom: 24,
        backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
        borderWidth: 2, borderColor: Colors.primary, ...Shadows.soft,
    },
    transporterLinkText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
});
