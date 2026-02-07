"use client";

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClass = {
  primary:
    "bg-brand-black text-white hover:bg-black disabled:bg-brand-gray disabled:text-brand-white",
  secondary:
    "border border-brand-border bg-brand-white text-brand-black hover:border-brand-black hover:bg-brand-bg disabled:opacity-50",
  ghost:
    "bg-transparent text-brand-black hover:bg-brand-bg disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

const sizeClass = {
  sm: "px-3 py-1.5 text-caption",
  md: "px-5 py-2.5 text-body",
  lg: "px-6 py-3 text-title",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled ?? isLoading}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-2 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
