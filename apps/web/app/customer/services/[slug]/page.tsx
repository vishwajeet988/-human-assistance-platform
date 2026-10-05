import { AppShell } from "../../../../components/shell/AppShell";
import { ServiceDetail } from "../../../../components/customer/ServiceCatalog";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <AppShell role="customer"><ServiceDetail slug={slug} /></AppShell>; }
