import type { ReactNode } from "react";

export function Card({ children, className = "", eyebrow, title }: { children: ReactNode; className?: string; eyebrow?: string; title?: string }) {
  return <section className={`card ${className}`}>
    {(eyebrow || title) && <div className="card-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}{title && <h2>{title}</h2>}</div>}
    {children}
  </section>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className={`avatar avatar-${size}`} aria-label={name}>{initials}</span>;
}
