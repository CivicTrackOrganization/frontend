import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, ...props }) => {
  return (
    <div className="my-2">
      <label className="font-semibold mb-1 block" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300 focus:shadow-sm"
        {...props}
      />
    </div>
  );
};

export default InputField;
