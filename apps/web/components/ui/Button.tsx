import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  return <button className={`button button-${variant} button-${size} ${className}`} {...props}>{children}</button>;
}

export function IconButton({ label, children, className = "", ...props }: ButtonProps & { label: string }) {
  return <button aria-label={label} className={`icon-button ${className}`} {...props}>{children}</button>;
}
