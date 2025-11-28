import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
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
import {
  isGeneralError,
  type SignError,
  type ValidationError,
} from "./utils/error-handling";

interface BaseForm {
  email: string;
  password: string;
}

interface RegisterForm extends BaseForm {
  firstName: string;
  lastName: string;
}

function RegisterLoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  const [baseFormData, setBaseFormData] = useState<BaseForm>({
    email: "",
    password: "",
  });

  const [registerFormData, setRegisterFormData] = useState<
    Omit<RegisterForm, keyof BaseForm>
  >({
    firstName: "",
    lastName: "",
  });

  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const navigate = useNavigate();

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const displayValidationErrors = (errors: ValidationError) => {
    Object.entries(errors).forEach(([field, message]) => {
      switch (field) {
        case "email":
          setEmailError(message[0]);
          break;
        case "password":
          setPasswordError(message[0]);
      }
    });
  };

  const signUpMutation = useMutation<
    SignUpResponse,
    AxiosError<SignError>,
    SignUpRequest
  >({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success(
        `Sign up successful for user ${
          data.firstName + " " + data.lastName
        }. Please sign in.`
      );
      setIsRegister(false);
    },
    onError: (error: AxiosError<SignError>) => {
      if (isGeneralError(error)) {
        const errorMessage = error.response?.data?.error;
        if (errorMessage) {
          toast.error(errorMessage);
        }
      } else if (error.response?.data) {
        displayValidationErrors(error.response?.data as ValidationError);
      } else {
        console.error(
          `Error occured, message: ${error.message}, status: ${error.status}`
        );
        toast.error("A connection error occured. Please try again.");
      }
    },
  });

  const signInMutation = useMutation<
    SignInResponse,
    AxiosError<SignError>,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast.success("Sign in successful");
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError<SignError>) => {
      if (isGeneralError(error)) {
        const errorMessage = error.response?.data?.error;
        if (errorMessage) {
          toast.error(errorMessage);
        }
      } else if (error.response?.data) {
        displayValidationErrors(error.response.data as ValidationError);
      } else {
        console.error(
          `Error occured, message: ${error.message}, status: ${error.status}`
        );
        toast.error("A connection error occured. Please try again.");
      }
    },
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors();
    if (e.target.name in registerFormData) {
      setRegisterFormData({
        ...registerFormData,
        [e.target.name]: e.target.value,
      });
    } else {
      setBaseFormData({
        ...baseFormData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSignUp = (event: React.FormEvent): void => {
    event.preventDefault();
    if (signUpMutation.isPending) return;

    const signUpRequest: SignUpRequest = {
      username: registerFormData.firstName + registerFormData.lastName,
      firstName: registerFormData.firstName,
      lastName: registerFormData.lastName,
      email: baseFormData.email,
      password: baseFormData.password,
    };

    signUpMutation.mutate(signUpRequest);
  };

  const handleSignIn = (event: React.FormEvent): void => {
    event.preventDefault();
    if (signInMutation.isPending) return;

    const signInRequest: SignInRequest = {
      email: baseFormData.email,
      password: baseFormData.password,
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
          {isRegister && (
            <>
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
            </>
          )}
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="john.doe@domain.com"
            onChange={handleFormChange}
            required
          />
          {emailError && (
            <p className="ml-1 text-sm text-red-600">{emailError}</p>
          )}
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            onChange={handleFormChange}
            required
          />
          {passwordError && (
            <p className="ml-1 text-sm text-red-600">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-xl mt-4 font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
            disabled={signUpMutation.isPending || signInMutation.isPending}
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterLoginPage;
