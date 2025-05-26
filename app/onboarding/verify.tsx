import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { generateOTP } from '@/utils/helpers';

export default function VerifyScreen() {
    const params = useLocalSearchParams();
    const { role, name, businessName, category } = params;

    const { tempPhoneNumber, createUser } = useAuthStore();
    const { createBusiness } = useBusinessStore();

    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState('');

    const inputRefs = React.useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        // Generate a random OTP
        const newOTP = generateOTP();
        setGeneratedOTP(newOTP);

        // Show the OTP in an alert (simulating SMS)
        Alert.alert(
            'Verification Code',
            `Your verification code is: ${newOTP}`,
            [{ text: 'OK' }]
        );

        // Start the countdown timer
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (text: string, index: number) => {
        // Update the OTP array
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to the next input field if this one is filled
        if (text.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to the previous input field on backspace if current field is empty
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const enteredOTP = otp.join('');

        if (enteredOTP.length !== 4) {
            Alert.alert('Error', 'Please enter the complete verification code');
            return;
        }

        setIsLoading(true);

        // Simulate verification
        setTimeout(() => {
            setIsLoading(false);

            if (enteredOTP === generatedOTP) {
                if (role === 'customer') {
                    createUser(tempPhoneNumber || '', 'customer', name as string);
                } else if (role === 'business') {
                    createUser(tempPhoneNumber || '', 'business', businessName as string);
                    createBusiness(
                        businessName as string,
                        tempPhoneNumber || '',
                        category as string
                    );
                }

                if (role === 'customer') {
                    router.replace('/(customer)');
                } else {
                    router.replace('/(business)');
                }
            } else {
                Alert.alert('Error', 'Invalid verification code. Please try again.');
            }
        }, 1000);
    };

    const handleResendCode = () => {
        // Generate a new OTP
        const newOTP = generateOTP();
        setGeneratedOTP(newOTP);

        // Show the OTP in an alert (simulating SMS)
        Alert.alert(
            'Verification Code',
            `Your new verification code is: ${newOTP}`,
            [{ text: 'OK' }]
        );

        // Reset the timer
        setTimer(30);

        // Start the countdown timer
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Verify Your Phone</Text>
                <Text style={styles.subtitle}>
                    We've sent a 4-digit code to {tempPhoneNumber}
                </Text>

                <View style={styles.otpContainer}>
                    {[0, 1, 2, 3].map((index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.otpInput}
                            value={otp[index]}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <Button
                    title="Verify"
                    onPress={handleVerify}
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={isLoading}
                    disabled={otp.join('').length !== 4}
                    style={styles.verifyButton}
                />

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>Resend in {timer}s</Text>
                    ) : (
                        <Button
                            title="Resend Code"
                            onPress={handleResendCode}
                            variant="text"
                            size="small"
                        />
                    )}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 32,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 32,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: colors.card,
    },
    verifyButton: {
        marginBottom: 24,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: colors.textLight,
    },
    timerText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
});