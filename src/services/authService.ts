import { API_BASE_URL } from "./api";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface ApiMessageResponse {
  message?: string;
  token?: string;
}

const parseResponse = async (
  response: Response
): Promise<ApiMessageResponse | string | null> => {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!text) return null;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as ApiMessageResponse;
    } catch {
      return null;
    }
  }

  return text;
};

const getErrorMessage = (
  data: ApiMessageResponse | string | null,
  fallback: string
) => {
  if (typeof data === "string") return data;
  return data?.message || fallback;
};

export const register = async (userData: RegisterRequest) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Failed to register"));
  }

  return data;
};

export const login = async (credentials: LoginRequest) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Failed to login"));
  }

  if (!data || typeof data === "string" || !data.token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  localStorage.setItem("token", data.token);

  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};