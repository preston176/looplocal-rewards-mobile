import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { validatePhoneNumber } from '@/utils/helpers';

const BUSINESS_CATEGORIES = [
  'Barbershop',
  'Salon',
  'Restaurant',
  'Cafe',
  'Retail Store',
  'Fitness Studio',
  'Other',
];

export default function BusinessOnboarding() {
  const { setTempPhoneNumber } = useAuthStore();
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContinue = () => {
    let hasError = false;
    
    // Validate business name
    if (!businessName.trim()) {
      setNameError('Please enter your business name');
      hasError = true;
    }
    
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setTempPhoneNumber(phoneNumber);
      router.push({
        pathname: '/onboarding/verify',
        params: { 
          role: 'business', 
          businessName, 
          category: category || 'Other'
        }
      });
    }, 1000);
  };
  
  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    if (phoneError) {
      setPhoneError('');
    }
  };
  
  const handleNameChange = (text: string) => {
    setBusinessName(text);
    if (nameError) {
      setNameError('');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Register Your Business</Text>
          <Text style={styles.subtitle}>
            Create a loyalty program for your customers and grow your business.
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Business Name"
              placeholder="Enter your business name"
              value={businessName}
              onChangeText={handleNameChange}
              autoCapitalize="words"
              error={nameError}
            />
            
            <Input
              label="Phone Number"
              placeholder="(123) 456-7890"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              error={phoneError}
            />
            
            <Input
              label="Business Category"
              placeholder="Select your business category"
              value={category}
              onChangeText={setCategory}
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
            disabled={!businessName || !phoneNumber}
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