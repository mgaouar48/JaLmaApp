import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const TLEMCEN = { latitude: 34.8828, longitude: -1.3148 };

export default function LiveTrackingScreen() {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const { t } = useTranslation();
    const params = useLocalSearchParams<{
        transporterFirstName?: string;
        transporterLastName?: string;
        transporterRating?: string;
        transporterCapacity?: string;
        transporterPrice?: string;
        transporterLat?: string;
        transporterLon?: string;
    }>();

    const driverName = params.transporterFirstName && params.transporterLastName
        ? `${params.transporterFirstName} ${params.transporterLastName}`
        : 'Ahmed Bensaid';
    const driverRating = params.transporterRating ? parseFloat(params.transporterRating) : 4.8;
    const driverCapacity = params.transporterCapacity ? parseInt(params.transporterCapacity) : 3000;

    const [userLocation, setUserLocation] = useState({
        latitude: TLEMCEN.latitude,
        longitude: TLEMCEN.longitude,
    });

    // Driver starts from transporter's real position
    const driverStartLat = params.transporterLat ? parseFloat(params.transporterLat) : TLEMCEN.latitude + 0.008;
    const driverStartLon = params.transporterLon ? parseFloat(params.transporterLon) : TLEMCEN.longitude - 0.006;

    const [driverPosition, setDriverPosition] = useState({
        latitude: driverStartLat,
        longitude: driverStartLon,
    });
    const [progress, setProgress] = useState(0.15);
    const [eta, setEta] = useState(12);

    // User location stays in Tlemcen for simulation
    // (real GPS would move it outside the simulation area → blue map)

    // Simulate driver movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPosition((prev) => ({
                latitude: prev.latitude + (userLocation.latitude - prev.latitude) * 0.05,
                longitude: prev.longitude + (userLocation.longitude - prev.longitude) * 0.05,
            }));
            setProgress((p) => Math.min(p + 0.02, 0.95));
            setEta((e) => Math.max(e - 0.3, 1));
        }, 2000);
        return () => clearInterval(interval);
    }, [userLocation]);

    // Fit both markers
    useEffect(() => {
        const timer = setTimeout(() => {
            mapRef.current?.fitToCoordinates(
                [userLocation, driverPosition],
                { edgePadding: { top: 120, right: 60, bottom: 300, left: 60 }, animated: true }
            );
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleCall = () => {
        Linking.openURL('tel:+213655123456');
    };

    return (
        <View style={styles.container}>
            {/* Real Map */}
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
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
                {/* Driver/Cistern Marker */}
                <Marker coordinate={driverPosition}>
                    <View style={styles.driverMarkerOuter}>
                        <View style={styles.driverPulse} />
                        <View style={styles.driverIcon}>
                            <MaterialIcons name="local-shipping" size={20} color={Colors.white} />
                        </View>
                    </View>
                </Marker>

                {/* Destination Marker */}
                <Marker coordinate={userLocation}>
                    <View style={styles.destMarkerOuter}>
                        <View style={styles.destIcon}>
                            <MaterialIcons name="place" size={20} color={Colors.white} />
                        </View>
                    </View>
                </Marker>
            </MapView>

            {/* Top bar */}
            <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>

                {/* ETA badge */}
                <View style={styles.etaBadge}>
                    <MaterialIcons name="schedule" size={16} color={Colors.statusGreen} />
                    <View>
                        <Text style={styles.etaTime}>{Math.round(eta)} min</Text>
                        <Text style={styles.etaLabel}>{t('tracking.estimatedArrival')}</Text>
                    </View>
                </View>
            </View>

            {/* Recenter Button */}
            <TouchableOpacity
                style={[styles.recenterBtn, { bottom: insets.bottom + 280 }]}
                onPress={() => {
                    mapRef.current?.fitToCoordinates(
                        [userLocation, driverPosition],
                        { edgePadding: { top: 120, right: 60, bottom: 300, left: 60 }, animated: true }
                    );
                }}
            >
                <MaterialIcons name="my-location" size={22} color={Colors.primary} />
            </TouchableOpacity>

            {/* Bottom card */}
            <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.dragHandle} />

                {/* Status & progress */}
                <View style={styles.statusRow}>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>{t('tracking.enRoute')}</Text>
                    </View>
                    <Text style={styles.distanceText}>
                        {(Math.sqrt(
                            Math.pow((driverPosition.latitude - userLocation.latitude) * 111, 2) +
                            Math.pow((driverPosition.longitude - userLocation.longitude) * 85, 2)
                        )).toFixed(1)} km
                    </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarOuter}>
                    <View style={[styles.progressBarInner, { width: `${progress * 100}%` }]} />
                </View>

                {/* Driver info */}
                <View style={styles.driverInfo}>
                    <View style={styles.driverAvatar}>
                        <MaterialIcons name="person" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>{driverName}</Text>
                        <View style={styles.driverMeta}>
                            <View style={styles.ratingBadge}>
                                <MaterialIcons name="star" size={12} color="#f59e0b" />
                                <Text style={styles.ratingText}>{driverRating.toFixed(1)}</Text>
                            </View>
                            <Text style={styles.vehicleInfo}>Citerne {driverCapacity.toLocaleString('fr-FR')}L</Text>
                        </View>
                    </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                        <MaterialIcons name="phone" size={20} color={Colors.white} />
                        <Text style={styles.callText}>{t('tracking.call')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => router.push('/rating')}
                    >
                        <Text style={styles.cancelText}>{t('tracking.simulationDone')}</Text>
                    </TouchableOpacity>
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
        justifyContent: 'center',
    },
    driverPulse: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: `${Colors.primary}20`,
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
    // Destination marker
    destMarkerOuter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    destIcon: {
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
    // Top bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    etaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        ...Shadows.floatSm,
    },
    etaTime: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
    },
    etaLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
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
        paddingHorizontal: 24,
        paddingTop: 12,
        ...Shadows.float,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.slate300,
        alignSelf: 'center',
        marginBottom: 20,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.statusGreen,
    },
    statusText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    distanceText: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        fontWeight: FontWeight.medium,
    },
    progressBarOuter: {
        height: 6,
        backgroundColor: Colors.slate200,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 24,
    },
    progressBarInner: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
        marginBottom: 20,
    },
    driverAvatar: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    driverDetails: { flex: 1 },
    driverName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
        marginBottom: 4,
    },
    driverMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    ratingText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: '#92400e',
    },
    vehicleInfo: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    callBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        flex: 1,
        paddingVertical: 14,
        borderRadius: BorderRadius.lg,
        ...Shadows.button,
    },
    callText: {
        color: Colors.white,
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
    cancelBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.slate100,
    },
    cancelText: {
        color: Colors.slate600,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
});
