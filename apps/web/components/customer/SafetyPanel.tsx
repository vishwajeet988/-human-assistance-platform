"use client";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { Button } from "../ui/Button";
import { Card } from "../ui/Surface";
export function SafetyPanel({ bookingId }: { bookingId: string }) { const [message, setMessage] = useState(""); const report = async () => { try { await apiFetch(`/bookings/${bookingId}/emergency`, { method: "POST", body: JSON.stringify({ description: "Customer requested safety support", severity: "EMERGENCY" }) }); setMessage("Operations has been alerted."); } catch (cause) { setMessage((cause as Error).message); } }; return <Card eyebrow="Safety" title="Need urgent help?"><p className="card-copy">This safety button alerts platform operations. It is not an ambulance or emergency medical service.</p><Button variant="danger" onClick={report}>Alert operations</Button>{message && <p className="muted">{message}</p>}</Card>; }
