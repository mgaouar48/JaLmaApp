import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, FontSize, FontWeight } from '../constants';

interface TransporterCardProps {
    firstName: string;
    lastName: string;
    rating: number;
    capacity: number;
    price: number;
    distance: number; // in km
    isSelected?: boolean;
    onPress?: () => void;
}

export const TransporterCard: React.FC<TransporterCardProps> = ({
    firstName,
    lastName,
    rating,
    capacity,
    price,
    distance,
    isSelected = false,
    onPress,
}) => {
    const initials = `${firstName[0]}${lastName[0]}`;

    const renderStars = () => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <MaterialIcons key={`full-${i}`} name="star" size={14} color={Colors.gold} />
            );
        }
        if (hasHalf) {
            stars.push(
                <MaterialIcons key="half" name="star-half" size={14} color={Colors.gold} />
            );
        }
        const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
        for (let i = 0; i < remaining; i++) {
            stars.push(
                <MaterialIcons key={`empty-${i}`} name="star-border" size={14} color={Colors.gray200} />
            );
        }
        return stars;
    };

    const formatNumber = (n: number) => n.toLocaleString('fr-FR');

    // ETA based on ~40 km/h average speed for a cistern truck
    const etaMinutes = Math.max(1, Math.round((distance / 40) * 60));
    const etaLabel = etaMinutes < 60
        ? `~${etaMinutes} min`
        : `~${Math.floor(etaMinutes / 60)}h${etaMinutes % 60 > 0 ? String(etaMinutes % 60).padStart(2, '0') : ''}`;

    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Left: Avatar */}
            <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                    {initials}
                </Text>
            </View>

            {/* Center: Info */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {firstName} {lastName}
                </Text>

                <View style={styles.starsRow}>
                    {renderStars()}
                    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                </View>

                <View style={styles.detailsRow}>
                    <View style={styles.detailChip}>
                        <MaterialIcons name="water-drop" size={12} color={Colors.primary} />
                        <Text style={styles.detailChipText}>{formatNumber(capacity)} L</Text>
                    </View>
                    <View style={styles.detailChip}>
                        <MaterialIcons name="payments" size={12} color={Colors.accent} />
                        <Text style={styles.detailChipText}>{formatNumber(price)} DA</Text>
                    </View>
                </View>
            </View>

            {/* Right: Distance & ETA */}
            <View style={styles.distanceContainer}>
                <MaterialIcons name="near-me" size={16} color={Colors.primary} />
                <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
                <View style={styles.etaBadge}>
                    <MaterialIcons name="schedule" size={10} color={Colors.accent} />
                    <Text style={styles.etaText}>{etaLabel}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 10,
        ...Shadows.soft,
        borderWidth: 1.5,
        borderColor: Colors.neutral100,
    },
    cardSelected: {
        borderColor: Colors.primary,
        backgroundColor: `${Colors.primary}08`,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarSelected: {
        backgroundColor: Colors.primary,
    },
    avatarText: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    avatarTextSelected: {
        color: Colors.white,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
        marginBottom: 2,
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        marginBottom: 6,
    },
    ratingText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
        marginLeft: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    detailChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: Colors.neutral50,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
    },
    detailChipText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.medium,
        color: Colors.slate700,
    },
    distanceContainer: {
        alignItems: 'center',
        gap: 2,
        marginLeft: 8,
    },
    distanceText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    etaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: `${Colors.accent}15`,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
        marginTop: 2,
    },
    etaText: {
        fontSize: 10,
        fontWeight: FontWeight.bold,
        color: Colors.accent,
    },
});
