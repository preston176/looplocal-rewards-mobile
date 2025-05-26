import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/Card';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';

// Mock leaderboard data
const MOCK_LEADERBOARD = [
    { id: 'user1', name: 'John D.', score: 450 },
    { id: 'user2', name: 'Sarah M.', score: 380 },
    { id: 'user3', name: 'Mike T.', score: 320 },
    { id: 'user4', name: 'Emma W.', score: 290 },
    { id: 'user5', name: 'David L.', score: 260 },
    { id: 'user6', name: 'Lisa K.', score: 230 },
    { id: 'user7', name: 'Robert J.', score: 210 },
    { id: 'user8', name: 'Jessica P.', score: 190 },
    { id: 'user9', name: 'Kevin S.', score: 170 },
    { id: 'user10', name: 'Amanda R.', score: 150 },
];

export default function LeaderboardScreen() {
    const { user } = useAuthStore();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [leaderboardType, setLeaderboardType] = useState<'points' | 'referrals'>('points');
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

    useEffect(() => {
        // In a real app, this would fetch data from an API
        // For our prototype, we'll use mock data and insert the current user

        let mockData = [...MOCK_LEADERBOARD];

        if (user) {
            // Remove any existing entry for the current user
            mockData = mockData.filter(item => item.id !== user.id);

            // Add the current user with their actual points
            const userEntry = {
                id: user.id,
                name: user.name || 'You',
                score: leaderboardType === 'points' ? user.points : user.referrals.length,
            };

            mockData.push(userEntry);

            // Sort by score
            mockData.sort((a, b) => b.score - a.score);
        }

        setLeaderboard(mockData);
    }, [user, leaderboardType, timeframe]);

    const getUserRank = () => {
        if (!user) return 0;
        return leaderboard.findIndex(item => item.id === user.id) + 1;
    };

    const renderTimeframeButtons = () => (
        <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={[styles.timeframeButton, timeframe === 'weekly' && styles.activeTimeframeButton]}
                onPress={() => setTimeframe('weekly')}
            >
                <Text style={[styles.timeframeButtonText, timeframe === 'weekly' && styles.activeTimeframeButtonText]}>
                    Weekly
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.timeframeButton, timeframe === 'monthly' && styles.activeTimeframeButton]}
                onPress={() => setTimeframe('monthly')}
            >
                <Text style={[styles.timeframeButtonText, timeframe === 'monthly' && styles.activeTimeframeButtonText]}>
                    Monthly
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.timeframeButton, timeframe === 'allTime' && styles.activeTimeframeButton]}
                onPress={() => setTimeframe('allTime')}
            >
                <Text style={[styles.timeframeButtonText, timeframe === 'allTime' && styles.activeTimeframeButtonText]}>
                    All Time
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button
                    title="Points"
                    onPress={() => setLeaderboardType('points')}
                    variant={leaderboardType === 'points' ? 'primary' : 'outline'}
                    style={styles.typeButton}
                />

                <Button
                    title="Referrals"
                    onPress={() => setLeaderboardType('referrals')}
                    variant={leaderboardType === 'referrals' ? 'primary' : 'outline'}
                    style={styles.typeButton}
                />
            </View>

            {renderTimeframeButtons()}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User's Rank Card */}
                {user && (
                    <Card variant="elevated" style={styles.rankCard}>
                        <Text style={styles.rankTitle}>
                            Your {leaderboardType === 'points' ? 'Points' : 'Referrals'} Rank
                        </Text>
                        <View style={styles.rankContent}>
                            <Text style={styles.rankNumber}>{getUserRank()}</Text>
                            <View style={styles.rankDetails}>
                                <Text style={styles.rankScore}>
                                    {leaderboardType === 'points' ? user.points : user.referrals.length}
                                </Text>
                                <Text style={styles.rankLabel}>
                                    {leaderboardType === 'points' ? 'Points' : 'Referrals'}
                                </Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Leaderboard List */}
                <Text style={styles.leaderboardTitle}>
                    {timeframe === 'weekly' ? 'This Week\'s' : timeframe === 'monthly' ? 'This Month\'s' : 'All-Time'} Top {leaderboardType === 'points' ? 'Point Earners' : 'Referrers'}
                </Text>

                {leaderboard.map((item, index) => (
                    <LeaderboardItem
                        key={item.id}
                        rank={index + 1}
                        name={item.name}
                        score={item.score}
                        isCurrentUser={user && item.id === user.id}
                    />
                ))}

                {/* Referral Section */}
                {leaderboardType === 'referrals' && (
                    <Card style={styles.referralCard}>
                        <Text style={styles.referralTitle}>Invite Friends & Earn Points</Text>
                        <Text style={styles.referralDescription}>
                            Share your referral code with friends. When they sign up and make their first check-in, you both earn 10 bonus points!
                        </Text>
                        <View style={styles.referralCodeContainer}>
                            <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
                            <Text style={styles.referralCode}>{user?.id.substring(0, 8).toUpperCase() || 'LOOP1234'}</Text>
                        </View>
                        <Button
                            title="Share Referral Code"
                            variant="primary"
                            fullWidth
                            style={styles.shareButton}
                            onPress={() => {
                                // In a real app, this would open the share dialog
                                alert('Sharing referral code...');
                            }}
                        />
                    </Card>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: 8,
    },
    typeButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    timeframeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTimeframeButton: {
        borderBottomColor: colors.primary,
    },
    timeframeButtonText: {
        fontSize: 14,
        color: colors.textLight,
    },
    activeTimeframeButtonText: {
        color: colors.primary,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 32,
    },
    rankCard: {
        padding: 16,
        marginBottom: 24,
    },
    rankTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 16,
    },
    rankContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.primary,
        marginRight: 24,
    },
    rankDetails: {
        flex: 1,
    },
    rankScore: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textDark,
    },
    rankLabel: {
        fontSize: 14,
        color: colors.textLight,
    },
    leaderboardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 16,
    },
    referralCard: {
        padding: 16,
        marginTop: 24,
    },
    referralTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 8,
    },
    referralDescription: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 16,
        lineHeight: 20,
    },
    referralCodeContainer: {
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    referralCodeLabel: {
        fontSize: 12,
        color: colors.textLight,
        marginBottom: 4,
    },
    referralCode: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        letterSpacing: 2,
    },
    shareButton: {
        marginTop: 8,
    },
});