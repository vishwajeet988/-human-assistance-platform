"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { brand } from "../../lib/brand";

const nav = {
  customer: [["Overview", "/app"], ["Services", "/customer/services"], ["Bookings", "/customer/bookings"], ["People & places", "/app/people"], ["Support", "/app/support"]],
  provider: [["Today", "/provider"], ["Profile", "/provider/profile"], ["Availability", "/provider/availability"], ["Verification", "/provider/verification"], ["Requests", "/provider/requests"]],
  operations: [["Overview", "/operations"], ["Bookings", "/operations/bookings"], ["Matching", "/admin/matching"], ["Provider review", "/admin/providers"], ["Support", "/operations/support"]]
} as const;

export function AppShell({ role, children }: { role: keyof typeof nav; children: ReactNode }) {
  const pathname = usePathname();
  const links = nav[role];
  return <div className="app-frame">
    <aside className="sidebar">
      <Link className="brand-lockup" href={role === "customer" ? "/app" : `/${role === "provider" ? "provider" : "operations"}`}><span className="brand-mark">{brand.mark}</span><span><strong>{brand.shortName}</strong><small>{role === "operations" ? "Operations" : role === "provider" ? "Provider space" : "Care space"}</small></span></Link>
      <nav aria-label="Primary navigation"><p className="nav-label">Workspace</p>{links.map(([label, href]) => <Link className={pathname === href ? "nav-link active" : "nav-link"} href={href} key={href}><span className="nav-dot" />{label}</Link>)}</nav>
      <div className="sidebar-bottom"><Link className="nav-link" href="/auth/sign-in"><span className="nav-dot" />Sign out</Link></div>
    </aside>
    <div className="content-frame"><header className="topbar"><span className="topbar-context">{role === "operations" ? "Operations" : role === "provider" ? "Provider space" : "Your care space"}</span><span className="topbar-status"><span className="status-dot" />All systems calm</span></header><main className="app-content">{children}</main></div>
  </div>;
}
