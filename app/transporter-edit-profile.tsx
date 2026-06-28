import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput, ChipSelector } from '../src/components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';

const TANK_CAPACITY_OPTIONS = [
    { id: '1000', label: '1 000 L' },
    { id: '2000', label: '2 000 L' },
    { id: '3000', label: '3 000 L' },
    { id: '5000', label: '5 000 L' },
    { id: '10000', label: '10 000 L' },
];

const GENDER_OPTIONS = [
    { id: 'male', label: 'Homme' },
    { id: 'female', label: 'Femme' },
];

export default function TransporterEditProfileScreen() {
    const { t } = useTranslation();
    const { session, profile, refreshProfile } = useAuth();
    const [saving, setSaving] = useState(false);

    // Profile fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<string[]>([]);

    // Driver-specific field
    const [tankCapacity, setTankCapacity] = useState<string[]>(['5000']);

    // Load existing data
    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name ?? '');
            setLastName(profile.last_name ?? '');
            setPhone(profile.phone ?? '');
            setEmail(profile.email ?? '');
            if (profile.gender) setGender([profile.gender]);
        }
        // Load tank capacity from drivers table
        if (session?.user?.id) {
            supabase
                .from('drivers')
                .select('tank_capacity_liters')
                .eq('id', session.user.id)
                .single()
                .then(({ data }) => {
                    if (data?.tank_capacity_liters) {
                        setTankCapacity([String(data.tank_capacity_liters)]);
                    }
                });
        }
    }, [profile, session?.user?.id]);

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            Alert.alert(t('common.error'), t('editProfile.requiredFields'));
            return;
        }
        if (email && !email.includes('@')) {
            Alert.alert(t('common.error'), t('editProfile.invalidEmail'));
            return;
        }
        if (!session?.user?.id) return;

        setSaving(true);
        try {
            // Update profiles
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    phone: phone.trim() || null,
                    email: email.trim() || null,
                    gender: gender[0] ?? null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', session.user.id);

            if (profileError) throw profileError;

            // Update tank capacity in drivers table
            if (tankCapacity[0]) {
                const { error: driverError } = await supabase
                    .from('drivers')
                    .update({
                        tank_capacity_liters: parseInt(tankCapacity[0]),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', session.user.id);

                if (driverError) throw driverError;
            }

            await refreshProfile();

            Alert.alert(
                t('common.success'),
                t('editProfile.updateSuccess'),
                [{ text: t('common.ok'), onPress: () => router.back() }]
            );
        } catch (err: any) {
            Alert.alert(t('common.error'), err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Dark gradient header */}
            <LinearGradient colors={['#0f172a', '#1e293b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.glowCircle} />
                <View style={styles.decorCircle1} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.headerIconRing}>
                        <MaterialIcons name="edit" size={22} color="#22c55e" />
                    </View>
                    <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="person" size={64} color={Colors.white} />
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <MaterialIcons name="camera-alt" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.form}>
                    {/* Name Row */}
                    <View style={styles.row}>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <Text style={styles.label}>{t('auth.firstName')}</Text>
                            <AppTextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder={t('auth.firstNamePlaceholder')}
                                icon="person"
                            />
                        </View>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <Text style={styles.label}>{t('auth.lastName')}</Text>
                            <AppTextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder={t('auth.lastNamePlaceholder')}
                            />
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.phoneNumber')}</Text>
                        <AppTextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="0555 123 456"
                            keyboardType="phone-pad"
                            icon="phone"
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('editProfile.emailLabel')}</Text>
                        <AppTextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="votre.email@example.com"
                            keyboardType="email-address"
                            icon="email"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('editProfile.genderLabel')}</Text>
                        <ChipSelector
                            options={GENDER_OPTIONS}
                            multiple={false}
                            onSelectionChange={setGender}
                            style={{ justifyContent: 'flex-start' }}
                        />
                    </View>

                    {/* Tank Capacity — transporter specific */}
                    <View style={styles.sectionDivider}>
                        <View style={styles.sectionDividerLine} />
                        <Text style={styles.sectionDividerLabel}>{t('auth.tankCapacity')}</Text>
                        <View style={styles.sectionDividerLine} />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('auth.tankCapacity')}</Text>
                        <ChipSelector
                            options={TANK_CAPACITY_OPTIONS}
                            multiple={false}
                            onSelectionChange={setTankCapacity}
                            initialValue={tankCapacity}
                            style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}
                        />
                    </View>

                    {/* Tank capacity info card */}
                    <View style={styles.infoCard}>
                        <MaterialIcons name="info-outline" size={18} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            La capacité actuelle de votre citerne :{' '}
                            <Text style={styles.infoBold}>
                                {tankCapacity[0]
                                    ? `${parseInt(tankCapacity[0]).toLocaleString('fr-FR')} L`
                                    : '--'}
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Save Button */}
            <View style={styles.bottomBar}>
                <PrimaryButton
                    title={saving ? t('common.loading') : t('editProfile.saveChanges')}
                    icon="check"
                    onPress={handleSave}
                    disabled={saving}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 20, overflow: 'hidden' },
    glowCircle: { position: 'absolute', top: -30, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(34,197,94,0.08)' },
    decorCircle1: { position: 'absolute', top: -20, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.03)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    headerContent: { alignItems: 'center', paddingTop: 8, gap: 6 },
    headerIconRing: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    saveBtnGhost: {
        paddingVertical: 8, paddingHorizontal: 12,
    },
    saveBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        ...Shadows.float,
    },
    editAvatarBtn: {
        position: 'absolute', bottom: 0, right: 0,
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: Colors.accent,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
    },
    form: {
        paddingHorizontal: 24,
        gap: 24,
    },
    row: {
        flexDirection: 'row', gap: 16,
    },
    fieldGroup: { gap: 8 },
    label: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.slate500,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginLeft: 4,
    },
    sectionDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    sectionDividerLine: {
        flex: 1, height: 1, backgroundColor: Colors.slate200,
    },
    sectionDividerLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.slate400,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: `${Colors.primary}10`,
        borderRadius: BorderRadius.lg,
        padding: 14,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.slate600,
    },
    infoBold: {
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        ...Shadows.float,
    },
});
