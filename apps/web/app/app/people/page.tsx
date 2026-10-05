import { AppShell } from "../../../components/shell/AppShell";
import { PeoplePlaces } from "../../../components/customer/PeoplePlaces";
export default function PeoplePlacesPage() { return <AppShell role="customer"><div className="page-heading"><div><p className="eyebrow">Your care space</p><h1>People &amp; places</h1><p className="muted">Keep only the practical details you need for a smoother request.</p></div></div><PeoplePlaces /></AppShell>; }
