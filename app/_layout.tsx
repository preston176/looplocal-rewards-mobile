import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const unstable_settings = {
    initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) {
            console.error(error);
            throw error;
        }
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    headerTintColor: colors.textDark,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                    name="onboarding/customer"
                    options={{
                        title: "Customer Signup",
                        headerBackTitle: "Back",
                    }}
                />
                <Stack.Screen
                    name="onboarding/business"
                    options={{
                        title: "Business Signup",
                        headerBackTitle: "Back",
                    }}
                />
                <Stack.Screen
                    name="onboarding/verify"
                    options={{
                        title: "Verify Phone",
                        headerBackTitle: "Back",
                    }}
                />
                <Stack.Screen
                    name="(customer)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="(business)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});