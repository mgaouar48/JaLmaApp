import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, Platform, TouchableOpacity, FlatList, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';

const FILTER_KEYS = ['all', 'inProgress', 'completed', 'cancelled'] as const;
type FilterKey = typeof FILTER_KEYS[number];

interface Order {
    id: string;
    client_id: string;
    status: string;
    delivery_address: string | null;
    quantity_liters: number;
    estimated_price: number | null;
    created_at: string;
    client_name?: string;
    client_phone?: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: keyof typeof MaterialIcons.glyphMap; labelKey: string }> = {
    assigned: { color: Colors.primary, bg: `${Colors.primary}12`, icon: 'assignment', labelKey: 'missions.statusAssigned' },
    on_route: { color: '#f59e0b', bg: '#fef3c720', icon: 'local-shipping', labelKey: 'missions.statusOnRoute' },
    completed: { color: Colors.statusGreen, bg: `${Colors.statusGreen}15`, icon: 'check-circle', labelKey: 'missions.statusCompleted' },
    cancelled: { color: Colors.statusRed, bg: `${Colors.statusRed}12`, icon: 'cancel', labelKey: 'missions.statusCancelled' },
    pending: { color: Colors.slate400, bg: Colors.slate100, icon: 'hourglass-top', labelKey: 'missions.statusPending' },
};

