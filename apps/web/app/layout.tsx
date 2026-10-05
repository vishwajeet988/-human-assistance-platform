import "./globals.css";
import type { Metadata } from "next";
import { brand } from "../lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: brand.name, template: `%s · ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  openGraph: { title: brand.name, description: brand.tagline, type: "website", images: [{ url: brand.logoSrc, alt: brand.logoAlt }] },
  icons: { icon: brand.logoSrc, apple: brand.logoSrc }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning>{children}</body></html>;
}
