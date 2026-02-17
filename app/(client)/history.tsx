import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Shadows, BorderRadius } from '../../src/constants';
import { OrderCard } from '../../src/components';

const orders = [
    {
        id: '1',
        date: '12 Oct 2023, 14:30',
        status: 'completed' as const,
        volume: '1200 L',
        price: '85,000 DZD',
        transporterName: 'Hamid Transport',
    },
    {
        id: '2',
        date: "Aujourd'hui, 09:15",
        status: 'in_progress' as const,
        volume: '5000 L',
        price: '320,000 DZD',
        transporterName: 'Karim Express',
    },
    {
        id: '3',
        date: '28 Sept 2023, 10:00',
        status: 'completed' as const,
        volume: '2500 L',
        price: '140,000 DZD',
        transporterName: 'Sarl Logistique',
    },
    {
        id: '4',
        date: '15 Sept 2023, 18:45',
        status: 'cancelled' as const,
        volume: '800 L',
        price: '55,000 DZD',
        transporterName: 'Hamid Transport',
    },
];

const filters = ['Tous', 'En cours', 'Terminé', 'Annulé'];

export default function HistoryScreen() {
    const [activeFilter, setActiveFilter] = React.useState('Tous');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Historique</Text>
                    <TouchableOpacity style={styles.filterBtn}>
                        <MaterialIcons name="tune" size={22} color={Colors.primary} />
                        <View style={styles.filterDot} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersList}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                            onPress={() => setActiveFilter(f)}
                        >
                            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Orders list */}
            <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {orders.map((order) => (
                    <OrderCard key={order.id} {...order} />
                ))}
                <View style={styles.endIndicator}>
                    <View style={styles.endLine} />
                    <Text style={styles.endText}>Vous avez vu tout l'historique</Text>
                </View>
            </ScrollView>
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
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
        backgroundColor: `${Colors.backgroundLight}E6`,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    filterBtn: {
        padding: 8,
        borderRadius: BorderRadius.full,
        position: 'relative',
    },
    filterDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: Colors.backgroundLight,
    },
    filtersContainer: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    filtersList: {
        gap: 12,
        paddingBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.neutral200,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        ...Shadows.soft,
    },
    filterChipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate600,
    },
    filterChipTextActive: {
        color: Colors.white,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
        gap: 16,
    },
    endIndicator: {
        alignItems: 'center',
        paddingVertical: 24,
        opacity: 0.6,
    },
    endLine: {
        width: 48,
        height: 3,
        borderRadius: 2,
        backgroundColor: Colors.neutral200,
        marginBottom: 12,
    },
    endText: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
});
