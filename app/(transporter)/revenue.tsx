import React from 'react';
import {
    View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';

// Simulated Data
const STATS = {
    total: '125,000',
    today: '12,500',
    week: '45,000',
    month: '180,000',
};

const TRANSACTIONS = [
    { id: 'T1', date: 'Aujourd\'hui, 10:30', client: 'Sarah Benali', amount: '+1 200 DA', type: 'income' },
    { id: 'T2', date: 'Hier, 14:15', client: 'Hotel El Aurassi', amount: '+4 500 DA', type: 'income' },
    { id: 'T3', date: '16 Fév, 09:00', client: 'Restaurant Le Sommet', amount: '+2 000 DA', type: 'income' },
    { id: 'T4', date: '15 Fév, 11:45', client: 'Commission Ja-Lma', amount: '-150 DA', type: 'expense' },
    { id: 'T5', date: '14 Fév, 08:30', client: 'Clinique Al Azhar', amount: '+3 000 DA', type: 'income' },
    { id: 'T6', date: '13 Fév, 16:20', client: 'Ahmed Khelil', amount: '+1 500 DA', type: 'income' },
];

export default function RevenueScreen() {
    const { t } = useTranslation();
    const renderTransaction = ({ item }: { item: typeof TRANSACTIONS[0] }) => {
        const isIncome = item.type === 'income';
        return (
            <View style={styles.transactionItem}>
                <View style={[styles.iconBox, isIncome ? styles.iconIncome : styles.iconExpense]}>
                    <MaterialIcons
                        name={isIncome ? "call-received" : "call-made"}
                        size={18}
                        color={isIncome ? Colors.primary : Colors.statusRed}
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionClient}>{item.client}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
                <Text style={[styles.transactionAmount, isIncome ? styles.amountIncome : styles.amountExpense]}>
                    {item.amount}
                </Text>
            </View>
        );
    };

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
                    <Text style={styles.balanceValue}>{STATS.total} <Text style={styles.currency}>DA</Text></Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.today')}</Text>
                            <Text style={styles.statValue}>{STATS.today}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.thisWeek')}</Text>
                            <Text style={styles.statValue}>{STATS.week}</Text>
                        </View>
                    </View>
                </View>

                {/* History Section */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>{t('revenue.history')}</Text>
                    <View style={styles.historyList}>
                        {TRANSACTIONS.map((item) => (
                            <View key={item.id}>
                                {renderTransaction({ item })}
                                {item.id !== TRANSACTIONS[TRANSACTIONS.length - 1].id && (
                                    <View style={styles.listDivider} />
                                )}
                            </View>
                        ))}
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
    historyList: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        ...Shadows.floatSm,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconIncome: {
        backgroundColor: `${Colors.primary}10`,
    },
    iconExpense: {
        backgroundColor: `${Colors.statusRed}10`,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionClient: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
    },
    transactionAmount: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    amountIncome: {
        color: Colors.primary,
    },
    amountExpense: {
        color: Colors.statusRed,
    },
    listDivider: {
        height: 1,
        backgroundColor: Colors.slate50,
        marginLeft: 56,
    },
});
