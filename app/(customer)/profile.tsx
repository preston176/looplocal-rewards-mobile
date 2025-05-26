import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Bell, Settings, LogOut, Info, Shield, HelpCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useSyncStore } from '@/store/syncStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { NotificationItem } from '@/components/NotificationItem';
import { colors } from '@/constants/colors';
import { formatPhoneNumber } from '@/utils/helpers';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
    const { pendingCheckIns, isOnline, syncAll } = useSyncStore();

    const [pushNotifications, setPushNotifications] = useState(true);
    const [locationServices, setLocationServices] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    onPress: () => {
                        logout();
                        router.replace('/');
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleNotificationPress = (id: string) => {
        markAsRead(id);
    };

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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Profile Card */}
                <Card variant="elevated" style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileAvatar}>
                            <Text style={styles.profileInitials}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                            <Text style={styles.profilePhone}>{user?.phoneNumber ? formatPhoneNumber(user.phoneNumber) : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user?.points || 0}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user?.checkIns.length || 0}</Text>
                            <Text style={styles.statLabel}>Check-ins</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user?.streakDays || 0}</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                    </View>
                </Card>

                {/* Notifications */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    {notifications.length > 0 && (
                        <Button
                            title="Mark All Read"
                            variant="text"
                            size="small"
                            onPress={markAllAsRead}
                        />
                    )}
                </View>

                {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onPress={() => handleNotificationPress(notification.id)}
                        />
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </Card>
                )}

                {notifications.length > 3 && (
                    <Button
                        title={`View All (${notifications.length})`}
                        variant="outline"
                        size="small"
                        style={styles.viewAllButton}
                        onPress={() => {
                            // In a real app, this would navigate to a notifications screen
                            Alert.alert('View All Notifications', 'This would show all notifications in a full screen.');
                        }}
                    />
                )}

                {/* Sync Status */}
                {pendingCheckIns.length > 0 && (
                    <Card style={[styles.syncCard, !isOnline && styles.offlineCard]}>
                        <View style={styles.syncHeader}>
                            <Text style={styles.syncTitle}>Pending Sync</Text>
                            <View style={[styles.statusIndicator, isOnline ? styles.onlineIndicator : styles.offlineIndicator]} />
                        </View>

                        <Text style={styles.syncText}>
                            {isOnline
                                ? `You have ${pendingCheckIns.length} check-ins waiting to be synced.`
                                : 'You are currently offline. Connect to the internet to sync your data.'}
                        </Text>

                        <Button
                            title="Sync Now"
                            variant="primary"
                            size="small"
                            disabled={!isOnline}
                            onPress={handleSync}
                            style={styles.syncButton}
                        />
                    </Card>
                )}

                {/* Settings */}
                <Text style={styles.sectionTitle}>Settings</Text>

                <Card style={styles.settingsCard}>
                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            <Bell size={20} color={colors.textLight} style={styles.settingIcon} />
                            <Text style={styles.settingLabel}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={pushNotifications}
                            onValueChange={setPushNotifications}
                            trackColor={{ false: colors.border, true: colors.primaryLight }}
                            thumbColor={pushNotifications ? colors.primary : colors.textLight}
                        />
                    </View>

                    <View style={styles.settingDivider} />

                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            <Settings size={20} color={colors.textLight} style={styles.settingIcon} />
                            <Text style={styles.settingLabel}>Location Services</Text>
                        </View>
                        <Switch
                            value={locationServices}
                            onValueChange={setLocationServices}
                            trackColor={{ false: colors.border, true: colors.primaryLight }}
                            thumbColor={locationServices ? colors.primary : colors.textLight}
                        />
                    </View>
                </Card>

                {/* Help & Support */}
                <Text style={styles.sectionTitle}>Help & Support</Text>

                <Card style={styles.supportCard}>
                    <TouchableButton
                        icon={<Info size={20} color={colors.textLight} />}
                        label="About LoopLocal"
                        onPress={() => {
                            // In a real app, this would navigate to an about screen
                            Alert.alert('About LoopLocal', 'LoopLocal is a loyalty rewards app for local businesses.');
                        }}
                    />

                    <View style={styles.settingDivider} />

                    <TouchableButton
                        icon={<Shield size={20} color={colors.textLight} />}
                        label="Privacy Policy"
                        onPress={() => {
                            // In a real app, this would navigate to a privacy policy screen
                            Alert.alert('Privacy Policy', 'This would show the privacy policy.');
                        }}
                    />

                    <View style={styles.settingDivider} />

                    <TouchableButton
                        icon={<HelpCircle size={20} color={colors.textLight} />}
                        label="Help Center"
                        onPress={() => {
                            // In a real app, this would navigate to a help center screen
                            Alert.alert('Help Center', 'This would show the help center.');
                        }}
                    />
                </Card>

                {/* Logout Button */}
                <Button
                    title="Logout"
                    variant="outline"
                    size="large"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    textStyle={{ color: colors.error }}
                />
            </ScrollView>
        </View>
    );
}

// Helper component for touchable settings items
const TouchableButton = ({ icon, label, onPress }: any) => (
    <View style={styles.touchableButton} onTouchEnd={onPress}>
        <View style={styles.settingLabelContainer}>
            {icon}
            <Text style={styles.settingLabel}>{label}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    profileCard: {
        padding: 16,
        marginBottom: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInitials: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 4,
    },
    profilePhone: {
        fontSize: 14,
        color: colors.textLight,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 12,
        marginTop: 8,
    },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    viewAllButton: {
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    syncCard: {
        padding: 16,
        marginBottom: 24,
    },
    offlineCard: {
        borderColor: colors.warning,
        borderWidth: 1,
    },
    syncHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    syncTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
        marginRight: 8,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    onlineIndicator: {
        backgroundColor: colors.success,
    },
    offlineIndicator: {
        backgroundColor: colors.warning,
    },
    syncText: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 16,
    },
    syncButton: {
        alignSelf: 'flex-start',
    },
    settingsCard: {
        padding: 0,
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: colors.text,
    },
    settingDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginHorizontal: 16,
    },
    supportCard: {
        padding: 0,
        marginBottom: 24,
    },
    touchableButton: {
        padding: 16,
    },
    logoutButton: {
        marginTop: 8,
        borderColor: colors.error,
    },
});