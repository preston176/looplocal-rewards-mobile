import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
    Gift,
    Settings as SettingsIcon,
    Bell,
    LogOut,
    Wifi,
    QrCode,
    Smartphone,
    Edit,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
    const { user, logout } = useAuthStore();
    const { currentBusiness, updateLoyaltyProgram } = useBusinessStore();

    const [isEditing, setIsEditing] = useState(false);
    const [pointsPerVisit, setPointsPerVisit] = useState(
        currentBusiness?.loyaltyProgram.pointsPerVisit.toString() || '10'
    );
    const [streakBonus, setStreakBonus] = useState(
        currentBusiness?.loyaltyProgram.streakBonus.toString() || '5'
    );

    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [qrEnabled, setQrEnabled] = useState(true);
    const [nfcEnabled, setNfcEnabled] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);

    const handleSaveLoyaltyProgram = () => {
        if (!currentBusiness) return;

        const updatedProgram = {
            ...currentBusiness.loyaltyProgram,
            pointsPerVisit: parseInt(pointsPerVisit) || 10,
            streakBonus: parseInt(streakBonus) || 5,
        };

        updateLoyaltyProgram(updatedProgram);
        setIsEditing(false);

        Alert.alert('Success', 'Loyalty program settings updated successfully.');
    };

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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Business Profile */}
                <Card variant="elevated" style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileAvatar}>
                            <Text style={styles.profileInitials}>
                                {currentBusiness?.name ? currentBusiness.name.charAt(0).toUpperCase() : 'B'}
                            </Text>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{currentBusiness?.name || 'Your Business'}</Text>
                            <Text style={styles.profileCategory}>{currentBusiness?.category || 'Business'}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                // In a real app, this would navigate to a profile edit screen
                                Alert.alert('Edit Profile', 'This would open the profile edit screen.');
                            }}
                        >
                            <Edit size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Loyalty Program Settings */}
                <Text style={styles.sectionTitle}>Loyalty Program</Text>
                <Card style={styles.loyaltyCard}>
                    <View style={styles.loyaltyHeader}>
                        <View style={styles.loyaltyTitleContainer}>
                            <Gift size={20} color={colors.primary} style={styles.loyaltyIcon} />
                            <Text style={styles.loyaltyTitle}>Loyalty Program Settings</Text>
                        </View>

                        {!isEditing && (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <Edit size={20} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {isEditing ? (
                        <View style={styles.editForm}>
                            <Input
                                label="Points Per Visit"
                                value={pointsPerVisit}
                                onChangeText={setPointsPerVisit}
                                keyboardType="number-pad"
                            />

                            <Input
                                label="Streak Bonus Points"
                                value={streakBonus}
                                onChangeText={setStreakBonus}
                                keyboardType="number-pad"
                            />

                            <View style={styles.formButtons}>
                                <Button
                                    title="Cancel"
                                    variant="outline"
                                    onPress={() => setIsEditing(false)}
                                    style={styles.formButton}
                                />

                                <Button
                                    title="Save"
                                    variant="primary"
                                    onPress={handleSaveLoyaltyProgram}
                                    style={styles.formButton}
                                />
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Points Per Visit</Text>
                                <Text style={styles.settingValue}>{currentBusiness?.loyaltyProgram.pointsPerVisit || 10}</Text>
                            </View>

                            <View style={styles.settingDivider} />

                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Streak Bonus Points</Text>
                                <Text style={styles.settingValue}>{currentBusiness?.loyaltyProgram.streakBonus || 5}</Text>
                            </View>

                            <View style={styles.settingDivider} />

                            <TouchableOpacity
                                style={styles.manageRewardsButton}
                                onPress={() => {
                                    // In a real app, this would navigate to a rewards management screen
                                    Alert.alert('Manage Rewards', 'This would open the rewards management screen.');
                                }}
                            >
                                <Text style={styles.manageRewardsText}>Manage Rewards</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Card>

                {/* Check-in Methods */}
                <Text style={styles.sectionTitle}>Check-in Methods</Text>
                <Card style={styles.checkInCard}>
                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            <Wifi size={20} color={colors.textLight} style={styles.settingIcon} />
                            <Text style={styles.settingLabel}>WiFi Check-in</Text>
                        </View>
                        <Switch
                            value={wifiEnabled}
                            onValueChange={setWifiEnabled}
                            trackColor={{ false: colors.border, true: colors.primaryLight }}
                            thumbColor={wifiEnabled ? colors.primary : colors.textLight}
                        />
                    </View>

                    <View style={styles.settingDivider} />

                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            <QrCode size={20} color={colors.textLight} style={styles.settingIcon} />
                            <Text style={styles.settingLabel}>QR Code Check-in</Text>
                        </View>
                        <Switch
                            value={qrEnabled}
                            onValueChange={setQrEnabled}
                            trackColor={{ false: colors.border, true: colors.primaryLight }}
                            thumbColor={qrEnabled ? colors.primary : colors.textLight}
                        />
                    </View>

                    <View style={styles.settingDivider} />

                    <View style={styles.settingItem}>
                        <View style={styles.settingLabelContainer}>
                            <Smartphone size={20} color={colors.textLight} style={styles.settingIcon} />
                            <Text style={styles.settingLabel}>NFC Check-in</Text>
                        </View>
                        <Switch
                            value={nfcEnabled}
                            onValueChange={setNfcEnabled}
                            trackColor={{ false: colors.border, true: colors.primaryLight }}
                            thumbColor={nfcEnabled ? colors.primary : colors.textLight}
                        />
                    </View>
                </Card>

                {/* App Settings */}
                <Text style={styles.sectionTitle}>App Settings</Text>
                <Card style={styles.appSettingsCard}>
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

                    <TouchableOpacity
                        style={styles.settingButton}
                        onPress={() => {
                            // In a real app, this would navigate to a data export screen
                            Alert.alert('Export Data', 'This would open the data export screen.');
                        }}
                    >
                        <Text style={styles.settingButtonText}>Export Customer Data</Text>
                    </TouchableOpacity>

                    <View style={styles.settingDivider} />

                    <TouchableOpacity
                        style={styles.settingButton}
                        onPress={() => {
                            // In a real app, this would navigate to a help center
                            Alert.alert('Help Center', 'This would open the help center.');
                        }}
                    >
                        <Text style={styles.settingButtonText}>Help & Support</Text>
                    </TouchableOpacity>
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
    profileCategory: {
        fontSize: 14,
        color: colors.textLight,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryLight + '30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 12,
        marginTop: 8,
    },
    loyaltyCard: {
        padding: 16,
        marginBottom: 24,
    },
    loyaltyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    loyaltyTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loyaltyIcon: {
        marginRight: 8,
    },
    loyaltyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
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
    settingValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    settingDivider: {
        height: 1,
        backgroundColor: colors.border,
    },
    manageRewardsButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
    },
    manageRewardsText: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '500',
    },
    editForm: {
        marginTop: 8,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    formButton: {
        marginLeft: 8,
        width: 100,
    },
    checkInCard: {
        padding: 16,
        marginBottom: 24,
    },
    appSettingsCard: {
        padding: 16,
        marginBottom: 24,
    },
    settingButton: {
        paddingVertical: 12,
    },
    settingButtonText: {
        fontSize: 16,
        color: colors.text,
    },
    logoutButton: {
        marginTop: 8,
        borderColor: colors.error,
    },
});