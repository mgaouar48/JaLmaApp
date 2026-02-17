import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';

const { width } = Dimensions.get('window');

export default function LiveTrackingScreen() {
    return (
        <View style={styles.container}>
            {/* Map background */}
            <View style={styles.mapBg}>
                {/* Simulated roads */}
                <View style={styles.road1} />
                <View style={styles.road2} />
                <View style={styles.road3} />

                {/* Route line (simulated) */}
                <View style={styles.routeLine} />

                {/* Driver marker - pulsing */}
                <View style={styles.driverMarker}>
                    <View style={styles.driverPulse} />
                    <View style={styles.driverIcon}>
                        <MaterialIcons name="local-shipping" size={24} color={Colors.white} />
                    </View>
                </View>

                {/* Destination marker */}
                <View style={styles.destMarker}>
                    <View style={styles.destRing} />
                    <View style={styles.destIcon}>
                        <MaterialIcons name="place" size={20} color={Colors.white} />
                    </View>
                </View>
            </View>

            {/* Top bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>

                {/* ETA badge */}
                <View style={styles.etaBadge}>
                    <MaterialIcons name="schedule" size={16} color={Colors.statusGreen} />
                    <View>
                        <Text style={styles.etaTime}>12 min</Text>
                        <Text style={styles.etaLabel}>Arrivée estimée</Text>
                    </View>
                </View>
            </View>

            {/* Bottom card */}
            <View style={styles.bottomCard}>
                <View style={styles.dragHandle} />

                {/* Status & progress */}
                <View style={styles.statusRow}>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>En route vers vous</Text>
                    </View>
                    <Text style={styles.distanceText}>2.4 km</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarOuter}>
                    <View style={styles.progressBarInner} />
                </View>

                {/* Driver info */}
                <View style={styles.driverInfo}>
                    <View style={styles.driverAvatar}>
                        <MaterialIcons name="person" size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>Ahmed Bensaid</Text>
                        <View style={styles.driverMeta}>
                            <View style={styles.ratingBadge}>
                                <MaterialIcons name="star" size={12} color={Colors.gold} />
                                <Text style={styles.ratingText}>4.8</Text>
                            </View>
                            <Text style={styles.vehicleInfo}>
                                <MaterialIcons name="local-shipping" size={12} color={Colors.slate400} />{' '}
                                Citerne 5000L
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.callBtn}>
                        <MaterialIcons name="phone" size={20} color={Colors.white} />
                        <Text style={styles.callText}>Appeler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => router.push('/rating')}
                    >
                        <Text style={styles.cancelText}>Simulation : Terminée</Text>
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
    mapBg: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    road1: {
        position: 'absolute', width: '150%', height: 24, top: '28%',
        backgroundColor: Colors.white, opacity: 0.6,
        transform: [{ rotate: '15deg' }],
    },
    road2: {
        position: 'absolute', width: 20, height: '100%', left: '40%',
        backgroundColor: Colors.white, opacity: 0.6,
        transform: [{ rotate: '-10deg' }],
    },
    road3: {
        position: 'absolute', width: '120%', height: 16, top: '55%',
        backgroundColor: Colors.white, opacity: 0.5,
        transform: [{ rotate: '-5deg' }],
    },
    routeLine: {
        position: 'absolute',
        top: '35%',
        left: '30%',
        width: 200,
        height: 4,
        backgroundColor: Colors.primary,
        borderRadius: 2,
        transform: [{ rotate: '30deg' }],
    },
    driverMarker: {
        position: 'absolute',
        top: '35%',
        left: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    driverPulse: {
        position: 'absolute',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${Colors.primary}20`,
    },
    driverIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
        ...Shadows.float,
    },
    destMarker: {
        position: 'absolute',
        top: '50%',
        right: '25%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    destRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.accent}25`,
    },
    destIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
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
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
    },
    etaLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 32 : 24,
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
        width: '65%',
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
        fontSize: FontSize.md,
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
