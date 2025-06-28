import axios from "axios";

const API_URL = "http://localhost:3000";

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData: {
    username?: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get("/users/");
    return response.data;
  },
};

export default api;
