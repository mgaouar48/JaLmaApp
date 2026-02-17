import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);

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
                {/* Header / Brand */}
                <View style={styles.brandSection}>
                    <View style={styles.logoCircle}>
                        <MaterialIcons name="water-drop" size={40} color={Colors.primary} />
                        <View style={styles.logoGradient} />
                    </View>
                    <Text style={styles.title}>Bienvenue chez Ja-Lma</Text>
                    <Text style={styles.subtitle}>Livraison d'eau pure à domicile</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Email / Phone */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email ou Téléphone</Text>
                        <AppTextInput
                            icon="person-outline"
                            placeholder="ex: jean@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.fieldGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Mot de passe</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgotLink}>Mot de passe oublié ?</Text>
                            </TouchableOpacity>
                        </View>
                        <AppTextInput
                            icon="lock-outline"
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? 'visibility' : 'visibility-off'}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />
                    </View>

                    <View style={{ height: 16 }} />

                    {/* Submit */}
                    <PrimaryButton
                        title="Se connecter"
                        icon="arrow-forward"
                        onPress={() => router.replace('/(client)')}
                    />
                </View>

                {/* Social Login */}
                <View style={styles.socialSection}>
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Ou continuer avec</Text>
                        <View style={styles.dividerLine} />
                    </View>
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialIcons name="g-translate" size={24} color={Colors.slate700} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialIcons name="apple" size={24} color={Colors.slate700} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Pas encore de compte ?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.footerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>

                {/* Transporter link */}
                <TouchableOpacity
                    style={styles.transporterLink}
                    onPress={() => router.push('/transporter-login')}
                >
                    <MaterialIcons name="local-shipping" size={16} color={Colors.primary} />
                    <Text style={styles.transporterLinkText}>Espace Transporteur</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 32,
        paddingTop: 60,
        paddingBottom: 40,
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    logoGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${Colors.primary}08`,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    form: {
        gap: 24,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.slate700,
        marginLeft: 4,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    forgotLink: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    socialSection: {
        marginTop: 32,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.slate200,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: FontSize.xs,
        color: Colors.slate400,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
    },
    socialBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: Colors.slate200,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
    },
    footerText: {
        fontSize: FontSize.sm,
        color: Colors.slate600,
    },
    footerLink: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    transporterLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    transporterLinkText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
});
