export type PaymentStatus = "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type Payment = { id: string; bookingId: string; customerId: string; provider: "razorpay-sandbox"; providerOrderId: string; providerPaymentId?: string; status: PaymentStatus; amountMinor: number; currency: string; idempotencyKey: string; createdAt: string; updatedAt: string };
export type Refund = { id: string; paymentId: string; amountMinor: number; reason: string; status: "REQUESTED" | "PROCESSING" | "COMPLETED" | "FAILED"; createdAt: string };
export type Earnings = { bookingId: string; providerId: string; grossMinor: number; commissionMinor: number; netMinor: number; currency: string };
