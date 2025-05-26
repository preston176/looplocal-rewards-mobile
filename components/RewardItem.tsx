import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gift, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Reward } from '@/types';
import { formatDate } from '@/utils/helpers';

interface RewardItemProps {
    reward: Reward;
    onPress: () => void;
    disabled?: boolean;
}

export const RewardItem: React.FC<RewardItemProps> = ({
    reward,
    onPress,
    disabled = false,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                reward.claimed && styles.claimedContainer,
                disabled && styles.disabledContainer
            ]}
            onPress={onPress}
            disabled={disabled || reward.claimed}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, reward.claimed && styles.claimedIconContainer]}>
                {reward.claimed ? (
                    <Check size={24} color={colors.success} />
                ) : (
                    <Gift size={24} color={colors.primary} />
                )}
            </View>

            <View style={styles.contentContainer}>
                <Text style={[styles.title, reward.claimed && styles.claimedText]}>
                    {reward.name}
                </Text>

                <Text style={styles.description} numberOfLines={2}>
                    {reward.description}
                </Text>

                {reward.claimed && reward.claimedAt && (
                    <Text style={styles.claimedDate}>
                        Claimed on {formatDate(reward.claimedAt)}
                    </Text>
                )}

                {!reward.claimed && (
                    <Text style={styles.pointsRequired}>
                        {reward.pointsRequired} points required
                    </Text>
                )}
            </View>

            {!reward.claimed && !disabled && (
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Available</Text>
                </View>
            )}

            {!reward.claimed && disabled && (
                <View style={styles.disabledStatusContainer}>
                    <Text style={styles.disabledStatusText}>Not enough points</Text>
                </View>
            )}

            {reward.claimed && (
                <View style={styles.claimedStatusContainer}>
                    <Text style={styles.claimedStatusText}>Claimed</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    claimedContainer: {
        borderColor: colors.success,
        backgroundColor: colors.success + '10', // 10% opacity
    },
    disabledContainer: {
        opacity: 0.7,
    },
    iconContainer: {
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primaryLight + '30', // 30% opacity
    },
    claimedIconContainer: {
        backgroundColor: colors.success + '20', // 20% opacity
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: colors.textDark,
    },
    claimedText: {
        color: colors.success,
    },
    description: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 4,
    },
    pointsRequired: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    claimedDate: {
        fontSize: 12,
        color: colors.textLight,
    },
    statusContainer: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginLeft: 8,
    },
    statusText: {
        color: colors.primaryDark,
        fontSize: 12,
        fontWeight: '500',
    },
    disabledStatusContainer: {
        backgroundColor: colors.border,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginLeft: 8,
    },
    disabledStatusText: {
        color: colors.textLight,
        fontSize: 12,
        fontWeight: '500',
    },
    claimedStatusContainer: {
        backgroundColor: colors.success + '20', // 20% opacity
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginLeft: 8,
    },
    claimedStatusText: {
        color: colors.success,
        fontSize: 12,
        fontWeight: '500',
    },
});