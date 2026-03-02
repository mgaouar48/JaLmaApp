import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { PrimaryButton } from '../src/components';
import { usePromo } from '../src/context/PromoContext';
import { useTranslation } from 'react-i18next';

interface Promo {
    id: string;
    code: string;
    title: string;
    description: string;
    discount: string;
    expiry: string;
    isActive: boolean;
}

export default function PromosScreen() {
    const { setPromoCode } = usePromo();
    const { t } = useTranslation();
    const [promos, setPromos] = useState<Promo[]>([
        {
            id: '1',
            code: 'JALMA26',
            title: 'Offre de Bienvenue',
            description: 'Profitez de 500 DA de réduction sur votre première commande de citerne de 5 000L ou plus.',
            discount: '-500 DA',
            expiry: 'Valable jusqu\'au 30 Juin 2026',
            isActive: false,
        },
        // Demo promo
        {
            id: '2',
            code: 'SUMMER',
            title: 'Spécial Été',
            description: 'Livraison gratuite pour toute commande le week-end.',
            discount: 'Gratuit',
            expiry: 'Valable jusqu\'au 31 Août 2026',
            isActive: false,
        }
    ]);

    const togglePromo = (id: string) => {
        setPromos(currentPromos =>
            currentPromos.map(p => {
                if (p.id === id) {
                    const newState = !p.isActive;
                    if (newState) {
                        Alert.alert(t('promos.promoActivated'), t('promos.promoAppliedMsg', { code: p.code }));
                        setPromoCode(p.code);
                        // Deactivate others if we only allow one
                        return { ...p, isActive: true };
                    }
                    if (p.isActive && !newState) {
                        setPromoCode(null);
                    }
                    return { ...p, isActive: false };
                }
                // Optional: Deactivate others if single selection
                // return { ...p, isActive: false }; 
                return p;
            })
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('promos.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>{t('promos.available')}</Text>

                {promos.map((promo) => (
                    <View key={promo.id} style={[styles.promoCard, promo.isActive && styles.promoCardActive]}>
                        <View style={styles.promoHeader}>
                            <View style={[styles.iconBg, promo.isActive && styles.iconBgActive]}>
                                <MaterialIcons name="local-offer" size={24} color={promo.isActive ? Colors.white : Colors.primary} />
                            </View>
                            <View style={styles.promoInfo}>
                                <Text style={styles.promoTitle}>{promo.title}</Text>
                                <Text style={styles.promoCode}>{promo.code}</Text>
                            </View>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{promo.discount}</Text>
                            </View>
                        </View>

                        <View style={styles.dashedLine}>
                            <View style={[styles.circle, styles.circleLeft]} />
                            <View style={[styles.circle, styles.circleRight]} />
                        </View>

                        <View style={styles.promoBody}>
                            <Text style={styles.description}>{promo.description}</Text>
                            <Text style={styles.expiry}>{promo.expiry}</Text>

                            <TouchableOpacity
                                style={[styles.activateBtn, promo.isActive && styles.activateBtnActive]}
                                onPress={() => togglePromo(promo.id)}
                            >
                                <Text style={[styles.activateBtnText, promo.isActive && styles.activateBtnTextActive]}>
                                    {promo.isActive ? t('promos.activated') : t('promos.activate')}
                                </Text>
                                {promo.isActive && <MaterialIcons name="check" size={16} color={Colors.white} />}
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

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
    content: {
        padding: 24,
    },
    subtitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 16,
    },
    promoCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        marginBottom: 20,
        ...Shadows.card,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    promoCardActive: {
        borderColor: Colors.accent,
        backgroundColor: '#F0FDFA',
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    iconBg: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    iconBgActive: {
        backgroundColor: Colors.accent,
    },
    promoInfo: {
        flex: 1,
    },
    promoTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
    },
    promoCode: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.black,
        color: Colors.slate400,
        marginTop: 2,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    discountBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    discountText: {
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: FontSize.xs,
    },
    dashedLine: {
        height: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.slate200,
        borderStyle: 'dashed',
        borderRadius: 1,
        marginVertical: 0,
        position: 'relative',
        backgroundColor: 'transparent',
    },
    circle: {
        position: 'absolute',
        top: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.backgroundLight,
    },
    circleLeft: { left: -10 },
    circleRight: { right: -10 },
    promoBody: {
        padding: 16,
        paddingTop: 16,
    },
    description: {
        fontSize: FontSize.sm,
        color: Colors.slate600,
        marginBottom: 8,
        lineHeight: 20,
    },
    expiry: {
        fontSize: FontSize.xs,
        color: Colors.slate400,
        marginBottom: 16,
        fontStyle: 'italic',
    },
    activateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: Colors.gray100,
        borderRadius: BorderRadius.md,
        gap: 8,
    },
    activateBtnActive: {
        backgroundColor: Colors.accent,
    },
    activateBtnText: {
        fontWeight: FontWeight.bold,
        color: Colors.slate600,
        fontSize: FontSize.sm,
    },
    activateBtnTextActive: {
        color: Colors.white,
    },
});
