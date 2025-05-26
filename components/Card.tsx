import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'default'
}) => {
    const getCardStyle = () => {
        switch (variant) {
            case 'elevated':
                return styles.elevatedCard;
            case 'outlined':
                return styles.outlinedCard;
            default:
                return styles.defaultCard;
        }
    };

    return (
        <View style={[styles.card, getCardStyle(), style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        backgroundColor: colors.card,
        marginVertical: 8,
    },
    defaultCard: {
        shadowColor: colors.textDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    elevatedCard: {
        shadowColor: colors.textDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    outlinedCard: {
        borderWidth: 1,
        borderColor: colors.border,
        shadowOpacity: 0,
        elevation: 0,
    },
});