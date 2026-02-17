import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';

export default function TransporterRegisterScreen() {
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
                <Text style={styles.navTitle}>INSCRIPTION</Text>
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
                    <Text style={styles.title}>Devenir Transporteur</Text>
                    <Text style={styles.subtitle}>
                        Rejoignez le réseau Ja-Lma et gérez vos livraisons d'eau en toute simplicité.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>NOM</Text>
                        <AppTextInput icon="person" placeholder="Ex: Dupont" />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>PRÉNOM</Text>
                        <AppTextInput icon="badge" placeholder="Ex: Marc" />
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>NUMÉRO DE TÉLÉPHONE</Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryCodeText}>+213</Text>
                            </View>
                            <AppTextInput
                                icon="phone-iphone"
                                placeholder="6 00 00 00 00"
                                keyboardType="phone-pad"
                                containerStyle={{ flex: 1 }}
                            />
                        </View>
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>TYPE DE VÉHICULE</Text>
                        <View style={styles.selectBox}>
                            <MaterialIcons name="local-shipping" size={18} color={Colors.slate400} />
                            <Text style={styles.selectText}>Sélectionnez la capacité</Text>
                            <MaterialIcons name="expand-more" size={20} color={Colors.slate400} />
                        </View>
                    </View>

                    {/* Terms checkbox */}
                    <View style={styles.termsRow}>
                        <View style={styles.checkbox}>
                            <MaterialIcons name="check-box-outline-blank" size={20} color={Colors.slate300} />
                        </View>
                        <Text style={styles.termsText}>
                            En m'inscrivant, j'accepte les{' '}
                            <Text style={styles.termsLink}>Conditions Générales</Text> et la{' '}
                            <Text style={styles.termsLink}>Politique de Confidentialité</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomCta}>
                <PrimaryButton
                    title="Suivant"
                    icon="arrow-forward"
                    onPress={() => router.replace('/(transporter)')}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    blob1: {
        position: 'absolute',
        top: -96,
        right: -96,
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: `${Colors.primary}08`,
    },
    blob2: {
        position: 'absolute',
        top: '50%',
        left: -128,
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: `${Colors.accent}08`,
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 52,
        paddingBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    navTitle: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        letterSpacing: 2,
        color: Colors.textMuted,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 120,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 8,
    },
    logoContainer: {
        width: 128,
        height: 128,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    logoBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${Colors.primary}08`,
        borderRadius: 64,
    },
    truckIconOverlay: {
        position: 'absolute',
        bottom: 20,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
        textAlign: 'center',
        marginTop: 8,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: 8,
        maxWidth: 280,
    },
    form: {
        gap: 20,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.textMuted,
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
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.slate200,
        ...Shadows.floatSm,
    },
    countryCodeText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.sm,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: Colors.slate200,
        gap: 12,
        ...Shadows.floatSm,
    },
    selectText: {
        flex: 1,
        fontSize: FontSize.base,
        color: Colors.slate400,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingHorizontal: 4,
        marginTop: 8,
    },
    checkbox: {},
    termsText: {
        flex: 1,
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        lineHeight: 18,
    },
    termsLink: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
    bottomCta: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 40,
        backgroundColor: Colors.backgroundLight,
    },
});
