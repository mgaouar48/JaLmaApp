import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';

export default function RegisterScreen() {
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
                    <Text style={styles.title}>Créer un compte</Text>
                    <Text style={styles.subtitle}>
                        Rejoignez Ja-Lma pour une livraison d'eau simplifiée
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Nom */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>NOM</Text>
                        <AppTextInput placeholder="Votre nom de famille" />
                    </View>

                    {/* Prénom */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>PRÉNOM</Text>
                        <AppTextInput placeholder="Votre prénom" />
                    </View>

                    {/* Phone */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>NUMÉRO DE TÉLÉPHONE</Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryCodeText}>🇩🇿 +213</Text>
                            </View>
                            <View style={styles.phoneInput}>
                                <AppTextInput
                                    placeholder="000 00 00 00"
                                    keyboardType="phone-pad"
                                    containerStyle={{ flex: 1 }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        En vous inscrivant, vous acceptez nos{' '}
                        <Text style={styles.link}>Conditions d'Utilisation</Text> et notre{' '}
                        <Text style={styles.link}>Politique de Confidentialité</Text>.
                    </Text>

                    {/* Submit */}
                    <PrimaryButton
                        title="S'inscrire"
                        icon="arrow-forward"
                        onPress={() => router.replace('/(client)')}
                        style={{ borderRadius: BorderRadius.full }}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Déjà un compte ?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.footerLink}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 32,
    },
    logoCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: `${Colors.primary}08`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: `${Colors.primary}99`,
        textAlign: 'center',
        marginTop: 8,
    },
    form: {
        gap: 20,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: `${Colors.primary}B3`,
        letterSpacing: 1,
        marginLeft: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        gap: 8,
    },
    countryCode: {
        paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        height: 52,
    },
    countryCodeText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.primary,
    },
    phoneInput: {
        flex: 1,
    },
    terms: {
        fontSize: 11,
        textAlign: 'center',
        color: `${Colors.primary}80`,
        paddingHorizontal: 16,
    },
    link: {
        color: Colors.primary,
        fontWeight: FontWeight.medium,
        textDecorationLine: 'underline',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 24,
        paddingBottom: 32,
    },
    footerText: {
        fontSize: FontSize.sm,
        color: `${Colors.primary}99`,
    },
    footerLink: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
});
