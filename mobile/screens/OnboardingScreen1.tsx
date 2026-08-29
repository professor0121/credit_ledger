import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Container } from "../components/Container";
import { Typography } from "../components/Typography";
import { Button } from "../components/Button";
import { Theme } from "../components/Theme";

interface OnboardingScreen1Props {
  onNext: () => void;
  onSkip: () => void;
}

const { width } = Dimensions.get("window");

export const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({
  onNext,
  onSkip,
}) => {
  return (
    <Container backgroundColor={Theme.colors.bgSage} style={styles.container}>
      {/* Header Skip */}
      <View style={styles.header}>
        <Button
          title="Skip"
          variant="text"
          onPress={onSkip}
          style={styles.skipButton}
          textStyle={{ color: Theme.colors.lightText }}
        />
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Image
          source={{
            uri: "https://placehold.co/600x450/ffe5d9/9d8189?text=Digital+Ledger&font=playfair",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <Typography variant="h1" align="center" style={styles.title}>
          Simplify Your Business Ledger
        </Typography>

        <Typography variant="body" align="center" style={styles.description}>
          Ditch the dusty paper notebooks. Track credits, manage collections, and monitor your cash flow in one modern dashboard.
        </Typography>
      </View>

      {/* Footer Dots and Action Button */}
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <Button
          title="Next"
          variant="filled"
          onPress={onNext}
          style={styles.nextButton}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  skipButton: {
    height: 40,
    paddingHorizontal: Theme.spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Theme.spacing.xl,
  },
  image: {
    width: width * 0.75,
    height: width * 0.56,
    borderRadius: Theme.roundness.lg,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Theme.colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    marginBottom: Theme.spacing.md,
    color: Theme.colors.darkText,
  },
  description: {
    paddingHorizontal: Theme.spacing.md,
    color: Theme.colors.lightText,
  },
  footer: {
    paddingBottom: Theme.spacing.xl,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: Theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Theme.colors.primary,
    width: 20,
  },
  nextButton: {
    width: "100%",
  },
});
