import axios from "axios";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  username: string;
  email: string;
}

export interface SignInRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignInResponse {
  access: string;
  refresh: string;
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
