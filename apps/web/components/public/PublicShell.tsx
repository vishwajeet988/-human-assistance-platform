import Link from "next/link";
import { brand } from "../../lib/brand";
import { BrandLogo } from "../brand/BrandLogo";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <div className="public-site">
    <header className="public-nav">
      <Link href="/" className="public-logo" aria-label={`${brand.name} home`}>
        <BrandLogo />
      </Link>
      <details className="mobile-menu">
        <summary aria-label="Open navigation"><span></span><span></span><span></span></summary>
        <nav className="mobile-menu-panel"><PublicLinks /></nav>
      </details>
      <nav className="desktop-nav" aria-label="Main navigation"><PublicLinks /></nav>
      <div className="public-nav-actions"><Link href="/auth/sign-in" className="nav-sign-in">Sign in</Link><Link href="/services" className="button button-primary button-sm">Get started</Link></div>
    </header>
    {children}
    <footer className="public-footer">
      <div><Link href="/" className="public-logo"><BrandLogo /></Link><p>Thoughtful, non-medical assistance for the moments when you cannot be there.</p></div>
      <div className="footer-links"><div><strong>Explore</strong><Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/for-families">For families</Link></div><div><strong>Trust</strong><Link href="/safety">Safety</Link><Link href="/faq">FAQ</Link><Link href="/auth/sign-in">Sign in</Link></div></div>
      <small className="footer-note">Non-medical assistance. Not an emergency medical service.</small>
    </footer>
  </div>;
}

function PublicLinks() {
  return <><Link href="/services">Services</Link><Link href="/how-it-works">How it works</Link><Link href="/safety">Safety</Link><Link href="/for-families">For families</Link><Link href="/faq">FAQ</Link></>;
}
