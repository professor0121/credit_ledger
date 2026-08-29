export const Theme = {
  colors: {
    primary: "#9d8189",       // Deep dusty rose
    secondary: "#f4acb7",     // Muted pink
    accent: "#ffcad4",        // Soft light pink
    bgPeach: "#ffe5d9",       // Soft peach
    bgSage: "#d8e2dc",        // Pastel mint/sage gray
    white: "#ffffff",
    darkText: "#4a3c31",      // Elegant deep brown for readable text
    lightText: "#8e7c77",     // Muted text
    border: "#ebdcd5",
    error: "#d9534f",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    sm: 6,
    md: 12,
    lg: 20,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: "700" as const,
      lineHeight: 36,
    },
    h2: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 26,
    },
    body: {
      fontSize: 15,
      fontWeight: "400" as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      lineHeight: 20,
    },
  },
};
