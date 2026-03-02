import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';

// Dummy Data
const MISSIONS = [
    {
        id: 'M-2024-001',
        client: 'Sarah Benali',
        address: 'Cite 2004 Logements, Bab Ezzouar',
        date: 'Aujourd\'hui, 10:30',
        price: '1 200 DA',
        volume: '2 000 L',
        status: 'in_progress',
    },
    {
        id: 'M-2024-002',
        client: 'Hotel El Aurassi',
        address: '2 Boulevard Frantz Fanon, Alger',
        date: 'Hier, 14:15',
        price: '4 500 DA',
        volume: '6 000 L',
        status: 'completed',
    },
    {
        id: 'M-2024-003',
        client: 'Restaurant Le Sommet',
        address: 'Hydra, Alger',
        date: '16 Fév, 09:00',
        price: '2 000 DA',
        volume: '3 000 L',
        status: 'completed',
    },
    {
        id: 'M-2024-004',
        client: 'Ahmed Khelil',
        address: 'Rue Didouche Mourad, Alger',
        date: '15 Fév, 11:45',
        price: '1 500 DA',
        volume: '2 000 L',
        status: 'cancelled',
    },
    {
        id: 'M-2024-005',
        client: 'Clinique Al Azhar',
        address: 'Dely Ibrahim, Alger',
        date: '14 Fév, 08:30',
        price: '3 000 DA',
        volume: '4 000 L',
        status: 'completed',
    },
];

const FILTER_KEYS = ['all', 'inProgress', 'completed', 'cancelled'] as const;

export default function MissionsScreen() {
    const [activeFilter, setActiveFilter] = useState('all');
    const { t } = useTranslation();

    const filteredMissions = MISSIONS.filter((mission) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'inProgress') return mission.status === 'in_progress' || mission.status === 'pending';
        if (activeFilter === 'completed') return mission.status === 'completed';
        if (activeFilter === 'cancelled') return mission.status === 'cancelled';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress': return '#3b82f6'; // Blue
            case 'completed': return '#22c55e'; // Green
            case 'cancelled': return '#ef4444'; // Red
            default: return Colors.slate400;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'in_progress': return t('missions.inProgress');
            case 'completed': return t('missions.completed');
            case 'cancelled': return t('missions.cancelled');
            default: return t('missions.pending');
        }
    };

    const renderMissionCard = ({ item }: { item: typeof MISSIONS[0] }) => {
        const statusColor = getStatusColor(item.status);
        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.idContainer}>
                        <MaterialIcons name="grid-3x3" size={14} color={Colors.slate400} />
                        <Text style={styles.idText}>{item.id}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {getStatusLabel(item.status)}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.row}>
                        <MaterialIcons name="person" size={18} color={Colors.primary} />
                        <Text style={styles.clientName}>{item.client}</Text>
                    </View>
                    <View style={styles.row}>
                        <MaterialIcons name="place" size={18} color={Colors.slate400} />
                        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <MaterialIcons name="water-drop" size={16} color={Colors.slate400} />
                            <Text style={styles.metaText}>{item.volume}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.metaItem}>
                            <MaterialIcons name="schedule" size={16} color={Colors.slate400} />
                            <Text style={styles.metaText}>{item.date}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                    <Text style={styles.priceLabel}>{t('missions.totalAmount')}</Text>
                    <Text style={styles.priceValue}>{item.price}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('missions.title')}</Text>
            </View>

            {/* Filters */}
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {FILTER_KEYS.map((key) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.filterChip,
                                activeFilter === key && styles.filterChipActive,
                            ]}
                            onPress={() => setActiveFilter(key)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === key && styles.filterTextActive,
                                ]}
                            >
                                {t(`missions.filter_${key}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            <FlatList
                data={filteredMissions}
                renderItem={renderMissionCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="assignment-late" size={48} color={Colors.slate300} />
                        <Text style={styles.emptyText}>{t('missions.noMissions')}</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    filterScroll: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 12,
        backgroundColor: Colors.white,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.slate100,
        borderWidth: 1,
        borderColor: Colors.slate100,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate500,
    },
    filterTextActive: {
        color: Colors.white,
    },
    listContent: {
        padding: 24,
        gap: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        ...Shadows.floatSm,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate50,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    idText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.slate400,
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        textTransform: 'uppercase',
    },
    cardContent: {
        padding: 16,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    clientName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.textDark,
    },
    address: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        backgroundColor: Colors.slate50,
        padding: 8,
        borderRadius: BorderRadius.sm,
    },
    metaItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.slate600,
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: Colors.slate200,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: `${Colors.primary}05`,
        borderTopWidth: 1,
        borderTopColor: `${Colors.primary}10`,
    },
    priceLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    priceValue: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 48,
        gap: 16,
    },
    emptyText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.slate400,
    },
});
