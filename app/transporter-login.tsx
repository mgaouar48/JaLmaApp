import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius } from '../src/constants';
import { PrimaryButton, AppTextInput } from '../src/components';

export default function TransporterLoginScreen() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoOuter}>
                        <View style={styles.logoDroplet}>
                            <MaterialIcons name="local-shipping" size={36} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.title}>Ja-Lma</Text>
                    <Text style={styles.subtitle}>Espace Transporteur</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Numéro de téléphone</Text>
                        <AppTextInput
                            icon="phone"
                            placeholder="06 00 00 00 00"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <AppTextInput
                            icon="lock-outline"
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? 'visibility' : 'visibility-off'}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotRow}>
                        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>

                    <PrimaryButton
                        title="Se connecter"
                        icon="arrow-forward"
                        onPress={() => router.replace('/(transporter)')}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Pas encore de compte ?</Text>
                    <TouchableOpacity onPress={() => router.push('/transporter-register')}>
                        <Text style={styles.footerLink}>Devenir transporteur (Inscription)</Text>
                    </TouchableOpacity>
                </View>
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
        paddingTop: 56,
        paddingBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoOuter: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: `${Colors.primary}08`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoDroplet: {
        width: 80,
        height: 80,
        backgroundColor: Colors.primary,
        borderRadius: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        transform: [{ rotate: '45deg' }],
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    subtitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
        marginTop: 4,
    },
    form: {
        gap: 24,
        flex: 1,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate700,
        marginLeft: 4,
    },
    forgotRow: {
        alignItems: 'flex-end',
    },
    forgotText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: `${Colors.primary}CC`,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    footerLink: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
});
