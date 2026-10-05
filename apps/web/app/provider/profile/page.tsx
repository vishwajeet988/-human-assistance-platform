import { AppShell } from "../../../components/shell/AppShell";
import { ProviderProfileForm, ProviderServicesForm } from "../../../components/provider/ProviderOnboarding";
export default function ProviderProfilePage() { return <AppShell role="provider"><div className="page-heading"><div><p className="eyebrow">Provider space</p><h1>Your profile</h1><p className="muted">Share the practical information customers need to understand your support.</p></div></div><div className="provider-stack"><ProviderProfileForm /><ProviderServicesForm /></div></AppShell>; }
