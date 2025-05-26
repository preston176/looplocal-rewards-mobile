import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface SpinWheelProps {
    segments: {
        label: string;
        value: number;
        color: string;
    }[];
    onSpinEnd: (value: number) => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ segments, onSpinEnd }) => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const [result, setResult] = useState<number | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        // Random number of full rotations (3-5) plus a random segment
        const randomSegment = Math.floor(Math.random() * segments.length);
        const segmentAngle = 360 / segments.length;
        const segmentRotation = randomSegment * segmentAngle;
        const fullRotations = 3 + Math.floor(Math.random() * 3); // 3-5 full rotations
        const finalRotation = fullRotations * 360 + segmentRotation;

        spinValue.setValue(0);

        Animated.timing(spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setIsSpinning(false);
            setResult(segments[randomSegment].value);
            onSpinEnd(segments[randomSegment].value);
        });

        return finalRotation;
    };

    const rotation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1440deg'], // 4 full rotations
    });

    const renderSegments = () => {
        const segmentAngle = 360 / segments.length;

        return segments.map((segment, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;

            return (
                <View
                    key={index}
                    style={[
                        styles.segment,
                        {
                            backgroundColor: segment.color,
                            transform: [
                                { rotate: `${startAngle}deg` },
                            ],
                            width: '50%',
                            height: '50%',
                            borderTopRightRadius: 100,
                            borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderTopLeftRadius: 0,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            transformOrigin: 'left bottom',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.segmentText,
                            {
                                transform: [{ rotate: `${segmentAngle / 2}deg` }],
                                top: 20,
                                right: 40,
                            },
                        ]}
                    >
                        {segment.label}
                    </Text>
                </View>
            );
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.wheelContainer}>
                <Animated.View
                    style={[
                        styles.wheel,
                        {
                            transform: [{ rotate: rotation }],
                        },
                    ]}
                >
                    {renderSegments()}
                </Animated.View>
                <View style={styles.pointer} />
            </View>

            <TouchableOpacity
                style={[styles.spinButton, isSpinning && styles.spinningButton]}
                onPress={spinWheel}
                disabled={isSpinning}
            >
                <Text style={styles.spinButtonText}>
                    {isSpinning ? 'Spinning...' : 'Spin to Win!'}
                </Text>
            </TouchableOpacity>

            {result !== null && (
                <Text style={styles.resultText}>
                    You won {result} points!
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    wheelContainer: {
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    wheel: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: 2,
        borderColor: colors.border,
    },
    segment: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        position: 'absolute',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    pointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.secondary,
        position: 'absolute',
        top: -10,
        zIndex: 10,
    },
    spinButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
    },
    spinningButton: {
        backgroundColor: colors.textLight,
    },
    spinButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.secondary,
    },
});