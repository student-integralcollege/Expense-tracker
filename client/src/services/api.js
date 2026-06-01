import axios from "axios";

const TOKEN_KEY = "expense-tracker-token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/auth/profile", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.put("/auth/password", payload);
  return data;
};

export const fetchDashboard = async (month) => {
  const { data } = await api.get("/dashboard/summary", { params: { month } });
  return data;
};

export const fetchExpenses = async (params) => {
  const { data } = await api.get("/expenses", { params });
  return data;
};

export const createExpense = async (payload) => {
  const { data } = await api.post("/expenses", payload);
  return data;
};

export const updateExpense = async (id, payload) => {
  const { data } = await api.put(`/expenses/${id}`, payload);
  return data;
};

export const deleteExpense = async (id) => {
  await api.delete(`/expenses/${id}`);
};

export const fetchInsights = async (month) => {
  const { data } = await api.post("/ai/insights", { month });
  return data;
};

export const getApiErrorMessage = (error, fallbackMessage = "Something went wrong.") => {
  const requestUrl = error.config?.url || "";
  const status = error.response?.status;
  const backendBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  if (!error.response) {
    return `Backend is unreachable. Start the API server and confirm ${backendBase} is running.`;
  }

  if (status === 404 && requestUrl.includes("/auth/")) {
    return "Auth API route was not found. Restart the backend so the latest server code loads on port 5000.";
  }

  if (status === 401) {
    return "Your session expired. Please log in again.";
  }

  return error.response?.data?.message || fallbackMessage;
};
