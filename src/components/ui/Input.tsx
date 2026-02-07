"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-body font-medium text-brand-black"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border bg-brand-white px-4 py-3 text-body text-brand-black placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-0 ${
          error ? "border-red-500" : "border-brand-border"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-caption text-red-600">{error}</p>
      )}
    </div>
  );
}
