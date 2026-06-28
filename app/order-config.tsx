import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Alert, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    const [driverPhone, setDriverPhone] = useState('');

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
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                const coord = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                };
                userLocation.current = coord;
                setPinCoordinate(coord);
                const newRegion = { ...coord, latitudeDelta: 0.008, longitudeDelta: 0.008 };
                setMapRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 500);

                setTimeout(() => setLocationGranted(true), 500);
            } catch (err) {
                console.log('Location error:', err);
                setTimeout(() => setLocationGranted(true), 500);
            }
        })();

        // Fetch driver phone
        if (params.transporterId) {
            supabase
                .from('profiles')
                .select('phone')
                .eq('id', params.transporterId)
                .single()
                .then(({ data }) => {
                    if (data?.phone) setDriverPhone(data.phone);
                });
        }
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
            {/* Blue gradient header */}
            <LinearGradient colors={['#0A4FAD', '#1565C0', '#1A73E8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                {/* Transporter mini-card in header */}
                <View style={styles.headerTransporterRow}>
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerAvatarText}>
                            {(params.transporterFirstName?.[0] ?? '?').toUpperCase()}{(params.transporterLastName?.[0] ?? '?').toUpperCase()}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.headerLabel}>{t('orderConfig.orderFor', { name: '' })}</Text>
                        <Text style={styles.headerName}>{transporterName}</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Transporter info card */}
                <View style={styles.transporterInfoCard}>
                    <View style={styles.transporterInfoLeft}>
                        <MaterialIcons name="local-shipping" size={20} color="#1A73E8" />
                        <View>
                            <Text style={styles.transporterInfoName}>{transporterName}</Text>
                            <Text style={styles.transporterInfoMeta}>
                                {transporterCapacity.toLocaleString('fr-FR')} L · {transporterPrice.toLocaleString('fr-FR')} DA
                            </Text>
                        </View>
                    </View>
                    <View style={styles.onlineBadge}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>En ligne</Text>
                    </View>
                </View>

                {/* Volume Selection */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionIconBg}>
                        <MaterialIcons name="water-drop" size={16} color="#1A73E8" />
                    </View>
                    <View>
                        <Text style={styles.sectionTitle}>{t('orderConfig.waterVolume')}</Text>
                        <Text style={styles.sectionDesc}>{t('orderConfig.selectCapacity')}</Text>
                    </View>
                </View>

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
                <View style={[styles.sectionHeader, { marginTop: 28 }]}>
                    <View style={[styles.sectionIconBg, { backgroundColor: '#fef9ec' }]}>
                        <MaterialIcons name="local-offer" size={16} color="#d97706" />
                    </View>
                    <View>
                        <Text style={styles.sectionTitle}>{t('orderConfig.promoCode')}</Text>
                        <Text style={styles.sectionDesc}>Réduction instantanée sur votre commande</Text>
                    </View>
                </View>
                <View style={styles.promoContainer}>
                    <View style={styles.promoInputWrapper}>
                        <MaterialIcons name="confirmation-number" size={18} color={Colors.slate400} style={{ marginLeft: 12 }} />
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
                        style={[!promoCode && styles.applyBtnDisabled]}
                        onPress={handleApplyPromo}
                        disabled={!promoCode}
                    >
                        <LinearGradient
                            colors={promoCode ? ['#0A4FAD', '#1565C0', '#1A73E8'] : ['#cbd5e1', '#cbd5e1', '#cbd5e1']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.applyBtn}
                        >
                            <Text style={styles.applyBtnText}>{t('orderConfig.apply')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {promoMessage && (
                    <View style={[styles.promoMessageRow, promoMessage.type === 'error' ? styles.promoErrorRow : styles.promoSuccessRow]}>
                        <MaterialIcons name={promoMessage.type === 'error' ? 'error-outline' : 'check-circle'} size={16} color={promoMessage.type === 'error' ? '#ef4444' : '#16a34a'} />
                        <Text style={[styles.promoMessage, promoMessage.type === 'error' ? styles.promoError : styles.promoSuccess]}>
                            {promoMessage.text}
                        </Text>
                    </View>
                )}

                {/* Delivery Location */}
                <View style={[styles.sectionHeader, { marginTop: 28 }]}>
                    <View style={[styles.sectionIconBg, { backgroundColor: '#fff0f0' }]}>
                        <MaterialIcons name="place" size={16} color="#ef4444" />
                    </View>
                    <View>
                        <Text style={styles.sectionTitle}>{t('orderConfig.deliveryLocation')}</Text>
                        <Text style={styles.sectionDesc}>{t('orderConfig.enterAddressOrPin')}</Text>
                    </View>
                </View>

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
                                router.replace({
                                    pathname: '/waiting-for-driver',
                                    params: {
                                        orderId: data?.order_id,
                                        transporterFirstName: params.transporterFirstName || '',
                                        transporterLastName: params.transporterLastName || '',
                                        transporterRating: String(transporterRating),
                                        transporterCapacity: String(transporterCapacity),
                                        transporterPrice: String(transporterPrice),
                                        transporterLat: params.transporterLat || String(TLEMCEN.latitude + 0.008),
                                        transporterLon: params.transporterLon || String(TLEMCEN.longitude - 0.006),
                                        transporterPhone: driverPhone,
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
    container: { flex: 1, backgroundColor: '#f8fafc' },
    // Header
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 20, overflow: 'hidden' },
    decorCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
    decorCircle2: { position: 'absolute', bottom: -30, left: 60, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    headerTransporterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, gap: 12, justifyContent: 'center' },
    headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
    headerAvatarText: { fontSize: FontSize.base, fontWeight: '800' as any, color: Colors.white },
    headerLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', fontWeight: FontWeight.medium },
    headerName: { fontSize: FontSize.lg, fontWeight: '800' as any, color: Colors.white },
    // Scroll
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130 },
    // Transporter info card
    transporterInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 24, borderWidth: 1, borderColor: '#e8edf5', ...Shadows.soft },
    transporterInfoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    transporterInfoName: { fontSize: FontSize.base, fontWeight: '700' as any, color: Colors.slate800 },
    transporterInfoMeta: { fontSize: FontSize.xs, color: Colors.slate500, marginTop: 2 },
    onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22c55e' },
    onlineText: { fontSize: FontSize.xs, fontWeight: '700' as any, color: '#16a34a' },
    // Section header
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    sectionIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center' },
    sectionTitle: { fontSize: FontSize.base, fontWeight: '700' as any, color: Colors.slate800, marginBottom: 1 },
    sectionDesc: { fontSize: FontSize.xs, color: Colors.slate400 },
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.slate200,
        height: 50,
        gap: 8,
    },
    promoInput: {
        flex: 1,
        fontSize: FontSize.base,
        color: Colors.slate800,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        paddingRight: 12,
    },
    applyBtn: {
        borderRadius: BorderRadius.lg,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        overflow: 'hidden',
        shadowColor: '#1A73E8',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    applyBtnDisabled: {
        opacity: 0.55,
    },
    applyBtnText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: FontSize.sm,
    },
    promoMessageRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, padding: 10, borderRadius: 10 },
    promoSuccessRow: { backgroundColor: '#f0fdf4' },
    promoErrorRow: { backgroundColor: '#fef2f2' },
    promoMessage: { fontSize: FontSize.sm, flex: 1 },
    promoSuccess: { color: '#16a34a', fontWeight: FontWeight.semibold },
    promoError: { color: '#ef4444', fontWeight: FontWeight.semibold },
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
