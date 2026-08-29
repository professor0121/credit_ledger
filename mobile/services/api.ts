import axios from "axios";
import { Platform } from "react-native";

// In development, localhost refers to the emulator/simulator host machine.
// Android emulator uses 10.0.2.2, while iOS simulator/Web uses localhost/127.0.0.1.
// We also define a fallback to the deployed Vercel backend so it works out of the box.
const DEV_API_URL = Platform.select({
  android: "http://10.0.2.2:5000/api",
  ios: "http://localhost:5000/api",
  default: "http://localhost:5000/api",
});

const PROD_API_URL = "https://backend-blush-iota-56.vercel.app/api";

// Set to true to force using the deployed Vercel backend instead of local server
const USE_PROD_FALLBACK = true;

export const API_URL = USE_PROD_FALLBACK ? PROD_API_URL : (__DEV__ ? DEV_API_URL : PROD_API_URL);

console.log("Configured API URL:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
