import React from "react";
import clsx from "clsx";

interface AuthToggleTabsProps {
  isRegister: boolean;
  setIsRegister: (value: boolean) => void;
}

const AuthToggleTabs: React.FC<AuthToggleTabsProps> = ({
  isRegister,
  setIsRegister,
}) => {
  const baseClasses =
    "rounded-xl w-full font-bold transition-colors duration-200 cursor-pointer";
  return (
    <div className="flex justify-center bg-gray-200 rounded-xl p-1 w-full">
      <button
        className={clsx(baseClasses, isRegister ? "bg-gray-200" : "bg-white")}
        onClick={() => setIsRegister(false)}
      >
        Login
      </button>
      <button
        className={clsx(baseClasses, isRegister ? "bg-white" : "bg-gray-200")}
        onClick={() => setIsRegister(true)}
      >
        Register
      </button>
    </div>
  );
};

export default AuthToggleTabs;
