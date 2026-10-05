import { AppShell } from "../../../components/shell/AppShell";
import { BookingList } from "../../../components/customer/Bookings";
export default function CustomerBookingsPage() { return <AppShell role="customer"><div className="page-heading"><div><p className="eyebrow">Your requests</p><h1>Bookings</h1><p className="muted">Keep track of upcoming and previous assistance requests.</p></div></div><BookingList /></AppShell>; }
