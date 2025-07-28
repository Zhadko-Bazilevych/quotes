import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      className="border rounded border-gray-300 p-1 cursor-pointer hover:bg-neutral-900"
      {...props}
    />
  );
}
