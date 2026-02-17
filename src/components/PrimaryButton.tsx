import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows, FontSize, FontWeight } from '../constants';

interface PrimaryButtonProps {
    title: string;
    onPress?: () => void;
    icon?: keyof typeof MaterialIcons.glyphMap;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'accent';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    icon = 'arrow-forward',
    loading = false,
    disabled = false,
    style,
    textStyle,
    variant = 'primary',
}) => {
    const bgColor = variant === 'accent' ? Colors.accent : Colors.primary;
    const shadowStyle = variant === 'accent' ? Shadows.fab : Shadows.button;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                shadowStyle,
                { backgroundColor: bgColor },
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.9}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={Colors.white} />
            ) : (
                <>
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                    {icon && (
                        <MaterialIcons name={icon} size={18} color={Colors.white} />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: BorderRadius.lg,
        gap: 8,
    },
    text: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
    },
    disabled: {
        opacity: 0.6,
    },
});
