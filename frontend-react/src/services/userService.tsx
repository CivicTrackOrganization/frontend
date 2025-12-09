import axios from "axios";
import type { User } from "../types";

export interface SignUpRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  access: string;
  refresh: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await axios.post<SignUpResponse>(
    `${API_URL}/auth/sign-up/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await axios.post<SignInResponse>(
    `${API_URL}/auth/sign-in/`,
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const fetchUserInfo = async (accessToken: string): Promise<UserInfo> => {
  const response = await axios.get<UserInfo>(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
