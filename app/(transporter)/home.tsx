import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Modal, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants';
import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransporterHomeScreen() {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const [isOnline, setIsOnline] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationGranted, setLocationGranted] = useState(false);
    const [updating, setUpdating] = useState(false);
    const { t } = useTranslation();
    const { session } = useAuth();

    // Documents popup state
    const [showDocsPopup, setShowDocsPopup] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState({
        carteGrise: false,
        permisConduire: false,
        autorisation: false,
    });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Show popup every time unless documents have been submitted
    useEffect(() => {
        const checkDocsPopup = async () => {
            try {
                const submitted = await AsyncStorage.getItem('docs_submitted');
                if (!submitted) {
                    setShowDocsPopup(true);
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(slideAnim, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            } catch { }
        };
        checkDocsPopup();
    }, []);

    // "Faire plus tard" — only closes for this session, does NOT save
    const handleDismissPopup = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setShowDocsPopup(false));
    };

    const handleUploadDoc = (docType: 'carteGrise' | 'permisConduire' | 'autorisation') => {
        // Placeholder — simulate upload
        setUploadedDocs(prev => ({ ...prev, [docType]: true }));
    };

    // Only submitting all documents saves the flag permanently
    const handleSubmitDocuments = async () => {
        const allUploaded = Object.values(uploadedDocs).every(v => v);
        if (!allUploaded) {
            Alert.alert(t('common.error'), 'Veuillez télécharger tous les documents.');
            return;
        }
        try {
            await AsyncStorage.setItem('docs_submitted', 'true');
        } catch { }
        Alert.alert(t('common.success'), 'Documents soumis avec succès !', [
            { text: t('common.ok'), onPress: handleDismissPopup },
        ]);
    };

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                setLocation(loc);
                mapRef.current?.animateToRegion({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }, 1000);

                setTimeout(() => setLocationGranted(true), 500);
            } catch (err) {
                console.log('Location error:', err);
                setTimeout(() => setLocationGranted(true), 500);
            }
        })();
    }, []);

    // Fetch current online status from DB on mount
    useEffect(() => {
        if (!session?.user?.id) return;
        supabase
            .from('drivers')
            .select('is_online')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
                if (data) setIsOnline(data.is_online);
            });
    }, [session?.user?.id]);

    const handleToggle = async () => {
        if (!session?.user?.id) return;
        const newStatus = !isOnline;
        setUpdating(true);

        // Build location value for PostGIS
        let locationUpdate: Record<string, unknown> = { is_online: newStatus };
        if (newStatus && location) {
            // Send current location when going online
            locationUpdate.current_location = `SRID=4326;POINT(${location.coords.longitude} ${location.coords.latitude})`;
            locationUpdate.last_location_update = new Date().toISOString();
        }
        if (!newStatus) {
            // Going offline: mark not available either
            locationUpdate.is_available = false;
        } else {
            locationUpdate.is_available = true;
        }

        const { error } = await supabase
            .from('drivers')
            .update(locationUpdate)
            .eq('id', session.user.id);

        setUpdating(false);
        if (error) {
            Alert.alert(t('common.error'), error.message);
        } else {
            setIsOnline(newStatus);
        }
    };

    const handleRecenter = () => {
        if (location) {
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    const initialRegion = {
        latitude: 34.8828,
        longitude: -1.3148,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            {/* Full-screen Map */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={initialRegion}
                showsUserLocation={locationGranted}
                showsMyLocationButton={false}
            />

            {/* Spacer for safe area */}
            <View style={{ height: insets.top + 12 }} />

            {/* Online/Offline Toggle */}
            <View style={styles.toggleOuter}>
                <TouchableOpacity
                    style={[styles.toggleContainer, updating && styles.toggleDisabled]}
                    onPress={handleToggle}
                    activeOpacity={0.8}
                    disabled={updating}
                >
                    <View style={styles.toggleLabels}>
                        <Text style={[styles.toggleLabelText, !isOnline && styles.toggleLabelActive]}>
                            {t('transporter.offline')}
                        </Text>
                        <Text style={[styles.toggleLabelText, isOnline && styles.toggleLabelActive]}>
                            {t('transporter.online')}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.toggleKnob,
                            isOnline ? styles.toggleKnobOn : styles.toggleKnobOff,
                        ]}
                    >
                        <MaterialIcons
                            name={updating ? 'hourglass-empty' : isOnline ? 'radar' : 'power-settings-new'}
                            size={20}
                            color={Colors.white}
                        />
                        <Text style={styles.toggleKnobText}>
                            {isOnline ? t('transporter.online') : t('transporter.offline')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Status indicator */}
            {isOnline && (
                <View style={styles.waitingBanner}>
                    <MaterialIcons name="radar" size={20} color={Colors.primary} />
                    <Text style={styles.waitingText}>{t('transporter.waitingForOrders')}</Text>
                </View>
            )}

            {/* Recenter Button */}
            <TouchableOpacity
                style={[styles.recenterBtn, { bottom: insets.bottom + 24 }]}
                onPress={handleRecenter}
            >
                <MaterialIcons name="my-location" size={24} color={Colors.textDark} />
            </TouchableOpacity>

            {/* Documents Popup Modal */}
            <Modal
                visible={showDocsPopup}
                transparent
                animationType="none"
                onRequestClose={handleDismissPopup}
            >
                <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                    <Animated.View style={[styles.modalCard, { transform: [{ translateY: slideAnim }] }]}>
                        {/* Header icon */}
                        <LinearGradient
                            colors={['#14532d', '#166534', '#22c55e']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.modalIconContainer}
                        >
                            <MaterialIcons name="folder-open" size={36} color={Colors.white} />
                        </LinearGradient>

                        <Text style={styles.modalTitle}>{t('transporter.documentsPopupTitle')}</Text>
                        <Text style={styles.modalSubtitle}>{t('transporter.documentsPopupSubtitle')}</Text>

                        {/* TEST CREDENTIALS */}
                        <TouchableOpacity
                            style={styles.testContainer}
                            onPress={() => {
                                setUploadedDocs({ carteGrise: true, permisConduire: true, autorisation: true });
                            }}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="science" size={20} color={Colors.accent} />
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.testTitle}>{t('transporter.testFillDocsTitle')}</Text>
                                <Text style={styles.testText}>{t('transporter.testFillDocsSubtitle')}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Document list */}
                        <View style={styles.docsList}>
                            {([
                                { key: 'carteGrise' as const, icon: 'directions-car' as const, label: t('transporter.carteGrise') },
                                { key: 'permisConduire' as const, icon: 'badge' as const, label: t('transporter.permisConduire') },
                                { key: 'autorisation' as const, icon: 'verified' as const, label: t('transporter.autorisation') },
                            ]).map((doc) => (
                                <View key={doc.key} style={styles.docRow}>
                                    <View style={[
                                        styles.docIconBg,
                                        uploadedDocs[doc.key] && styles.docIconBgDone,
                                    ]}>
                                        <MaterialIcons
                                            name={uploadedDocs[doc.key] ? 'check-circle' : doc.icon}
                                            size={22}
                                            color={uploadedDocs[doc.key] ? Colors.statusGreen : Colors.primary}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.docLabel,
                                        uploadedDocs[doc.key] && styles.docLabelDone,
                                    ]}>{doc.label}</Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.uploadBtnWrapper,
                                            uploadedDocs[doc.key] && styles.uploadBtnDone,
                                        ]}
                                        onPress={() => handleUploadDoc(doc.key)}
                                        disabled={uploadedDocs[doc.key]}
                                    >
                                        {uploadedDocs[doc.key] ? (
                                            <>
                                                <MaterialIcons name="check" size={16} color={Colors.statusGreen} />
                                                <Text style={styles.uploadBtnTextDone}>{t('transporter.uploaded')}</Text>
                                            </>
                                        ) : (
                                            <LinearGradient
                                                colors={['#14532d', '#166534', '#22c55e']}
                                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                style={styles.uploadBtn}
                                            >
                                                <MaterialIcons name="cloud-upload" size={16} color={Colors.white} />
                                                <Text style={styles.uploadBtnText}>{t('transporter.uploadDocument')}</Text>
                                            </LinearGradient>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Submit button */}
                        <TouchableOpacity
                            style={[
                                styles.submitDocsBtnWrapper,
                                !Object.values(uploadedDocs).every(v => v) && styles.submitDocsBtnDisabled,
                            ]}
                            onPress={handleSubmitDocuments}
                        >
                            <LinearGradient
                                colors={['#14532d', '#166534', '#22c55e']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.submitDocsBtn}
                            >
                                <MaterialIcons name="send" size={18} color={Colors.white} />
                                <Text style={styles.submitDocsBtnText}>{t('transporter.submitDocuments')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Do it later */}
                        <TouchableOpacity style={styles.laterBtn} onPress={handleDismissPopup}>
                            <Text style={styles.laterBtnText}>{t('transporter.doItLater')}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toggleOuter: {
        paddingHorizontal: 24,
        paddingBottom: 12,
    },
    toggleContainer: {
        height: 60,
        backgroundColor: 'rgba(226,232,240,0.9)',
        borderRadius: 30,
        padding: 5,
        position: 'relative',
    },
    toggleDisabled: {
        opacity: 0.7,
    },
    toggleLabels: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    toggleLabelText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.extrabold,
        color: Colors.slate400,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    toggleLabelActive: {
        color: Colors.slate600,
    },
    toggleKnob: {
        position: 'absolute',
        top: 5,
        height: 50,
        width: '50%',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...Shadows.float,
    },
    toggleKnobOn: {
        right: 5,
        backgroundColor: Colors.statusGreen,
    },
    toggleKnobOff: {
        left: 5,
        backgroundColor: Colors.statusRed,
    },
    toggleKnobText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.extrabold,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    waitingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: BorderRadius.full,
        ...Shadows.card,
    },
    waitingText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.primary,
    },
    recenterBtn: {
        position: 'absolute',
        right: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.float,
    },
    // ── Documents Popup Styles ──
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        ...Shadows.float,
    },
    modalIconContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.slate500,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
        paddingHorizontal: 8,
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
        width: '100%',
    },
    testTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.slate800, marginBottom: 2 },
    testText: { fontSize: FontSize.xs, color: Colors.slate600 },
    docsList: {
        width: '100%',
        gap: 12,
        marginBottom: 24,
    },
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
        borderRadius: BorderRadius.lg,
        padding: 14,
        gap: 12,
    },
    docIconBg: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: `${Colors.primary}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    docIconBgDone: {
        backgroundColor: `${Colors.statusGreen}15`,
    },
    docLabel: {
        flex: 1,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate800,
    },
    docLabelDone: {
        color: Colors.statusGreen,
    },
    uploadBtnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: BorderRadius.full,
    },
    uploadBtnDone: {
        backgroundColor: `${Colors.statusGreen}15`,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: BorderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    uploadBtnText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    uploadBtnTextDone: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        color: Colors.statusGreen,
    },
    submitDocsBtnWrapper: {
        width: '100%',
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    submitDocsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        paddingVertical: 16,
        borderRadius: BorderRadius.full,
    },
    submitDocsBtnDisabled: {
        opacity: 0.5,
    },
    submitDocsBtnText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    },
    laterBtn: {
        marginTop: 16,
        paddingVertical: 8,
    },
    laterBtnText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.slate400,
        textDecorationLine: 'underline',
    },
});
