import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import MainPage from "./MainPage.tsx";
import RegisterLoginPage from "./RegisterLoginPage.tsx";
import { Toaster } from "react-hot-toast";
import AxiosInterceptor from "./AxiosInterceptor.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AxiosInterceptor>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register-login" element={<RegisterLoginPage />} />
          </Routes>
        </AxiosInterceptor>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
