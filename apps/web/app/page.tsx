import Link from "next/link";
import { Button } from "../components/ui/Button";
import { brand } from "../lib/brand";

export default function HomePage() {
  return <main>
    <header className="public-header"><span className="brand-lockup"><span className="brand-mark">{brand.mark}</span><span><strong>{brand.shortName}</strong><small>Human assistance</small></span></span><Link href="/auth/sign-in"><Button variant="quiet" size="sm">Sign in</Button></Link></header>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">A steadier way to be there</p><h1>When you cannot be there, someone trustworthy can.</h1><p className="lede">{brand.description} From appointments to everyday errands, arrange thoughtful support with clarity, care, and visibility.</p><div className="hero-actions"><Link href="/auth/sign-in"><Button size="lg">Get started <span aria-hidden="true">↗</span></Button></Link><a href="#how-it-works"><Button variant="secondary" size="lg">How it works</Button></a></div></div><div className="hero-panel" aria-label="A calm service experience"><p className="eyebrow">Designed around peace of mind</p><div className="panel-row"><span className="panel-label">Your request</span><span className="panel-value">Appointment companion</span></div><div className="panel-row"><span className="panel-label">Provider status</span><span className="panel-value"><span className="badge badge-success">Verified &amp; ready</span></span></div><div className="panel-row"><span className="panel-label">Family visibility</span><span className="panel-value">Included</span></div><div className="panel-row"><span className="panel-label">Next step</span><span className="panel-value">A clear, calm update</span></div></div></section>
    <section id="how-it-works" className="public-section"><p className="eyebrow">How it works</p><h2>Thoughtful help, without the guesswork.</h2><p className="lede">A simple foundation for the moments when dependable support matters.</p></section>
  </main>;
}
