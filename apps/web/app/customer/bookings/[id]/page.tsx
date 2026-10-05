import { AppShell } from "../../../../components/shell/AppShell";
import { BookingDetail } from "../../../../components/customer/Bookings";
export default async function CustomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AppShell role="customer"><BookingDetail id={id} /></AppShell>; }
