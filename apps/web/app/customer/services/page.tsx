import { AppShell } from "../../../components/shell/AppShell";
import { ServiceCatalog } from "../../../components/customer/ServiceCatalog";

export default function CustomerServicesPage() { return <AppShell role="customer"><div className="page-heading"><div><p className="eyebrow">Service catalog</p><h1>What would make today easier?</h1><p className="muted">Choose a kind of non-medical assistance. We’ll guide you through the details.</p></div></div><ServiceCatalog /><div className="trust-strip"><span>✓ Non-medical scope is always clear</span><span>✓ You see an estimate before requesting</span><span>✓ No payment is collected at this stage</span></div></AppShell>; }
