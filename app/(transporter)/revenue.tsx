import React from 'react';
import {
    View, Text, StyleSheet, Platform, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';

export default function RevenueScreen() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('revenue.title')}</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Total Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>{t('revenue.totalBalance')}</Text>
                    <Text style={styles.balanceValue}>-- <Text style={styles.currency}>DA</Text></Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.today')}</Text>
                            <Text style={styles.statValue}>--</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.thisWeek')}</Text>
                            <Text style={styles.statValue}>--</Text>
                        </View>
                    </View>
                </View>

                {/* History Section - Empty state */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>{t('revenue.history')}</Text>
                    <View style={styles.emptyCard}>
                        <MaterialIcons name="receipt-long" size={40} color={Colors.slate300} />
                        <Text style={styles.emptyText}>{t('revenue.noTransactions')}</Text>
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
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        gap: 24,
        paddingBottom: 100,
    },
    balanceCard: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.xl,
        padding: 24,
        ...Shadows.card,
    },
    balanceLabel: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: FontWeight.medium,
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 40,
        fontWeight: FontWeight.extrabold,
        color: Colors.white,
        marginBottom: 24,
    },
    currency: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: BorderRadius.lg,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    statValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 16,
    },
    historySection: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    emptyCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 32,
        alignItems: 'center',
        gap: 12,
        ...Shadows.floatSm,
    },
    emptyText: {
        fontSize: FontSize.sm,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
});
