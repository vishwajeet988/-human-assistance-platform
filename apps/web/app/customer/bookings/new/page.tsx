import { AppShell } from "../../../../components/shell/AppShell";
import { BookingWizard } from "../../../../components/customer/BookingWizard";

export default async function NewBookingPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) { const params = await searchParams; return <AppShell role="customer"><BookingWizard initialService={params.service} /></AppShell>; }
