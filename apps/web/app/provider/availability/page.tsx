import { AppShell } from "../../../components/shell/AppShell";
import { ProviderAvailabilityForm } from "../../../components/provider/ProviderOnboarding";
export default function ProviderAvailabilityPage() { return <AppShell role="provider"><div className="page-heading"><div><p className="eyebrow">Provider space</p><h1>Availability</h1><p className="muted">Set the times you may be available. This does not send you bookings yet.</p></div></div><ProviderAvailabilityForm /></AppShell>; }
