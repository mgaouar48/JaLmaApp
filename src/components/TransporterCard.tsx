import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    const initials = `${(firstName?.[0] ?? '?')}${(lastName?.[0] ?? '?')}`.toUpperCase();

    const formatNumber = (n: number) => n.toLocaleString('fr-FR');

    // ETA based on ~40 km/h average speed for a cistern truck
    const etaMinutes = Math.max(1, Math.round((distance / 40) * 60));
    const etaLabel = etaMinutes < 60
        ? `${etaMinutes} min`
        : `${Math.floor(etaMinutes / 60)}h${etaMinutes % 60 > 0 ? String(etaMinutes % 60).padStart(2, '0') : ''}`;

    const stars = Math.round(rating);

    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            {/* Selected glow accent bar */}
            {isSelected && <View style={styles.accentBar} />}

            {/* Avatar */}
            {isSelected ? (
                <LinearGradient
                    colors={['#0A4FAD', '#1A73E8']}
                    style={styles.avatar}
                >
                    <Text style={styles.avatarTextSelected}>{initials}</Text>
                </LinearGradient>
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
            )}

            {/* Info column */}
            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
                        {firstName} {lastName}
                    </Text>
                    {/* Online dot */}
                    <View style={styles.onlineDot} />
                </View>

                {/* Star rating */}
                <View style={styles.starsRow}>
                    {[1,2,3,4,5].map(i => (
                        <MaterialIcons
                            key={i}
                            name={i <= stars ? 'star' : 'star-border'}
                            size={13}
                            color={i <= stars ? '#f59e0b' : Colors.slate300}
                        />
                    ))}
                    <Text style={styles.ratingText}>{rating > 0 ? rating.toFixed(1) : 'Nouveau'}</Text>
                </View>

                {/* Chips */}
                <View style={styles.chipsRow}>
                    <View style={[styles.chip, isSelected && styles.chipSelected]}>
                        <MaterialIcons name="water-drop" size={11} color={isSelected ? '#1A73E8' : Colors.slate500} />
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {formatNumber(capacity)} L
                        </Text>
                    </View>
                    <View style={[styles.chip, styles.chipPrice]}>
                        <MaterialIcons name="payments" size={11} color="#16a34a" />
                        <Text style={styles.chipPriceText}>{formatNumber(price)} DA</Text>
                    </View>
                </View>
            </View>

            {/* Right — Distance & ETA */}
            <View style={styles.rightCol}>
                <View style={[styles.distancePill, isSelected && styles.distancePillSelected]}>
                    <MaterialIcons name="near-me" size={13} color={isSelected ? Colors.white : Colors.primary} />
                    <Text style={[styles.distanceText, isSelected && styles.distanceTextSelected]}>
                        {distance.toFixed(1)} km
                    </Text>
                </View>
                <View style={styles.etaPill}>
                    <MaterialIcons name="schedule" size={11} color="#d97706" />
                    <Text style={styles.etaText}>{etaLabel}</Text>
                </View>
                {isSelected && (
                    <View style={styles.selectedCheck}>
                        <MaterialIcons name="check" size={14} color={Colors.white} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#e8edf5',
        ...Shadows.soft,
        position: 'relative',
        overflow: 'hidden',
    },
    cardSelected: {
        borderColor: '#1A73E8',
        backgroundColor: '#f0f6ff',
        ...Shadows.card,
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#1A73E8',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EBF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginLeft: 4,
    },
    avatarText: {
        fontSize: FontSize.base,
        fontWeight: '800' as any,
        color: '#1A73E8',
    },
    avatarTextSelected: {
        fontSize: FontSize.base,
        fontWeight: '800' as any,
        color: Colors.white,
    },
    info: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
    name: { fontSize: FontSize.sm, fontWeight: '700' as any, color: Colors.slate800, flex: 1 },
    nameSelected: { color: '#0A4FAD' },
    onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22c55e', borderWidth: 1, borderColor: '#dcfce7' },
    starsRow: { flexDirection: 'row', alignItems: 'center', gap: 1, marginBottom: 6 },
    ratingText: { fontSize: 11, color: Colors.slate400, marginLeft: 4, fontWeight: FontWeight.medium },
    chipsRow: { flexDirection: 'row', gap: 6 },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 20,
    },
    chipSelected: { backgroundColor: '#dbeafe' },
    chipText: { fontSize: 11, fontWeight: FontWeight.medium, color: Colors.slate600 },
    chipTextSelected: { color: '#1A73E8' },
    chipPrice: { backgroundColor: '#f0fdf4' },
    chipPriceText: { fontSize: 11, fontWeight: '700' as any, color: '#16a34a' },
    rightCol: { alignItems: 'center', gap: 6, marginLeft: 8 },
    distancePill: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: '#EBF2FF',
        paddingHorizontal: 8, paddingVertical: 5,
        borderRadius: 20,
    },
    distancePillSelected: { backgroundColor: '#1A73E8' },
    distanceText: { fontSize: 11, fontWeight: '700' as any, color: Colors.primary },
    distanceTextSelected: { color: Colors.white },
    etaPill: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 7, paddingVertical: 3,
        borderRadius: 20,
    },
    etaText: { fontSize: 10, fontWeight: '700' as any, color: '#d97706' },
    selectedCheck: {
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: '#1A73E8',
        alignItems: 'center', justifyContent: 'center',
    },
});
