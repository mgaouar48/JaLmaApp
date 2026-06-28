import React, { useState } from 'react';
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

export default function EditProfileScreen() {
    const { t } = useTranslation();
    const { session, profile, refreshProfile } = useAuth();
    const [saving, setSaving] = useState(false);

    const genderOptions = [
        { id: 'male', label: t('editProfile.male') },
        { id: 'female', label: t('editProfile.female') },
    ];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<string[]>(['male']);

    // Load existing data
    React.useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name ?? '');
            setLastName(profile.last_name ?? '');
            setPhone(profile.phone ?? '');
            setEmail(profile.email ?? '');
            if (profile.gender) setGender([profile.gender]);
        }
    }, [profile]);

    const handleSave = async () => {
        // Validate email
        if (email && !email.includes('@')) {
            Alert.alert(t('common.error'), t('editProfile.invalidEmail'));
            return;
        }

        // Validate required fields
        if (!firstName || !lastName) {
            Alert.alert(t('common.error'), t('editProfile.requiredFields'));
            return;
        }
        if (!session?.user?.id) return;

        setSaving(true);
        try {
            const { error } = await supabase
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

            if (error) throw error;

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
            {/* Gradient header */}
            <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.decorCircle1} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.headerIconRing}>
                        <MaterialIcons name="edit" size={26} color={Colors.white} />
                    </View>
                    <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="person" size={64} color={Colors.white} />
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <MaterialIcons name="camera-alt" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    {/* Name */}
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
                        <Text style={styles.label}>{t('editProfile.email')}</Text>
                        <AppTextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="votre.email@example.com"
                            keyboardType="email-address"
                            icon="email"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* DOB */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('editProfile.dob')}</Text>
                        <AppTextInput
                            value={dob}
                            onChangeText={setDob}
                            placeholder="JJ / MM / AAAA"
                            keyboardType="number-pad"
                            icon="cake"
                            maxLength={10}
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>{t('editProfile.gender')}</Text>
                        <ChipSelector
                            options={genderOptions}
                            multiple={false}
                            onSelectionChange={setGender}
                            style={{ justifyContent: 'flex-start' }}
                        />
                        {/* Initialize chip selector with current gender logic if needed, 
                currently component manages its own state but we sync it */}
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
    decorCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    headerContent: { alignItems: 'center', paddingTop: 8, gap: 6 },
    headerIconRing: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    saveBtnGhost: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    saveBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...Shadows.float,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    form: {
        paddingHorizontal: 24,
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.slate500,
        letterSpacing: 1,
        marginLeft: 4,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        ...Shadows.float,
    },
});
