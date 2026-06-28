import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, FontSize, FontWeight, Shadows, BorderRadius } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper: get start of day in ISO
const startOfDay = (d: Date) => {
    const s = new Date(d);
    s.setHours(0, 0, 0, 0);
    return s.toISOString();
};

// Helper: get start of day N days ago
const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d;
};

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function TransporterDashboard() {
    const { t } = useTranslation();
    const { profile, session } = useAuth();
    const [docsSubmitted, setDocsSubmitted] = useState(true);

    // Real data states
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [lastOrderTime, setLastOrderTime] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('docs_submitted').then(val => {
            setDocsSubmitted(val === 'true');
        }).catch(() => { });
    }, []);

    const fetchDashboardData = useCallback(async () => {
        const userId = session?.user?.id;
        if (!userId) return;

        try {
            // Fetch all completed orders for this driver
            const { data: orders } = await supabase
                .from('orders')
                .select('id, estimated_price, final_price, completed_at, created_at')
                .eq('driver_id', userId)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false });

            if (!orders || orders.length === 0) {
                setTodayRevenue(0);
                setCompletedCount(0);
                setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
                setLastOrderTime(null);
                return;
            }

            // Total completed count
            setCompletedCount(orders.length);

            // Last order time
            const lastOrder = orders[0];
            if (lastOrder.completed_at) {
                const d = new Date(lastOrder.completed_at);
                setLastOrderTime(d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
            }

            // Today's revenue
            const todayStart = startOfDay(new Date());
            const todayOrders = orders.filter(o =>
                o.completed_at && new Date(o.completed_at).toISOString() >= todayStart
            );
            const todaySum = todayOrders.reduce((sum, o) => sum + (o.final_price ?? o.estimated_price ?? 0), 0);
            setTodayRevenue(todaySum);

            // Weekly chart data (last 7 days including today)
            const weekly: number[] = [0, 0, 0, 0, 0, 0, 0];
            for (let i = 6; i >= 0; i--) {
                const dayStart = daysAgo(i);
                const dayEnd = new Date(dayStart);
                dayEnd.setDate(dayEnd.getDate() + 1);
                const dayOrders = orders.filter(o => {
                    if (!o.completed_at) return false;
                    const ct = new Date(o.completed_at);
                    return ct >= dayStart && ct < dayEnd;
                });
                weekly[6 - i] = dayOrders.reduce((sum, o) => sum + (o.final_price ?? o.estimated_price ?? 0), 0);
            }
            setWeeklyData(weekly);
        } catch (err) {
            console.error('[Dashboard] Error fetching data:', err);
        }
    }, [session?.user?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [fetchDashboardData])
    );

    // Subscribe to realtime changes
    useEffect(() => {
        const channel = supabase
            .channel('dashboard-orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
            }, () => {
                fetchDashboardData();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [fetchDashboardData]);

    // Chart helpers
    const maxWeekly = Math.max(...weeklyData, 1);
    const getWeekDayLabels = () => {
        const labels: string[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = daysAgo(i);
            const dayIndex = (d.getDay() + 6) % 7; // Mon=0
            labels.push(DAY_LABELS[dayIndex]);
        }
        return labels;
    };
    const chartLabels = getWeekDayLabels();

    return (
        <View style={styles.container}>
            {/* Map background */}
            <View style={styles.mapBg}>
                <View style={styles.road1} />
                <View style={styles.road2} />
                <View style={styles.road3} />
                {/* Center truck indicator */}
                <View style={styles.centerIndicator}>
                    <View style={styles.pingRing} />
                    <View style={styles.centerIcon}>
                        <MaterialIcons name="local-shipping" size={28} color={Colors.primary} />
                    </View>
                </View>
                {/* Pin */}
                <View style={styles.mapPin}>
                    <View style={styles.pinDot}>
                        <MaterialIcons name="place" size={16} color={Colors.statusRed} />
                    </View>
                </View>
            </View>

            {/* Gradient overlay */}
            <View style={styles.gradientOverlay} />

            {/* Content */}
            <View style={styles.contentWrapper}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={20} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.greeting}>{t('transporter.greeting')}</Text>
                            <Text style={styles.name}>
                                {profile?.first_name
                                    ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
                                    : t('transporter.driver')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications')}>
                        <MaterialIcons name="notifications" size={24} color={Colors.slate600} />
                        {!docsSubmitted && <View style={styles.notifBadge} />}
                    </TouchableOpacity>
                </View>

                {/* Scrollable content */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Revenue card */}
                    <TouchableOpacity
                        style={styles.revenueCard}
                        onPress={() => router.push('/(transporter)/revenue')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.revenueBlob1} />
                        <View style={styles.revenueBlob2} />
                        <View style={styles.revenueHeader}>
                            <View style={styles.revenueHeaderLeft}>
                                <View style={styles.revenueIconBg}>
                                    <MaterialIcons name="payments" size={18} color={Colors.white} />
                                </View>
                                <Text style={styles.revenueLabel}>{t('transporter.todayRevenue')}</Text>
                            </View>
                        </View>
                        <View style={styles.revenueAmount}>
                            <Text style={styles.revenueValue}>
                                {todayRevenue > 0 ? todayRevenue.toLocaleString('fr-FR') : '0'}
                            </Text>
                            <Text style={styles.revenueCurrency}>DA</Text>
                        </View>
                        <Text style={styles.revenueSubtext}>
                            {lastOrderTime
                                ? `${t('transporter.lastTrip')} · ${lastOrderTime}`
                                : t('transporter.lastTrip')}
                        </Text>
                    </TouchableOpacity>

                    {/* Completed orders card */}
                    <View style={styles.statsCard}>
                        <View style={styles.statsHeader}>
                            <View style={styles.statsHeaderLeft}>
                                <View style={styles.statsIconBg}>
                                    <MaterialIcons name="local-shipping" size={18} color={Colors.primary} />
                                </View>
                                <Text style={styles.statsLabel}>{t('transporter.completedOrders')}</Text>
                            </View>
                        </View>
                        <View style={styles.statsFooter}>
                            <View>
                                <Text style={styles.statsValue}>
                                    {completedCount}
                                    <Text style={styles.statsTotal}> {t('revenue.trips')}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Weekly Revenue Chart */}
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeaderRow}>
                            <View>
                                <Text style={styles.chartTitle}>{t('transporter.weeklyRevenue')}</Text>
                                <Text style={styles.chartSubtitle}>
                                    {weeklyData.reduce((s, v) => s + v, 0).toLocaleString('fr-FR')} DA {t('transporter.days') === 'jours' ? 'cette semaine' : 'this week'}
                                </Text>
                            </View>
                            <View style={styles.chartBadge}>
                                <MaterialIcons name="bar-chart" size={14} color={Colors.primary} />
                                <Text style={styles.chartBadgeText}>7j</Text>
                            </View>
                        </View>

                        <View style={styles.chartCard}>
                            {/* Horizontal scroll: 4 bars visible, scroll for rest */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.chartScrollContent}
                            >
                                {/* Y-axis grid lines (behind bars) */}
                                <View style={styles.gridLinesOverlay}>
                                    {[0, 1, 2, 3].map(i => (
                                        <View key={i} style={styles.gridLine} />
                                    ))}
                                </View>

                                {/* Bars */}
                                <View style={styles.chartContainer}>
                                {weeklyData.map((val, i) => {
                                    const barH = maxWeekly > 0 ? Math.max((val / maxWeekly) * 160, val > 0 ? 8 : 3) : 3;
                                    const isToday = i === 6;
                                    const isMax = val > 0 && val === maxWeekly;
                                    return (
                                        <View key={i} style={styles.barCol}>
                                            {/* Amount label - full number, no abbreviation */}
                                            {val > 0 && (
                                                <View style={[styles.amountBubble, isToday && styles.amountBubbleToday]}>
                                                    <Text style={[styles.amountText, isToday && styles.amountTextToday]}>
                                                        {val.toLocaleString('fr-FR')}
                                                    </Text>
                                                </View>
                                            )}

                                            {/* Bar with glow cap */}
                                            <View style={[styles.barWrapper, { height: barH }]}>
                                                {/* Glow cap on top */}
                                                {isToday && val > 0 && (
                                                    <View style={styles.barCapGlow} />
                                                )}
                                                {/* Main bar body */}
                                                <View style={[
                                                    styles.bar,
                                                    {
                                                        backgroundColor: isToday
                                                            ? Colors.primary
                                                            : isMax
                                                                ? `${Colors.primary}70`
                                                                : `${Colors.primary}28`,
                                                        borderRadius: 10,
                                                    }
                                                ]} />
                                            </View>

                                            {/* Day label */}
                                            <View style={[styles.dayLabelWrapper, isToday && styles.dayLabelWrapperToday]}>
                                                <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>
                                                    {chartLabels[i]}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    mapBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#eef2f6',
        overflow: 'hidden',
    },
    road1: {
        position: 'absolute', width: '100%', height: 16, top: '33%',
        backgroundColor: Colors.white, opacity: 0.6, transform: [{ rotate: '12deg' }, { scale: 1.5 }],
    },
    road2: {
        position: 'absolute', width: 16, height: '100%', left: '25%',
        backgroundColor: Colors.white, opacity: 0.6, transform: [{ rotate: '-12deg' }],
    },
    road3: {
        position: 'absolute', width: '100%', height: 24, bottom: '25%',
        backgroundColor: Colors.white, opacity: 0.6, transform: [{ rotate: '-6deg' }, { scale: 1.25 }],
    },
    centerIndicator: {
        position: 'absolute', top: '50%', left: '50%',
        marginTop: -32, marginLeft: -32,
        alignItems: 'center', justifyContent: 'center',
    },
    pingRing: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: `${Colors.primary}15`,
        position: 'absolute',
    },
    centerIcon: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: `${Colors.primary}30`,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
        ...Shadows.floatSm,
    },
    mapPin: {
        position: 'absolute', top: '33%', right: '25%',
    },
    pinDot: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.85)',
    },
    contentWrapper: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 32 : 40,
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.gray200,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
        overflow: 'hidden',
    },
    greeting: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
    },
    name: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    notifBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    notifBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.statusRed,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
        gap: 16,
    },
    revenueCard: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.xl,
        padding: 20,
        ...Shadows.float,
        overflow: 'hidden',
    },
    revenueBlob1: {
        position: 'absolute', right: -24, top: -24,
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    revenueBlob2: {
        position: 'absolute', left: -24, bottom: -24,
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    revenueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    revenueHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    revenueIconBg: {
        padding: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    revenueLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: 'rgba(255,255,255,0.8)',
    },
    revenueAmount: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginTop: 12,
    },
    revenueValue: {
        fontSize: FontSize['4xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.white,
        letterSpacing: -1,
    },
    revenueCurrency: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: 'rgba(255,255,255,0.7)',
    },
    revenueSubtext: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    statsCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 20,
        ...Shadows.floatSm,
        borderWidth: 1,
        borderColor: Colors.slate100,
        height: 128,
        justifyContent: 'space-between',
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsIconBg: {
        padding: 6,
        backgroundColor: `${Colors.primary}15`,
        borderRadius: 8,
    },
    statsLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
    },
    statsFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    statsValue: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    statsTotal: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.slate400,
    },
    // Weekly chart
    chartSection: {
        marginTop: 4,
    },
    chartHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    chartTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    chartSubtitle: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        marginTop: 2,
        fontWeight: FontWeight.medium,
    },
    chartBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: `${Colors.primary}12`,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: BorderRadius.full,
    },
    chartBadgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    chartCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        ...Shadows.floatSm,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    // Grid lines behind bars
    gridLinesOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 44,
        justifyContent: 'space-between',
        pointerEvents: 'none',
    },
    gridLine: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.slate100,
    },
    // Horizontal scroll container
    chartScrollContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingRight: 8,
        position: 'relative',
        minHeight: 210 + 44,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 210,
        paddingTop: 4,
    },
    barCol: {
        width: Dimensions.get('window').width * 0.22,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 4,
    },
    // Amount bubble above the bar
    amountBubble: {
        backgroundColor: Colors.slate100,
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginBottom: 4,
    },
    amountBubbleToday: {
        backgroundColor: Colors.primary,
    },
    amountText: {
        fontSize: 9,
        fontWeight: FontWeight.bold,
        color: Colors.slate500,
    },
    amountTextToday: {
        color: Colors.white,
    },
    barWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
    },
    barCapGlow: {
        position: 'absolute',
        top: -3,
        width: '55%',
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        opacity: 0.4,
        zIndex: 2,
    },
    bar: {
        width: '60%',
        height: '100%',
    },
    dayLabelWrapper: {
        marginTop: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    dayLabelWrapperToday: {
        backgroundColor: `${Colors.primary}12`,
    },
    barLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
    barLabelToday: {
        color: Colors.primary,
        fontWeight: FontWeight.bold,
    },
});
