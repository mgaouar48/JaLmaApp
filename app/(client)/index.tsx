import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform,
    FlatList, ScrollView, Animated, PanResponder, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, Shadows, BorderRadius } from '../../src/constants';
import { TransporterCard } from '../../src/components';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import type { AvailableDriver } from '../../src/types/supabase';

const { width, height } = Dimensions.get('window');

// List area heights (just the scrollable list, not the header/filters)
const LIST_MIN = height * 0.15;  // collapsed: small list
const LIST_MAX = height * 0.50;  // expanded: half screen for list
const SNAP_THRESHOLD = (LIST_MAX - LIST_MIN) / 2;

// Haversine distance in km
function haversineDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Tlemcen center
const TLEMCEN = { latitude: 34.8828, longitude: -1.3148 };

type SortKey = 'distance' | 'price';
type CapacityFilter = 0 | 2000 | 3000;

const CAPACITY_OPTIONS: { label: string; value: CapacityFilter }[] = [
    { label: 'all', value: 0 },
    { label: '2000', value: 2000 },
    { label: '3000', value: 3000 },
];

const SORT_KEYS: { key: string; value: SortKey; icon: string }[] = [
    { key: 'distance', value: 'distance', icon: 'near-me' },
    { key: 'price', value: 'price', icon: 'payments' },
];

