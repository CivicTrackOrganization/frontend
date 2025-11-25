import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import AuthToggleTabs from "./components/AuthToggleTabs";
import InputField from "./components/InputField";
import {
  signIn,
  signUp,
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type SignUpResponse,
} from "./services/userService";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignInError {
  error: string;
}

interface SignUpError {
  [key: string]: string[];
}

function RegisterLoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const signUpMutation = useMutation<
    SignUpResponse,
    AxiosError<SignUpError>,
    SignUpRequest
  >({
    mutationFn: signUp,
    onSuccess: (data) => {
      alert(`Sign up successful for user ${data.username}. Please sign in.`);
      setIsRegister(false);
    },
    onError: (error: AxiosError<SignUpError>) => {
      const errors = error.response?.data;

      if (errors) {
        let errorMessage = "";

        Object.entries(errors).forEach(([field, message]) => {
          errorMessage += `\n${field}: ${message[0]}`;
        });

        console.error("Sing-up failed:", error);
        alert(`Sign up failed: ${errorMessage}`);
      } else {
        alert(`Sign up failed: ${error.message}`);
      }
    },
  });

  const signInMutation = useMutation<
    SignInResponse,
    AxiosError<SignInError>,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: (data) => {
      alert(`Sign in successful.`);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError<SignInError>) => {
      const errorMessage =
        error.response?.data.error || "An unknown error occured";
      console.error("Sign-in failed: ", error);
      alert(`Sign in failed: ${errorMessage}.`);
    },
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (event: React.FormEvent): void => {
    event.preventDefault();
    if (signUpMutation.isPending) return;

    const signUpRequest: SignUpRequest = {
      username: formData.firstName + formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    signUpMutation.mutate(signUpRequest);
  };

  const handleSignIn = (event: React.FormEvent): void => {
    event.preventDefault();
    if (signInMutation.isPending) return;

    const signInRequest: SignInRequest = {
      username: formData.firstName + formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    signInMutation.mutate(signInRequest);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100">
      <div className="bg-white px-5 py-7 rounded-xl max-w-sm w-full m-3">
        <div className="mb-6">
          <p className="text-center font-extrabold text-xl">CivicTrack</p>
          <p className="text-center text-gray-500 text-sm">
            Resident problem reporting system
          </p>
        </div>
        <AuthToggleTabs isRegister={isRegister} setIsRegister={setIsRegister} />
        <form onSubmit={isRegister ? handleSignUp : handleSignIn}>
          <InputField
            id="first-name"
            name="firstName"
            label="First name"
            type="text"
            placeholder="John"
            onChange={handleFormChange}
            required
          />
          <InputField
            id="last-name"
            name="lastName"
            label="Last name"
            type="text"
            placeholder="Doe"
            onChange={handleFormChange}
            required
          />
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="john.doe@domain.com"
            onChange={handleFormChange}
            required
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="***********"
            onChange={handleFormChange}
            required
          />
          <button className="w-full py-2 bg-black text-white rounded-xl mt-4 font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterLoginPage;
