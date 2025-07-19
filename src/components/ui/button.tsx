import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;

  return (
    <button
      className="border rounded border-gray-300 p-1 cursor-pointer hover:bg-neutral-900"
      {...rest}
    >
      {children}
    </button>
  );
}
