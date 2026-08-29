import React, { useState } from "react";
import { View, TextInput, TextInputProps, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Theme } from "./Theme";
import { Typography } from "./Typography";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const borderStateStyle = error
    ? styles.borderError
    : isFocused
    ? styles.borderFocused
    : styles.borderDefault;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography variant="caption" style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={[styles.inputWrapper, borderStateStyle]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#b5aba7"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
      {error && (
        <Typography variant="caption" color={Theme.colors.error} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
    width: "100%",
  },
  label: {
    marginBottom: Theme.spacing.xs,
    fontWeight: "600",
    color: Theme.colors.darkText,
    opacity: 0.8,
  },
  inputWrapper: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: Theme.roundness.md,
    backgroundColor: Theme.colors.white,
    paddingHorizontal: Theme.spacing.md,
    justifyContent: "center",
  },
  input: {
    ...Theme.typography.body,
    color: Theme.colors.darkText,
    padding: 0, // Reset RN default padding
  },
  borderDefault: {
    borderColor: Theme.colors.border,
  },
  borderFocused: {
    borderColor: Theme.colors.primary,
  },
  borderError: {
    borderColor: Theme.colors.error,
  },
  errorText: {
    marginTop: Theme.spacing.xs,
    fontWeight: "500",
  },
});
