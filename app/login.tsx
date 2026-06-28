import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
    Platform, Alert, Animated, Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';
import { ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Entry animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(logoScale, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

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
        if (error) Alert.alert(t('common.error'), error.message);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Hero gradient background */}
            <LinearGradient
                colors={['#0A4FAD', '#1565C0', '#1A73E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBackground}
            >
                {/* Decorative circles */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <View style={styles.decorCircle3} />

                {/* Logo + Brand */}
                <Animated.View style={[styles.heroContent, { transform: [{ scale: logoScale }], opacity: fadeAnim }]}>
                    <View style={styles.logoRing}>
                        <View style={styles.logoInner}>
                            <MaterialIcons name="water-drop" size={40} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.appName}>Ja-Lma</Text>
                    <Text style={styles.heroTagline}>{t('auth.welcomeSubtitle')}</Text>
                </Animated.View>
            </LinearGradient>

            {/* Card */}
            <Animated.View style={[
                styles.card,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.cardScroll}
                >
                    <Text style={styles.cardTitle}>{t('auth.welcomeTitle')}</Text>
                    <Text style={styles.cardSubtitle}>{t('auth.welcomeSubtitle')}</Text>

                    {/* Quick-fill test button */}
                    <TouchableOpacity
                        style={styles.testChip}
                        onPress={() => { setEmail('jkdn488@gmail.com'); setPassword('test123'); }}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="bolt" size={15} color="#f59e0b" />
                        <Text style={styles.testChipText}>{t('auth.testClientTitle')} — tap to fill</Text>
                    </TouchableOpacity>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.emailOrPhone')}</Text>
                        <AppTextInput
                            icon="email"
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

                    {/* Login button */}
                    <TouchableOpacity
                        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['#1A73E8', '#0A4FAD']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.loginBtnGradient}
                        >
                            {loading
                                ? <Text style={styles.loginBtnText}>{t('common.loading')}</Text>
                                : <>
                                    <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                                    <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
                                </>
                            }
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Register link */}
                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>{t('auth.noAccount')} </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.registerLink}>{t('auth.createAccount')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    <View style={styles.separator}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>ou</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* Transporter CTA — gradient banner */}
                    <TouchableOpacity
                        onPress={() => router.push('/transporter-login')}
                        activeOpacity={0.88}
                        style={styles.transporterCard}
                    >
                        <LinearGradient
                            colors={['#0f172a', '#1e293b']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.transporterCardGradient}
                        >
                            <View style={styles.transporterIconCircle}>
                                <MaterialIcons name="local-shipping" size={24} color="#22c55e" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.transporterCardTitle}>{t('auth.transporterSpace')}</Text>
                                <Text style={styles.transporterCardSub}>Ja-Lma Pro — accès livreur</Text>
                            </View>
                            <View style={styles.transporterArrow}>
                                <MaterialIcons name="arrow-forward" size={18} color="#22c55e" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const CARD_TOP = height * 0.33;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A4FAD' },

    // Hero
    heroBackground: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: CARD_TOP + 40,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute', top: -60, right: -60,
        width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    decorCircle2: {
        position: 'absolute', top: 40, left: -80,
        width: 180, height: 180, borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    decorCircle3: {
        position: 'absolute', bottom: -20, right: 40,
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    heroContent: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 56 : 40,
    },
    logoRing: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
    },
    logoInner: {
        width: 68, height: 68, borderRadius: 34,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center', justifyContent: 'center',
    },
    appName: {
        fontSize: 32, fontWeight: '800' as any,
        color: Colors.white, letterSpacing: 1,
    },
    heroTagline: {
        fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)',
        fontWeight: FontWeight.medium, marginTop: 4,
    },

    // Card
    card: {
        position: 'absolute', top: CARD_TOP,
        left: 0, right: 0, bottom: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        ...Shadows.float,
    },
    cardScroll: {
        paddingHorizontal: 28, paddingTop: 32, paddingBottom: 40, gap: 16,
    },
    cardTitle: {
        fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold,
        color: Colors.slate900,
    },
    cardSubtitle: {
        fontSize: FontSize.sm, color: Colors.slate500,
        marginTop: -8,
    },

    // Test chip
    testChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#fef3c7',
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: BorderRadius.full,
        borderWidth: 1, borderColor: '#fbbf24',
    },
    testChipText: {
        fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: '#92400e',
    },

    // Form
    fieldGroup: { gap: 6 },
    label: {
        fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.slate700,
    },
    labelRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    forgotLink: {
        fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary,
    },

    // Login button
    loginBtn: {
        borderRadius: BorderRadius.full, overflow: 'hidden',
        marginTop: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
    },
    loginBtnGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 17, gap: 8,
    },
    loginBtnText: {
        fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white,
    },

    // Register
    registerRow: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    registerText: { fontSize: FontSize.sm, color: Colors.slate500 },
    registerLink: {
        fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary,
    },

    // Separator
    separator: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
    },
    separatorLine: { flex: 1, height: 1, backgroundColor: Colors.slate200 },
    separatorText: { fontSize: FontSize.xs, color: Colors.slate400 },

    // Transporter card CTA
    transporterCard: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
    },
    transporterCardGradient: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 16, paddingHorizontal: 18, gap: 14,
    },
    transporterIconCircle: {
        width: 46, height: 46, borderRadius: 12,
        backgroundColor: 'rgba(34,197,94,0.15)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)',
    },
    transporterCardTitle: {
        fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white,
    },
    transporterCardSub: {
        fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2,
    },
    transporterArrow: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: 'rgba(34,197,94,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
});
