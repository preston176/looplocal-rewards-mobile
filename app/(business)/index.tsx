import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    Users,
    TrendingUp,
    Calendar,
    Clock,
    Award,
    RefreshCw,
    Wifi,
    QrCode,
    Smartphone,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { useSyncStore } from '@/store/syncStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/StatCard';
import { CheckInMethod } from '@/components/CheckInMethod';
import { colors } from '@/constants/colors';

export default function BusinessDashboardScreen() {
    const { user } = useAuthStore();
    const { currentBusiness, getCheckInsForPeriod } = useBusinessStore();
    const { isOnline, pendingCheckIns, syncAll } = useSyncStore();

    const [activeCheckInMethod, setActiveCheckInMethod] = useState<'wifi' | 'qr' | 'nfc'>('wifi');

    const todayCheckIns = getCheckInsForPeriod('day').length;
    const weekCheckIns = getCheckInsForPeriod('week').length;
    const monthCheckIns = getCheckInsForPeriod('month').length;

    const handleSync = () => {
        if (pendingCheckIns.length === 0) {
            Alert.alert('No Pending Sync', 'All your data is already synced.');
            return;
        }

        if (!isOnline) {
            Alert.alert('Offline', 'You are currently offline. Please connect to the internet to sync your data.');
            return;
        }

        syncAll();
        Alert.alert('Sync Complete', `Successfully synced ${pendingCheckIns.length} check-ins.`);
    };

    const handleCheckInMethodPress = (method: 'wifi' | 'qr' | 'nfc') => {
        setActiveCheckInMethod(method);

        // In a real app, this would update the business settings
        Alert.alert(
            'Check-in Method Updated',
            `${method.toUpperCase()} is now your primary check-in method.`
        );
    };

    const handleGenerateQR = () => {
        // In a real app, this would generate a QR code for the business
        Alert.alert(
            'QR Code Generated',
            'Your QR code has been generated. You can print it and display it in your business for customers to scan.'
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Business Header */}
                <Card variant="elevated" style={styles.businessCard}>
                    <Text style={styles.businessName}>{currentBusiness?.name || user?.name || 'Your Business'}</Text>
                    <Text style={styles.businessCategory}>{currentBusiness?.category || 'Business'}</Text>

                    {!isOnline && (
                        <View style={styles.offlineContainer}>
                            <Text style={styles.offlineText}>
                                You're offline. Data will sync when you're back online.
                            </Text>
                            <Button
                                title="Sync Now"
                                variant="outline"
                                size="small"
                                disabled={!isOnline}
                                onPress={handleSync}
                                style={styles.syncButton}
                            />
                        </View>
                    )}
                </Card>

                {/* Stats Overview */}
                <Text style={styles.sectionTitle}>Today's Overview</Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Today's Check-ins"
                        value={todayCheckIns}
                        icon={<Users size={24} color={colors.primary} />}
                    />

                    <StatCard
                        title="This Week"
                        value={weekCheckIns}
                        subtitle={`+${weekCheckIns - todayCheckIns} from today`}
                        icon={<Calendar size={24} color={colors.secondary} />}
                        color={colors.secondary}
                    />
                </View>

                <View style={styles.statsGrid}>
                    <StatCard
                        title="Active Customers"
                        value={currentBusiness?.customers.length || 0}
                        icon={<TrendingUp size={24} color={colors.info} />}
                        color={colors.info}
                    />

                    <StatCard
                        title="This Month"
                        value={monthCheckIns}
                        subtitle={`Avg ${Math.round(monthCheckIns / 30)} per day`}
                        icon={<Clock size={24} color={colors.accent} />}
                        color={colors.accent}
                    />
                </View>

                {/* Check-in Methods */}
                <Text style={styles.sectionTitle}>Check-in Methods</Text>
                <Text style={styles.sectionSubtitle}>
                    Choose how customers can check in to your business
                </Text>

                <CheckInMethod
                    method="wifi"
                    onPress={() => handleCheckInMethodPress('wifi')}
                    active={activeCheckInMethod === 'wifi'}
                />

                <CheckInMethod
                    method="qr"
                    onPress={() => handleCheckInMethodPress('qr')}
                    active={activeCheckInMethod === 'qr'}
                />

                <CheckInMethod
                    method="nfc"
                    onPress={() => handleCheckInMethodPress('nfc')}
                    active={activeCheckInMethod === 'nfc'}
                />

                {activeCheckInMethod === 'qr' && (
                    <Button
                        title="Generate QR Code"
                        variant="primary"
                        onPress={handleGenerateQR}
                        style={styles.generateButton}
                    />
                )}

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            // In a real app, this would navigate to the rewards screen
                            Alert.alert('Manage Rewards', 'This would open the rewards management screen.');
                        }}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
                            <Award size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.actionText}>Manage Rewards</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSync}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: colors.secondaryLight }]}>
                            <RefreshCw size={24} color={colors.secondary} />
                        </View>
                        <Text style={styles.actionText}>Sync Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            // In a real app, this would navigate to the export screen
                            Alert.alert('Export Data', 'This would open the data export screen.');
                        }}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: colors.accent + '40' }]}>
                            <Calendar size={24} color={colors.accent} />
                        </View>
                        <Text style={styles.actionText}>Export Data</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    businessCard: {
        padding: 24,
        marginBottom: 24,
    },
    businessName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 4,
    },
    businessCategory: {
        fontSize: 16,
        color: colors.textLight,
    },
    offlineContainer: {
        backgroundColor: colors.warning + '20',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    offlineText: {
        fontSize: 14,
        color: colors.warning,
        flex: 1,
        marginRight: 8,
    },
    syncButton: {
        borderColor: colors.warning,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    generateButton: {
        marginTop: 8,
        marginBottom: 24,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 8,
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        color: colors.textDark,
        fontWeight: '500',
        textAlign: 'center',
    },
});