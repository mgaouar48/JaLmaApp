import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

export default function TransporterRegisterScreen() {
    const [capacity, setCapacity] = useState<'2000 L' | '3000 L' | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleRegister = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !capacity) {
            Alert.alert(t('common.error'), t('auth.fillAllFields'));
            return;
        }
        if (password.length < 6) {
            Alert.alert(t('common.error'), t('auth.passwordTooShort'));
            return;
        }

        setLoading(true);

        // Sign up with role=driver
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    role: 'driver',
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                },
            },
        });

        if (error) {
            setLoading(false);
            Alert.alert(t('common.error'), error.message);
            return;
        }

        // Create the drivers table row (works even if email confirmation is pending)
        if (data.user) {
            const capacityLiters = parseInt(capacity.replace(' L', ''));
            await supabase.from('drivers').insert({
                id: data.user.id,
                tank_capacity_liters: capacityLiters,
                price_per_delivery: capacityLiters === 3000 ? 1500 : 1200,
                is_online: false,
                is_available: true,
            });
        }

        setLoading(false);
        // Session created immediately → AuthGuard routes to /(transporter)/home automatically
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Decorative blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Top nav */}
            <View style={styles.nav}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios-new" size={18} color={Colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>{t('auth.registration')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBg} />
                        <MaterialIcons name="water-drop" size={72} color={Colors.primary} />
                        <View style={styles.truckIconOverlay}>
                            <MaterialIcons name="local-shipping" size={28} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.title}>{t('transporter.becomeTransporter')}</Text>
                    <Text style={styles.subtitle}>{t('transporter.registerSubtitle')}</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.lastName')}</Text>
                        <AppTextInput icon="person" placeholder={t('auth.lastNamePlaceholder')} value={lastName} onChangeText={setLastName} />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.firstName')}</Text>
                        <AppTextInput icon="badge" placeholder={t('auth.firstNamePlaceholder')} value={firstName} onChangeText={setFirstName} />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <AppTextInput icon="email" placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.password')}</Text>
                        <AppTextInput icon="lock-outline" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('transporter.tankCapacity')}</Text>
                        <View style={styles.capacityRow}>
                            {(['2000 L', '3000 L'] as const).map((option) => {
                                const isSelected = capacity === option;
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.capacityOption, isSelected && styles.capacityOptionSelected]}
                                        onPress={() => setCapacity(option)}
                                        activeOpacity={0.8}
                                    >
                                        <MaterialIcons
                                            name="local-shipping"
                                            size={24}
                                            color={isSelected ? Colors.primary : Colors.slate400}
                                        />
                                        <Text style={[styles.capacityText, isSelected && styles.capacityTextSelected]}>
                                            {option}
                                        </Text>
                                        {isSelected && (
                                            <View style={styles.checkBadge}>
                                                <MaterialIcons name="check" size={12} color={Colors.white} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Terms */}
                    <View style={styles.termsRow}>
                        <View style={styles.checkbox} />
                        <Text style={styles.termsText}>
                            {t('auth.termsPrefix')}
                            <Text style={styles.termsLink}>{t('auth.termsOfUse')}</Text>{t('auth.termsAnd')}
                            <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomCta}>
                <PrimaryButton
                    title={loading ? t('common.loading') : t('common.next')}
                    icon="arrow-forward"
                    onPress={handleRegister}
                    disabled={loading}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    blob1: { position: 'absolute', top: -96, right: -96, width: 256, height: 256, borderRadius: 128, backgroundColor: `${Colors.primary}08` },
    blob2: { position: 'absolute', top: '50%', left: -128, width: 256, height: 256, borderRadius: 128, backgroundColor: `${Colors.accent}08` },
    nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 8 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.floatSm, borderWidth: 1, borderColor: Colors.slate100 },
    navTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 2, color: Colors.textMuted },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 },
    logoSection: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
    logoContainer: { width: 128, height: 128, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    logoBg: { ...StyleSheet.absoluteFillObject, backgroundColor: `${Colors.primary}08`, borderRadius: 64 },
    truckIconOverlay: { position: 'absolute', bottom: 20 },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textDark, textAlign: 'center', marginTop: 8 },
    subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginTop: 8, maxWidth: 280 },
    form: { gap: 20 },
    fieldGroup: { gap: 6 },
    label: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted, letterSpacing: 1, marginLeft: 4 },
    capacityRow: { flexDirection: 'row', gap: 12 },
    capacityOption: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md, paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.slate200, gap: 8, position: 'relative', ...Shadows.floatSm },
    capacityOptionSelected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}05`, borderWidth: 2 },
    capacityText: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.slate500 },
    capacityTextSelected: { color: Colors.primary, fontWeight: FontWeight.bold },
    checkBadge: { position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
    termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 4, marginTop: 8 },
    checkbox: {},
    termsText: { flex: 1, fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
    termsLink: { color: Colors.primary, fontWeight: FontWeight.bold },
    bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 32, paddingTop: 40, backgroundColor: Colors.backgroundLight },
});
