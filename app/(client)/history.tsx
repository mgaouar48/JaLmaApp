import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Platform, RefreshControl, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Shadows, BorderRadius } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';

type OrderStatus = 'completed' | 'cancelled' | 'assigned' | 'on_route' | 'searching' | 'pending';

interface Order {
    id: string;
    status: OrderStatus;
    created_at: string;
    completed_at: string | null;
    delivery_address: string | null;
    quantity_liters: number;
    final_price: number | null;
    estimated_price: number | null;
    driver_name: string;
}

const filterKeys = ['all', 'inProgress', 'completed', 'cancelled'] as const;

const STATUS_IN_PROGRESS: OrderStatus[] = ['searching', 'pending', 'assigned', 'on_route'];

function statusColor(status: OrderStatus) {
    if (status === 'completed') return Colors.statusGreen;
    if (status === 'cancelled') return Colors.statusRed;
    return Colors.primary;
}

function statusIcon(status: OrderStatus): any {
    if (status === 'completed') return 'check-circle';
    if (status === 'cancelled') return 'cancel';
    if (status === 'on_route') return 'local-shipping';
    return 'schedule';
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function HistoryScreen() {
    const { t } = useTranslation();
    const { session } = useAuth();
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const filters = filterKeys.map(k => ({ key: k, label: t(`history.${k}`) }));

    const fetchOrders = useCallback(async () => {
        const userId = session?.user?.id;
        console.log('[History] fetching for userId:', userId);
        if (!userId) {
            setFetchError('Aucune session active.');
            setLoading(false);
            return;
        }
        setFetchError(null);

        const { data, error } = await supabase
            .from('orders')
            .select(`
                id, status, created_at, completed_at,
                delivery_address, quantity_liters,
                final_price, estimated_price,
                driver_id
            `)
            .eq('client_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[History] fetchOrders error:', error.message);
            setFetchError(`Erreur: ${error.message}`);
            setLoading(false);
            setRefreshing(false);
            return;
        }

        if (!data || data.length === 0) {
            setOrders([]);
            setLoading(false);
            setRefreshing(false);
            return;
        }

        // Step 2 — resolve unique driver names from the drivers table
        const driverIds = [...new Set(data.map((o: any) => o.driver_id).filter(Boolean))];
        let driverMap: Record<string, string> = {};

        if (driverIds.length > 0) {
            const { data: drivers, error: driverErr } = await supabase
                .from('drivers')
                .select('id, first_name, last_name')
                .in('id', driverIds);

            if (driverErr) {
                console.warn('[History] driver lookup error:', driverErr.message);
            } else if (drivers) {
                drivers.forEach((d: any) => {
                    driverMap[d.id] = `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim();
                });
            }
        }

        const mapped: Order[] = data.map((o: any) => ({
            id: o.id,
            status: o.status as OrderStatus,
            created_at: o.created_at,
            completed_at: o.completed_at,
            delivery_address: o.delivery_address,
            quantity_liters: o.quantity_liters,
            final_price: o.final_price,
            estimated_price: o.estimated_price,
            driver_name: o.driver_id && driverMap[o.driver_id]
                ? driverMap[o.driver_id]
                : t('common.unknown'),
        }));

        setOrders(mapped);
        setLoading(false);
        setRefreshing(false);
    }, [session?.user?.id]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchOrders();
        }, [fetchOrders])
    );

    const filteredOrders = React.useMemo(() => {
        if (activeFilter === 'all') return orders;
        if (activeFilter === 'inProgress') return orders.filter(o => STATUS_IN_PROGRESS.includes(o.status));
        if (activeFilter === 'completed') return orders.filter(o => o.status === 'completed');
        if (activeFilter === 'cancelled') return orders.filter(o => o.status === 'cancelled');
        return orders;
    }, [activeFilter, orders]);

    const statusLabel = (status: OrderStatus) => {
        const map: Record<OrderStatus, string> = {
            completed: t('history.completed'),
            cancelled: t('history.cancelled'),
            assigned: t('history.inProgress'),
            on_route: t('history.inProgress'),
            searching: t('history.inProgress'),
            pending: t('history.inProgress'),
        };
        return map[status] ?? status;
    };

    return (
        <View style={styles.container}>
            {/* Blue gradient header */}
            <View style={styles.headerWrapper}>
                <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                    <View style={styles.decorCircle1} />
                    <View style={styles.decorCircle2} />
                    <View style={styles.headerRow}>
                        <View style={styles.headerIconRing}>
                            <MaterialIcons name="history" size={22} color="rgba(255,255,255,0.9)" />
                        </View>
                        <Text style={styles.headerTitle}>{t('history.title')}</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{orders.length}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>

                {/* Error banner */}
                {fetchError && (
                    <View style={styles.errorBanner}>
                        <MaterialIcons name="error-outline" size={16} color="#b91c1c" />
                        <Text style={styles.errorBannerText}>{fetchError}</Text>
                    </View>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersList}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f.key}
                            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
                            onPress={() => setActiveFilter(f.key)}
                        >
                            <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Orders list */}
            {loading ? (
                <View style={styles.loadingState}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); fetchOrders(); }}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                >
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            const price = order.final_price ?? order.estimated_price;
                            const color = statusColor(order.status);
                            return (
                                <View key={order.id} style={styles.orderCard}>
                                    {/* Left color bar */}
                                    <View style={[styles.colorBar, { backgroundColor: color }]} />

                                    <View style={styles.cardBody}>
                                        {/* Top row */}
                                        <View style={styles.topRow}>
                                            <View style={[styles.statusBadge, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
                                                <MaterialIcons name={statusIcon(order.status)} size={13} color={color} />
                                                <Text style={[styles.statusText, { color }]}>
                                                    {statusLabel(order.status)}
                                                </Text>
                                            </View>
                                            {price && (
                                                <Text style={styles.priceText}>
                                                    {price.toLocaleString('fr-FR')} DA
                                                </Text>
                                            )}
                                        </View>

                                        {/* Address */}
                                        <View style={styles.addressRow}>
                                            <MaterialIcons name="location-on" size={14} color={Colors.slate400} />
                                            <Text style={styles.addressText} numberOfLines={1}>
                                                {order.delivery_address || t('history.noAddress')}
                                            </Text>
                                        </View>

                                        {/* Driver + Volume */}
                                        <View style={styles.metaRow}>
                                            <View style={styles.metaItem}>
                                                <MaterialIcons name="person" size={13} color={Colors.slate400} />
                                                <Text style={styles.metaText}>{order.driver_name}</Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <MaterialIcons name="opacity" size={13} color={Colors.slate400} />
                                                <Text style={styles.metaText}>
                                                    {order.quantity_liters.toLocaleString('fr-FR')} L
                                                </Text>
                                            </View>
                                            <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconBg}>
                                <MaterialIcons name="history" size={36} color={Colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>{t('history.noOrders')}</Text>
                            <Text style={styles.emptySubtitle}>{t('history.noOrdersSub')}</Text>
                        </View>
                    )}

                    {orders.length > 0 && (
                        <View style={styles.endIndicator}>
                            <View style={styles.endLine} />
                            <Text style={styles.endText}>{t('history.endOfHistory')}</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    headerWrapper: { overflow: 'hidden' },
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 28 },
    decorCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
    decorCircle2: { position: 'absolute', bottom: -20, left: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, gap: 10 },
    headerIconRing: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white, flex: 1 },
    countBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    countText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.white },
    filtersContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
    filtersList: { gap: 10, paddingBottom: 8 },
    filterChip: {
        paddingHorizontal: 18, paddingVertical: 8,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.white,
        borderWidth: 1, borderColor: Colors.slate200,
    },
    filterChipActive: {
        backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadows.soft,
    },
    filterChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.slate600 },
    filterChipTextActive: { color: Colors.white },
    // Error
    errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', padding: 10, marginHorizontal: 20, marginBottom: 10, borderRadius: 8, gap: 8 },
    errorBannerText: { color: '#b91c1c', fontSize: FontSize.sm, flex: 1 },
    // Loading
    loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    // List
    list: { flex: 1 },
    listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 14 },
    // Order card
    orderCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        ...Shadows.floatSm,
        borderWidth: 1, borderColor: Colors.slate100,
    },
    colorBar: { width: 5 },
    cardBody: { flex: 1, padding: 14, gap: 8 },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: BorderRadius.full, borderWidth: 1,
    },
    statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
    priceText: { fontSize: FontSize.base, fontWeight: FontWeight.extrabold, color: Colors.slate800 },
    addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    addressText: { flex: 1, fontSize: FontSize.sm, color: Colors.slate600, fontWeight: FontWeight.medium },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: FontSize.xs, color: Colors.slate400, fontWeight: FontWeight.medium },
    dateText: { marginLeft: 'auto', fontSize: FontSize.xs, color: Colors.slate400 },
    // Empty state
    emptyState: { alignItems: 'center', paddingVertical: 60, gap: 14 },
    emptyIconBg: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    emptyTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.slate700 },
    emptySubtitle: { fontSize: FontSize.sm, color: Colors.slate400, textAlign: 'center', paddingHorizontal: 32 },
    // End
    endIndicator: { alignItems: 'center', paddingVertical: 24, opacity: 0.5 },
    endLine: { width: 40, height: 3, borderRadius: 2, backgroundColor: Colors.slate200, marginBottom: 10 },
    endText: { fontSize: FontSize.sm, color: Colors.slate500 },
});
