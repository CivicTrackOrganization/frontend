import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: "email" | "password" | "text";
  placeholder: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  required = false,
}) => {
  return (
    <div className="my-2">
      <label className="font-semibold mb-1 block" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300 focus:shadow-sm"
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default InputField;
