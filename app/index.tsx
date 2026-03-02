import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight } from '../src/constants';
import { useTranslation } from 'react-i18next';

export default function SplashScreen() {
    const { t } = useTranslation();
    const floatAnim = new Animated.Value(0);
    const spinAnim = new Animated.Value(0);

    useEffect(() => {
        // Float animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Spin animation
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Navigate after splash
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={[Colors.primaryLight, Colors.white]}
            style={styles.container}
        >
            {/* Logo area */}
            <Animated.View
                style={[styles.logoContainer, { transform: [{ translateY: floatAnim }] }]}
            >
                {/* Glow */}
                <View style={styles.glow} />
                {/* Logo box */}
                <View style={styles.logoBox}>
                    <View style={styles.gradientOverlay} />
                    <MaterialIcons name="water-drop" size={64} color={Colors.primaryLight} />
                </View>
            </Animated.View>

            {/* Title */}
            <Text style={styles.title}>{t('common.appName')}</Text>
            <Text style={styles.subtitle}>{t('common.tagline')}</Text>

            {/* Loading spinner */}
            <View style={styles.loaderContainer}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <MaterialIcons name="refresh" size={32} color={Colors.primary} />
                </Animated.View>
            </View>

            {/* Bottom decoration */}
            <View style={styles.bottomDecoration}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    glow: {
        position: 'absolute',
        width: 224,
        height: 224,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 112,
        top: -32,
    },
    logoBox: {
        width: 160,
        height: 160,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        overflow: 'hidden',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${Colors.primaryLight}15`,
    },
    title: {
        fontSize: FontSize['5xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.primary,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: `${Colors.primary}CC`,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    loaderContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
    },
    bottomDecoration: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '33%',
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 300,
        height: 200,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 150,
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -80,
        right: -40,
        width: 300,
        height: 250,
        backgroundColor: `${Colors.primaryLight}15`,
        borderRadius: 150,
    },
});
