import React from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { Theme } from "./Theme";
import { Typography } from "./Typography";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "filled" | "outlined" | "text";
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "filled",
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isFilled = variant === "filled";
  const isOutlined = variant === "outlined";

  const buttonStyle = [
    styles.base,
    isFilled && styles.filled,
    isOutlined && styles.outlined,
    disabled && styles.disabled,
    style,
  ];

  const getTextColor = () => {
    if (disabled) return "#b5aba7";
    if (isFilled) return Theme.colors.white;
    return Theme.colors.primary;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Typography
          variant="button"
          style={[{ color: getTextColor() }, textStyle]}
        >
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Theme.roundness.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.md,
    flexDirection: "row",
  },
  filled: {
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
  },
  disabled: {
    backgroundColor: "#ebdcd5",
    borderColor: "#ebdcd5",
    shadowOpacity: 0,
    elevation: 0,
  },
});
