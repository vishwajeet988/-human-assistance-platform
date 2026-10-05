import Link from "next/link";
import { PublicShell } from "../components/public/PublicShell";
import { PublicServiceGrid } from "../components/public/PublicServiceGrid";
import { Button } from "../components/ui/Button";
import { brand } from "../lib/brand";

export default function HomePage() {
  return <PublicShell><main>
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">Thoughtful help, arranged simply</p>
        <h1>Need someone to be there?</h1>
        <p className="hero-line">When you can't be there, someone trustworthy can.</p>
        <p className="lede">{brand.description} Arrange practical support for hospital visits, elders, pets and everyday errands—with clear boundaries and useful updates.</p>
        <div className="hero-actions"><Link href="/services" className="button button-primary button-lg">Find help <span aria-hidden="true">↗</span></Link><Link href="/how-it-works" className="button button-secondary button-lg">How it works</Link></div>
        <p className="hero-assurance"><span>●</span> Non-medical assistance, with family visibility when it helps</p>
      </div>
      <div className="hero-visual" aria-label="A simple view of a planned assistance visit">
        <div className="hero-visual-top"><span>ARRANGED WITH CARE</span><span>01</span></div>
        <div className="hero-visual-body"><p className="eyebrow">Your request</p><h2>Appointment companion</h2><p>Practical support for the parts of a visit that are easier with someone beside you.</p><div className="visual-rule"></div><div className="visual-meta"><span><b>For</b> You or family</span><span><b>Scope</b> Non-medical</span></div></div>
        <div className="hero-visual-footer"><span className="visual-avatar">E</span><span><strong>Approved and available</strong><small>A clear next step, not more to manage.</small></span><span className="visual-dot"></span></div>
      </div>
    </section>
    <section className="home-section home-services"><div className="section-heading"><div><p className="eyebrow">Ways we can help</p><h2>Practical support for real life.</h2></div><Link href="/services" className="text-link">View all services <span>↗</span></Link></div><PublicServiceGrid /></section>
    <section className="home-section home-journey"><div className="journey-intro"><p className="eyebrow">How it works</p><h2>Support that feels simple from the start.</h2><p>Tell us what would make things easier. We keep the process clear so you can focus on the person who needs you.</p><Link href="/how-it-works" className="text-link">See how it works <span>↗</span></Link></div><div className="mini-steps"><div><b>01</b><h3>Tell us what you need</h3><p>Choose a service and share the useful details.</p></div><div><b>02</b><h3>We find a suitable person</h3><p>Eligible, available and approved for the request.</p></div><div><b>03</b><h3>You stay informed</h3><p>Useful updates for you and your family.</p></div></div></section>
    <section className="family-banner"><div><p className="eyebrow">For families living apart</p><h2>You live in another city. They shouldn't have to handle everything alone.</h2><p>Arrange practical help for a parent or loved one and stay close to what matters, even when you cannot be there in person.</p><Link href="/for-families"><Button variant="secondary">Explore family support</Button></Link></div></section>
    <section className="home-section trust-section"><div><p className="eyebrow">Trust, in plain language</p><h2>Clear help. Clear limits. No guesswork.</h2></div><div className="trust-list"><p><span>01</span><strong>Practical, non-medical support</strong></p><p><span>02</span><strong>Provider trust signals you can understand</strong></p><p><span>03</span><strong>Transparent estimates before you request</strong></p><p><span>04</span><strong>Visibility for the family, when it helps</strong></p></div></section>
  </main></PublicShell>;
}
