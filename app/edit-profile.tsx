import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput, ChipSelector } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function EditProfileScreen() {
    const { t } = useTranslation();

    const genderOptions = [
        { id: 'male', label: t('editProfile.male') },
        { id: 'female', label: t('editProfile.female') },
    ];

    const [firstName, setFirstName] = useState('Karim');
    const [lastName, setLastName] = useState('Benali');
    const [email, setEmail] = useState('karim.benali@email.com');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<string[]>(['male']);

    const handleSave = () => {
        // Validate email
        if (!email.includes('@')) {
            Alert.alert(t('common.error'), t('editProfile.invalidEmail'));
            return;
        }

        // Validate required fields
        if (!firstName || !lastName || !email) {
            Alert.alert(t('common.error'), t('editProfile.requiredFields'));
            return;
        }

        Alert.alert(
            t('common.success'),
            t('editProfile.updateSuccess'),
            [{ text: t('common.ok'), onPress: () => router.back() }]
        );
    };

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
                <TouchableOpacity style={styles.saveBtnGhost} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>{t('editProfile.save')}</Text>
                </TouchableOpacity>
            </View>

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
                    title={t('editProfile.saveChanges')}
                    icon="check"
                    onPress={handleSave}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
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
