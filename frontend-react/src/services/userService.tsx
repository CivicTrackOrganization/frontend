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

const API_URL = "http://localhost:8000";

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  console.log(
    "data being send: " + data.email + " " + data.password + " " + data.username
  );
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
