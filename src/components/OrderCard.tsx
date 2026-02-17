import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, FontSize, FontWeight } from '../constants';

interface OrderCardProps {
    date: string;
    status: 'completed' | 'in_progress' | 'cancelled';
    volume: string;
    price: string;
    transporterName: string;
    transporterImage?: string;
    style?: ViewStyle;
}

const statusConfig = {
    completed: {
        label: 'Terminé',
        bg: 'rgba(46,204,113,0.1)',
        color: Colors.statusGreen,
        borderColor: 'rgba(46,204,113,0.2)',
    },
    in_progress: {
        label: 'En cours',
        bg: 'rgba(241,196,15,0.1)',
        color: Colors.warning,
        borderColor: 'rgba(241,196,15,0.2)',
    },
    cancelled: {
        label: 'Annulé',
        bg: Colors.gray200,
        color: Colors.gray500,
        borderColor: Colors.slate300,
    },
};

export const OrderCard: React.FC<OrderCardProps> = ({
    date,
    status,
    volume,
    price,
    transporterName,
    style,
}) => {
    const sc = statusConfig[status];

    return (
        <View style={[styles.card, status === 'cancelled' && { opacity: 0.7 }, style]}>
            {status === 'in_progress' && <View style={styles.progressBar} />}
            <View style={styles.header}>
                <View>
                    <Text style={styles.dateLabel}>Date</Text>
                    <Text style={styles.dateValue}>{date}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: sc.bg, borderColor: sc.borderColor }]}>
                    <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Volume</Text>
                    <View style={styles.detailValue}>
                        <MaterialIcons name="water-drop" size={18} color={Colors.primary} />
                        <Text style={styles.detailValueText}>{volume}</Text>
                    </View>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Prix Total</Text>
                    <View style={styles.detailValue}>
                        <MaterialIcons name="payments" size={18} color={Colors.primary} />
                        <Text style={styles.detailValueText}>{price}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.transporterInfo}>
                    <View style={styles.transporterAvatar}>
                        <MaterialIcons name="local-shipping" size={20} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.transporterLabel}>Transporteur</Text>
                        <Text style={styles.transporterName}>{transporterName}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 20,
        ...Shadows.soft,
        borderWidth: 1,
        borderColor: Colors.neutral100,
        overflow: 'hidden',
    },
    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 3,
        height: '100%',
        backgroundColor: Colors.warning,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    dateLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateValue: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral100,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
        marginBottom: 4,
    },
    detailValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailValueText: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    transporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    transporterAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transporterLabel: {
        fontSize: FontSize.xs,
        color: Colors.slate500,
    },
    transporterName: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate900,
    },
});
