import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { useFocusEffect } from 'expo-router';

interface Transaction {
    id: string;
    amount: number;
    clientName: string;
    address: string | null;
    date: string;
    liters: number;
}

// Helpers
const startOfDay = (d: Date) => {
    const s = new Date(d);
    s.setHours(0, 0, 0, 0);
    return s;
};

const startOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d);
    mon.setDate(diff);
    mon.setHours(0, 0, 0, 0);
    return mon;
};

const startOfMonth = () => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
};

type Period = 'today' | 'week' | 'month';

export default function RevenueScreen() {
    const { t } = useTranslation();
    const { session } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [activePeriod, setActivePeriod] = useState<Period>('today');

    const fetchRevenue = useCallback(async () => {
        const userId = session?.user?.id;
        if (!userId) return;

        try {
            // Fetch all completed orders
            const { data: orders } = await supabase
                .from('orders')
                .select('id, client_id, estimated_price, final_price, completed_at, delivery_address, quantity_liters')
                .eq('driver_id', userId)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false });

            if (!orders || orders.length === 0) {
                setTransactions([]);
                setTotalBalance(0);
                setTodayRevenue(0);
                setWeekRevenue(0);
                setMonthRevenue(0);
                return;
            }

            // Fetch client names
            const clientIds = [...new Set(orders.map(o => o.client_id))];
            let clientMap: Record<string, string> = {};
            if (clientIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name')
                    .in('id', clientIds);
                if (profiles) {
                    profiles.forEach(p => {
                        clientMap[p.id] = `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || t('common.unknown');
                    });
                }
            }

            // Build transaction list
            const txns: Transaction[] = orders.map(o => ({
                id: o.id,
                amount: o.final_price ?? o.estimated_price ?? 0,
                clientName: clientMap[o.client_id] || t('common.unknown'),
                address: o.delivery_address,
                date: o.completed_at || '',
                liters: o.quantity_liters,
            }));

            setTransactions(txns);

            // Calculate totals
            const total = txns.reduce((sum, tx) => sum + tx.amount, 0);
            setTotalBalance(total);

            const now = new Date();
            const todayStart = startOfDay(now);
            const weekStart = startOfWeek();
            const monthStart = startOfMonth();

            const todaySum = txns
                .filter(tx => tx.date && new Date(tx.date) >= todayStart)
                .reduce((sum, tx) => sum + tx.amount, 0);
            setTodayRevenue(todaySum);

            const weekSum = txns
                .filter(tx => tx.date && new Date(tx.date) >= weekStart)
                .reduce((sum, tx) => sum + tx.amount, 0);
            setWeekRevenue(weekSum);

            const monthSum = txns
                .filter(tx => tx.date && new Date(tx.date) >= monthStart)
                .reduce((sum, tx) => sum + tx.amount, 0);
            setMonthRevenue(monthSum);
        } catch (err) {
            console.error('[Revenue] Error:', err);
        }
    }, [session?.user?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchRevenue();
        }, [fetchRevenue])
    );

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel('revenue-orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
            }, () => { fetchRevenue(); })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [fetchRevenue]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRevenue();
        setRefreshing(false);
    };

    // Filter transactions by period
    const filteredTransactions = transactions.filter(tx => {
        if (!tx.date) return false;
        const d = new Date(tx.date);
        if (activePeriod === 'today') return d >= startOfDay(new Date());
        if (activePeriod === 'week') return d >= startOfWeek();
        if (activePeriod === 'month') return d >= startOfMonth();
        return true;
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (n: number) => n.toLocaleString('fr-FR').replace(/\s/g, ' ');

    const periodRevenue = activePeriod === 'today' ? todayRevenue : activePeriod === 'week' ? weekRevenue : monthRevenue;

    return (
        <View style={styles.container}>
            {/* Dark gradient header */}
            <LinearGradient colors={['#0f172a', '#1e293b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.glowCircle} />
                <View style={styles.decorCircle1} />
                <View style={styles.headerContent}>
                    <View style={styles.headerIconRing}>
                        <MaterialIcons name="payments" size={22} color="#22c55e" />
                    </View>
                    <Text style={styles.title}>{t('revenue.title')}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
            >
                {/* Total Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceBlob1} />
                    <View style={styles.balanceBlob2} />
                    <Text style={styles.balanceLabel}>{t('revenue.totalBalance')}</Text>
                    <Text style={styles.balanceValue}>
                        {formatCurrency(totalBalance)} <Text style={styles.currency}>DA</Text>
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.today')}</Text>
                            <Text style={styles.statValue}>{formatCurrency(todayRevenue)}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.thisWeek')}</Text>
                            <Text style={styles.statValue}>{formatCurrency(weekRevenue)}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>{t('revenue.thisMonth')}</Text>
                            <Text style={styles.statValue}>{formatCurrency(monthRevenue)}</Text>
                        </View>
                    </View>
                </View>

                {/* Period filter */}
                <View style={styles.periodRow}>
                    {(['today', 'week', 'month'] as Period[]).map(p => (
                        <TouchableOpacity
                            key={p}
                            style={[styles.periodChip, activePeriod === p && styles.periodChipActive]}
                            onPress={() => setActivePeriod(p)}
                        >
                            <Text style={[styles.periodText, activePeriod === p && styles.periodTextActive]}>
                                {p === 'today' ? t('revenue.today') : p === 'week' ? t('revenue.thisWeek') : t('revenue.thisMonth')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Period summary */}
                <View style={styles.periodSummary}>
                    <View style={styles.periodSummaryIcon}>
                        <MaterialIcons name="trending-up" size={20} color={Colors.statusGreen} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.periodSummaryLabel}>{t('revenue.totalEarnings')}</Text>
                        <Text style={styles.periodSummaryValue}>{formatCurrency(periodRevenue)} DA</Text>
                    </View>
                    <Text style={styles.periodSummaryCount}>
                        {filteredTransactions.length} {t('revenue.trips')}
                    </Text>
                </View>

                {/* History Section */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>{t('revenue.history')}</Text>

                    {filteredTransactions.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <MaterialIcons name="receipt-long" size={40} color={Colors.slate300} />
                            <Text style={styles.emptyText}>{t('revenue.noTransactions')}</Text>
                        </View>
                    ) : (
                        filteredTransactions.map((tx) => (
                            <View key={tx.id} style={styles.txCard}>
                                <View style={styles.txIconBg}>
                                    <MaterialIcons name="local-shipping" size={20} color={Colors.primary} />
                                </View>
                                <View style={styles.txDetails}>
                                    <Text style={styles.txClient} numberOfLines={1}>{tx.clientName}</Text>
                                    <Text style={styles.txMeta} numberOfLines={1}>
                                        {tx.liters.toLocaleString('fr-FR')}L • {formatDate(tx.date)}
                                    </Text>
                                    {tx.address && (
                                        <Text style={styles.txAddress} numberOfLines={1}>
                                            <MaterialIcons name="place" size={10} color={Colors.slate400} /> {tx.address}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.txAmountWrapper}>
                                    <Text style={styles.txAmount}>+{formatCurrency(tx.amount)}</Text>
                                    <Text style={styles.txCurrency}>DA</Text>
                                </View>
                            </View>
                        ))
                    )}
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
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 16, overflow: 'hidden' },
    glowCircle: { position: 'absolute', top: -30, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(34,197,94,0.08)' },
    decorCircle1: { position: 'absolute', top: -20, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.03)' },
    headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, gap: 10 },
    headerIconRing: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
    title: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        gap: 20,
        paddingBottom: 100,
    },
    // Balance card
    balanceCard: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.xl,
        padding: 24,
        ...Shadows.card,
        overflow: 'hidden',
    },
    balanceBlob1: {
        position: 'absolute', right: -30, top: -30,
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    balanceBlob2: {
        position: 'absolute', left: -20, bottom: -20,
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    balanceLabel: {
        fontSize: FontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: FontWeight.medium,
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 36,
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
        padding: 14,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.65)',
        marginBottom: 4,
    },
    statValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 8,
    },
    // Period filter
    periodRow: {
        flexDirection: 'row',
        gap: 10,
    },
    periodChip: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.slate200,
    },
    periodChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    periodText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.slate500,
    },
    periodTextActive: {
        color: Colors.white,
    },
    // Period summary
    periodSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.slate100,
        ...Shadows.floatSm,
    },
    periodSummaryIcon: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: `${Colors.statusGreen}12`,
        alignItems: 'center', justifyContent: 'center',
    },
    periodSummaryLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
    },
    periodSummaryValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    periodSummaryCount: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        backgroundColor: `${Colors.primary}10`,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    // History section
    historySection: {
        gap: 12,
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
    // Transaction card
    txCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.slate100,
        ...Shadows.floatSm,
    },
    txIconBg: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    txDetails: {
        flex: 1,
        gap: 2,
    },
    txClient: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    txMeta: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
    },
    txAddress: {
        fontSize: 10,
        color: Colors.slate400,
        marginTop: 1,
    },
    txAmountWrapper: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.extrabold,
        color: Colors.statusGreen,
    },
    txCurrency: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
});
