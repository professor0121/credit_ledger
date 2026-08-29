import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/api";

export interface Shop {
  _id: string;
  whatsappNumber: string;
  ownerName: string;
  shopName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  shop: Shop | null;
  phoneNumber: string;
  step: "phone" | "otp";
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  shop: null,
  phoneNumber: "",
  step: "phone",
  loading: false,
  error: null,
};

// Async Thunk: Send OTP to phone number
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/send-otp", { phone });
      return { phone, data: response.data };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to send OTP";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/verify-otp", { phone, otp });
      const { token, shop } = response.data;
      if (token) {
        await AsyncStorage.setItem("userToken", token);
      }
      return { token, shop };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Invalid or expired OTP";
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await AsyncStorage.removeItem("userToken");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.token = null;
      state.shop = null;
      state.phoneNumber = "";
      state.step = "phone";
      state.loading = false;
      state.error = null;
    },
    setStep: (state, action: PayloadAction<"phone" | "otp">) => {
      state.step = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ token: string; shop: Shop | null }>) => {
      state.token = action.payload.token;
      state.shop = action.payload.shop;
    }
  },
  extraReducers: (builder) => {
    builder
      // sendOtp pending / fulfilled / rejected
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.phoneNumber = action.payload.phone;
        state.step = "otp";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // verifyOtp pending / fulfilled / rejected
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.shop = action.payload.shop;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // logout fulfilled
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.shop = null;
        state.phoneNumber = "";
        state.step = "phone";
        state.error = null;
      });
  },
});

export const { resetAuth, setStep, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
