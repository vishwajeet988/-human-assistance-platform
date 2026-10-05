"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { Badge, Card } from "../ui/Surface";
import { Notice } from "../ui/Feedback";
type Assignment = { status: string; provider?: { displayName: string; bio?: string; languages: string[]; experienceSummary?: string } };
export function BookingAssignment({ id }: { id: string }) { const [data, setData] = useState<Assignment | null>(null); const [error, setError] = useState(""); useEffect(() => { apiFetch<Assignment>(`/customer/bookings/${id}/assignment`).then(setData).catch((cause: Error) => setError(cause.message)); }, [id]); if (error) return <Notice tone="error">{error}</Notice>; if (!data) return null; return <Card eyebrow="Assignment" title={data.status === "ASSIGNED" ? "Assistant confirmed" : data.status === "SEARCHING" ? "Finding a suitable assistant" : "Booking received"}><Badge tone={data.status === "ASSIGNED" ? "success" : "warning"}>{data.status}</Badge>{data.provider && <><h3>{data.provider.displayName}</h3><p className="card-copy">{data.provider.bio || "Approved assistant"}</p><p className="muted">{data.provider.languages.join(" · ")}{data.provider.experienceSummary ? ` · ${data.provider.experienceSummary}` : ""}</p></>}</Card>; }
