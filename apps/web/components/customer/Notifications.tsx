"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { Card } from "../ui/Surface";
import { EmptyState, Notice } from "../ui/Feedback";
type Item = { id: string; title: string; body: string; status: string; createdAt: string };
export function Notifications() { const [items, setItems] = useState<Item[]>([]); const [error, setError] = useState(""); useEffect(() => { apiFetch<Item[]>("/customer/notifications").then(setItems).catch((cause: Error) => setError(cause.message)); }, []); if (error) return <Notice tone="error">{error}</Notice>; return <><div className="page-heading"><div><p className="eyebrow">Updates</p><h1>Important updates</h1><p className="muted">A quiet record of your assistance journey.</p></div></div><Card>{!items.length ? <EmptyState title="No updates yet">Booking and payment updates will appear here.</EmptyState> : items.map((item) => <div className="list-row" key={item.id}><span><strong>{item.title}</strong><br /><span className="list-meta">{item.body} · {new Date(item.createdAt).toLocaleString("en-IN")}</span></span></div>)}</Card></>; }
