import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types";
import { authAPI } from "@/app/apis";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  request?: unknown;
  message?: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response;

      // Store token in localStorage
      localStorage.setItem("token", token);

      return { token, user };
    } catch (error: unknown) {
      console.log("Login error: ", error);

      // Extract error message from server response
      let errorMessage = "Login failed";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // Server responded with error status
          errorMessage =
            axiosError.response.data?.message ||
            axiosError.response.data?.error ||
            `Server error: ${axiosError.response.status}`;
        } else if (axiosError.request) {
          // Request was made but no response received
          errorMessage = "Network error: Unable to connect to server";
        } else {
          // Something else happened
          errorMessage = axiosError.message || "An unexpected error occurred";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.log("errorMessage: ", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
    }: { username?: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register({
        username,
        email,
        password,
      });
      const { token, user } = response;

      // Store token in localStorage
      localStorage.setItem("token", token);

      return { token, user };
    } catch (error: unknown) {
      console.log("Registration error: ", error);

      // Extract error message from server response
      let errorMessage = "Registration failed";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // Server responded with error status
          errorMessage =
            axiosError.response.data?.message ||
            axiosError.response.data?.error ||
            `Server error: ${axiosError.response.status}`;
        } else if (axiosError.request) {
          // Request was made but no response received
          errorMessage = "Network error: Unable to connect to server";
        } else {
          // Something else happened
          errorMessage = axiosError.message || "An unexpected error occurred";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.log("errorMessage: ", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
});

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.user;
    } catch (error: unknown) {
      console.log("Get current user error: ", error);

      let errorMessage = "Failed to get user info";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          errorMessage =
            axiosError.response.data?.message ||
            axiosError.response.data?.error ||
            `Server error: ${axiosError.response.status}`;
        } else if (axiosError.request) {
          errorMessage = "Network error: Unable to connect to server";
        } else {
          errorMessage = axiosError.message || "An unexpected error occurred";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
