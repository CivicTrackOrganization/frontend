import { useState } from "react";
import AuthToggleTabs from "./components/AuthToggleTabs";
import InputField from "./components/InputField";
import { useNavigate } from "react-router-dom";

function RegisterLoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    navigate("/", { replace: true });
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
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <InputField
                id={"first-name"}
                label={"First name"}
                type={"text"}
                placeholder={"John"}
                required
              />
              <InputField
                id={"last-name"}
                label={"Last name"}
                type={"text"}
                placeholder={"Doe"}
                required
              />
            </>
          )}
          <InputField
            id={"email"}
            label={"Email"}
            type={"email"}
            placeholder={"john.doe@domain.com"}
            required
          />
          <InputField
            id={"password"}
            label={"Password"}
            type={"password"}
            placeholder={"***********"}
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