export default function MissionsScreen() {
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useTranslation();
    const { session } = useAuth();

    const fetchOrders = useCallback(async () => {
        try {
            // Get session directly from supabase to ensure we have the latest token
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const userId = currentSession?.user?.id;

            if (!userId) {
                console.log('[Missions] No user session found');
                setLoading(false);
                return;
            }

            console.log('[Missions] Fetching orders for driver:', userId);

            const { data, error } = await supabase
                .from('orders')
                .select('id, client_id, status, delivery_address, quantity_liters, estimated_price, created_at')
                .eq('driver_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[Missions] Error fetching orders:', error);
                setLoading(false);
                return;
            }

            console.log('[Missions] Orders found:', data?.length ?? 0);

            // Fetch client names
            const clientIds = [...new Set((data || []).map(o => o.client_id))];
            let clientMap: Record<string, { name: string; phone: string }> = {};
            if (clientIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, phone')
                    .in('id', clientIds);
                if (profiles) {
                    profiles.forEach(p => {
                        clientMap[p.id] = {
                            name: `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || t('common.unknown'),
                            phone: p.phone ?? '',
                        };
                    });
                }
            }

            const enriched = (data || []).map(o => ({
                ...o,
                client_name: clientMap[o.client_id]?.name || t('common.unknown'),
                client_phone: clientMap[o.client_id]?.phone || '',
            }));

            setOrders(enriched);
        } catch (err) {
            console.error('[Missions] Fetch orders error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // Subscribe to realtime changes on orders table
    useEffect(() => {
        const channel = supabase
            .channel('driver-orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
            }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [fetchOrders]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const filteredOrders = orders.filter(o => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'inProgress') return ['assigned', 'on_route'].includes(o.status);
        if (activeFilter === 'completed') return o.status === 'completed';
        if (activeFilter === 'cancelled') return o.status === 'cancelled';
        return true;
    });

    const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.pending;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const renderOrder = ({ item }: { item: Order }) => {
        const sc = getStatusConfig(item.status);
        return (
            <TouchableOpacity style={styles.orderCard} activeOpacity={0.85}>
                {/* Status badge */}
                <View style={styles.orderHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                        <MaterialIcons name={sc.icon} size={14} color={sc.color} />
                        <Text style={[styles.statusText, { color: sc.color }]}>{t(sc.labelKey)}</Text>
                    </View>
                    <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
                </View>

                {/* Client info */}
                <View style={styles.orderRow}>
                    <View style={styles.orderIconBg}>
                        <MaterialIcons name="person" size={18} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.orderLabel}>{t('missions.client')}</Text>
                        <Text style={styles.orderValue}>{item.client_name}</Text>
                    </View>
                </View>

                {/* Address */}
                {item.delivery_address && (
                    <View style={styles.orderRow}>
                        <View style={styles.orderIconBg}>
                            <MaterialIcons name="place" size={18} color={Colors.statusRed} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.orderLabel}>{t('missions.deliveryAddress')}</Text>
                            <Text style={styles.orderValue} numberOfLines={1}>{item.delivery_address}</Text>
                        </View>
                    </View>
                )}

                {/* Bottom row: quantity + price */}
                <View style={styles.orderFooter}>
                    <View style={styles.orderStat}>
                        <MaterialIcons name="opacity" size={16} color={Colors.primary} />
                        <Text style={styles.orderStatText}>
                            {item.quantity_liters.toLocaleString('fr-FR')} {t('missions.liters')}
                        </Text>
                    </View>
                    {item.estimated_price !== null && (
                        <View style={styles.orderStat}>
                            <MaterialIcons name="payments" size={16} color={Colors.statusGreen} />
                            <Text style={[styles.orderStatText, { color: Colors.statusGreen, fontWeight: FontWeight.bold }]}>
                                {item.estimated_price.toLocaleString('fr-FR')} DA
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action button for assigned orders */}
                {item.status === 'assigned' && (
                    <TouchableOpacity
                        style={styles.startBtn}
                        onPress={() => router.push({
                            pathname: '/active-delivery',
                            params: {
                                orderId: item.id,
                                clientName: item.client_name,
                                clientPhone: item.client_phone,
                                clientAddress: item.delivery_address ?? '',
                            },
                        })}
                    >
                        <MaterialIcons name="navigation" size={18} color={Colors.white} />
                        <Text style={styles.startBtnText}>{t('missions.startDelivery')}</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Dark gradient header */}
            <LinearGradient colors={['#0f172a', '#1e293b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.glowCircle} />
                <View style={styles.decorCircle1} />
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.headerIconRing}>
                            <MaterialIcons name="assignment" size={22} color="#22c55e" />
                        </View>
                        <Text style={styles.title}>{t('missions.title')}</Text>
                    </View>
                    <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                        <MaterialIcons name="refresh" size={22} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Filters */}
            <View style={styles.filterRow}>
                {FILTER_KEYS.map((key) => (
                    <TouchableOpacity
                        key={key}
                        style={[
                            styles.filterChip,
                            activeFilter === key && styles.filterChipActive,
                        ]}
                        onPress={() => setActiveFilter(key)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === key && styles.filterTextActive,
                            ]}
                        >
                            {t(`missions.filter_${key}`)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order list */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrder}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconBg}>
                            <MaterialIcons name="assignment" size={48} color={Colors.slate300} />
                        </View>
                        <Text style={styles.emptyText}>{t('missions.noMissions')}</Text>
                        <Text style={styles.emptySubtext}>{t('missions.noMissionsSubtitle')}</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 16, overflow: 'hidden' },
    glowCircle: { position: 'absolute', top: -30, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(34,197,94,0.08)' },
    decorCircle1: { position: 'absolute', top: -20, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.03)' },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerIconRing: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
    title: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    refreshBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 10,
        backgroundColor: Colors.white,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.slate100,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate500,
    },
    filterTextActive: {
        color: Colors.white,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
        gap: 12,
    },
    // Order card
    orderCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 18,
        ...Shadows.soft,
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: BorderRadius.full,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    orderDate: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
    },
    orderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    orderIconBg: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    orderLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
    },
    orderValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    orderFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
    },
    orderStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    orderStatText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate600,
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 14,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: BorderRadius.full,
        ...Shadows.button,
    },
    startBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    // Empty state
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: 12,
    },
    emptyIconBg: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: Colors.slate100,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    emptySubtext: {
        fontSize: FontSize.sm,
        color: Colors.slate400,
    },
});
