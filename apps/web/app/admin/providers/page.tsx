import { AppShell } from "../../../components/shell/AppShell";
import { ProviderReview } from "../../../components/admin/ProviderReview";
export default function AdminProvidersPage() { return <AppShell role="operations"><div className="page-heading"><div><p className="eyebrow">Operations</p><h1>Provider trust review</h1><p className="muted">Review onboarding and trust states before any future assignment.</p></div></div><ProviderReview /></AppShell>; }
