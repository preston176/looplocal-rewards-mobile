import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
    progress: number; // 0 to 1
    height?: number;
    backgroundColor?: string;
    fillColor?: string;
    style?: ViewStyle;
    showPercentage?: boolean;
    label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 8,
    backgroundColor = colors.border,
    fillColor = colors.primary,
    style,
    showPercentage = false,
    label,
}) => {
    // Ensure progress is between 0 and 1
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const percentage = Math.round(clampedProgress * 100);

    return (
        <View style={[styles.container, style]}>
            {(label || showPercentage) && (
                <View style={styles.labelContainer}>
                    {label && <Text style={styles.label}>{label}</Text>}
                    {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
                </View>
            )}

            <View style={[styles.progressBackground, { height, backgroundColor }]}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${percentage}%`,
                            height,
                            backgroundColor: fillColor
                        }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: colors.textLight,
        fontWeight: '500',
    },
    percentage: {
        fontSize: 12,
        color: colors.textLight,
        fontWeight: '500',
    },
    progressBackground: {
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        borderRadius: 4,
    },
});