import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="border rounded border-gray-300 p-1 flex-1"
      {...props}
    />
  );
}
