import { brand } from "../../lib/brand";

export function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <span className={`brand-logo ${compact ? "brand-logo-compact" : "brand-logo-full"} ${className}`}>
    <img src={brand.logoSrc} alt={compact ? brand.name : brand.logoAlt} />
  </span>;
}
