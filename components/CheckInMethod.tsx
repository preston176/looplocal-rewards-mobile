import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wifi, QrCode, Smartphone } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface CheckInMethodProps {
    method: 'wifi' | 'qr' | 'nfc';
    onPress: () => void;
    active?: boolean;
}

export const CheckInMethod: React.FC<CheckInMethodProps> = ({
    method,
    onPress,
    active = false,
}) => {
    const getIcon = () => {
        switch (method) {
            case 'wifi':
                return <Wifi size={24} color={active ? colors.primary : colors.textLight} />;
            case 'qr':
                return <QrCode size={24} color={active ? colors.primary : colors.textLight} />;
            case 'nfc':
                return <Smartphone size={24} color={active ? colors.primary : colors.textLight} />;
        }
    };

    const getTitle = () => {
        switch (method) {
            case 'wifi':
                return 'WiFi Check-in';
            case 'qr':
                return 'QR Code Scan';
            case 'nfc':
                return 'NFC Tap';
        }
    };

    const getDescription = () => {
        switch (method) {
            case 'wifi':
                return 'Connect to store WiFi to check in automatically';
            case 'qr':
                return 'Scan the QR code at the store to check in';
            case 'nfc':
                return 'Tap your phone on the NFC tag at the store';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, active && styles.activeContainer]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
                {getIcon()}
            </View>

            <View style={styles.contentContainer}>
                <Text style={[styles.title, active && styles.activeTitle]}>
                    {getTitle()}
                </Text>

                <Text style={styles.description}>
                    {getDescription()}
                </Text>
            </View>

            {active && <View style={styles.activeIndicator} />}
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
    activeContainer: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight + '10', // 10% opacity
    },
    iconContainer: {
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background,
    },
    activeIconContainer: {
        backgroundColor: colors.primaryLight + '30', // 30% opacity
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
    activeTitle: {
        color: colors.primary,
    },
    description: {
        fontSize: 14,
        color: colors.textLight,
    },
    activeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
});