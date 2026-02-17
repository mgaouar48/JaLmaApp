import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../constants';

interface AppTextInputProps extends TextInputProps {
    icon?: keyof typeof MaterialIcons.glyphMap;
    rightIcon?: keyof typeof MaterialIcons.glyphMap;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
    icon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    style,
    ...rest
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View
            style={[
                styles.container,
                focused && styles.focused,
                containerStyle,
            ]}
        >
            {icon && (
                <MaterialIcons
                    name={icon}
                    size={20}
                    color={Colors.slate400}
                    style={styles.leftIcon}
                />
            )}
            <TextInput
                style={[styles.input, icon && { paddingLeft: 0 }, style]}
                placeholderTextColor={Colors.slate400}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...rest}
            />
            {rightIcon && (
                <MaterialIcons
                    name={rightIcon}
                    size={20}
                    color={Colors.slate400}
                    style={styles.rightIcon}
                    onPress={onRightIconPress}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    focused: {
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
    },
    leftIcon: {
        marginRight: 12,
    },
    rightIcon: {
        marginLeft: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 14,
        color: Colors.slate900,
    },
});
