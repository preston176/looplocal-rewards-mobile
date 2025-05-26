import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color = colors.primary,
}) => {
    return (
        <View style={[styles.container, { borderLeftColor: color }]}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.value, { color }]}>{value}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {icon && (
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    {icon}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: colors.card,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 8,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: colors.textLight,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
});