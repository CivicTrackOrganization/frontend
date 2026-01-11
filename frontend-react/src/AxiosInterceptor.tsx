import React, { useEffect } from "react";
import { privateApi } from "./clients";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface AxiosInterceptorProps {
  children: React.ReactNode;
}

const AxiosInterceptor = ({ children }: AxiosInterceptorProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = privateApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/register-login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => privateApi.interceptors.response.eject(responseInterceptor);
  }, [navigate]);

  return children;
};

export default AxiosInterceptor;
