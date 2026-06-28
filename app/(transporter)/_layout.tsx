import React, { useState, useEffect, useCallback } from 'react';
import { Tabs } from 'expo-router';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { router } from 'expo-router';

interface IncomingOrder {
    id: string;
    client_id: string;
    delivery_address: string | null;
    quantity_liters: number;
    estimated_price: number | null;
    client_name: string;
    client_phone: string;
    distance_km: number;
    eta_min: number;
}

export default function TransporterTabLayout() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { session } = useAuth();
    const [incomingOrder, setIncomingOrder] = useState<IncomingOrder | null>(null);
    const [responding, setResponding] = useState(false);

    // Shake animation for the modal
    const shakeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(400)).current;

    useEffect(() => {
        if (incomingOrder) {
            // Slide in
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }).start();
        }
    }, [incomingOrder]);

    // Poll for pending searching orders on focus + realtime
    const checkForIncomingOrders = useCallback(async () => {
        const userId = session?.user?.id;
        if (!userId || incomingOrder) return;

        const { data } = await supabase
            .from('orders')
            .select('id, client_id, delivery_address, quantity_liters, estimated_price')
            .eq('driver_id', userId)
            .eq('status', 'searching')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name, phone')
                .eq('id', data.client_id)
                .single();

            setIncomingOrder({
                id: data.id,
                client_id: data.client_id,
                delivery_address: data.delivery_address,
                quantity_liters: data.quantity_liters,
                estimated_price: data.estimated_price ?? 1200,
                client_name: profile
                    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
                    : t('common.unknown'),
                client_phone: profile?.phone ?? '',
                distance_km: 3.5,
                eta_min: 7,
            });
        }
    }, [session?.user?.id, incomingOrder]);

    // Listen for incoming orders via Realtime (INSERT on orders, filter client-side)
    useEffect(() => {
        const userId = session?.user?.id;
        if (!userId) return;

        // Initial check on mount
        checkForIncomingOrders();

        const channel = supabase
            .channel('incoming-orders-driver')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                async (payload: any) => {
                    const order = payload.new;
                    // Filter client-side
                    if (order.driver_id !== userId || order.status !== 'searching') return;
                    if (incomingOrder) return; // Already showing one

                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('first_name, last_name, phone')
                        .eq('id', order.client_id)
                        .single();

                    setIncomingOrder({
                        id: order.id,
                        client_id: order.client_id,
                        delivery_address: order.delivery_address,
                        quantity_liters: order.quantity_liters,
                        estimated_price: order.estimated_price ?? 1200,
                        client_name: profile
                            ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
                            : t('common.unknown'),
                        client_phone: profile?.phone ?? '',
                        distance_km: 3.5,
                        eta_min: 7,
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [session?.user?.id]);

    const handleAccept = async () => {
        if (!incomingOrder || responding) return;
        setResponding(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'assigned' })
                .eq('id', incomingOrder.id);
            if (error) throw error;

            // Mark driver as unavailable
            if (session?.user?.id) {
                await supabase
                    .from('drivers')
                    .update({ is_available: false })
                    .eq('id', session.user.id);
            }

            const order = incomingOrder;
            setIncomingOrder(null);

            // Navigate to active delivery
            router.push({
                pathname: '/active-delivery',
                params: {
                    orderId: order.id,
                    clientName: order.client_name,
                    clientPhone: order.client_phone,
                    clientAddress: order.delivery_address ?? '',
                },
            });
        } catch (err: any) {
            console.error('Accept error:', err);
        } finally {
            setResponding(false);
        }
    };

    const handleDecline = async () => {
        if (!incomingOrder || responding) return;
        setResponding(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'cancelled' })
                .eq('id', incomingOrder.id);
            if (error) throw error;
            setIncomingOrder(null);
        } catch (err: any) {
            console.error('Decline error:', err);
        } finally {
            setResponding(false);
        }
    };

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: Colors.gray400,
                    tabBarStyle: {
                        backgroundColor: Colors.white,
                        borderTopColor: Colors.slate100,
                        borderTopWidth: 1,
                        paddingTop: 8,
                        paddingBottom: 8 + insets.bottom,
                        height: 64 + insets.bottom,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 40,
                        elevation: 10,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: t('tabs.home'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t('tabs.dashboard'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="dashboard" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="missions"
                    options={{
                        title: t('tabs.missions'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="list-alt" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="revenue"
                    options={{
                        title: t('tabs.revenue'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="account-balance-wallet" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: t('tabs.profile'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="person" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>

            {/* Incoming order modal — shown on top of all tabs */}
            <Modal
                visible={!!incomingOrder}
                transparent
                animationType="none"
                statusBarTranslucent
            >
                <View style={styles.overlay}>
                    <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
                        {/* Decoration blobs */}
                        <View style={styles.blob1} />
                        <View style={styles.blob2} />

                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.alertIconBg}>
                                <MaterialIcons name="notifications-active" size={28} color={Colors.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>{t('incoming.title')}</Text>
                                <Text style={styles.modalSub}>{t('incoming.subtitle')}</Text>
                            </View>
                        </View>

                        {/* Client info */}
                        <View style={styles.clientRow}>
                            <View style={styles.clientAvatar}>
                                <MaterialIcons name="person" size={22} color={Colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.clientLabel}>{t('incoming.client')}</Text>
                                <Text style={styles.clientName}>{incomingOrder?.client_name}</Text>
                            </View>
                        </View>

                        {/* Stats grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <MaterialIcons name="place" size={20} color={Colors.primary} />
                                <Text style={styles.statValue}>{incomingOrder?.distance_km?.toFixed(1)} km</Text>
                                <Text style={styles.statLabel}>{t('incoming.distance')}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <MaterialIcons name="schedule" size={20} color={Colors.primary} />
                                <Text style={styles.statValue}>{incomingOrder?.eta_min} min</Text>
                                <Text style={styles.statLabel}>{t('incoming.eta')}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <MaterialIcons name="payments" size={20} color={Colors.statusGreen} />
                                <Text style={[styles.statValue, { color: Colors.statusGreen }]}>
                                    {(incomingOrder?.estimated_price ?? 1200).toLocaleString('fr-FR')}
                                </Text>
                                <Text style={styles.statLabel}>DA</Text>
                            </View>
                        </View>

                        {/* Address */}
                        {incomingOrder?.delivery_address && (
                            <View style={styles.addressRow}>
                                <MaterialIcons name="location-on" size={16} color={Colors.slate400} />
                                <Text style={styles.addressText} numberOfLines={2}>
                                    {incomingOrder.delivery_address}
                                </Text>
                            </View>
                        )}

                        {/* Volume */}
                        <View style={styles.volumeChip}>
                            <MaterialIcons name="opacity" size={16} color={Colors.primary} />
                            <Text style={styles.volumeText}>
                                {incomingOrder?.quantity_liters?.toLocaleString('fr-FR')} L
                            </Text>
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.declineBtn, responding && { opacity: 0.6 }]}
                                onPress={handleDecline}
                                disabled={responding}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="close" size={22} color={Colors.statusRed} />
                                <Text style={styles.declineBtnText}>{t('incoming.decline')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.acceptBtn, responding && { opacity: 0.6 }]}
                                onPress={handleAccept}
                                disabled={responding}
                                activeOpacity={0.85}
                            >
                                <MaterialIcons name="check" size={22} color={Colors.white} />
                                <Text style={styles.acceptBtnText}>
                                    {responding ? t('common.loading') : t('incoming.accept')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: Platform.OS === 'ios' ? 40 : 28,
        gap: 16,
        overflow: 'hidden',
        ...Shadows.float,
    },
    blob1: {
        position: 'absolute', right: -40, top: -40,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: `${Colors.primary}08`,
    },
    blob2: {
        position: 'absolute', left: -20, bottom: -20,
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: `${Colors.primary}06`,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    alertIconBg: {
        width: 56, height: 56, borderRadius: 16,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.extrabold,
        color: Colors.slate800,
    },
    modalSub: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
        marginTop: 2,
    },
    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.backgroundLight,
        borderRadius: BorderRadius.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    clientAvatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: `${Colors.primary}12`,
        alignItems: 'center', justifyContent: 'center',
    },
    clientLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
    clientName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    statsGrid: {
        flexDirection: 'row',
        backgroundColor: Colors.backgroundLight,
        borderRadius: BorderRadius.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.slate200,
        marginHorizontal: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
    },
    addressText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.slate500,
        fontWeight: FontWeight.medium,
    },
    volumeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: `${Colors.primary}10`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
    },
    volumeText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    declineBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: BorderRadius.full,
        borderWidth: 2,
        borderColor: Colors.statusRed,
    },
    declineBtnText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.statusRed,
    },
    acceptBtn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
        ...Shadows.floatSm,
    },
    acceptBtnText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
});
