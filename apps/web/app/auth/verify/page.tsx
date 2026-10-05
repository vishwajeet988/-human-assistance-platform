import Link from "next/link";
import { BrandLogo } from "../../../components/brand/BrandLogo";
import { Button } from "../../../components/ui/Button";
import { Field } from "../../../components/ui/Field";
import { Notice } from "../../../components/ui/Feedback";
import { brand } from "../../../lib/brand";

export default function VerifyPage() {
  return <main className="auth-layout"><aside className="auth-aside"><BrandLogo /><div><p className="eyebrow">One small step</p><h1>Only you should enter your space.</h1><p>Your verification code is private. Never share it with anyone, including someone claiming to represent {brand.name}.</p></div></aside><section className="auth-main"><div className="auth-card"><p className="eyebrow">Verify your sign-in</p><h1>Enter your code</h1><p className="muted">We sent a six-digit code to your phone or email. It expires shortly.</p><form className="auth-form" action="/app"><Field label="Verification code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} required /><Button type="submit" size="lg">Verify and continue</Button></form><Notice>We’ll never display or log your verification code.</Notice><p className="auth-footer"><Link href="/auth/sign-in">Use a different destination</Link></p></div></section></main>;
}