export default function ClientDashboard() {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationGranted, setLocationGranted] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('distance');
    const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>(0);
    const [panelExpanded, setPanelExpanded] = useState(false);
    const [drivers, setDrivers] = useState<AvailableDriver[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const { t } = useTranslation();
    const { profile } = useAuth();

    // Only the list area height is animated
    const listHeight = useRef(new Animated.Value(LIST_MIN)).current;
    const lastListH = useRef(LIST_MIN);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
            onPanResponderGrant: () => {
                listHeight.stopAnimation((v) => { lastListH.current = v; });
            },
            onPanResponderMove: (_, gs) => {
                // drag up → increase list height (dy negative)
                const newH = lastListH.current - gs.dy;
                listHeight.setValue(Math.max(LIST_MIN, Math.min(LIST_MAX, newH)));
            },
            onPanResponderRelease: (_, gs) => {
                const currentH = lastListH.current - gs.dy;
                let target: number;
                if (gs.vy < -0.5) target = LIST_MAX;
                else if (gs.vy > 0.5) target = LIST_MIN;
                else target = currentH > LIST_MIN + SNAP_THRESHOLD ? LIST_MAX : LIST_MIN;

                setPanelExpanded(target === LIST_MAX);
                lastListH.current = target;
                Animated.spring(listHeight, {
                    toValue: target,
                    useNativeDriver: false,
                    bounciness: 4,
                    speed: 14,
                }).start();
            },
        })
    ).current;

    const togglePanel = () => {
        const target = panelExpanded ? LIST_MIN : LIST_MAX;
        setPanelExpanded(!panelExpanded);
        lastListH.current = target;
        Animated.spring(listHeight, {
            toValue: target,
            useNativeDriver: false,
            bounciness: 4,
            speed: 14,
        }).start();
    };

    // User position, fallback to Tlemcen center
    const userLat = location?.coords.latitude ?? TLEMCEN.latitude;
    const userLon = location?.coords.longitude ?? TLEMCEN.longitude;

    // Location + initial fetch
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                setLocation(loc);
                fetchDrivers(loc.coords.latitude, loc.coords.longitude);

                // Allow UI to render before enabling map's location tracking
                setTimeout(() => setLocationGranted(true), 500);
            } catch (err) {
                console.log('Location error:', err);
                // Fallback to avoid empty state
                setTimeout(() => setLocationGranted(true), 500);
            }
        })();
    }, []);

    const fetchDrivers = async (lat: number, lon: number) => {
        setLoadingDrivers(true);
        const { data, error } = await supabase.rpc('list_available_drivers', {
            p_client_lat: lat,
            p_client_lon: lon,
        });
        setLoadingDrivers(false);
        if (!error && data) setDrivers(data);
    };

    // Realtime subscription — auto-refresh when any driver goes online/offline
    useEffect(() => {
        const channel = supabase
            .channel('drivers-online-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'drivers' },
                () => {
                    // Re-fetch using saved location or fallback
                    const lat = location?.coords.latitude ?? TLEMCEN.latitude;
                    const lon = location?.coords.longitude ?? TLEMCEN.longitude;
                    fetchDrivers(lat, lon);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [location]);

    const transportersWithDistance = useMemo(() => {
        let list = drivers.filter(d =>
            capacityFilter === 0 || d.tank_capacity_liters === capacityFilter
        );
        list = [...list].sort((a, b) => {
            if (sortKey === 'distance') return a.distance_meters - b.distance_meters;
            if (sortKey === 'price') return (a.price_per_delivery ?? 0) - (b.price_per_delivery ?? 0);
            return 0;
        });
        return list;
    }, [drivers, capacityFilter, sortKey]);

    const handleTransporterPress = useCallback((transporter: AvailableDriver) => {
        setSelectedId(transporter.driver_id);
        mapRef.current?.animateToRegion({
            latitude: transporter.lat,
            longitude: transporter.lon,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
        }, 800);
    }, []);

    const handleMarkerPress = useCallback((driverId: string) => {
        setSelectedId(driverId);
        const index = transportersWithDistance.findIndex(d => d.driver_id === driverId);
        if (index >= 0) {
            flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
        }
        if (!panelExpanded) {
            setPanelExpanded(true);
            lastListH.current = LIST_MAX;
            Animated.spring(listHeight, {
                toValue: LIST_MAX,
                useNativeDriver: false,
                bounciness: 4,
                speed: 14,
            }).start();
        }
    }, [transportersWithDistance, panelExpanded]);

    const goToMyLocation = async () => {
        const lat = location?.coords.latitude ?? TLEMCEN.latitude;
        const lon = location?.coords.longitude ?? TLEMCEN.longitude;
        mapRef.current?.animateToRegion({
            latitude: lat, longitude: lon,
            latitudeDelta: 0.02, longitudeDelta: 0.02,
        }, 800);
        if (!location) {
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            mapRef.current?.animateToRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.02, longitudeDelta: 0.02,
            }, 800);
        }
    };

    const initialRegion = {
        latitude: TLEMCEN.latitude,
        longitude: TLEMCEN.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
    };

    const renderTransporterItem = useCallback(({ item }: { item: AvailableDriver }) => (
        <TransporterCard
            firstName={item.first_name}
            lastName={item.last_name}
            rating={0}
            capacity={item.tank_capacity_liters}
            price={item.price_per_delivery}
            distance={item.distance_meters / 1000}
            isSelected={item.driver_id === selectedId}
            onPress={() => handleTransporterPress(item)}
        />
    ), [selectedId, handleTransporterPress]);

    return (
        <View style={styles.container}>
            {/* ── Map area (fills remaining space) ── */}
            <View style={styles.mapArea}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={initialRegion}
                    showsUserLocation={locationGranted}
                    showsMyLocationButton={false}
                >
                    {transportersWithDistance.map((d) => (
                        <Marker
                            key={d.driver_id}
                            coordinate={{ latitude: d.lat, longitude: d.lon }}
                            onPress={() => handleMarkerPress(d.driver_id)}
                        >
                            <View style={styles.markerOuter}>
                                <View style={[
                                    styles.markerInner,
                                    d.driver_id === selectedId && styles.markerInnerSelected,
                                ]}>
                                    <MaterialIcons
                                        name="local-shipping"
                                        size={18}
                                        color={d.driver_id === selectedId ? Colors.white : Colors.primary}
                                    />
                                </View>
                                <Text style={[
                                    styles.markerName,
                                    d.driver_id === selectedId && styles.markerNameSelected,
                                ]}>
                                    {d.first_name?.[0]}.{d.last_name?.[0]}
                                </Text>
                            </View>
                        </Marker>
                    ))}
                </MapView>

                {/* Top Header overlay */}
                <LinearGradient
                    colors={['rgba(10,79,173,0.92)', 'rgba(26,115,232,0.85)']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 40 }]}
                >
                    <View>
                        <Text style={styles.headerDate}>📍 Tlemcen</Text>
                        <Text style={styles.headerName}>{t('client.greeting', { name: profile?.first_name || '' })}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.avatarWrapper}
                        onPress={() => router.push('/edit-profile')}
                    >
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={22} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Map controls */}
                <View style={styles.mapControls}>
                    <TouchableOpacity style={styles.mapControlBtn} onPress={goToMyLocation}>
                        <MaterialIcons name="my-location" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mapControlBtn}
                        onPress={() => router.push('/promos')}
                    >
                        <MaterialIcons name="local-offer" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Bottom Panel (not absolute — part of flex flow) ── */}
            <View style={styles.bottomPanel}>
                {/* Drag handle (always visible) */}
                <View {...panResponder.panHandlers}>
                    <TouchableOpacity onPress={togglePanel} activeOpacity={0.9}>
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>
                        <View style={styles.panelTitleRow}>
                            <Text style={styles.panelTitle}>{t('client.availableTransporters')}</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countBadgeText}>{transportersWithDistance.length}</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <MaterialIcons
                                name={panelExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                                size={24}
                                color={Colors.primary}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Filters (always visible — NOT inside the animated area) */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {SORT_KEYS.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[
                                styles.filterChip,
                                sortKey === opt.value && styles.filterChipActive,
                            ]}
                            onPress={() => setSortKey(opt.value)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name={opt.icon as any}
                                size={14}
                                color={sortKey === opt.value ? Colors.white : Colors.primary}
                            />
                            <Text style={[
                                styles.filterChipText,
                                sortKey === opt.value && styles.filterChipTextActive,
                            ]}>
                                {t(`client.sort_${opt.key}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.filterDivider} />

                    {CAPACITY_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[
                                styles.filterChip,
                                capacityFilter === opt.value && styles.filterChipActive,
                            ]}
                            onPress={() => setCapacityFilter(opt.value)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterChipText,
                                capacityFilter === opt.value && styles.filterChipTextActive,
                            ]}>
                                {opt.label === 'all' ? t('client.all') : `${Number(opt.label).toLocaleString()} L`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Animated list area (this is the only part that collapses) */}
                <Animated.View style={{ height: listHeight }}>
                    <FlatList
                        ref={flatListRef}
                        data={transportersWithDistance}
                        renderItem={renderTransporterItem}
                        keyExtractor={(item) => item.driver_id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialIcons name="search-off" size={48} color={Colors.gray400} />
                                <Text style={styles.emptyText}>Aucun transporteur trouvé</Text>
                                <Text style={styles.emptySubtext}>Essayez de modifier les filtres</Text>
                            </View>
                        }
                        onScrollToIndexFailed={(info) => {
                            setTimeout(() => {
                                flatListRef.current?.scrollToIndex({
                                    index: info.index, animated: true,
                                });
                            }, 300);
                        }}
                    />
                </Animated.View>

                {/* Green order button — visible only when a transporter is selected */}
                {selectedId && (() => {
                    const d = transportersWithDistance.find(x => x.driver_id === selectedId);
                    if (!d) return null;
                    return (
                        <View style={styles.orderBtnContainer}>
                            <TouchableOpacity
                                style={styles.orderBtn}
                                activeOpacity={0.85}
                                onPress={() => router.push({
                                    pathname: '/order-config',
                                    params: {
                                        transporterId: d.driver_id,
                                        transporterFirstName: d.first_name,
                                        transporterLastName: d.last_name,
                                        transporterRating: '0',
                                        transporterCapacity: String(d.tank_capacity_liters),
                                        transporterPrice: String(d.price_per_delivery),
                                        transporterLat: String(d.lat),
                                        transporterLon: String(d.lon),
                                    },
                                })}
                            >
                                <MaterialIcons name="local-shipping" size={20} color={Colors.white} />
                                <Text style={styles.orderBtnText}>
                                    Commander via {d.first_name} {d.last_name}
                                </Text>
                                <MaterialIcons name="arrow-forward" size={18} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    );
                })()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },

    // ── Map (flex: fills remaining space) ──
    mapArea: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },

    // ── Markers ──
    markerOuter: {
        alignItems: 'center',
    },
    markerInner: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 10,
        ...Shadows.floatSm,
        borderWidth: 1.5,
        borderColor: Colors.neutral200,
    },
    markerInnerSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    markerName: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        backgroundColor: Colors.white,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        overflow: 'hidden',
        ...Shadows.floatSm,
    },
    markerNameSelected: {
        backgroundColor: Colors.primary,
        color: Colors.white,
    },

    // ── Header overlay ──
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 14,
    },
    headerDate: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 0.3,
    },
    headerName: {
        fontSize: FontSize.xl,
        fontWeight: '800' as any,
        color: Colors.white,
        marginTop: 2,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },

    // ── Map controls ──
    mapControls: {
        position: 'absolute',
        right: 14,
        bottom: 14,
        gap: 10,
    },
    mapControlBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.card,
    },

    // ── Bottom Panel (flex-based, not absolute) ──
    bottomPanel: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Shadows.float,
        // Pull up over map slightly
        marginTop: -24,
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 2,
    },
    handle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: Colors.gray200,
    },
    panelTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 10,
        gap: 8,
    },
    panelTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    countBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
    },
    countBadgeText: {
        color: Colors.white,
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },

    // ── Filters ──
    filterRow: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        gap: 6,
        alignItems: 'center',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.primary}10`,
        borderWidth: 1,
        borderColor: `${Colors.primary}20`,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterChipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    filterChipTextActive: {
        color: Colors.white,
    },
    filterDivider: {
        width: 1,
        height: 18,
        backgroundColor: Colors.gray200,
        marginHorizontal: 2,
    },

    // ── List ──
    listContent: {
        paddingTop: 3,
        paddingBottom: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 35,
        gap: 8,
    },
    emptyText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.slate700,
    },
    emptySubtext: {
        fontSize: FontSize.sm,
        color: Colors.slate400,
    },

    // ── Order button ──
    orderBtnContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 10,
    },
    orderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.accent,
        paddingVertical: 15,
        borderRadius: BorderRadius.full,
        ...Shadows.fab,
    },
    orderBtnText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
});
