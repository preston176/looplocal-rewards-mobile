import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface LeaderboardItemProps {
    rank: number;
    name: string;
    score: number;
    isCurrentUser?: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
    rank,
    name,
    score,
    isCurrentUser = false,
}) => {
    const getRankColor = () => {
        switch (rank) {
            case 1:
                return '#FFD700'; // Gold
            case 2:
                return '#C0C0C0'; // Silver
            case 3:
                return '#CD7F32'; // Bronze
            default:
                return colors.textLight;
        }
    };

    return (
        <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
            <View style={[styles.rankContainer, { backgroundColor: getRankColor() + '20' }]}>
                {rank <= 3 ? (
                    <Trophy size={16} color={getRankColor()} />
                ) : (
                    <Text style={[styles.rank, { color: getRankColor() }]}>{rank}</Text>
                )}
            </View>

            <Text style={[styles.name, isCurrentUser && styles.currentUserText]}>
                {name}
                {isCurrentUser && ' (You)'}
            </Text>

            <View style={styles.scoreContainer}>
                <Text style={[styles.score, isCurrentUser && styles.currentUserText]}>
                    {score}
                </Text>
                <Text style={styles.pointsLabel}>pts</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.card,
    },
    currentUserContainer: {
        backgroundColor: colors.primaryLight + '20', // 20% opacity
        borderWidth: 1,
        borderColor: colors.primary,
    },
    rankContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rank: {
        fontSize: 14,
        fontWeight: '700',
    },
    name: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    currentUserText: {
        fontWeight: '600',
        color: colors.primary,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    score: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textDark,
    },
    pointsLabel: {
        fontSize: 12,
        color: colors.textLight,
        marginLeft: 2,
    },
});