import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants';
import { useTranslation } from 'react-i18next';

type DocStatus = 'empty' | 'uploaded' | 'verified';

interface DocItem {
    key: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    labelKey: string;
    status: DocStatus;
}

export default function MyDocumentsScreen() {
    const { t } = useTranslation();

    const [documents, setDocuments] = useState<DocItem[]>([
        { key: 'carteGrise', icon: 'directions-car', labelKey: 'transporter.carteGrise', status: 'empty' },
        { key: 'permisConduire', icon: 'badge', labelKey: 'transporter.permisConduire', status: 'empty' },
        { key: 'autorisation', icon: 'verified', labelKey: 'transporter.autorisation', status: 'empty' },
    ]);

    const getStatusConfig = (status: DocStatus) => {
        switch (status) {
            case 'verified':
                return {
                    color: Colors.statusGreen,
                    bgColor: `${Colors.statusGreen}12`,
                    icon: 'check-circle' as const,
                    label: t('documents.verified'),
                };
            case 'uploaded':
                return {
                    color: Colors.warning,
                    bgColor: `${Colors.warning}20`,
                    icon: 'hourglass-top' as const,
                    label: t('documents.pending'),
                };
            default:
                return {
                    color: Colors.slate400,
                    bgColor: `${Colors.slate100}`,
                    icon: 'cloud-upload' as const,
                    label: t('documents.notUploaded'),
                };
        }
    };

    const handleUpload = (key: string) => {
        // Simulate upload — replace with real file picker later
        setDocuments(prev =>
            prev.map(doc =>
                doc.key === key ? { ...doc, status: 'uploaded' as DocStatus } : doc
            )
        );
        Alert.alert(t('common.success'), t('documents.uploadSuccess'));
    };

    const handleView = (key: string) => {
        Alert.alert(t('documents.viewTitle'), t('documents.viewMessage'));
    };

    const uploadedCount = documents.filter(d => d.status !== 'empty').length;
    const totalCount = documents.length;

    return (
        <View style={styles.container}>
            {/* Dark gradient header */}
            <LinearGradient colors={['#0f172a', '#1e293b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={styles.glowCircle} />
                <View style={styles.decorCircle1} />
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.headerIconRing}>
                        <MaterialIcons name="folder-open" size={26} color="#22c55e" />
                    </View>
                    <Text style={styles.headerTitle}>{t('documents.title')}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressIconContainer}>
                        <MaterialIcons name="folder-open" size={32} color={Colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.progressTitle}>{t('documents.progressTitle')}</Text>
                        <Text style={styles.progressSubtitle}>
                            {uploadedCount}/{totalCount} {t('documents.documentsUploaded')}
                        </Text>
                    </View>
                    {/* Progress ring */}
                    <View style={styles.progressRing}>
                        <Text style={styles.progressPercent}>
                            {Math.round((uploadedCount / totalCount) * 100)}%
                        </Text>
                    </View>
                </View>

                {/* Info banner */}
                <View style={styles.infoBanner}>
                    <MaterialIcons name="info-outline" size={18} color={Colors.primary} />
                    <Text style={styles.infoBannerText}>{t('documents.infoBanner')}</Text>
                </View>

                {/* Documents list */}
                <Text style={styles.sectionTitle}>{t('documents.requiredDocs')}</Text>

                {/* TEST CREDENTIALS */}
                <TouchableOpacity 
                    style={styles.testContainer} 
                    onPress={() => {
                        setDocuments(prev => prev.map(doc => ({ ...doc, status: 'uploaded' as DocStatus })));
                    }}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="science" size={20} color={Colors.accent} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.testTitle}>{t('transporter.testFillDocsTitle')}</Text>
                        <Text style={styles.testText}>{t('transporter.testFillDocsSubtitle')}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.docsList}>
                    {documents.map((doc) => {
                        const statusConfig = getStatusConfig(doc.status);
                        return (
                            <View key={doc.key} style={styles.docCard}>
                                <View style={styles.docCardHeader}>
                                    <View style={[styles.docIconBg, { backgroundColor: `${Colors.primary}10` }]}>
                                        <MaterialIcons name={doc.icon} size={24} color={Colors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.docName}>{t(doc.labelKey)}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                                            <MaterialIcons name={statusConfig.icon} size={12} color={statusConfig.color} />
                                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={styles.docActions}>
                                    {doc.status === 'empty' ? (
                                        <TouchableOpacity
                                            style={styles.uploadButton}
                                            onPress={() => handleUpload(doc.key)}
                                        >
                                            <MaterialIcons name="cloud-upload" size={18} color={Colors.white} />
                                            <Text style={styles.uploadButtonText}>{t('transporter.uploadDocument')}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity
                                                style={styles.viewButton}
                                                onPress={() => handleView(doc.key)}
                                            >
                                                <MaterialIcons name="visibility" size={16} color={Colors.primary} />
                                                <Text style={styles.viewButtonText}>{t('documents.view')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.replaceButton}
                                                onPress={() => handleUpload(doc.key)}
                                            >
                                                <MaterialIcons name="refresh" size={16} color={Colors.slate500} />
                                                <Text style={styles.replaceButtonText}>{t('documents.replace')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'ios' ? 52 : 40, paddingBottom: 20, overflow: 'hidden' },
    glowCircle: { position: 'absolute', top: -30, left: '50%', marginLeft: -80, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(34,197,94,0.08)' },
    decorCircle1: { position: 'absolute', top: -20, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.03)' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 52 : 40, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    headerContent: { alignItems: 'center', paddingTop: 8, gap: 6 },
    headerIconRing: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '800' as any, color: Colors.white },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    // Progress card
    progressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 20,
        gap: 16,
        marginBottom: 16,
        ...Shadows.card,
    },
    progressIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.floatSm,
    },
    progressTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.slate800,
        marginBottom: 4,
    },
    progressSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
    },
    progressRing: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 4,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressPercent: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.extrabold,
        color: Colors.primary,
    },
    // Info banner
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: `${Colors.primary}08`,
        borderRadius: BorderRadius.lg,
        padding: 14,
        marginBottom: 24,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
    },
    infoBannerText: {
        flex: 1,
        fontSize: FontSize.xs,
        color: Colors.slate600,
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.slate500,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    testContainer: {
        backgroundColor: `${Colors.accent}15`,
        padding: 12,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: `${Colors.accent}50`,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    testTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.slate800, marginBottom: 2 },
    testText: { fontSize: FontSize.xs, color: Colors.slate600 },
    // Documents list
    docsList: {
        gap: 12,
    },
    docCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: 18,
        ...Shadows.soft,
    },
    docCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 14,
    },
    docIconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    docName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
        marginBottom: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
    },
    // Actions
    docActions: {
        borderTopWidth: 1,
        borderTopColor: Colors.slate100,
        paddingTop: 14,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: BorderRadius.full,
        ...Shadows.button,
    },
    uploadButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    viewButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: `${Colors.primary}10`,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
    },
    viewButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    replaceButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: Colors.slate100,
        paddingVertical: 10,
        borderRadius: BorderRadius.full,
    },
    replaceButtonText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate500,
    },
});
