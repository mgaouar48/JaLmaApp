import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../constants';

interface ChipOption {
    id: string;
    label: string;
}

interface ChipSelectorProps {
    options: ChipOption[];
    multiple?: boolean;
    onSelectionChange?: (selected: string[]) => void;
    style?: ViewStyle;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
    options,
    multiple = true,
    onSelectionChange,
    style,
}) => {
    const [selected, setSelected] = useState<string[]>([]);

    const handlePress = (id: string) => {
        let newSelected: string[];
        if (multiple) {
            newSelected = selected.includes(id)
                ? selected.filter((s) => s !== id)
                : [...selected, id];
        } else {
            newSelected = selected.includes(id) ? [] : [id];
        }
        setSelected(newSelected);
        onSelectionChange?.(newSelected);
    };

    return (
        <View style={[styles.container, style]}>
            {options.map((option) => {
                const isSelected = selected.includes(option.id);
                return (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => handlePress(option.id)}
                        activeOpacity={0.7}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: `${Colors.primary}15`,
        backgroundColor: Colors.white,
    },
    chipSelected: {
        backgroundColor: `${Colors.primary}15`,
        borderColor: Colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary,
    },
    chipTextSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
});
