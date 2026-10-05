"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "../../../components/brand/BrandLogo";
import { Button } from "../../../components/ui/Button";
import { Field } from "../../../components/ui/Field";
import { Notice } from "../../../components/ui/Feedback";
import { brand } from "../../../lib/brand";

export default function SignInPage() {
  const [destination, setDestination] = useState("");
  const [sent, setSent] = useState(false);
  return <main className="auth-layout"><aside className="auth-aside"><BrandLogo /><div><p className="eyebrow">A calmer way to coordinate care</p><h1>Support that feels considered.</h1><p>Sign in to keep your requests, people, and updates in one safe place.</p></div><small>Private by design · non-medical assistance</small></aside><section className="auth-main"><div className="auth-card"><p className="eyebrow">Welcome back</p><h1>Sign in to {brand.shortName}</h1><p className="muted">Use your phone or email. We’ll send a one-time verification code.</p>{sent && <Notice>We’ve sent a verification code if this destination is eligible. Check your messages to continue.</Notice>}<form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><Field label="Phone or email" name="destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="you@example.com" autoComplete="email" required /><Button type="submit" size="lg">Continue</Button></form><p className="auth-footer">By continuing, you agree to our <Link href="/terms">terms</Link> and acknowledge our privacy approach.</p></div></section></main>;
}
