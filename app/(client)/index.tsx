import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, Shadows, BorderRadius } from '../../src/constants';

const { width } = Dimensions.get('window');

export default function ClientDashboard() {
    return (
        <View style={styles.container}>
            {/* Map Background Placeholder */}
            <View style={styles.mapContainer}>
                <View style={styles.mapBg}>
                    {/* Grid dots to simulate map */}
                    {Array.from({ length: 200 }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.mapDot,
                                {
                                    top: Math.random() * 600,
                                    left: Math.random() * width,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* User location indicator */}
                <View style={styles.userDot}>
                    <View style={styles.userDotInner} />
                    <View style={styles.userDotPulse} />
                </View>

                {/* Truck markers */}
                <View style={[styles.truckMarker, { top: '42%', left: '35%' }]}>
                    <View style={styles.truckMarkerInner}>
                        <View style={styles.truckIconBg}>
                            <MaterialIcons name="local-shipping" size={20} color={Colors.primary} />
                        </View>
                    </View>
                    <View style={styles.truckBadge}>
                        <Text style={styles.truckBadgeText}>5m</Text>
                    </View>
                </View>

                <View style={[styles.truckMarker, { top: '35%', left: '65%' }]}>
                    <View style={styles.truckMarkerInner}>
                        <View style={styles.truckIconBg}>
                            <MaterialIcons name="local-shipping" size={20} color={Colors.primary} />
                        </View>
                    </View>
                    <View style={styles.truckBadge}>
                        <Text style={styles.truckBadgeText}>12m</Text>
                    </View>
                </View>

                <View style={[styles.truckMarker, { top: '58%', left: '75%' }]}>
                    <View style={styles.truckMarkerInner}>
                        <View style={styles.truckIconBg}>
                            <MaterialIcons name="local-shipping" size={20} color={Colors.primary} />
                        </View>
                    </View>
                    <View style={styles.truckBadge}>
                        <Text style={styles.truckBadgeText}>8m</Text>
                    </View>
                </View>
            </View>

            {/* Top Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerDate}>Lundi, 12 Mai</Text>
                    <Text style={styles.headerName}>Bonjour, Karim</Text>
                </View>
                <TouchableOpacity style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <MaterialIcons name="person" size={24} color={Colors.white} />
                    </View>
                    <View style={styles.notifDot} />
                </TouchableOpacity>
            </View>

            {/* Map controls */}
            <View style={styles.mapControls}>
                <TouchableOpacity style={styles.mapControlBtn}>
                    <MaterialIcons name="my-location" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapControlBtn}>
                    <MaterialIcons name="layers" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Order CTA */}
            <View style={styles.ctaWrapper}>
                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => router.push('/order-config')}
                    activeOpacity={0.9}
                >
                    <View style={styles.ctaIconBg}>
                        <MaterialIcons name="water-drop" size={20} color={Colors.white} />
                    </View>
                    <Text style={styles.ctaText}>Commander une citerne</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
    },
    mapBg: {
        ...StyleSheet.absoluteFillObject,
    },
    mapDot: {
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#d1dbe4',
    },
    userDot: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userDotInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    userDotPulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.primary}20`,
    },
    truckMarker: {
        position: 'absolute',
        alignItems: 'center',
    },
    truckMarkerInner: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 8,
        ...Shadows.floatSm,
    },
    truckIconBg: {
        backgroundColor: `${Colors.primary}15`,
        padding: 6,
        borderRadius: 4,
    },
    truckBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    truckBadgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: FontWeight.bold,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.5)',
    },
    headerDate: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: `${Colors.primary}99`,
    },
    headerName: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
        ...Shadows.floatSm,
    },
    notifDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.statusRed,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    mapControls: {
        position: 'absolute',
        right: 16,
        bottom: 140,
        gap: 12,
    },
    mapControlBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.card,
    },
    ctaWrapper: {
        position: 'absolute',
        bottom: 80,
        left: 24,
        right: 24,
        alignItems: 'center',
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.accent,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: BorderRadius.full,
        gap: 12,
        ...Shadows.fab,
        width: '100%',
        justifyContent: 'center',
    },
    ctaIconBg: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 4,
        borderRadius: BorderRadius.full,
    },
    ctaText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        letterSpacing: -0.3,
    },
});
