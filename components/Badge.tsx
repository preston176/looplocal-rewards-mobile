import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'primary',
    size = 'medium',
    style,
    textStyle,
}) => {
    const getBadgeStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryBadge;
            case 'secondary':
                return styles.secondaryBadge;
            case 'success':
                return styles.successBadge;
            case 'error':
                return styles.errorBadge;
            case 'warning':
                return styles.warningBadge;
            case 'info':
                return styles.infoBadge;
            default:
                return styles.primaryBadge;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'secondary':
                return styles.secondaryText;
            case 'success':
                return styles.successText;
            case 'error':
                return styles.errorText;
            case 'warning':
                return styles.warningText;
            case 'info':
                return styles.infoText;
            default:
                return styles.primaryText;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.smallBadge;
            case 'medium':
                return styles.mediumBadge;
            case 'large':
                return styles.largeBadge;
            default:
                return styles.mediumBadge;
        }
    };

    const getTextSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.smallText;
            case 'medium':
                return styles.mediumText;
            case 'large':
                return styles.largeText;
            default:
                return styles.mediumText;
        }
    };

    return (
        <View style={[styles.badge, getBadgeStyle(), getSizeStyle(), style]}>
            <Text style={[styles.text, getTextStyle(), getTextSizeStyle(), textStyle]}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBadge: {
        backgroundColor: colors.primaryLight,
    },
    secondaryBadge: {
        backgroundColor: colors.secondaryLight,
    },
    successBadge: {
        backgroundColor: '#D4EDDA',
    },
    errorBadge: {
        backgroundColor: '#F8D7DA',
    },
    warningBadge: {
        backgroundColor: '#FFF3CD',
    },
    infoBadge: {
        backgroundColor: '#D1ECF1',
    },
    text: {
        fontWeight: '600',
    },
    primaryText: {
        color: colors.primaryDark,
    },
    secondaryText: {
        color: colors.secondaryDark,
    },
    successText: {
        color: colors.success,
    },
    errorText: {
        color: colors.error,
    },
    warningText: {
        color: colors.warning,
    },
    infoText: {
        color: colors.info,
    },
    smallBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    mediumBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    largeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    smallText: {
        fontSize: 10,
    },
    mediumText: {
        fontSize: 12,
    },
    largeText: {
        fontSize: 14,
    },
});