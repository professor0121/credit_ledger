import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Animated, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingScreen1 } from "./screens/OnboardingScreen1";
import { OnboardingScreen2 } from "./screens/OnboardingScreen2";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { Theme } from "./components/Theme";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { setCredentials, logout } from "./store/authSlice";

type ScreenType = "loading" | "onboarding1" | "onboarding2" | "login" | "dashboard";

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const [screen, setScreen] = useState<ScreenType>("loading");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

      if (userToken) {
        // Sync Redux state with AsyncStorage on startup
        dispatch(setCredentials({ token: userToken, shop: null }));
        setScreen("dashboard");
      } else if (hasOnboarded === "true") {
        setScreen("login");
      } else {
        setScreen("onboarding1");
      }
    } catch (e) {
      setScreen("onboarding1");
    }
  };

  const transitionTo = (newScreen: ScreenType) => {
    // Premium Fade Out -> Change Screen -> Fade In Transition
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setScreen(newScreen);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSkipOnboarding = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    transitionTo("login");
  };

  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    transitionTo("login");
  };

  const handleLoginSuccess = () => {
    transitionTo("dashboard");
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    transitionTo("onboarding1");
  };

  if (screen === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {screen === "onboarding1" && (
        <OnboardingScreen1
          onNext={() => transitionTo("onboarding2")}
          onSkip={handleSkipOnboarding}
        />
      )}
      {screen === "onboarding2" && (
        <OnboardingScreen2
          onNext={handleFinishOnboarding}
          onBack={() => transitionTo("onboarding1")}
        />
      )}
      {screen === "login" && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
      {screen === "dashboard" && (
        <DashboardScreen onLogout={handleLogout} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgPeach,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.bgPeach,
  },
});
