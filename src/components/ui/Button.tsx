import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#ff6b9d] hover:bg-[#e55a8a] text-white shadow-[0_4px_12px_rgba(255,107,157,0.25)] border-transparent",
  secondary:
    "bg-white hover:bg-[#fff5f7] text-[#ff6b9d] border border-[#ff6b9d]",
  ghost:
    "bg-transparent hover:bg-[#fff5f7] text-[rgba(8,19,26,0.66)] border border-transparent hover:border-[rgba(8,19,26,0.14)]",
  danger:
    "bg-[#b22323] hover:bg-[#921d1d] text-white border-transparent",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-tight",
        "transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-2 focus-visible:outline-[#ff6b9d] focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
