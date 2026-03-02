import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton } from '../src/components';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            {/* Skip button */}
            <View style={styles.header}>
                <View />
                <TouchableOpacity
                    onPress={() => router.replace('/login')}
                    style={styles.skipButton}
                >
                    <Text style={styles.skipText}>{t('common.skip')}</Text>
                </TouchableOpacity>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.bgBlob} />
                <View style={styles.illustrationWrapper}>
                    <View style={styles.illustrationCircle} />
                    <View style={styles.illustrationPlaceholder}>
                        <MaterialIcons name="local-shipping" size={120} color={Colors.primary} />
                        <View style={styles.dot1} />
                        <View style={styles.dot2} />
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.textBlock}>
                    <Text style={styles.title}>
                        {t('onboarding.title')}
                        <Text style={styles.titleGradient}>{t('onboarding.titleHighlight')}</Text>
                    </Text>
                    <Text style={styles.description}>
                        {t('onboarding.description')}
                    </Text>
                </View>

                {/* Navigation controls */}
                <View style={styles.controls}>
                    {/* Pagination dots */}
                    <View style={styles.pagination}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>

                    {/* Button */}
                    <PrimaryButton
                        title={t('common.next')}
                        icon="arrow-forward"
                        onPress={() => router.push('/login')}
                        style={{ width: '100%' }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 56,
        marginBottom: 16,
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: BorderRadius.full,
    },
    skipText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: `${Colors.primary}B3`,
    },
    illustrationContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bgBlob: {
        position: 'absolute',
        width: width * 1.2,
        height: '80%',
        backgroundColor: `${Colors.primary}08`,
        borderRadius: width,
        top: -40,
    },
    illustrationWrapper: {
        width: width * 0.85,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    illustrationCircle: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${Colors.primary}15`,
        borderRadius: width,
        transform: [{ scale: 0.9 }],
    },
    illustrationPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot1: {
        position: 'absolute',
        top: 40,
        right: -20,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: `${Colors.primary}66`,
    },
    dot2: {
        position: 'absolute',
        bottom: 80,
        left: -20,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: `${Colors.primary}33`,
    },
    content: {
        alignItems: 'center',
        gap: 32,
        marginTop: 24,
    },
    textBlock: {
        alignItems: 'center',
        gap: 16,
        maxWidth: 300,
    },
    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.primary,
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: -0.3,
    },
    titleGradient: {
        color: Colors.primaryLight,
    },
    description: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.medium,
        color: Colors.slate500,
        textAlign: 'center',
        lineHeight: 26,
    },
    controls: {
        width: '100%',
        alignItems: 'center',
        gap: 32,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: Colors.slate300,
    },
    dotActive: {
        width: 32,
        backgroundColor: Colors.primary,
    },
});
