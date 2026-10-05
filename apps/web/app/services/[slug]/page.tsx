import { PublicShell } from "../../../components/public/PublicShell";
import { ServiceDetail } from "../../../components/customer/ServiceCatalog";

export default async function PublicServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicShell><main className="public-page"><ServiceDetail slug={slug} /></main></PublicShell>; }
