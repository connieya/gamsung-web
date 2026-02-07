interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-brand-border border-t-brand-black ${sizeClass[size]} ${className}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}
