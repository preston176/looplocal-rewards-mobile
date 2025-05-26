import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
}) => {
    const getButtonStyle = () => {
        let buttonStyle: ViewStyle = {};

        switch (variant) {
            case 'primary':
                buttonStyle = styles.primaryButton;
                break;
            case 'secondary':
                buttonStyle = styles.secondaryButton;
                break;
            case 'outline':
                buttonStyle = styles.outlineButton;
                break;
            case 'text':
                buttonStyle = styles.textButton;
                break;
        }

        switch (size) {
            case 'small':
                buttonStyle = { ...buttonStyle, ...styles.smallButton };
                break;
            case 'medium':
                buttonStyle = { ...buttonStyle, ...styles.mediumButton };
                break;
            case 'large':
                buttonStyle = { ...buttonStyle, ...styles.largeButton };
                break;
        }

        if (fullWidth) {
            buttonStyle = { ...buttonStyle, ...styles.fullWidth };
        }

        if (disabled) {
            buttonStyle = { ...buttonStyle, ...styles.disabledButton };
        }

        return buttonStyle;
    };

    const getTextStyle = () => {
        let textStyleVar: TextStyle = {};

        switch (variant) {
            case 'primary':
                textStyleVar = styles.primaryText;
                break;
            case 'secondary':
                textStyleVar = styles.secondaryText;
                break;
            case 'outline':
                textStyleVar = styles.outlineText;
                break;
            case 'text':
                textStyleVar = styles.textButtonText;
                break;
        }

        switch (size) {
            case 'small':
                textStyleVar = { ...textStyleVar, ...styles.smallText };
                break;
            case 'medium':
                textStyleVar = { ...textStyleVar, ...styles.mediumText };
                break;
            case 'large':
                textStyleVar = { ...textStyleVar, ...styles.largeText };
                break;
        }

        if (disabled) {
            textStyleVar = { ...textStyleVar, ...styles.disabledText };
        }

        return textStyleVar;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'text' ? colors.primary : 'white'}
                    size="small"
                />
            ) : (
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    mediumButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    largeButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    fullWidth: {
        width: '100%',
    },
    disabledButton: {
        opacity: 0.5,
    },
    primaryText: {
        color: 'white',
        fontWeight: '600',
    },
    secondaryText: {
        color: 'white',
        fontWeight: '600',
    },
    outlineText: {
        color: colors.primary,
        fontWeight: '600',
    },
    textButtonText: {
        color: colors.primary,
        fontWeight: '600',
    },
    smallText: {
        fontSize: 12,
    },
    mediumText: {
        fontSize: 14,
    },
    largeText: {
        fontSize: 16,
    },
    disabledText: {
        opacity: 0.7,
    },
});