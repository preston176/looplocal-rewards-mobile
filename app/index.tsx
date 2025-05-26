import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'customer') {
                router.replace('/(customer)');
            } else if (user.role === 'business') {
                router.replace('/(business)');
            }
        }
    }, [isAuthenticated, user]);

    const handleCustomerPress = () => {
        router.push('/onboarding/customer');
    };

    const handleBusinessPress = () => {
        router.push('/onboarding/business');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>LL</Text>
                    </View>
                    <Text style={styles.appName}>LoopLocal</Text>
                </View>

                <Text style={styles.tagline}>
                    Loyalty rewards for local businesses
                </Text>

                <View style={styles.illustrationContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                        style={styles.illustration}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.description}>
                    Earn rewards at your favorite local shops, restaurants, and services. Check in, earn points, and redeem rewards!
                </Text>

                <View style={styles.buttonContainer}>
                    <Text style={styles.chooseText}>I am a:</Text>

                    <Button
                        title="Customer"
                        onPress={handleCustomerPress}
                        variant="primary"
                        size="large"
                        fullWidth
                        style={styles.button}
                    />

                    <Button
                        title="Business Owner"
                        onPress={handleBusinessPress}
                        variant="outline"
                        size="large"
                        fullWidth
                        style={styles.button}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textDark,
    },
    tagline: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
        marginBottom: 32,
    },
    illustrationContainer: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    description: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
    },
    chooseText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textDark,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        marginBottom: 16,
    },
});