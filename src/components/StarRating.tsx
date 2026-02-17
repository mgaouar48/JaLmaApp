import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants';

interface StarRatingProps {
    maxStars?: number;
    initialRating?: number;
    size?: number;
    onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
    maxStars = 5,
    initialRating = 0,
    size = 48,
    onRatingChange,
}) => {
    const [rating, setRating] = useState(initialRating);

    const handlePress = (star: number) => {
        setRating(star);
        onRatingChange?.(star);
    };

    return (
        <View style={styles.container}>
            {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => handlePress(star)}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="star"
                        size={size}
                        color={star <= rating ? Colors.gold : Colors.gray200}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
});
