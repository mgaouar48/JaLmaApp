import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';

export default function TransporterProfileScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profil</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.avatar}>
                    <MaterialIcons name="person" size={48} color={Colors.white} />
                </View>
                <Text style={styles.name}>Mamadou Diallo</Text>
                <Text style={styles.role}>Transporteur • Citerne 5000L</Text>

                <View style={styles.menuList}>
                    {[
                        { icon: 'edit' as const, label: 'Modifier le profil' },
                        { icon: 'description' as const, label: 'Mes documents' },
                        { icon: 'notifications' as const, label: 'Notifications' },
                        { icon: 'help-outline' as const, label: 'Aide & Support' },
                    ].map((item, i) => (
                        <TouchableOpacity key={i} style={styles.menuItem}>
                            <View style={styles.menuIconBg}>
                                <MaterialIcons name={item.icon} size={20} color={Colors.primary} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <MaterialIcons name="chevron-right" size={20} color={Colors.slate400} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => router.replace('/transporter-login')}
                >
                    <MaterialIcons name="logout" size={20} color={Colors.statusRed} />
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>
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
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary },
    content: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 24 },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, ...Shadows.float,
    },
    name: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.primary, marginBottom: 4 },
    role: { fontSize: FontSize.sm, color: Colors.slate500, marginBottom: 32 },
    menuList: {
        width: '100%', gap: 4,
        backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
        padding: 8, ...Shadows.soft,
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 12, gap: 12,
    },
    menuIconBg: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center', justifyContent: 'center',
    },
    menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.slate800 },
    logoutButton: {
        flexDirection: 'row', alignItems: 'center',
        gap: 8, marginTop: 32,
        paddingVertical: 12, paddingHorizontal: 24,
        borderRadius: BorderRadius.lg, backgroundColor: Colors.red50,
    },
    logoutText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.statusRed },
});
