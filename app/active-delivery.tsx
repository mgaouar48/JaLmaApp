import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, Linking, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Tlemcen center as fallback
const TLEMCEN = { latitude: 34.8828, longitude: -1.3148 };

export default function ActiveDeliveryScreen() {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const { t } = useTranslation();
    const params = useLocalSearchParams<{
        orderId?: string;
        clientName?: string;
        clientPhone?: string;
        clientAddress?: string;
        distance?: string;
        tarif?: string;
        volume?: string;
        clientLat?: string;
        clientLon?: string;
    }>();

    const orderId = params.orderId || 'CMD-2024-0847';
    const clientName = params.clientName || 'Karim Belkacem';
    const clientPhone = params.clientPhone || '+213 6 55 12 34 56';
    const clientAddress = params.clientAddress || '12 Rue Didouche Mourad, Tlemcen';
    const distance = params.distance || '2.3 km';
    const tarif = params.tarif || '1 500 DA';
    const volume = params.volume || '3 000 L';

    // Client destination
    const clientLat = params.clientLat ? parseFloat(params.clientLat) : TLEMCEN.latitude - 0.01;
    const clientLon = params.clientLon ? parseFloat(params.clientLon) : TLEMCEN.longitude + 0.008;

    const [driverPosition, setDriverPosition] = useState({
        latitude: TLEMCEN.latitude,
        longitude: TLEMCEN.longitude,
    });
    const [progress, setProgress] = useState(0.05);
    const [eta, setEta] = useState(15);
    const [arrived, setArrived] = useState(false);

    // Driver position stays in Tlemcen for simulation
    // (real GPS would move it outside the simulation area → blue map)

    // Simulate driver moving toward client
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPosition((prev) => {
                const newLat = prev.latitude + (clientLat - prev.latitude) * 0.05;
                const newLon = prev.longitude + (clientLon - prev.longitude) * 0.05;
                return { latitude: newLat, longitude: newLon };
            });
            setProgress((p) => Math.min(p + 0.02, 0.95));
            setEta((e) => Math.max(e - 0.3, 0));
        }, 2500);
        return () => clearInterval(interval);
    }, [clientLat, clientLon]);

    // Check if arrived (within ~100m)
    useEffect(() => {
        const dist = Math.sqrt(
            Math.pow((driverPosition.latitude - clientLat) * 111000, 2) +
            Math.pow((driverPosition.longitude - clientLon) * 85000, 2)
        );
        if (dist < 100 && !arrived) {
            setArrived(true);
            setProgress(1);
            setEta(0);
        }
    }, [driverPosition]);

    // Fit map to both points
    useEffect(() => {
        const timer = setTimeout(() => {
            mapRef.current?.fitToCoordinates(
                [driverPosition, { latitude: clientLat, longitude: clientLon }],
                { edgePadding: { top: 140, right: 60, bottom: 380, left: 60 }, animated: true }
            );
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleCall = () => {
        Linking.openURL(`tel:${clientPhone.replace(/\s/g, '')}`);
    };

    const handleFinalize = () => {
        Alert.alert(
            t('delivery.deliveryComplete'),
            t('delivery.orderFinalized', { orderId }),
            [{ text: t('common.ok'), onPress: () => router.back() }]
        );
    };

    const handleRecenter = () => {
        mapRef.current?.fitToCoordinates(
            [driverPosition, { latitude: clientLat, longitude: clientLon }],
            { edgePadding: { top: 140, right: 60, bottom: 380, left: 60 }, animated: true }
        );
    };

    const remainingDistKm = Math.sqrt(
        Math.pow((driverPosition.latitude - clientLat) * 111, 2) +
        Math.pow((driverPosition.longitude - clientLon) * 85, 2)
    );

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: TLEMCEN.latitude,
                    longitude: TLEMCEN.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
            >
                {/* Driver (me) marker */}
                <Marker coordinate={driverPosition}>
                    <View style={styles.driverMarkerOuter}>
                        <View style={styles.driverPulse} />
                        <View style={styles.driverIcon}>
                            <MaterialIcons name="local-shipping" size={20} color={Colors.white} />
                        </View>
                        <Text style={styles.driverLabel}>{t('delivery.me')}</Text>
                    </View>
                </Marker>

                {/* Client destination marker */}
                <Marker coordinate={{ latitude: clientLat, longitude: clientLon }}>
                    <View style={styles.clientMarkerOuter}>
                        <View style={styles.clientIcon}>
                            <MaterialIcons name="place" size={20} color={Colors.white} />
                        </View>
                        <Text style={styles.clientLabel}>{clientName.split(' ')[0]}</Text>
                    </View>
                </Marker>
            </MapView>

            {/* Top bar */}
            <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>

                <View style={styles.orderIdBadge}>
                    <MaterialIcons name="receipt" size={16} color={Colors.primary} />
                    <Text style={styles.orderIdText}>{orderId}</Text>
                </View>
            </View>

            {/* Recenter */}
            <TouchableOpacity
                style={[styles.recenterBtn, { bottom: insets.bottom + 340 }]}
                onPress={handleRecenter}
            >
                <MaterialIcons name="my-location" size={22} color={Colors.primary} />
            </TouchableOpacity>

            {/* Bottom card */}
            <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.dragHandle} />

                {/* Status & progress */}
                <View style={styles.statusRow}>
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, arrived && styles.statusDotArrived]} />
                        <Text style={styles.statusText}>
                            {arrived ? t('delivery.arrivedAtClient') : t('delivery.enRouteToClient')}
                        </Text>
                    </View>
                    <Text style={styles.liveDistance}>
                        {remainingDistKm.toFixed(1)} km
                    </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarOuter}>
                    <View style={[
                        styles.progressBarInner,
                        { width: `${Math.min(progress * 100, 100)}%` },
                        arrived && styles.progressBarComplete,
                    ]} />
                </View>

                {/* ETA row */}
                <View style={styles.etaRow}>
                    <View style={styles.etaItem}>
                        <MaterialIcons name="schedule" size={18} color={Colors.primary} />
                        <View>
                            <Text style={styles.etaValue}>{arrived ? t('delivery.arrived') : `${Math.max(1, Math.round(eta))} min`}</Text>
                            <Text style={styles.etaLabel}>{t('delivery.remainingTime')}</Text>
                        </View>
                    </View>
                    <View style={styles.etaDivider} />
                    <View style={styles.etaItem}>
                        <MaterialIcons name="straighten" size={18} color={Colors.primary} />
                        <View>
                            <Text style={styles.etaValue}>{distance}</Text>
                            <Text style={styles.etaLabel}>{t('delivery.totalDistance')}</Text>
                        </View>
                    </View>
                    <View style={styles.etaDivider} />
                    <View style={styles.etaItem}>
                        <MaterialIcons name="payments" size={18} color={Colors.accent} />
                        <View>
                            <Text style={[styles.etaValue, { color: Colors.accent }]}>{tarif}</Text>
                            <Text style={styles.etaLabel}>{t('delivery.tariff')}</Text>
                        </View>
                    </View>
                </View>

                {/* Client info */}
                <View style={styles.clientInfo}>
                    <View style={styles.clientAvatar}>
                        <MaterialIcons name="person" size={22} color={Colors.primary} />
                    </View>
                    <View style={styles.clientDetails}>
                        <Text style={styles.clientName}>{clientName}</Text>
                        <Text style={styles.clientAddress} numberOfLines={1}>{clientAddress}</Text>
                    </View>
                    <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                        <MaterialIcons name="phone" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Action buttons */}
                <View style={styles.actions}>
                    {arrived ? (
                        <TouchableOpacity
                            style={styles.finalizeBtn}
                            onPress={handleFinalize}
                            activeOpacity={0.85}
                        >
                            <MaterialIcons name="check-circle" size={22} color={Colors.white} />
                            <Text style={styles.finalizeBtnText}>{t('delivery.finalizeDelivery')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.callFullBtn} onPress={handleCall}>
                                <MaterialIcons name="phone" size={20} color={Colors.white} />
                                <Text style={styles.callFullText}>{t('tracking.call')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.arriveEarlyBtn}
                                onPress={() => {
                                    setArrived(true);
                                    setProgress(1);
                                    setEta(0);
                                }}
                            >
                                <MaterialIcons name="flag" size={20} color={Colors.primary} />
                                <Text style={styles.arriveEarlyText}>{t('delivery.iArrived')}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },
    // Driver marker
    driverMarkerOuter: {
        alignItems: 'center',
    },
    driverPulse: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: `${Colors.primary}20`,
        top: -8,
    },
    driverIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
        ...Shadows.float,
    },
    driverLabel: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    // Client marker
    clientMarkerOuter: {
        alignItems: 'center',
    },
    clientIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
        ...Shadows.float,
    },
    clientLabel: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: FontWeight.bold,
        color: Colors.white,
        backgroundColor: Colors.accent,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    // Top bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    orderIdBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.white,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        ...Shadows.floatSm,
    },
    orderIdText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    recenterBtn: {
        position: 'absolute',
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
    },
    // Bottom card
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        ...Shadows.float,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.slate300,
        alignSelf: 'center',
        marginBottom: 16,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.statusGreen,
    },
    statusDotArrived: {
        backgroundColor: Colors.accent,
    },
    statusText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    liveDistance: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        fontWeight: FontWeight.medium,
    },
    progressBarOuter: {
        height: 6,
        backgroundColor: Colors.slate200,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressBarInner: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    progressBarComplete: {
        backgroundColor: Colors.accent,
    },
    // ETA row
    etaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${Colors.primary}08`,
        borderRadius: BorderRadius.lg,
        padding: 14,
        marginBottom: 16,
    },
    etaItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    etaValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    etaLabel: {
        fontSize: 10,
        color: Colors.slate400,
    },
    etaDivider: {
        width: 1,
        height: 28,
        backgroundColor: Colors.slate200,
        marginHorizontal: 6,
    },
    // Client info
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        marginBottom: 16,
    },
    clientAvatar: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    clientDetails: { flex: 1 },
    clientName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
        marginBottom: 2,
    },
    clientAddress: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
    },
    callBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: Colors.statusGreen,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    // Actions
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    callFullBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        flex: 1,
        paddingVertical: 15,
        borderRadius: BorderRadius.full,
        ...Shadows.button,
    },
    callFullText: {
        color: Colors.white,
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    arriveEarlyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flex: 1,
        paddingVertical: 15,
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.primary}10`,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    arriveEarlyText: {
        color: Colors.primary,
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    finalizeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flex: 1,
        backgroundColor: '#22c55e',
        paddingVertical: 16,
        borderRadius: BorderRadius.full,
        ...Shadows.fab,
    },
    finalizeBtnText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
});
