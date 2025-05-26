import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Notification } from '@/types';
import { formatDate, formatTime } from '@/utils/helpers';

interface NotificationItemProps {
    notification: Notification;
    onPress: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, notification.read ? styles.read : styles.unread]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Bell size={20} color={notification.read ? colors.textLight : colors.primary} />
            </View>

            <View style={styles.contentContainer}>
                <Text style={[styles.title, notification.read ? styles.readText : styles.unreadText]}>
                    {notification.title}
                </Text>

                <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                </Text>

                <Text style={styles.timestamp}>
                    {formatDate(notification.timestamp)} at {formatTime(notification.timestamp)}
                </Text>
            </View>

            {!notification.read && <View style={styles.unreadIndicator} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    unread: {
        backgroundColor: colors.primaryLight + '20', // 20% opacity
    },
    read: {
        backgroundColor: colors.card,
    },
    iconContainer: {
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        marginBottom: 4,
    },
    unreadText: {
        fontWeight: '600',
        color: colors.textDark,
    },
    readText: {
        fontWeight: '400',
        color: colors.textLight,
    },
    message: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 12,
        color: colors.textLight,
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginLeft: 8,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
});