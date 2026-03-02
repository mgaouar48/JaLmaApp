import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton, StarRating, ChipSelector } from '../src/components';
import { useTranslation } from 'react-i18next';

export default function RatingScreen() {
    const { t } = useTranslation();

    const feedbackTags = [
        { id: 'punctual', label: `⏰ ${t('rating.punctuality')}` },
        { id: 'service', label: `👍 ${t('rating.service')}` },
        { id: 'quality', label: `💧 ${t('rating.waterQuality')}` },
        { id: 'communication', label: `💬 ${t('rating.communication')}` },
        { id: 'cleanliness', label: `🧹 ${t('rating.cleanliness')}` },
    ];
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('rating.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Success icon */}
                <View style={styles.successIcon}>
                    <View style={styles.successGlow} />
                    <MaterialIcons name="check-circle" size={56} color={Colors.accent} />
                </View>

                <Text style={styles.title}>{t('rating.deliveryComplete')}</Text>
                <Text style={styles.subtitle}>
                    {t('rating.howWasDelivery')}
                </Text>

                {/* Driver card */}
                <View style={styles.driverCard}>
                    <View style={styles.driverAvatar}>
                        <MaterialIcons name="person" size={24} color={Colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.driverName}>Ahmed Bensaid</Text>
                        <Text style={styles.driverMeta}>Citerne 5000L • Réf: #JL-247</Text>
                    </View>
                </View>

                {/* Star rating */}
                <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>{t('rating.yourRating')}</Text>
                    <StarRating maxStars={5} initialRating={4} size={44} />
                </View>

                {/* Tags */}
                <View style={styles.tagSection}>
                    <Text style={styles.tagLabel}>{t('rating.whatDidYouLike')}</Text>
                    <ChipSelector options={feedbackTags} />
                </View>

                {/* Comment */}
                <View style={styles.commentSection}>
                    <Text style={styles.commentLabel}>{t('rating.commentOptional')}</Text>
                    <TextInput
                        style={styles.commentInput}
                        placeholder={t('rating.shareFeedback')}
                        placeholderTextColor={Colors.slate400}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit */}
                <PrimaryButton
                    title={t('rating.submit')}
                    icon="send"
                    variant="accent"
                    onPress={() => router.replace('/(client)')}
                />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.slate100,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 48,
        gap: 24,
    },
    successIcon: {
        alignSelf: 'center',
        position: 'relative',
    },
    successGlow: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${Colors.accent}20`,
        top: -12,
        left: -12,
    },
    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.base,
        color: Colors.slate500,
        textAlign: 'center',
        marginTop: -12,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: BorderRadius.lg,
        ...Shadows.floatSm,
    },
    driverAvatar: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center', justifyContent: 'center',
    },
    driverName: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.bold,
        color: Colors.slate900,
    },
    driverMeta: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    ratingSection: {
        alignItems: 'center',
        gap: 16,
        paddingVertical: 8,
    },
    ratingLabel: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.slate700,
    },
    tagSection: {
        gap: 12,
    },
    tagLabel: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.slate700,
    },
    commentSection: {
        gap: 8,
    },
    commentLabel: {
        fontSize: FontSize.md,
        fontWeight: FontWeight.semibold,
        color: Colors.slate700,
    },
    commentInput: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: 16,
        fontSize: FontSize.base,
        color: Colors.slate900,
        minHeight: 100,
        borderWidth: 1,
        borderColor: Colors.slate200,
    },
});
