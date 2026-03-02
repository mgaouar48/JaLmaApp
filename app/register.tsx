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

export default function RegisterScreen() {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            Alert.alert(t('common.error'), t('auth.fillAllFields'));
            return;
        }
        if (password.length < 6) {
            Alert.alert(t('common.error'), t('auth.passwordTooShort'));
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    role: 'client',
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                },
            },
        });
        setLoading(false);

        if (error) {
            Alert.alert(t('common.error'), error.message);
            return;
        }
        // Session created immediately → AuthGuard routes to /(client) automatically
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
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <MaterialIcons name="water-drop" size={48} color={Colors.primaryLight} />
                    </View>
                    <Text style={styles.title}>{t('auth.registerTitle')}</Text>
                    <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.lastName')}</Text>
                        <AppTextInput
                            placeholder={t('auth.lastNamePlaceholder')}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.firstName')}</Text>
                        <AppTextInput
                            placeholder={t('auth.firstNamePlaceholder')}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <AppTextInput
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
                            placeholder="••••••••"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        {t('auth.termsPrefix')}
                        <Text style={styles.link}>{t('auth.termsOfUse')}</Text>{t('auth.termsAnd')}
                        <Text style={styles.link}>{t('auth.privacyPolicy')}</Text>.
                    </Text>

                    {/* Submit */}
                    <PrimaryButton
                        title={loading ? t('common.loading') : t('auth.register')}
                        icon="arrow-forward"
                        onPress={handleRegister}
                        disabled={loading}
                        style={{ borderRadius: BorderRadius.full }}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('auth.hasAccount')}{' '}</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.footerLink}>{t('auth.login')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },
    header: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
    logoCircle: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: `${Colors.primary}08`,
        alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.primary },
    subtitle: { fontSize: FontSize.sm, color: `${Colors.primary}99`, textAlign: 'center', marginTop: 8 },
    form: { gap: 20 },
    fieldGroup: { gap: 8 },
    label: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: `${Colors.primary}B3`, letterSpacing: 1, marginLeft: 4 },
    terms: { fontSize: 11, textAlign: 'center', color: `${Colors.primary}80`, paddingHorizontal: 16 },
    link: { color: Colors.primary, fontWeight: FontWeight.medium, textDecorationLine: 'underline' },
    footer: { flexDirection: 'row', justifyContent: 'center', paddingTop: 24, paddingBottom: 32 },
    footerText: { fontSize: FontSize.sm, color: `${Colors.primary}99` },
    footerLink: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
});
