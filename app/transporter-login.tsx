import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

export default function TransporterLoginScreen() {
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
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });
        setLoading(false);

        if (error) {
            Alert.alert(t('common.error'), error.message);
            return;
        }

        // Read role from auth metadata (no extra DB call, no RLS timing issue)
        const role = data.user?.user_metadata?.role;
        if (role !== 'driver') {
            await supabase.auth.signOut();
            Alert.alert(
                t('common.error'),
                t('auth.notADriver') || 'Ce compte n\'est pas un compte transporteur.'
            );
            return;
        }

        router.replace('/(transporter)/home');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoOuter}>
                        <View style={styles.logoDroplet}>
                            <MaterialIcons name="local-shipping" size={36} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.title}>{t('auth.transporterLogin')}</Text>
                    <Text style={styles.subtitle}>{t('auth.transporterSubtitle')}</Text>
                </View>

                {/* TEST CREDENTIALS */}
                <TouchableOpacity 
                    style={styles.testContainer} 
                    onPress={() => {
                        setEmail('driver-test@gmail.com');
                        setPassword('password123');
                    }}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="local-shipping" size={20} color={Colors.primary} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.testTitle}>{t('auth.testTransporterTitle')}</Text>
                        <Text style={styles.testText}>{t('auth.testEmail')}: driver-test@gmail.com</Text>
                        <Text style={styles.testText}>{t('auth.testPassword')}: password123</Text>
                    </View>
                </TouchableOpacity>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <AppTextInput
                            icon="email"
                            placeholder="email@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.password')}</Text>
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

                    <TouchableOpacity
                        style={styles.forgotRow}
                        onPress={() => router.push('/transporter-forgot-password')}
                    >
                        <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                    </TouchableOpacity>

                    <PrimaryButton
                        title={loading ? t('common.loading') : t('auth.login')}
                        icon="arrow-forward"
                        onPress={handleLogin}
                        disabled={loading}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('auth.noAccountYet')}</Text>
                    <TouchableOpacity onPress={() => router.push('/transporter-register')}>
                        <Text style={styles.footerLink}>{t('auth.becomeTransporter')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scrollContent: { flexGrow: 1, paddingHorizontal: 32, paddingTop: 56, paddingBottom: 32 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoOuter: {
        width: 128, height: 128, borderRadius: 64,
        backgroundColor: `${Colors.primary}08`,
        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    logoDroplet: {
        width: 80, height: 80, backgroundColor: Colors.primary,
        borderTopRightRadius: 40, borderBottomRightRadius: 40, borderBottomLeftRadius: 40,
        transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.primary },
    subtitle: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.slate500, marginTop: 4 },
    testContainer: {
        backgroundColor: `${Colors.primary}15`,
        padding: 16,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: `${Colors.primary}50`,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    testTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.slate800, marginBottom: 4 },
    testText: { fontSize: FontSize.xs, color: Colors.slate600 },
    form: { gap: 24, flex: 1 },
    fieldGroup: { gap: 8 },
    label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.slate700, marginLeft: 4 },
    forgotRow: { alignItems: 'flex-end' },
    forgotText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: `${Colors.primary}CC` },
    footer: { marginTop: 'auto', paddingTop: 32, borderTopWidth: 1, borderTopColor: Colors.slate100, alignItems: 'center', gap: 8 },
    footerText: { fontSize: FontSize.sm, color: Colors.slate500 },
    footerLink: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.primary },
});
