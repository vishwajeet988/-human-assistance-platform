const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message ?? "Something went wrong. Please try again.");
  return body.data as T;
}

export function formatINR(minor: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(minor / 100); }
export type Service = { id: string; slug: string; name: string; shortDescription: string; longDescription: string; iconKey: string; displayOrder: number; durationOptionsMinutes: number[]; basePriceMinor: number; hourlyRateMinor: number; customerRequirements: string[] };
export type FamilyMember = { id: string; name: string; relationship: string; phone?: string; notes?: string };
export type Address = { id: string; label: string; recipientName: string; addressLine1: string; addressLine2?: string; locality: string; city: string; state: string; postalCode: string; instructions?: string };
export type Booking = { id: string; reference: string; serviceName: string; serviceSlug: string; familyMemberId?: string; addressId: string; scheduledStart: string; durationMinutes: number; requirements?: string; estimateAmountMinor: number; currency: string; state: string; createdAt: string; events: { id: string; type: string; note: string; createdAt: string }[] };
