import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RegisterLoginPage from "./RegisterLoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegisterLoginPage />
  </StrictMode>
);
