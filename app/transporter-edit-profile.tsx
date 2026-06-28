import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
    const { session, profile } = useAuth();
    const [saving, setSaving] = useState(false);

    // Profile fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<string[]>([]);

    // Driver-specific field
    const [tankCapacity, setTankCapacity] = useState<string[]>(['5000']);

    // Load existing data
    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name ?? '');
            setLastName(profile.last_name ?? '');
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

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
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
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
