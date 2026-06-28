import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView,
    Platform, Alert, Animated, Dimensions, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

const { height } = Dimensions.get('window');

export default function TransporterLoginScreen() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Entry animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const truckAnim = useRef(new Animated.Value(-30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
            Animated.spring(truckAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

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
        if (error) {
            setLoading(false);
            Alert.alert(t('common.error'), error.message);
            return;
        }
        const role = data.user?.user_metadata?.role;
        if (role !== 'driver') {
            await supabase.auth.signOut();
            setLoading(false);
            Alert.alert(t('common.error'), t('auth.notADriver') || "Ce compte n'est pas un compte transporteur.");
            return;
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Hero — dark slate + green accent */}
            <LinearGradient
                colors={['#0f172a', '#1e293b', '#0f172a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBackground}
            >
                {/* Glowing accent circle */}
                <View style={styles.glowCircle} />
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                {/* Back button */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>

                {/* Hero content */}
                <Animated.View style={[styles.heroContent, {
                    transform: [{ scale: logoScale }], opacity: fadeAnim,
                }]}>
                    {/* Truck icon with glow */}
                    <Animated.View style={[styles.logoWrapper, {
                        transform: [{ translateY: truckAnim }],
                    }]}>
                        <View style={styles.logoRingOuter}>
                            <View style={styles.logoRingInner}>
                                <LinearGradient
                                    colors={['#22c55e', '#16a34a']}
                                    style={styles.logoGradientCircle}
                                >
                                    <MaterialIcons name="local-shipping" size={36} color={Colors.white} />
                                </LinearGradient>
                            </View>
                        </View>
                    </Animated.View>

                    <Text style={styles.appName}>Ja-Lma</Text>
                    <View style={styles.roleBadge}>
                        <MaterialIcons name="verified" size={13} color="#22c55e" />
                        <Text style={styles.roleText}>{t('auth.transporterLogin')}</Text>
                    </View>
                </Animated.View>
            </LinearGradient>

            {/* Sliding card */}
            <Animated.View style={[
                styles.card,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.cardScroll}
                >
                    <Text style={styles.cardTitle}>{t('auth.transporterLogin')}</Text>
                    <Text style={styles.cardSubtitle}>{t('auth.transporterSubtitle')}</Text>

                    {/* Quick-fill test chip */}
                    <TouchableOpacity
                        style={styles.testChip}
                        onPress={() => { setEmail('ericos4482@gmail.com'); setPassword('test123'); }}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="bolt" size={14} color="#16a34a" />
                        <Text style={styles.testChipText}>{t('auth.testTransporterTitle')} — tap to fill</Text>
                    </TouchableOpacity>

                    {/* Email */}
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

                    {/* Password */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>{t('auth.password')}</Text>
                            <TouchableOpacity onPress={() => router.push('/transporter-forgot-password')}>
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

                    {/* Login button — green gradient */}
                    <TouchableOpacity
                        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['#22c55e', '#16a34a']}
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
                        <Text style={styles.registerText}>{t('auth.noAccountYet')} </Text>
                        <TouchableOpacity onPress={() => router.push('/transporter-register')}>
                            <Text style={styles.registerLink}>{t('auth.becomeTransporter')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    <View style={styles.separator}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>ou</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* Client CTA — blue gradient banner */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.88}
                        style={styles.clientCard}
                    >
                        <LinearGradient
                            colors={['#1A73E8', '#0A4FAD']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.clientCardGradient}
                        >
                            <View style={styles.clientIconCircle}>
                                <MaterialIcons name="person" size={24} color="#60a5fa" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.clientCardTitle}>{t('auth.clientSpace') || 'Espace client'}</Text>
                                <Text style={styles.clientCardSub}>Ja-Lma — accès client</Text>
                            </View>
                            <View style={styles.clientArrow}>
                                <MaterialIcons name="arrow-forward" size={18} color="#60a5fa" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const CARD_TOP = height * 0.36;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },

    // Hero
    heroBackground: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: CARD_TOP + 40,
        overflow: 'hidden',
    },
    glowCircle: {
        position: 'absolute', top: -40, left: '50%', marginLeft: -100,
        width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(34, 197, 94, 0.12)',
    },
    decorCircle1: {
        position: 'absolute', top: -30, right: -50,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    decorCircle2: {
        position: 'absolute', bottom: 20, left: -40,
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: 'rgba(34,197,94,0.06)',
    },
    backBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 52 : 36,
        left: 20,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 10,
    },
    heroContent: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 44,
    },
    logoWrapper: { marginBottom: 16 },
    logoRingOuter: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(34,197,94,0.12)',
        alignItems: 'center', justifyContent: 'center',
    },
    logoRingInner: {
        width: 78, height: 78, borderRadius: 39,
        backgroundColor: 'rgba(34,197,94,0.18)',
        alignItems: 'center', justifyContent: 'center',
    },
    logoGradientCircle: {
        width: 60, height: 60, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
    },
    appName: {
        fontSize: 28, fontWeight: '800' as any,
        color: Colors.white, letterSpacing: 1,
    },
    roleBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        marginTop: 6,
        backgroundColor: 'rgba(34,197,94,0.15)',
        paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: BorderRadius.full,
        borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)',
    },
    roleText: {
        fontSize: FontSize.xs, fontWeight: FontWeight.bold,
        color: '#4ade80',
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
        fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.slate900,
    },
    cardSubtitle: {
        fontSize: FontSize.sm, color: Colors.slate500, marginTop: -8,
    },

    // Test chip
    testChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: BorderRadius.full,
        borderWidth: 1, borderColor: '#86efac',
    },
    testChipText: {
        fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: '#14532d',
    },

    // Form
    fieldGroup: { gap: 6 },
    label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.slate700 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    forgotLink: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: '#16a34a' },

    // Login button
    loginBtn: {
        borderRadius: BorderRadius.full, overflow: 'hidden',
        marginTop: 4,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    loginBtnGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 17, gap: 8,
    },
    loginBtnText: {
        fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white,
    },

    // Register row
    registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerText: { fontSize: FontSize.sm, color: Colors.slate500 },
    registerLink: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#16a34a' },

    // Separator
    separator: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    separatorLine: { flex: 1, height: 1, backgroundColor: Colors.slate200 },
    separatorText: { fontSize: FontSize.xs, color: Colors.slate400 },

    // Client card CTA
    clientCard: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#1A73E8',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
    },
    clientCardGradient: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 16, paddingHorizontal: 18, gap: 14,
    },
    clientIconCircle: {
        width: 46, height: 46, borderRadius: 12,
        backgroundColor: 'rgba(96,165,250,0.15)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)',
    },
    clientCardTitle: {
        fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white,
    },
    clientCardSub: {
        fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2,
    },
    clientArrow: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: 'rgba(96,165,250,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
});
