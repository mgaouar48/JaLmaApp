import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight } from '../../src/constants';

export default function RevenueScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Revenus</Text>
            </View>
            <View style={styles.content}>
                <MaterialIcons name="account-balance-wallet" size={64} color={`${Colors.primary}30`} />
                <Text style={styles.placeholder}>Fonctionnalité à venir</Text>
                <Text style={styles.subtext}>
                    Suivez vos revenus et vos paiements ici.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 16,
    },
    title: {
        fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary,
    },
    content: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        gap: 16, paddingBottom: 80,
    },
    placeholder: {
        fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.slate500,
    },
    subtext: {
        fontSize: FontSize.sm, color: Colors.slate400,
        textAlign: 'center', paddingHorizontal: 48,
    },
});
