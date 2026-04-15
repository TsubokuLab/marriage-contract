import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, padding = "md", className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-white border border-[rgba(8,19,26,0.14)] rounded-[20px]",
        "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
        paddingStyles[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
