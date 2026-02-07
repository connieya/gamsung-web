interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-gray-300 border-t-gray-900 ${sizeClass[size]} ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}
