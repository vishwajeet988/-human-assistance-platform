"use client";
import { useEffect, useState } from "react";
import { apiFetch, formatINR } from "../../lib/api";
import { Card } from "../ui/Surface";
import { Notice, EmptyState } from "../ui/Feedback";
type Payment = { id: string; bookingId: string; status: string; amountMinor: number; currency: string };
export function PaymentLedger() { const [items, setItems] = useState<Payment[]>([]); const [error, setError] = useState(""); useEffect(() => { apiFetch<Payment[]>("/admin/payments").then(setItems).catch((cause: Error) => setError(cause.message)); }, []); if (error) return <Notice tone="error">{error}</Notice>; return <><div className="page-heading"><div><p className="eyebrow">Operations · finance</p><h1>Payment ledger</h1><p className="muted">Gateway status is server-confirmed. Payouts are not enabled.</p></div></div><Card>{!items.length ? <EmptyState title="No payments yet">Sandbox payment activity will appear here.</EmptyState> : items.map((item) => <div className="list-row" key={item.id}><span><strong>{item.bookingId}</strong><br /><span className="list-meta">{item.status}</span></span><strong>{formatINR(item.amountMinor)}</strong></div>)}</Card></>; }
