import React, { useState } from "react";
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "../components/Container";
import { Typography } from "../components/Typography";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Theme } from "../components/Theme";
import { RootState, AppDispatch } from "../store";
import { sendOtp, verifyOtp, resetAuth } from "../store/authSlice";

interface LoginScreenProps {
  onLoginSuccess: (token: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { step, loading } = useSelector((state: RootState) => state.auth);

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    setErrors({});
    
    // Simple 10 digit validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrors({ phone: "Please enter a valid 10-digit phone number" });
      return;
    }

    try {
      const resultAction = await dispatch(sendOtp(phoneNumber));
      if (sendOtp.fulfilled.match(resultAction)) {
        setOtp("");
      } else {
        const errMsg = resultAction.payload as string || "Failed to send OTP";
        setErrors({ phone: errMsg });
      }
    } catch (e) {
      setErrors({ phone: "Failed to send verification code" });
    }
  };

  const handleVerifyOtp = async () => {
    Keyboard.dismiss();
    setErrors({});

    // Simple 4 digit OTP validation
    if (otp.length !== 4) {
      setErrors({ otp: "Please enter a 4-digit OTP" });
      return;
    }

    try {
      const resultAction = await dispatch(verifyOtp({ phone: phoneNumber, otp }));
      if (verifyOtp.fulfilled.match(resultAction)) {
        const token = resultAction.payload.token;
        if (token) {
          onLoginSuccess(token);
        }
      } else {
        const errMsg = resultAction.payload as string || "Invalid OTP";
        setErrors({ otp: errMsg });
      }
    } catch (e) {
      setErrors({ otp: "Verification failed. Please try again." });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container scrollable backgroundColor={Theme.colors.bgPeach} contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Typography variant="h1" style={styles.title}>
            Welcome to Credit Ledger
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            {step === "phone"
              ? "Enter your mobile number to receive a secure login OTP."
              : "We sent an OTP to your phone. Enter the code below."}
          </Typography>

          {step === "phone" ? (
            <View style={styles.form}>
              <Input
                label="Mobile Number"
                placeholder="Enter 10-digit number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                error={errors.phone}
              />
              <Button
                title="Send Verification Code"
                onPress={handleSendOtp}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Input
                label="Verification Code (OTP)"
                placeholder="Enter OTP"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                error={errors.otp}
              />
              <Button
                title="Verify and Login"
                onPress={handleVerifyOtp}
                loading={loading}
                style={styles.submitButton}
              />
              <Button
                title="Change Phone Number"
                variant="text"
                onPress={() => {
                  dispatch(resetAuth());
                  setOtp("");
                  setErrors({});
                }}
                style={styles.backLink}
                textStyle={{ color: Theme.colors.primary }}
              />
            </View>
          )}
        </View>

        <Typography variant="caption" align="center" style={styles.footerText}>
          By logging in, you agree to our Terms of Service and Privacy Policy. All credit operations are encrypted.
        </Typography>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: "center",
    paddingBottom: Theme.spacing.xl,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.lg,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    width: "100%",
  },
  title: {
    marginBottom: Theme.spacing.xs,
    fontSize: 24,
    color: Theme.colors.darkText,
  },
  subtitle: {
    marginBottom: Theme.spacing.xl,
    color: Theme.colors.lightText,
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: Theme.spacing.sm,
    width: "100%",
  },
  backLink: {
    marginTop: Theme.spacing.md,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    marginTop: Theme.spacing.xl,
    color: Theme.colors.lightText,
    paddingHorizontal: Theme.spacing.md,
  },
});
