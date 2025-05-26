import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    style?: ViewStyle;
    inputStyle?: TextStyle;
    maxLength?: number;
    multiline?: boolean;
    numberOfLines?: number;
    disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    error,
    keyboardType = 'default',
    autoCapitalize = 'none',
    style,
    inputStyle,
    maxLength,
    multiline = false,
    numberOfLines = 1,
    disabled = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                error ? styles.inputError : null,
                disabled ? styles.inputDisabled : null
            ]}>
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    editable={!disabled}
                    placeholderTextColor={colors.textLight}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.eyeIcon}
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={colors.textLight} />
                        ) : (
                            <Eye size={20} color={colors.textLight} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: colors.textDark,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.card,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: colors.text,
    },
    inputError: {
        borderColor: colors.error,
    },
    inputDisabled: {
        backgroundColor: colors.border,
        opacity: 0.7,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 4,
    },
    eyeIcon: {
        padding: 10,
    },
});