import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { validatePhoneNumber } from '@/utils/helpers';

export default function CustomerOnboarding() {
    const { setTempPhoneNumber } = useAuthStore();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError('Please enter a valid phone number');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setTempPhoneNumber(phoneNumber);
            router.push({
                pathname: '/onboarding/verify',
                params: { role: 'customer', name }
            });
        }, 1000);
    };

    const handlePhoneChange = (text: string) => {
        setPhoneNumber(text);
        if (phoneError) {
            setPhoneError('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Join LoopLocal</Text>
                    <Text style={styles.subtitle}>
                        Sign up to start earning rewards at your favorite local businesses.
                    </Text>

                    <View style={styles.form}>
                        <Input
                            label="Your Name (Optional)"
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Phone Number"
                            placeholder="(123) 456-7890"
                            value={phoneNumber}
                            onChangeText={handlePhoneChange}
                            keyboardType="phone-pad"
                            error={phoneError}
                        />

                        <Text style={styles.infoText}>
                            We'll send you a verification code to confirm your phone number.
                        </Text>
                    </View>

                    <Button
                        title="Continue"
                        onPress={handleContinue}
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={isLoading}
                        disabled={!phoneNumber}
                    />

                    <Text style={styles.termsText}>
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 32,
    },
    form: {
        marginBottom: 32,
    },
    infoText: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 8,
    },
    termsText: {
        fontSize: 12,
        color: colors.textLight,
        textAlign: 'center',
        marginTop: 24,
    },
});