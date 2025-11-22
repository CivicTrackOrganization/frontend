import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import RegisterLoginPage from "./RegisterLoginPage.tsx";
import MainPage from "./MainPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register-login" element={<RegisterLoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
