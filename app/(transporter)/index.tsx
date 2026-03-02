import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, Shadows, BorderRadius } from '../../src/constants';
import { useTranslation } from 'react-i18next';

export default function TransporterDashboard() {
    const [isOnline, setIsOnline] = useState(true);
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {/* Map background */}
            <View style={styles.mapBg}>
                <View style={styles.road1} />
                <View style={styles.road2} />
                <View style={styles.road3} />
                {/* Center truck indicator */}
                <View style={styles.centerIndicator}>
                    <View style={styles.pingRing} />
                    <View style={styles.centerIcon}>
                        <MaterialIcons name="local-shipping" size={28} color={Colors.primary} />
                    </View>
                </View>
                {/* Pin */}
                <View style={styles.mapPin}>
                    <View style={styles.pinDot}>
                        <MaterialIcons name="place" size={16} color={Colors.statusRed} />
                    </View>
                </View>
            </View>

            {/* Gradient overlay */}
            <View style={styles.gradientOverlay} />

            {/* Content */}
            <View style={styles.contentWrapper}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={20} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.greeting}>{t('transporter.greeting')}</Text>
                            <Text style={styles.name}>Mamadou</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notifBtn}>
                        <MaterialIcons name="notifications" size={24} color={Colors.slate600} />
                    </TouchableOpacity>
                </View>

                {/* Scrollable content */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Revenue card */}
                    <TouchableOpacity
                        style={styles.revenueCard}
                        onPress={() => router.push('/(transporter)/revenue')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.revenueBlob1} />
                        <View style={styles.revenueBlob2} />
                        <View style={styles.revenueHeader}>
                            <View style={styles.revenueHeaderLeft}>
                                <View style={styles.revenueIconBg}>
                                    <MaterialIcons name="payments" size={18} color={Colors.white} />
                                </View>
                                <Text style={styles.revenueLabel}>{t('transporter.todayRevenue')}</Text>
                            </View>
                            <View style={styles.trendBadge}>
                                <MaterialIcons name="trending-up" size={14} color="#86efac" />
                                <Text style={styles.trendText}>+15%</Text>
                            </View>
                        </View>
                        <View style={styles.revenueAmount}>
                            <Text style={styles.revenueValue}>12,500</Text>
                            <Text style={styles.revenueCurrency}>DA</Text>
                        </View>
                        <Text style={styles.revenueSubtext}>{t('transporter.lastTrip')}</Text>
                    </TouchableOpacity>

                    {/* Completed orders card */}
                    <View style={styles.statsCard}>
                        <View style={styles.statsHeader}>
                            <View style={styles.statsHeaderLeft}>
                                <View style={styles.statsIconBg}>
                                    <MaterialIcons name="local-shipping" size={18} color={Colors.primary} />
                                </View>
                                <Text style={styles.statsLabel}>{t('transporter.completedOrders')}</Text>
                            </View>
                        </View>
                        <View style={styles.statsFooter}>
                            <View>
                                <Text style={styles.statsValue}>
                                    8<Text style={styles.statsTotal}>/12</Text>
                                </Text>
                            </View>
                            <View style={styles.progressCircle}>
                                <Text style={styles.progressText}>66%</Text>
                            </View>
                        </View>
                    </View>

                    {/* Next mission */}
                    <View style={styles.missionSection}>
                        <Text style={styles.missionTitle}>{t('transporter.nextMission')}</Text>
                        <View style={styles.missionCard}>
                            <View style={styles.missionInfo}>
                                <Text style={styles.missionAddress}>Zone 4, Rue du Canal</Text>
                                <Text style={styles.missionDesc}>Livraison de 50 packs d'eau</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.missionNavBtn}
                                onPress={() => router.push('/new-mission')}
                            >
                                <MaterialIcons name="near-me" size={20} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    mapBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#eef2f6',
        overflow: 'hidden',
    },
    road1: {
        position: 'absolute', width: '100%', height: 16, top: '33%',
        backgroundColor: Colors.white, opacity: 0.6, transform: [{ rotate: '12deg' }, { scale: 1.5 }],
    },
    road2: {
        position: 'absolute', width: 16, height: '100%', left: '25%',
        backgroundColor: Colors.white, opacity: 0.6, transform: [{ rotate: '-12deg' }],
    },
    road3: {
        position: 'absolute', width: '100%', height: 24, bottom: '25%',
        backgroundColor: Colors.white, opacity: 0.6, transform: [{ rotate: '-6deg' }, { scale: 1.25 }],
    },
    centerIndicator: {
        position: 'absolute', top: '50%', left: '50%',
        marginTop: -32, marginLeft: -32,
        alignItems: 'center', justifyContent: 'center',
    },
    pingRing: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: `${Colors.primary}15`,
        position: 'absolute',
    },
    centerIcon: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: `${Colors.primary}30`,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
        ...Shadows.floatSm,
    },
    mapPin: {
        position: 'absolute', top: '33%', right: '25%',
    },
    pinDot: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.85)',
    },
    contentWrapper: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 32 : 40,
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.gray200,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: Colors.white,
        overflow: 'hidden',
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
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center', justifyContent: 'center',
        ...Shadows.floatSm,
    },
    toggleOuter: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    toggleContainer: {
        height: 68,
        backgroundColor: 'rgba(226,232,240,0.8)',
        borderRadius: 34,
        padding: 6,
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
        top: 6,
        height: 56,
        width: '50%',
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...Shadows.float,
    },
    toggleKnobOn: {
        right: 6,
        backgroundColor: Colors.statusGreen,
    },
    toggleKnobOff: {
        left: 6,
        backgroundColor: Colors.statusRed,
    },
    toggleKnobText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.extrabold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
        gap: 16,
    },
    revenueCard: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.xl,
        padding: 20,
        ...Shadows.float,
        overflow: 'hidden',
    },
    revenueBlob1: {
        position: 'absolute', right: -24, top: -24,
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    revenueBlob2: {
        position: 'absolute', left: -24, bottom: -24,
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    revenueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    revenueHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    revenueIconBg: {
        padding: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    revenueLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: 'rgba(255,255,255,0.8)',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(74,222,128,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    trendText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: '#86efac',
    },
    revenueAmount: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginTop: 12,
    },
    revenueValue: {
        fontSize: FontSize['4xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.white,
        letterSpacing: -1,
    },
    revenueCurrency: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: 'rgba(255,255,255,0.7)',
    },
    revenueSubtext: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    statsCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 20,
        ...Shadows.floatSm,
        borderWidth: 1,
        borderColor: Colors.slate100,
        height: 128,
        justifyContent: 'space-between',
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsIconBg: {
        padding: 6,
        backgroundColor: `${Colors.primary}15`,
        borderRadius: 8,
    },
    statsLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
    },
    statsFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    statsValue: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    statsTotal: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.medium,
        color: Colors.slate400,
    },
    progressCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    missionSection: {
        marginTop: 8,
    },
    missionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 12,
    },
    missionCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.lg,
        ...Shadows.floatSm,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    missionInfo: {},
    missionAddress: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    missionDesc: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
        marginTop: 4,
    },
    missionNavBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },

});
