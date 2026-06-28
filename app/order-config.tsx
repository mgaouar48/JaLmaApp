import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Alert, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton } from '../src/components';
import { usePromo } from '../src/context/PromoContext';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { supabase } from '../src/lib/supabase';

const TLEMCEN = { latitude: 34.8828, longitude: -1.3148 };

export default function OrderConfigScreen() {
    const { t } = useTranslation();
    const params = useLocalSearchParams<{
        transporterId?: string;
        transporterFirstName?: string;
        transporterLastName?: string;
        transporterRating?: string;
        transporterCapacity?: string;
        transporterPrice?: string;
        transporterLat?: string;
        transporterLon?: string;
    }>();
    const transporterName = params.transporterFirstName && params.transporterLastName
        ? `${params.transporterFirstName} ${params.transporterLastName}`
        : t('orderConfig.transporter');
    const transporterRating = params.transporterRating ? parseFloat(params.transporterRating) : 4.5;
    const transporterCapacity = params.transporterCapacity ? parseInt(params.transporterCapacity) : 5000;
    const transporterPrice = params.transporterPrice ? parseInt(params.transporterPrice) : 1500;

    const volumes = [
        { id: 'selected', label: `${transporterCapacity.toLocaleString('fr-FR')} L`, price: transporterPrice, priceDisplay: `${transporterPrice.toLocaleString('fr-FR')} DA`, icon: 'opacity' as const },
    ];
    const { promoCode: globalPromoCode } = usePromo();
    const [selectedVolume, setSelectedVolume] = useState('selected');
    const [submitting, setSubmitting] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showFullMap, setShowFullMap] = useState(false);
    const fullMapRef = useRef<MapView>(null);
    const insets = useSafeAreaInsets();

    // Location state
    const mapRef = useRef<MapView>(null);
    const [locationGranted, setLocationGranted] = useState(false);
    const [address, setAddress] = useState('24 Rue Didouche Mourad, Alger');
    const [pinCoordinate, setPinCoordinate] = useState({
        latitude: TLEMCEN.latitude,
        longitude: TLEMCEN.longitude,
    });
    const [mapRegion, setMapRegion] = useState({
        latitude: TLEMCEN.latitude,
        longitude: TLEMCEN.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
    });
    // Store the user's real GPS location separately from the pin
    const userLocation = useRef({ latitude: TLEMCEN.latitude, longitude: TLEMCEN.longitude });

    const selectedVol = volumes.find((v) => v.id === selectedVolume);
    const finalPrice = selectedVol ? selectedVol.price - appliedDiscount : 0;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            setLocationGranted(true);
            let loc = await Location.getCurrentPositionAsync({});
            const coord = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            };
            userLocation.current = coord;
            setPinCoordinate(coord);
            const newRegion = { ...coord, latitudeDelta: 0.008, longitudeDelta: 0.008 };
            setMapRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 500);
        })();
    }, []);

    useEffect(() => {
        if (globalPromoCode) {
            setPromoCode(globalPromoCode);
            if (globalPromoCode.toUpperCase() === 'JALMA26') {
                setAppliedDiscount(500);
                setPromoMessage({ type: 'success', text: t('orderConfig.globalPromoApplied', { discount: '500' }) });
            } else if (globalPromoCode.toUpperCase() === 'SUMMER') {
                setAppliedDiscount(1500);
                setPromoMessage({ type: 'success', text: t('orderConfig.summerPromoApplied') });
            }
        }
    }, [globalPromoCode]);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return;
        if (promoCode.toUpperCase() === 'JALMA26') {
            setAppliedDiscount(500);
            setPromoMessage({ type: 'success', text: t('orderConfig.promoApplied', { discount: '500' }) });
        } else if (promoCode.toUpperCase() === 'SUMMER') {
            setAppliedDiscount(1500);
            setPromoMessage({ type: 'success', text: t('orderConfig.summerPromoApplied') });
        } else {
            setAppliedDiscount(0);
            setPromoMessage({ type: 'error', text: t('orderConfig.invalidPromo') });
        }
    };

    const handleMarkerDrag = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setPinCoordinate({ latitude, longitude });
        // Simulate reverse geocoding
        setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    };

    const handleMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setPinCoordinate({ latitude, longitude });
        setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('orderConfig.orderFor', { name: transporterName })}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Volume Selection */}
                <Text style={styles.sectionTitle}>{t('orderConfig.waterVolume')}</Text>
                <Text style={styles.sectionDesc}>
                    {t('orderConfig.selectCapacity')}
                </Text>

                <View style={styles.volumeList}>
                    {volumes.map((vol) => {
                        const isActive = selectedVolume === vol.id;
                        return (
                            <TouchableOpacity
                                key={vol.id}
                                style={[styles.volumeCard, isActive && styles.volumeCardActive]}
                                onPress={() => setSelectedVolume(vol.id)}
                                activeOpacity={0.8}
                            >
                                {isActive && <View style={styles.volumeCardGlow} />}
                                <View
                                    style={[
                                        styles.volumeIconBg,
                                        isActive && styles.volumeIconBgActive,
                                    ]}
                                >
                                    <MaterialIcons
                                        name={vol.icon}
                                        size={28}
                                        color={isActive ? Colors.white : Colors.primary}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.volumeLabel,
                                        isActive && styles.volumeLabelActive,
                                    ]}
                                >
                                    {vol.label}
                                </Text>
                                <Text
                                    style={[
                                        styles.volumePrice,
                                        isActive && styles.volumePriceActive,
                                    ]}
                                >
                                    {vol.priceDisplay}
                                </Text>
                                {isActive && (
                                    <View style={styles.checkBadge}>
                                        <MaterialIcons name="check" size={14} color={Colors.white} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Promo Code Section */}
                <Text style={[styles.sectionTitle, { marginTop: 32 }]}>{t('orderConfig.promoCode')}</Text>
                <View style={styles.promoContainer}>
                    <View style={styles.promoInputWrapper}>
                        <TextInput
                            style={styles.promoInput}
                            placeholder={t('orderConfig.enterPromo')}
                            placeholderTextColor={Colors.slate400}
                            value={promoCode}
                            onChangeText={(text) => {
                                setPromoCode(text);
                                if (promoMessage) setPromoMessage(null);
                            }}
                            autoCapitalize="characters"
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.applyBtn, !promoCode && styles.applyBtnDisabled]}
                        onPress={handleApplyPromo}
                        disabled={!promoCode}
                    >
                        <Text style={styles.applyBtnText}>{t('orderConfig.apply')}</Text>
                    </TouchableOpacity>
                </View>
                {promoMessage && (
                    <Text style={[
                        styles.promoMessage,
                        promoMessage.type === 'error' ? styles.promoError : styles.promoSuccess
                    ]}>
                        {promoMessage.text}
                    </Text>
                )}

                {/* Delivery Location */}
                <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
                    {t('orderConfig.deliveryLocation')}
                </Text>
                <Text style={styles.sectionDesc}>
                    {t('orderConfig.enterAddressOrPin')}
                </Text>

                {/* Editable address input */}
                <View style={styles.addressInputCard}>
                    <View style={styles.addressIconBg}>
                        <MaterialIcons name="place" size={20} color={Colors.primary} />
                    </View>
                    <TextInput
                        style={styles.addressInput}
                        value={address}
                        onChangeText={setAddress}
                        placeholder={t('orderConfig.enterAddress')}
                        placeholderTextColor={Colors.slate400}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            // Re-center map on current location
                            mapRef.current?.animateToRegion(mapRegion, 500);
                        }}
                    >
                        <MaterialIcons name="my-location" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Real Map with tap-to-place pin */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={mapRegion}
                        onPress={handleMapPress}
                        showsUserLocation={locationGranted}
                        showsMyLocationButton={false}
                    >
                        <Marker
                            coordinate={pinCoordinate}
                            pinColor={Colors.primary}
                        />
                    </MapView>
                    <View style={styles.mapHint}>
                        <MaterialIcons name="touch-app" size={14} color={Colors.white} />
                        <Text style={styles.mapHintText}>{t('orderConfig.tapOrDragPin')}</Text>
                    </View>
                    {/* Expand button */}
                    <TouchableOpacity
                        style={styles.expandBtn}
                        onPress={() => setShowFullMap(true)}
                    >
                        <MaterialIcons name="fullscreen" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Confirmed address */}
                <View style={styles.confirmAddressRow}>
                    <MaterialIcons name="check-circle" size={18} color={Colors.statusGreen} />
                    <Text style={styles.confirmAddressText} numberOfLines={1}>{address}</Text>
                </View>
            </ScrollView>

            {/* Fullscreen Map Modal */}
            <Modal visible={showFullMap} animationType="slide">
                <View style={styles.fullMapContainer}>
                    <MapView
                        ref={fullMapRef}
                        provider={PROVIDER_GOOGLE}
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={{
                            ...pinCoordinate,
                            latitudeDelta: 0.008,
                            longitudeDelta: 0.008,
                        }}
                        onPress={handleMapPress}
                        showsUserLocation={locationGranted}
                        showsMyLocationButton={false}
                    >
                        <Marker
                            coordinate={pinCoordinate}
                            pinColor={Colors.primary}
                        />
                    </MapView>

                    {/* Close button */}
                    <TouchableOpacity
                        style={[styles.fullMapCloseBtn, { top: insets.top + 12 }]}
                        onPress={() => setShowFullMap(false)}
                    >
                        <MaterialIcons name="close" size={22} color={Colors.primary} />
                    </TouchableOpacity>

                    {/* My location button — goes to real GPS position */}
                    <TouchableOpacity
                        style={[styles.fullMapLocBtn, { top: insets.top + 12 }]}
                        onPress={() => {
                            fullMapRef.current?.animateToRegion({
                                ...userLocation.current,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008,
                            }, 500);
                        }}
                    >
                        <MaterialIcons name="my-location" size={22} color={Colors.primary} />
                    </TouchableOpacity>

                    {/* Address label */}
                    <View style={[styles.fullMapAddress, { bottom: insets.bottom + 80 }]}>
                        <MaterialIcons name="place" size={16} color={Colors.primary} />
                        <Text style={styles.fullMapAddressText} numberOfLines={1}>{address}</Text>
                    </View>

                    {/* Confirm button — centers small map on pin position */}
                    <TouchableOpacity
                        style={[styles.fullMapConfirmBtn, { bottom: insets.bottom + 20 }]}
                        onPress={() => {
                            const pinRegion = { ...pinCoordinate, latitudeDelta: 0.008, longitudeDelta: 0.008 };
                            setMapRegion(pinRegion);
                            setShowFullMap(false);
                            // Animate the small map to the confirmed pin location
                            setTimeout(() => {
                                mapRef.current?.animateToRegion(pinRegion, 500);
                            }, 300);
                        }}
                        activeOpacity={0.9}
                    >
                        <MaterialIcons name="check" size={20} color={Colors.white} />
                        <Text style={styles.fullMapConfirmText}>{t('orderConfig.confirmPosition')}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Bottom summary */}
            <View style={styles.bottomBar}>
                <View style={styles.summaryRow}>
                    <View>
                        <Text style={styles.summaryLabel}>{t('orderConfig.estimatedTotal')}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                            {appliedDiscount > 0 && (
                                <Text style={styles.oldPrice}>{selectedVol?.priceDisplay}</Text>
                            )}
                            <Text style={styles.summaryValue}>
                                {finalPrice <= 0 ? t('orderConfig.free') : `${finalPrice.toLocaleString('fr-FR').replace(/\s/g, ' ')} DA`}
                            </Text>
                        </View>
                    </View>
                    <PrimaryButton
                        title={submitting ? t('common.loading') : t('common.confirm')}
                        icon="check"
                        disabled={submitting}
                        onPress={async () => {
                            setSubmitting(true);
                            try {
                                // Get the current session to ensure we have a valid token
                                const { data: { session } } = await supabase.auth.getSession();
                                if (!session) {
                                    Alert.alert(t('common.error'), 'Session expirée. Veuillez vous reconnecter.');
                                    setSubmitting(false);
                                    return;
                                }

                                const { data, error } = await supabase.functions.invoke('create-order', {
                                    headers: {
                                        Authorization: `Bearer ${session.access_token}`,
                                    },
                                    body: {
                                        delivery_lat: pinCoordinate.latitude,
                                        delivery_lon: pinCoordinate.longitude,
                                        delivery_address: address,
                                        quantity_liters: transporterCapacity,
                                        driver_id: params.transporterId || null,
                                        estimated_price: finalPrice,
                                    },
                                });
                                if (error) throw error;
                                router.push({
                                    pathname: '/live-tracking',
                                    params: {
                                        orderId: data?.order_id,
                                        transporterFirstName: params.transporterFirstName || '',
                                        transporterLastName: params.transporterLastName || '',
                                        transporterRating: String(transporterRating),
                                        transporterCapacity: String(transporterCapacity),
                                        transporterPrice: String(transporterPrice),
                                        transporterLat: params.transporterLat || String(TLEMCEN.latitude + 0.008),
                                        transporterLon: params.transporterLon || String(TLEMCEN.longitude - 0.006),
                                    },
                                });
                            } catch (err: any) {
                                Alert.alert(t('common.error'), err.message || t('orderConfig.orderFailed'));
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                        variant="accent"
                        style={{ paddingHorizontal: 32 }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 120,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        marginBottom: 20,
    },
    volumeList: {
        gap: 12,
    },
    volumeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.transparent,
        ...Shadows.floatSm,
        position: 'relative',
        overflow: 'hidden',
    },
    volumeCardActive: {
        borderColor: Colors.primary,
        backgroundColor: `${Colors.primary}08`,
    },
    volumeCardGlow: {
        position: 'absolute',
        right: -20,
        top: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${Colors.primary}15`,
    },
    volumeIconBg: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    volumeIconBgActive: {
        backgroundColor: Colors.primary,
    },
    volumeLabel: {
        flex: 1,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    volumeLabelActive: {
        color: Colors.primary,
    },
    volumePrice: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate500,
    },
    volumePriceActive: {
        color: Colors.primary,
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Address input
    addressInputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 12,
        gap: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        ...Shadows.floatSm,
        marginBottom: 16,
    },
    addressIconBg: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    addressInput: {
        flex: 1,
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.slate800,
    },
    // Map
    mapContainer: {
        height: 200,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadows.floatSm,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    pinContainer: {
        alignItems: 'center',
    },
    pinHead: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: Colors.white,
        ...Shadows.float,
    },
    pinTail: {
        width: 4, height: 12,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: -2,
    },
    mapHint: {
        position: 'absolute',
        bottom: 8,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
    },
    mapHintText: {
        fontSize: FontSize.xs,
        color: Colors.white,
        fontWeight: FontWeight.medium,
    },
    confirmAddressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        paddingHorizontal: 4,
    },
    confirmAddressText: {
        flex: 1,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate600,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        ...Shadows.float,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.primary,
    },
    oldPrice: {
        fontSize: FontSize.sm,
        color: Colors.slate400,
        textDecorationLine: 'line-through',
        marginBottom: 6,
    },
    promoContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    promoInputWrapper: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.slate200,
        paddingHorizontal: 16,
        justifyContent: 'center',
        height: 50,
    },
    promoInput: {
        fontSize: FontSize.base,
        color: Colors.slate800,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    applyBtn: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    applyBtnDisabled: {
        backgroundColor: Colors.slate300,
    },
    applyBtnText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: FontSize.sm,
    },
    promoMessage: {
        fontSize: FontSize.sm,
        marginTop: 8,
        marginLeft: 4,
    },
    promoSuccess: {
        color: Colors.statusGreen || '#10b981',
    },
    promoError: {
        color: Colors.statusRed || '#ef4444',
    },
    // Expand button on mini map
    expandBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
    },
    // Fullscreen map modal
    fullMapContainer: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },
    fullMapCloseBtn: {
        position: 'absolute',
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
    },
    fullMapLocBtn: {
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
    fullMapAddress: {
        position: 'absolute',
        left: 24,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: BorderRadius.lg,
        ...Shadows.floatSm,
    },
    fullMapAddressText: {
        flex: 1,
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    fullMapConfirmBtn: {
        position: 'absolute',
        left: 24,
        right: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: BorderRadius.full,
        ...Shadows.fab,
    },
    fullMapConfirmText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
});
