import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function NewMissionScreen() {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            {/* Map background */}
            <View style={styles.mapBg}>
                <View style={styles.road1} />
                <View style={styles.road2} />

                {/* Route pins */}
                <View style={styles.pickupPin}>
                    <View style={styles.pinCircle}>
                        <MaterialIcons name="local-shipping" size={18} color={Colors.primary} />
                    </View>
                    <Text style={styles.pinLabel}>Pickup</Text>
                </View>

                <View style={styles.destPin}>
                    <View style={[styles.pinCircle, { backgroundColor: `${Colors.accent}15` }]}>
                        <MaterialIcons name="place" size={18} color={Colors.accent} />
                    </View>
                    <Text style={styles.pinLabel}>Destination</Text>
                </View>

                {/* Route line */}
                <View style={styles.routeLine} />
            </View>

            {/* Top bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.topTitle}>{t('newMission.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Bottom card */}
            <View style={styles.bottomCard}>
                <View style={styles.dragHandle} />

                {/* Mission badge */}
                <View style={styles.missionBadge}>
                    <View style={styles.missionIconBg}>
                        <MaterialIcons name="water-drop" size={24} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.missionTitle}>Livraison Citerne 5000L</Text>
                        <Text style={styles.missionRef}>Réf: #JL-312</Text>
                    </View>
                    <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>{t('newMission.urgent')}</Text>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="place" size={16} color={Colors.primary} />
                        <View>
                            <Text style={styles.detailLabel}>Destination</Text>
                            <Text style={styles.detailValue}>24 Rue du Canal, Alger</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="schedule" size={16} color={Colors.primary} />
                        <View>
                            <Text style={styles.detailLabel}>{t('newMission.distance')}</Text>
                            <Text style={styles.detailValue}>3.2 km • ~12 min</Text>
                        </View>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialIcons name="payments" size={16} color={Colors.statusGreen} />
                        <View>
                            <Text style={styles.detailLabel}>{t('newMission.remuneration')}</Text>
                            <Text style={[styles.detailValue, { color: Colors.statusGreen, fontWeight: '800' }]}>
                                2 800 DA
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="close" size={20} color={Colors.statusRed} />
                        <Text style={styles.rejectText}>{t('newMission.reject')}</Text>
                    </TouchableOpacity>
                    <PrimaryButton
                        title={t('newMission.accept')}
                        icon="check"
                        variant="accent"
                        onPress={() => router.replace('/(transporter)')}
                        style={{ flex: 1 }}
                    />
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
        position: 'absolute', width: '150%', height: 20, top: '35%',
        backgroundColor: Colors.white, opacity: 0.5,
        transform: [{ rotate: '10deg' }],
    },
    road2: {
        position: 'absolute', width: 16, height: '100%', left: '50%',
        backgroundColor: Colors.white, opacity: 0.5,
        transform: [{ rotate: '-8deg' }],
    },
    routeLine: {
        position: 'absolute',
        top: '33%', left: '25%',
        width: 200, height: 3,
        backgroundColor: Colors.primary,
        borderRadius: 2,
        transform: [{ rotate: '20deg' }],
        opacity: 0.7,
    },
    pickupPin: {
        position: 'absolute',
        top: '30%', left: '20%',
        alignItems: 'center',
    },
    destPin: {
        position: 'absolute',
        top: '42%', right: '20%',
        alignItems: 'center',
    },
    pinCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
        ...Shadows.floatSm,
    },
    pinLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.slate600,
        marginTop: 4,
        backgroundColor: Colors.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
        paddingBottom: 12,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    topTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: BorderRadius.full,
        ...Shadows.floatSm,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: Colors.white,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        ...Shadows.float,
    },
    dragHandle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: Colors.slate300,
        alignSelf: 'center', marginBottom: 20,
    },
    missionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    missionIconBg: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    missionTitle: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
    },
    missionRef: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    urgentBadge: {
        backgroundColor: `${Colors.statusRed}15`,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: `${Colors.statusRed}30`,
    },
    urgentText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.statusRed,
    },
    detailsGrid: {
        gap: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
    },
    detailValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    rejectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: BorderRadius.lg,
        backgroundColor: `${Colors.statusRed}10`,
        borderWidth: 1,
        borderColor: `${Colors.statusRed}30`,
    },
    rejectText: {
        color: Colors.statusRed,
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
    },
});
