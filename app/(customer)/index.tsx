import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Wifi, QrCode, Smartphone } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useSyncStore } from '@/store/syncStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Badge } from '@/components/Badge';
import { BusinessCard } from '@/components/BusinessCard';
import { colors } from '@/constants/colors';
import { generateId, calculateStreakBonus } from '@/utils/helpers';

// Mock data for nearby businesses
const NEARBY_BUSINESSES = [
    {
        id: '1',
        name: 'Joe\'s Barbershop',
        category: 'Barbershop',
        address: '123 Main St',
        rating: 4.8,
    },
    {
        id: '2',
        name: 'Bella\'s Salon',
        category: 'Salon',
        address: '456 Oak Ave',
        rating: 4.5,
    },
    {
        id: '3',
        name: 'Cafe Delight',
        category: 'Cafe',
        address: '789 Elm St',
        rating: 4.7,
    },
];

export default function CustomerHomeScreen() {
    const { user, addPoints, addCheckIn, updateStreak } = useAuthStore();
    const { addPendingCheckIn, isOnline, syncAll } = useSyncStore();
    const { addNotification } = useNotificationStore();

    const [isWifiConnected, setIsWifiConnected] = useState(false);
    const [showWifiModal, setShowWifiModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

    // Simulate WiFi connection detection
    useEffect(() => {
        const checkWifiInterval = setInterval(() => {
            // Randomly simulate WiFi connection changes (for demo purposes)
            if (Math.random() > 0.7) {
                const newWifiState = !isWifiConnected;
                setIsWifiConnected(newWifiState);

                if (newWifiState && !showWifiModal) {
                    // Simulate detecting a business WiFi
                    const randomBusiness = NEARBY_BUSINESSES[Math.floor(Math.random() * NEARBY_BUSINESSES.length)];
                    setSelectedBusiness(randomBusiness);
                    setShowWifiModal(true);
                }
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(checkWifiInterval);
    }, [isWifiConnected, showWifiModal]);

    const handleCheckIn = (method: 'wifi' | 'qr' | 'nfc', businessId: string = '1') => {
        // Get the business from our mock data
        const business = NEARBY_BUSINESSES.find(b => b.id === businessId) || NEARBY_BUSINESSES[0];

        // Create a check-in record
        const checkIn = {
            id: generateId(),
            businessId: business.id,
            userId: user?.id || '',
            timestamp: new Date().toISOString(),
            points: 10, // Base points
            method,
            synced: isOnline,
        };

        // Update streak and calculate bonus
        updateStreak();
        const streakBonus = user ? calculateStreakBonus(user.streakDays + 1) : 0;
        const totalPoints = 10 + streakBonus;

        // Add points and check-in to user record
        addPoints(totalPoints);
        addCheckIn(checkIn);

        // If offline, add to pending sync queue
        if (!isOnline) {
            addPendingCheckIn(checkIn);
            addNotification(
                'Offline Check-in',
                `Your check-in at ${business.name} has been saved and will sync when you're back online.`
            );
        } else {
            // If online, sync immediately
            syncAll();
            addNotification(
                'Check-in Successful',
                `You earned ${totalPoints} points at ${business.name}${streakBonus > 0 ? ` (includes ${streakBonus} streak bonus)` : ''}!`
            );
        }

        // Show success message
        Alert.alert(
            'Check-in Successful!',
            `You earned ${totalPoints} points at ${business.name}${streakBonus > 0 ? ` (includes ${streakBonus} streak bonus)` : ''}!`,
            [{ text: 'OK' }]
        );

        // Close WiFi modal if open
        if (showWifiModal) {
            setShowWifiModal(false);
        }
    };

    const handleQRScan = () => {
        // Simulate scanning a QR code
        Alert.alert(
            'QR Code Detected',
            'Would you like to check in at Joe\'s Barbershop?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Check In', onPress: () => handleCheckIn('qr', '1') }
            ]
        );
    };

    const handleNFCTap = () => {
        // Simulate NFC tap
        Alert.alert(
            'NFC Tag Detected',
            'Would you like to check in at Bella\'s Salon?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Check In', onPress: () => handleCheckIn('nfc', '2') }
            ]
        );
    };

    const handleBusinessPress = (business: any) => {
        // In a real app, this would navigate to the business details screen
        Alert.alert(
            business.name,
            `Would you like to check in at ${business.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Check In', onPress: () => handleCheckIn('qr', business.id) }
            ]
        );
    };

    // Render WiFi captive portal modal
    const renderWifiModal = () => {
        if (!showWifiModal || !selectedBusiness) return null;

        return (
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Wifi size={24} color={colors.primary} />
                        <Text style={styles.modalTitle}>WiFi Check-in</Text>
                    </View>

                    <Text style={styles.modalText}>
                        You're connected to {selectedBusiness.name}'s WiFi network.
                        Would you like to check in and earn points?
                    </Text>

                    <View style={styles.modalButtons}>
                        <Button
                            title="Not Now"
                            onPress={() => setShowWifiModal(false)}
                            variant="outline"
                            style={{ flex: 1, marginRight: 8 }}
                        />
                        <Button
                            title="Check In"
                            onPress={() => handleCheckIn('wifi', selectedBusiness.id)}
                            variant="primary"
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Points Card */}
                <Card variant="elevated" style={styles.pointsCard}>
                    <Text style={styles.welcomeText}>
                        Welcome back, {user?.name || 'there'}!
                    </Text>
                    <Text style={styles.pointsText}>{user?.points || 0}</Text>
                    <Text style={styles.pointsLabel}>Total Points</Text>

                    {user?.streakDays ? (
                        <View style={styles.streakContainer}>
                            <Badge
                                label={`${user.streakDays} Day Streak!`}
                                variant="primary"
                                size="small"
                            />
                        </View>
                    ) : null}

                    <ProgressBar
                        progress={0.6}
                        label="Progress to next reward"
                        showPercentage
                        style={styles.progressBar}
                    />

                    <Button
                        title="View Rewards"
                        onPress={() => router.push('/rewards')}
                        variant="outline"
                        size="small"
                        style={styles.viewRewardsButton}
                    />
                </Card>

                {/* Check-in Methods */}
                <Text style={styles.sectionTitle}>Check In</Text>
                <View style={styles.checkInContainer}>
                    <TouchableOpacity
                        style={styles.checkInMethod}
                        onPress={() => Alert.alert('WiFi Check-in', 'Connect to a business WiFi to check in automatically.')}
                    >
                        <View style={[styles.checkInIcon, { backgroundColor: colors.primaryLight }]}>
                            <Wifi size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.checkInText}>WiFi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkInMethod}
                        onPress={handleQRScan}
                    >
                        <View style={[styles.checkInIcon, { backgroundColor: colors.secondaryLight }]}>
                            <QrCode size={24} color={colors.secondary} />
                        </View>
                        <Text style={styles.checkInText}>QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.checkInMethod}
                        onPress={handleNFCTap}
                    >
                        <View style={[styles.checkInIcon, { backgroundColor: colors.accent + '40' }]}>
                            <Smartphone size={24} color={colors.accent} />
                        </View>
                        <Text style={styles.checkInText}>NFC Tap</Text>
                    </TouchableOpacity>
                </View>

                {/* Nearby Businesses */}
                <Text style={styles.sectionTitle}>Nearby Businesses</Text>
                {NEARBY_BUSINESSES.map((business) => (
                    <BusinessCard
                        key={business.id}
                        name={business.name}
                        category={business.category}
                        address={business.address}
                        rating={business.rating}
                        onPress={() => handleBusinessPress(business)}
                    />
                ))}

                {/* Connection Status */}
                {!isOnline && (
                    <View style={styles.offlineContainer}>
                        <Text style={styles.offlineText}>
                            You're offline. Check-ins will be saved and synced when you're back online.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* WiFi Modal */}
            {renderWifiModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    pointsCard: {
        padding: 24,
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 8,
    },
    pointsText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primary,
    },
    pointsLabel: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 16,
    },
    streakContainer: {
        marginBottom: 16,
    },
    progressBar: {
        marginBottom: 16,
    },
    viewRewardsButton: {
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 16,
    },
    checkInContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    checkInMethod: {
        alignItems: 'center',
        width: '30%',
    },
    checkInIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkInText: {
        fontSize: 14,
        color: colors.textDark,
        fontWeight: '500',
    },
    offlineContainer: {
        backgroundColor: colors.warning + '20',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    offlineText: {
        fontSize: 14,
        color: colors.warning,
        textAlign: 'center',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginLeft: 8,
    },
    modalText: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 24,
        lineHeight: 24,
    },
    modalButtons: {
        flexDirection: 'row',
    },
});