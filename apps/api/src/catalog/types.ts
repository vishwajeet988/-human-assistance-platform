export type PricingType = "DURATION" | "HOURLY";

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  iconKey: string;
  displayOrder: number;
  active: boolean;
  durationOptionsMinutes: number[];
  basePriceMinor: number;
  hourlyRateMinor: number;
  customerRequirements: string[];
  providerRequirements: string[];
};

export type FamilyMember = { id: string; customerId: string; name: string; relationship: string; phone?: string | undefined; notes?: string | undefined };
export type CustomerAddress = { id: string; customerId: string; label: string; recipientName: string; addressLine1: string; addressLine2?: string | undefined; locality: string; city: string; state: string; postalCode: string; instructions?: string | undefined };
export type FamilyMemberInput = Omit<FamilyMember, "id" | "customerId">;
export type FamilyMemberPatch = { name?: string | undefined; relationship?: string | undefined; phone?: string | undefined; notes?: string | undefined };
export type CustomerAddressInput = Omit<CustomerAddress, "id" | "customerId">;
export type CustomerAddressPatch = { label?: string | undefined; recipientName?: string | undefined; addressLine1?: string | undefined; addressLine2?: string | undefined; locality?: string | undefined; city?: string | undefined; state?: string | undefined; postalCode?: string | undefined; instructions?: string | undefined };
export type BookingState = "DRAFT" | "PENDING_PAYMENT" | "SEARCHING_PROVIDER" | "PROVIDER_ASSIGNED" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
export type BookingEvent = { id: string; bookingId: string; type: string; createdAt: string; customerVisible: boolean; note: string };
export type Booking = { id: string; reference: string; customerId: string; familyMemberId?: string | undefined; addressId: string; serviceSlug: string; serviceName: string; scheduledStart: string; durationMinutes: number; requirements?: string | undefined; emergencyContact?: { name: string; phone: string } | undefined; estimateAmountMinor: number; currency: "INR"; state: BookingState; createdAt: string; events: BookingEvent[]; idempotencyKey?: string | undefined; assignedProviderId?: string | undefined };
