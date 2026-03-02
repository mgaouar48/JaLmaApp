import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function HelpSupportScreen() {
    const { t } = useTranslation();
    const supportEmail = "support@jalma.com";

    const handleContactSupport = () => {
        Linking.openURL(`mailto:${supportEmail}?subject=Support Request`);
    };

    const handleReportBug = () => {
        Linking.openURL(`mailto:${supportEmail}?subject=Bug Report`);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            t('help.deleteAccount'),
            t('help.deleteAccountConfirm'),
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('help.delete'),
                    style: "destructive",
                    onPress: () => {
                        Alert.alert(t('help.accountDeleted'), t('help.accountDeletedMsg'), [
                            { text: t('common.ok'), onPress: () => router.replace('/login') }
                        ]);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('help.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('help.contactUs')}</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.iconBg}>
                                <MaterialIcons name="email" size={24} color={Colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardLabel}>{t('help.supportEmail')}</Text>
                                <Text style={styles.cardValue}>{supportEmail}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleContactSupport}>
                            <Text style={styles.actionBtnText}>{t('help.sendEmail')}</Text>
                            <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bug Report Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('help.reportProblem')}</Text>
                    <View style={styles.card}>
                        <Text style={styles.description}>
                            {t('help.bugDescription')}
                        </Text>
                        <TouchableOpacity style={styles.outlineBtn} onPress={handleReportBug}>
                            <MaterialIcons name="bug-report" size={20} color={Colors.primary} />
                            <Text style={styles.outlineBtnText}>{t('help.reportBug')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={[styles.section, { marginTop: 32 }]}>
                    <Text style={[styles.sectionTitle, { color: Colors.statusRed }]}>{t('help.dangerZone')}</Text>
                    <View style={[styles.card, { borderColor: `${Colors.statusRed}30`, borderWidth: 1 }]}>
                        <Text style={styles.description}>
                            {t('help.deleteWarning')}
                        </Text>
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                            <MaterialIcons name="delete-forever" size={20} color={Colors.white} />
                            <Text style={styles.deleteBtnText}>{t('help.deleteMyAccount')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
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
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 12,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        ...Shadows.card,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    iconBg: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    cardLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        backgroundColor: Colors.gray100,
        borderRadius: BorderRadius.md,
    },
    actionBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    description: {
        fontSize: FontSize.sm,
        color: Colors.slate600,
        marginBottom: 16,
        lineHeight: 20,
    },
    outlineBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: BorderRadius.md,
    },
    outlineBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        backgroundColor: Colors.statusRed,
        borderRadius: BorderRadius.md,
    },
    deleteBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.white,
    },
});
