import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Container } from "../components/Container";
import { Typography } from "../components/Typography";
import { Button } from "../components/Button";
import { Theme } from "../components/Theme";

interface DashboardScreenProps {
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("hasOnboarded");
    onLogout();
  };

  return (
    <Container backgroundColor={Theme.colors.bgSage}>
      <View style={styles.header}>
        <View>
          <Typography variant="caption">Welcome Back</Typography>
          <Typography variant="h2" style={styles.shopName}>Professor's Ledger</Typography>
        </View>
        <TouchableOpacity style={styles.profileBadge} activeOpacity={0.7}>
          <Typography variant="button" style={styles.badgeText}>PL</Typography>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Typography variant="caption" color="rgba(255,255,255,0.8)">Net Balance Outstanding</Typography>
          <Typography variant="h1" style={styles.balanceAmount}>₹ 48,250</Typography>
          <View style={styles.balanceSplit}>
            <View>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">To Collect</Typography>
              <Typography variant="h2" style={styles.collectText}>₹ 52,000</Typography>
            </View>
            <View style={styles.divider} />
            <View>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">To Pay</Typography>
              <Typography variant="h2" style={styles.payText}>₹ 3,750</Typography>
            </View>
          </View>
        </View>

        {/* Feature Grid */}
        <Typography variant="h2" style={styles.sectionTitle}>Quick Actions</Typography>
        
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Typography variant="h2" style={styles.gridEmoji}>👤</Typography>
            <Typography variant="button" style={styles.gridLabel}>Add Customer</Typography>
          </View>
          <View style={styles.gridItem}>
            <Typography variant="h2" style={styles.gridEmoji}>📊</Typography>
            <Typography variant="button" style={styles.gridLabel}>Reports</Typography>
          </View>
          <View style={styles.gridItem}>
            <Typography variant="h2" style={styles.gridEmoji}>🔔</Typography>
            <Typography variant="button" style={styles.gridLabel}>Send Reminders</Typography>
          </View>
          <View style={styles.gridItem}>
            <Typography variant="h2" style={styles.gridEmoji}>⚙️</Typography>
            <Typography variant="button" style={styles.gridLabel}>Settings</Typography>
          </View>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          variant="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  shopName: {
    color: Theme.colors.darkText,
    fontWeight: "700",
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Theme.colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  balanceCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.lg,
    padding: Theme.spacing.lg,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: Theme.spacing.xl,
  },
  balanceAmount: {
    color: Theme.colors.white,
    fontSize: 36,
    marginVertical: Theme.spacing.xs,
    fontWeight: "700",
  },
  balanceSplit: {
    flexDirection: "row",
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    justifyContent: "space-between",
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  collectText: {
    color: "#e2f0d9",
    fontWeight: "700",
  },
  payText: {
    color: "#fce4d6",
    fontWeight: "700",
  },
  sectionTitle: {
    color: Theme.colors.darkText,
    marginBottom: Theme.spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.xl,
  },
  gridItem: {
    width: "48%",
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.roundness.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  gridEmoji: {
    fontSize: 28,
    marginBottom: Theme.spacing.sm,
  },
  gridLabel: {
    fontSize: 14,
    color: Theme.colors.darkText,
  },
  logoutButton: {
    marginTop: Theme.spacing.md,
    borderColor: Theme.colors.primary,
  },
});
