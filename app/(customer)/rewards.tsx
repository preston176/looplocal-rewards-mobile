import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { RewardItem } from '@/components/RewardItem';
import { SpinWheel } from '@/components/SpinWheel';
import { colors } from '@/constants/colors';
import { generateId } from '@/utils/helpers';

// Mock rewards data
const AVAILABLE_REWARDS = [
    {
        id: '1',
        name: 'Free Haircut',
        description: 'Redeem for a free haircut at any participating barbershop',
        pointsRequired: 100,
        claimed: false,
    },
    {
        id: '2',
        name: '25% Off Any Service',
        description: 'Get 25% off any service at participating salons',
        pointsRequired: 50,
        claimed: false,
    },
    {
        id: '3',
        name: 'Free Coffee',
        description: 'Enjoy a free coffee at any participating cafe',
        pointsRequired: 30,
        claimed: false,
    },
    {
        id: '4',
        name: 'Priority Booking',
        description: 'Skip the line with priority booking at participating businesses',
        pointsRequired: 75,
        claimed: false,
    },
];

// Spin wheel segments
const WHEEL_SEGMENTS = [
    { label: '5', value: 5, color: '#FF6B6B' },
    { label: '10', value: 10, color: '#4ECDC4' },
    { label: '15', value: 15, color: '#FFD166' },
    { label: '20', value: 20, color: '#6A0572' },
    { label: '25', value: 25, color: '#FF6B6B' },
    { label: '5', value: 5, color: '#4ECDC4' },
];

export default function RewardsScreen() {
    const { user, addPoints, claimReward } = useAuthStore();
    const { addNotification } = useNotificationStore();

    const [dailySpinUsed, setDailySpinUsed] = useState(false);

    const handleClaimReward = (reward: any) => {
        if (!user) return;

        if (user.points < reward.pointsRequired) {
            Alert.alert(
                'Not Enough Points',
                `You need ${reward.pointsRequired - user.points} more points to claim this reward.`
            );
            return;
        }

        Alert.alert(
            'Claim Reward',
            `Are you sure you want to claim "${reward.name}" for ${reward.pointsRequired} points?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Claim',
                    onPress: () => {
                        // Add the reward to the user's claimed rewards
                        const claimedReward = {
                            ...reward,
                            claimed: true,
                            claimedAt: new Date().toISOString(),
                        };

                        claimReward(reward.id);

                        // Deduct points (this would be handled in a real app's backend)
                        addPoints(-reward.pointsRequired);

                        // Add notification
                        addNotification(
                            'Reward Claimed',
                            `You've successfully claimed "${reward.name}". Visit the business to redeem it!`
                        );

                        Alert.alert(
                            'Reward Claimed!',
                            `You've successfully claimed "${reward.name}". Visit the business to redeem it!`
                        );
                    }
                }
            ]
        );
    };

    const handleSpinEnd = (value: number) => {
        // Add the points won
        addPoints(value);

        // Mark daily spin as used
        setDailySpinUsed(true);

        // Add notification
        addNotification(
            'Daily Spin Bonus',
            `Congratulations! You won ${value} bonus points from the daily spin.`
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Points Summary */}
                <Card style={styles.pointsCard}>
                    <Text style={styles.pointsText}>{user?.points || 0}</Text>
                    <Text style={styles.pointsLabel}>Available Points</Text>
                </Card>

                {/* Daily Spin */}
                <Card variant="elevated" style={styles.spinCard}>
                    <Text style={styles.sectionTitle}>Daily Bonus Spin</Text>
                    <Text style={styles.spinDescription}>
                        Spin the wheel once daily for bonus points!
                    </Text>

                    <SpinWheel
                        segments={WHEEL_SEGMENTS}
                        onSpinEnd={handleSpinEnd}
                    />

                    {dailySpinUsed && (
                        <Text style={styles.spinUsedText}>
                            You've used your daily spin. Come back tomorrow for another chance!
                        </Text>
                    )}
                </Card>

                {/* Available Rewards */}
                <Text style={styles.rewardsTitle}>Available Rewards</Text>

                {AVAILABLE_REWARDS.map((reward) => (
                    <RewardItem
                        key={reward.id}
                        reward={reward}
                        onPress={() => handleClaimReward(reward)}
                        disabled={user ? user.points < reward.pointsRequired : true}
                    />
                ))}

                {/* Progress to Next Reward */}
                <Card style={styles.progressCard}>
                    <Text style={styles.progressTitle}>Next Reward Progress</Text>

                    <ProgressBar
                        progress={user ? user.points / 100 : 0}
                        label="Free Haircut (100 points)"
                        showPercentage
                        style={styles.progressBar}
                    />

                    <Text style={styles.progressText}>
                        {user ? (100 - user.points > 0 ? `${100 - user.points} more points needed` : 'Ready to claim!') : '100 more points needed'}
                    </Text>
                </Card>
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
    pointsCard: {
        alignItems: 'center',
        padding: 24,
        marginBottom: 24,
    },
    pointsText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primary,
    },
    pointsLabel: {
        fontSize: 16,
        color: colors.textLight,
    },
    spinCard: {
        padding: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 8,
        textAlign: 'center',
    },
    spinDescription: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 16,
        textAlign: 'center',
    },
    spinUsedText: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    rewardsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 16,
    },
    progressCard: {
        padding: 16,
        marginTop: 24,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 16,
    },
    progressBar: {
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: 'center',
    },
});