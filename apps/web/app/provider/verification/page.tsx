import { AppShell } from "../../../components/shell/AppShell";
import { ProviderVerification } from "../../../components/provider/ProviderOnboarding";
export default function ProviderVerificationPage() { return <AppShell role="provider"><div className="page-heading"><div><p className="eyebrow">Provider space</p><h1>Verification</h1><p className="muted">See what has been submitted and what operations still needs.</p></div></div><ProviderVerification /></AppShell>; }
