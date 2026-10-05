import { AppShell } from "../../../../components/shell/AppShell";
import { BookingDetail } from "../../../../components/customer/Bookings";
import { BookingAssignment } from "../../../../components/customer/BookingAssignment";
import { SafetyPanel } from "../../../../components/customer/SafetyPanel";
export default async function CustomerBookingDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AppShell role="customer"><BookingDetail id={id} /><BookingAssignment id={id} /><SafetyPanel bookingId={id} /></AppShell>; }
