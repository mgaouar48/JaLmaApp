import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
    Platform, TouchableOpacity, Alert, Animated, Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { AppTextInput } from '../src/components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

const { height } = Dimensions.get('window');
const CARD_TOP = height * 0.28;

export default function RegisterScreen() {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleRegister = async () => {
        if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
            Alert.alert(t('common.error'), t('auth.fillAllFields'));
            return;
        }
        if (password.length < 6) {
            Alert.alert(t('common.error'), t('auth.passwordTooShort'));
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email.trim(), password,
            options: { data: { role: 'client', first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim() } },
        });
        setLoading(false);
        if (error) Alert.alert(t('common.error'), error.message);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <Animated.View style={[styles.heroContent, { transform: [{ scale: logoScale }], opacity: fadeAnim }]}>
                    <View style={styles.logoRing}>
                        <View style={styles.logoInner}>
                            <MaterialIcons name="person-add" size={34} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.appName}>Ja-Lma</Text>
                    <Text style={styles.heroTagline}>{t('auth.registerSubtitle')}</Text>
                </Animated.View>
            </LinearGradient>

            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.cardScroll}>
                    <Text style={styles.cardTitle}>{t('auth.registerTitle')}</Text>

                    <View style={styles.nameRow}>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <Text style={styles.label}>{t('auth.lastName')}</Text>
                            <AppTextInput placeholder={t('auth.lastNamePlaceholder')} value={lastName} onChangeText={setLastName} />
                        </View>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <Text style={styles.label}>{t('auth.firstName')}</Text>
                            <AppTextInput placeholder={t('auth.firstNamePlaceholder')} value={firstName} onChangeText={setFirstName} />
                        </View>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.phoneNumber')}</Text>
                        <AppTextInput icon="phone" placeholder="0555 123 456" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <AppTextInput icon="email" placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.password')}</Text>
                        <AppTextInput icon="lock-outline" placeholder="••••••••" secureTextEntry={!showPassword} rightIcon={showPassword ? 'visibility' : 'visibility-off'} onRightIconPress={() => setShowPassword(!showPassword)} value={password} onChangeText={setPassword} />
                    </View>

                    <Text style={styles.terms}>
                        {t('auth.termsPrefix')}
                        <Text style={styles.termsLink}>{t('auth.termsOfUse')}</Text>
                        {t('auth.termsAnd')}
                        <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>.
                    </Text>

                    <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                        <LinearGradient colors={['#1A73E8', '#0A4FAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                            <Text style={styles.btnText}>{loading ? t('common.loading') : t('auth.register')}</Text>
                            {!loading && <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />}
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>{t('auth.hasAccount')} </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>{t('auth.login')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A4FAD' },
    hero: { position: 'absolute', top: 0, left: 0, right: 0, height: CARD_TOP + 40, overflow: 'hidden' },
    decorCircle1: { position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.07)' },
    decorCircle2: { position: 'absolute', bottom: -10, left: -60, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.05)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 36, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    heroContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: Platform.OS === 'ios' ? 50 : 36 },
    logoRing: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    logoInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    appName: { fontSize: 24, fontWeight: '800' as any, color: Colors.white, letterSpacing: 1 },
    heroTagline: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 4, paddingHorizontal: 32 },
    card: { position: 'absolute', top: CARD_TOP, left: 0, right: 0, bottom: 0, backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, ...Shadows.float },
    cardScroll: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40, gap: 14 },
    cardTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.slate900 },
    nameRow: { flexDirection: 'row', gap: 10 },
    fieldGroup: { gap: 5 },
    label: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.slate400, letterSpacing: 0.8, textTransform: 'uppercase' },
    terms: { fontSize: 11, textAlign: 'center', color: Colors.slate400, lineHeight: 17, paddingHorizontal: 8 },
    termsLink: { color: Colors.primary, fontWeight: FontWeight.bold },
    btn: { borderRadius: BorderRadius.full, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
    btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 17, gap: 8 },
    btnText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white },
    loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginText: { fontSize: FontSize.sm, color: Colors.slate500 },
    loginLink: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
});
