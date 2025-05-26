import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface BusinessCardProps {
    name: string;
    category: string;
    address?: string;
    rating?: number;
    onPress: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
    name,
    category,
    address,
    rating,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.category}>{category}</Text>

                {address && (
                    <View style={styles.addressContainer}>
                        <MapPin size={14} color={colors.textLight} />
                        <Text style={styles.address}>{address}</Text>
                    </View>
                )}
            </View>

            {rating !== undefined && (
                <View style={styles.ratingContainer}>
                    <Star size={16} color={colors.accent} fill={colors.accent} />
                    <Text style={styles.rating}>{rating.toFixed(1)}</Text>
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
    contentContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: colors.textDark,
    },
    category: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 8,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    address: {
        fontSize: 12,
        color: colors.textLight,
        marginLeft: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accent + '20', // 20% opacity
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    rating: {
        color: colors.textDark,
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
});