import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton } from '../src/components';

const volumes = [
    { id: '3000', label: '3 000 L', price: '18 000 DA', icon: 'opacity' as const },
    { id: '5000', label: '5 000 L', price: '28 000 DA', icon: 'water-drop' as const },
    { id: '10000', label: '10 000 L', price: '50 000 DA', icon: 'water' as const },
];

export default function OrderConfigScreen() {
    const [selectedVolume, setSelectedVolume] = useState('5000');

    const selectedVol = volumes.find((v) => v.id === selectedVolume);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nouvelle commande</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Volume Selection */}
                <Text style={styles.sectionTitle}>Volume d'eau</Text>
                <Text style={styles.sectionDesc}>
                    Sélectionnez la capacité souhaitée
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
                                    {vol.price}
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

                {/* Delivery Location */}
                <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
                    Lieu de livraison
                </Text>
                <TouchableOpacity style={styles.locationCard}>
                    <View style={styles.locationInfo}>
                        <View style={styles.locationIconBg}>
                            <MaterialIcons name="place" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.locationText}>
                            <Text style={styles.locationLabel}>Adresse actuelle</Text>
                            <Text style={styles.locationAddress}>
                                24 Rue Didouche Mourad, Alger
                            </Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.slate400} />
                </TouchableOpacity>

                {/* Map preview */}
                <View style={styles.mapPreview}>
                    <View style={styles.mapSimulation}>
                        <View style={styles.mapRoad1} />
                        <View style={styles.mapRoad2} />
                        <MaterialIcons name="place" size={32} color={Colors.primary} style={styles.mapMarker} />
                    </View>
                    <View style={styles.mapOverlay}>
                        <Text style={styles.mapOverlayText}>Appuyez pour changer</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom summary */}
            <View style={styles.bottomBar}>
                <View style={styles.summaryRow}>
                    <View>
                        <Text style={styles.summaryLabel}>Total estimé</Text>
                        <Text style={styles.summaryValue}>{selectedVol?.price}</Text>
                    </View>
                    <PrimaryButton
                        title="Confirmer"
                        icon="check"
                        onPress={() => router.push('/live-tracking')}
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
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        ...Shadows.floatSm,
        marginTop: 8,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    locationIconBg: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    locationText: { flex: 1 },
    locationLabel: {
        fontSize: FontSize.xs, color: Colors.slate500, marginBottom: 2,
    },
    locationAddress: {
        fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.slate800,
    },
    mapPreview: {
        height: 160,
        backgroundColor: '#e5e7eb',
        borderRadius: BorderRadius.lg,
        marginTop: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    mapSimulation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapRoad1: {
        position: 'absolute', width: '120%', height: 12,
        backgroundColor: Colors.white, opacity: 0.5,
        transform: [{ rotate: '20deg' }],
    },
    mapRoad2: {
        position: 'absolute', width: 12, height: '120%',
        backgroundColor: Colors.white, opacity: 0.5,
        transform: [{ rotate: '-8deg' }],
    },
    mapMarker: {},
    mapOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    mapOverlayText: {
        fontSize: FontSize.xs,
        color: Colors.white,
        fontWeight: FontWeight.medium,
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
    },
    summaryValue: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.primary,
    },
});
