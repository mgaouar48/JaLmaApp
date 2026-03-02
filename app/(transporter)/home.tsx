import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, Modal, Linking, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// Simulated incoming order
const INCOMING_ORDER = {
    id: 'CMD-2024-0847',
    clientName: 'Karim Belkacem',
    clientRating: 4.7,
    clientPhone: '+213 6 55 12 34 56',
    address: '12 Rue Didouche Mourad, Alger',
    distance: '2.3 km',
    tarif: '1 500 DA',
    volume: '3 000 L',
};

export default function TransporterHomeScreen() {
    const insets = useSafeAreaInsets();
    const mapRef = React.useRef<MapView>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [showOrder, setShowOrder] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            mapRef.current?.animateToRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        })();
    }, []);

    // Simulate incoming order when going online
    useEffect(() => {
        if (isOnline) {
            const timer = setTimeout(() => setShowOrder(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setShowOrder(false);
        }
    }, [isOnline]);

    const handleRecenter = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const handleCall = () => {
        Linking.openURL(`tel:${INCOMING_ORDER.clientPhone.replace(/\s/g, '')}`);
    };

    const handleAccept = () => {
        setShowOrder(false);
        router.push({
            pathname: '/active-delivery',
            params: {
                orderId: INCOMING_ORDER.id,
                clientName: INCOMING_ORDER.clientName,
                clientPhone: INCOMING_ORDER.clientPhone,
                clientAddress: INCOMING_ORDER.address,
                distance: INCOMING_ORDER.distance,
                tarif: INCOMING_ORDER.tarif,
                volume: INCOMING_ORDER.volume,
            },
        });
    };

    const handleReject = () => {
        setShowOrder(false);
        Alert.alert(t('transporter.orderRejected'), t('transporter.orderRejectedMsg'));
    };

    const initialRegion = {
        latitude: 34.8828,
        longitude: -1.3148,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <MaterialIcons
                    key={i}
                    name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-border'}
                    size={16}
                    color="#f59e0b"
                />
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            {/* Full-screen Map */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={false}
            />

            {/* Spacer for safe area */}
            <View style={{ height: insets.top + 12 }} />

            {/* Online/Offline Toggle */}
            <View style={styles.toggleOuter}>
                <TouchableOpacity
                    style={styles.toggleContainer}
                    onPress={() => setIsOnline(!isOnline)}
                    activeOpacity={0.8}
                >
                    <View style={styles.toggleLabels}>
                        <Text style={[styles.toggleLabelText, !isOnline && styles.toggleLabelActive]}>
                            {t('transporter.offline')}
                        </Text>
                        <Text style={[styles.toggleLabelText, isOnline && styles.toggleLabelActive]}>
                            {t('transporter.online')}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.toggleKnob,
                            isOnline ? styles.toggleKnobOn : styles.toggleKnobOff,
                        ]}
                    >
                        <MaterialIcons
                            name={isOnline ? 'radar' : 'power-settings-new'}
                            size={20}
                            color={Colors.white}
                        />
                        <Text style={styles.toggleKnobText}>
                            {isOnline ? t('transporter.online') : t('transporter.offline')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Status indicator */}
            {isOnline && !showOrder && (
                <View style={styles.waitingBanner}>
                    <MaterialIcons name="radar" size={20} color={Colors.primary} />
                    <Text style={styles.waitingText}>{t('transporter.waitingForOrders')}</Text>
                </View>
            )}

            {/* Recenter Button */}
            <TouchableOpacity
                style={[styles.recenterBtn, { bottom: insets.bottom + 24 }]}
                onPress={handleRecenter}
            >
                <MaterialIcons name="my-location" size={24} color={Colors.textDark} />
            </TouchableOpacity>

            {/* Incoming Order Modal */}
            <Modal
                visible={showOrder}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOrder(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
                        {/* Modal Header */}
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderIcon}>
                                <MaterialIcons name="notifications-active" size={24} color={Colors.white} />
                            </View>
                            <Text style={styles.modalTitle}>{t('transporter.newOrder')}</Text>
                        </View>

                        {/* Client Info */}
                        <View style={styles.clientCard}>
                            <View style={styles.clientRow}>
                                <View style={styles.clientAvatar}>
                                    <MaterialIcons name="person" size={28} color={Colors.primary} />
                                </View>
                                <View style={styles.clientInfo}>
                                    <Text style={styles.clientName}>{INCOMING_ORDER.clientName}</Text>
                                    <View style={styles.ratingRow}>
                                        {renderStars(INCOMING_ORDER.clientRating)}
                                        <Text style={styles.ratingText}>{INCOMING_ORDER.clientRating}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                                    <MaterialIcons name="phone" size={22} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Order Details */}
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="place" size={20} color={Colors.primary} />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>{t('transporter.location')}</Text>
                                    <Text style={styles.detailValue}>{INCOMING_ORDER.address}</Text>
                                </View>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <MaterialIcons name="straighten" size={20} color={Colors.primary} />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Distance</Text>
                                    <Text style={styles.detailValue}>{INCOMING_ORDER.distance}</Text>
                                </View>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <MaterialIcons name="water-drop" size={20} color={Colors.primary} />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>{t('transporter.volume')}</Text>
                                    <Text style={styles.detailValue}>{INCOMING_ORDER.volume}</Text>
                                </View>
                            </View>
                            <View style={styles.detailDivider} />
                            <View style={styles.detailRow}>
                                <MaterialIcons name="payments" size={20} color={Colors.primary} />
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>{t('transporter.tariff')}</Text>
                                    <Text style={styles.tarifValue}>{INCOMING_ORDER.tarif}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.rejectBtn]}
                                onPress={handleReject}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="close" size={28} color={Colors.white} />
                                <Text style={styles.actionBtnText}>{t('newMission.reject')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.acceptBtn]}
                                onPress={handleAccept}
                                activeOpacity={0.8}
                            >
                                <MaterialIcons name="check" size={28} color={Colors.white} />
                                <Text style={styles.actionBtnText}>{t('newMission.accept')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 12,
        backgroundColor: 'rgba(255,255,255,0.90)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
        ...Shadows.floatSm,
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
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    toggleOuter: {
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    toggleContainer: {
        height: 60,
        backgroundColor: 'rgba(226,232,240,0.9)',
        borderRadius: 30,
        padding: 5,
        position: 'relative',
    },
    toggleLabels: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    toggleLabelText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.extrabold,
        color: Colors.slate400,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    toggleLabelActive: {
        color: Colors.slate600,
    },
    toggleKnob: {
        position: 'absolute',
        top: 5,
        height: 50,
        width: '50%',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...Shadows.float,
    },
    toggleKnobOn: {
        right: 5,
        backgroundColor: Colors.statusGreen,
    },
    toggleKnobOff: {
        left: 5,
        backgroundColor: Colors.statusRed,
    },
    toggleKnobText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.extrabold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    waitingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: BorderRadius.full,
        ...Shadows.card,
    },
    waitingText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    recenterBtn: {
        position: 'absolute',
        right: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.float,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalSheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.slate300,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    modalHeaderIcon: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.accent,
        alignItems: 'center', justifyContent: 'center',
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    // Client
    clientCard: {
        backgroundColor: `${Colors.primary}08`,
        borderRadius: BorderRadius.lg,
        padding: 16,
        marginBottom: 16,
    },
    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clientAvatar: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    clientInfo: {
        flex: 1,
        marginLeft: 12,
    },
    clientName: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    ratingText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: '#f59e0b',
        marginLeft: 4,
    },
    callBtn: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: Colors.statusGreen,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    // Details
    detailsCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.slate100,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        fontWeight: FontWeight.medium,
    },
    detailValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.textDark,
        marginTop: 2,
    },
    tarifValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        marginTop: 2,
    },
    detailDivider: {
        height: 1,
        backgroundColor: Colors.slate100,
    },
    // Actions
    actionRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: BorderRadius.xl,
    },
    rejectBtn: {
        backgroundColor: '#ef4444',
    },
    acceptBtn: {
        backgroundColor: '#22c55e',
    },
    actionBtnText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
    },
});
