import React from "react";
import { Text as RNText, TextProps, StyleSheet, StyleProp, TextStyle } from "react-native";
import { Theme } from "./Theme";

type TypographyVariant = "h1" | "h2" | "body" | "caption" | "button";

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color,
  align = "left",
  style,
  children,
  ...rest
}) => {
  const variantStyle = styles[variant];
  const textColor = color || (variant === "caption" ? Theme.colors.lightText : Theme.colors.darkText);

  return (
    <RNText
      style={[
        variantStyle,
        { color: textColor, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    ...Theme.typography.h1,
  },
  h2: {
    ...Theme.typography.h2,
  },
  body: {
    ...Theme.typography.body,
  },
  caption: {
    ...Theme.typography.caption,
  },
  button: {
    ...Theme.typography.button,
  },
});
