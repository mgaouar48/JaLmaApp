import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

export default function WaitingForDriverScreen() {
    const { t } = useTranslation();
    const params = useLocalSearchParams<{
        orderId: string;
        transporterFirstName?: string;
        transporterLastName?: string;
        transporterRating?: string;
        transporterCapacity?: string;
        transporterPrice?: string;
        transporterLat?: string;
        transporterLon?: string;
        transporterPhone?: string;
    }>();

    const orderId = params.orderId;
    const driverName = params.transporterFirstName && params.transporterLastName
        ? `${params.transporterFirstName} ${params.transporterLastName}`
        : t('common.unknown');

    const [cancelling, setCancelling] = useState(false);
    const [status, setStatus] = useState<'searching' | 'assigned' | 'cancelled' | null>('searching');

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const dotAnim1 = useRef(new Animated.Value(0.3)).current;
    const dotAnim2 = useRef(new Animated.Value(0.3)).current;
    const dotAnim3 = useRef(new Animated.Value(0.3)).current;

    // Pulse animation for the truck icon
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();

        // Dot loading animation
        const animateDots = () => {
            Animated.sequence([
                Animated.timing(dotAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(dotAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(dotAnim3, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.delay(300),
                Animated.parallel([
                    Animated.timing(dotAnim1, { toValue: 0.3, duration: 200, useNativeDriver: true }),
                    Animated.timing(dotAnim2, { toValue: 0.3, duration: 200, useNativeDriver: true }),
                    Animated.timing(dotAnim3, { toValue: 0.3, duration: 200, useNativeDriver: true }),
                ]),
                Animated.delay(200),
            ]).start(animateDots);
        };
        animateDots();
    }, []);

    // Realtime subscription — watch for status change
    useEffect(() => {
        if (!orderId) return;

        const channel = supabase
            .channel(`waiting-order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`,
                },
                (payload: any) => {
                    const newStatus = payload.new?.status;
                    setStatus(newStatus);

                    if (newStatus === 'assigned') {
                        // Driver accepted — navigate to live tracking
                        supabase.removeChannel(channel);
                        router.replace({
                            pathname: '/live-tracking',
                            params: {
                                orderId,
                                transporterFirstName: params.transporterFirstName || '',
                                transporterLastName: params.transporterLastName || '',
                                transporterRating: params.transporterRating || '',
                                transporterCapacity: params.transporterCapacity || '',
                                transporterPrice: params.transporterPrice || '',
                                transporterLat: params.transporterLat || '',
                                transporterLon: params.transporterLon || '',
                                transporterPhone: params.transporterPhone || '',
                            },
                        });
                    } else if (newStatus === 'cancelled') {
                        supabase.removeChannel(channel);
                        Alert.alert(
                            t('waiting.driverDeclined'),
                            t('waiting.driverDeclinedMsg'),
                            [{ text: t('common.ok'), onPress: () => router.back() }]
                        );
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [orderId]);

    const handleCancel = async () => {
        if (cancelling || !orderId) return;
        Alert.alert(
            t('waiting.cancelTitle'),
            t('waiting.cancelMsg'),
            [
                { text: t('common.no'), style: 'cancel' },
                {
                    text: t('common.yes'), style: 'destructive', onPress: async () => {
                        setCancelling(true);
                        try {
                            const { error } = await supabase
                                .from('orders')
                                .update({ status: 'cancelled' })
                                .eq('id', orderId);
                            if (error) throw error;
                            router.back();
                        } catch (err: any) {
                            Alert.alert(t('common.error'), err.message);
                            setCancelling(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Background decorations */}
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />
            <View style={styles.bgCircle3} />

            <View style={styles.content}>
                {/* Animated truck */}
                <View style={styles.iconWrapper}>
                    <View style={styles.iconRing2} />
                    <View style={styles.iconRing1} />
                    <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
                        <MaterialIcons name="local-shipping" size={52} color={Colors.white} />
                    </Animated.View>
                </View>

                {/* Title */}
                <Text style={styles.title}>{t('waiting.title')}</Text>
                <Text style={styles.subtitle}>{t('waiting.subtitle')}</Text>

                {/* Driver name card */}
                <View style={styles.driverCard}>
                    <View style={styles.driverAvatar}>
                        <MaterialIcons name="person" size={22} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.driverLabel}>{t('waiting.driver')}</Text>
                        <Text style={styles.driverName}>{driverName}</Text>
                    </View>
                    {/* Animated dots */}
                    <View style={styles.dotsRow}>
                        {[dotAnim1, dotAnim2, dotAnim3].map((anim, i) => (
                            <Animated.View key={i} style={[styles.dot, { opacity: anim }]} />
                        ))}
                    </View>
                </View>

                {/* Info cards */}
                <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                        <MaterialIcons name="payments" size={20} color={Colors.primary} />
                        <Text style={styles.infoValue}>{params.transporterPrice || '1 200'}</Text>
                        <Text style={styles.infoUnit}>DA</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <MaterialIcons name="opacity" size={20} color={Colors.primary} />
                        <Text style={styles.infoValue}>
                            {params.transporterCapacity
                                ? Number(params.transporterCapacity).toLocaleString('fr-FR')
                                : '—'}
                        </Text>
                        <Text style={styles.infoUnit}>L</Text>
                    </View>
                </View>

                {/* Status badge */}
                <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{t('waiting.waitingConfirmation')}</Text>
                </View>

                {/* Cancel button */}
                <TouchableOpacity
                    style={[styles.cancelBtn, cancelling && { opacity: 0.6 }]}
                    onPress={handleCancel}
                    disabled={cancelling}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="close" size={18} color={Colors.statusRed} />
                    <Text style={styles.cancelText}>
                        {cancelling ? t('common.loading') : t('waiting.cancel')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgCircle1: {
        position: 'absolute', top: -80, right: -80,
        width: 280, height: 280, borderRadius: 140,
        backgroundColor: `${Colors.primary}08`,
    },
    bgCircle2: {
        position: 'absolute', bottom: -60, left: -60,
        width: 220, height: 220, borderRadius: 110,
        backgroundColor: `${Colors.primary}06`,
    },
    bgCircle3: {
        position: 'absolute', top: '40%', left: -40,
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: `${Colors.primary}04`,
    },
    content: {
        width: '100%',
        paddingHorizontal: 32,
        alignItems: 'center',
        gap: 20,
    },
    // Icon
    iconWrapper: {
        width: 140, height: 140,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
    },
    iconRing2: {
        position: 'absolute',
        width: 140, height: 140, borderRadius: 70,
        backgroundColor: `${Colors.primary}10`,
    },
    iconRing1: {
        position: 'absolute',
        width: 108, height: 108, borderRadius: 54,
        backgroundColor: `${Colors.primary}18`,
    },
    iconCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.float,
    },
    // Title
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.slate800,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.slate400,
        textAlign: 'center',
        fontWeight: FontWeight.medium,
        marginTop: -8,
    },
    // Driver card
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.slate100,
        ...Shadows.floatSm,
    },
    driverAvatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: `${Colors.primary}12`,
        alignItems: 'center', justifyContent: 'center',
    },
    driverLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
    driverName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 4,
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    // Info row
    infoRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    infoCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.slate100,
        ...Shadows.floatSm,
    },
    infoValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        flex: 1,
    },
    infoUnit: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
    // Status badge
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: `${Colors.statusGreen}12`,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: `${Colors.statusGreen}30`,
    },
    statusDot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.statusGreen,
    },
    statusText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.statusGreen,
    },
    // Cancel
    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        borderColor: Colors.statusRed,
        marginTop: 8,
    },
    cancelText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.statusRed,
    },
});
