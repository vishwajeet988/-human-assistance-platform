import { PublicShell } from "../../components/public/PublicShell";
import { PublicServiceGrid } from "../../components/public/PublicServiceGrid";

export const metadata = { title: "Services", description: "Explore calm, non-medical assistance for hospital visits, elders, pets and everyday errands." };

export default function ServicesPage() { return <PublicShell><main className="public-page"><section className="page-intro"><p className="eyebrow">Find the right kind of help</p><h1>Support for the moments that matter.</h1><p>Whether it is a hospital visit, an errand for your parents or a vet appointment, arrange thoughtful practical assistance with clarity.</p></section><PublicServiceGrid /><div className="public-trust-row"><span>Clear non-medical boundaries</span><span>Upfront estimates</span><span>Family visibility</span></div></main></PublicShell>; }
