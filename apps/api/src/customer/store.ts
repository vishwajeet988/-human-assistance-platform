import { randomUUID } from "node:crypto";
import { AppError } from "../errors.js";
import { seededCategories } from "../catalog/data.js";
import type { Booking, BookingEvent, CustomerAddress, CustomerAddressInput, CustomerAddressPatch, FamilyMember, FamilyMemberInput, FamilyMemberPatch } from "../catalog/types.js";

export class CustomerStore {
  readonly categories = seededCategories;
  private familyMembers: FamilyMember[] = [];
  private addresses: CustomerAddress[] = [];
  private bookings: Booking[] = [];

  listFamilyMembers(customerId: string) { return this.familyMembers.filter((item) => item.customerId === customerId); }
  createFamilyMember(customerId: string, input: FamilyMemberInput) { const item = { id: randomUUID(), customerId, ...input }; this.familyMembers.push(item); return item; }
  updateFamilyMember(customerId: string, id: string, input: FamilyMemberPatch) { const item = this.familyMembers.find((candidate) => candidate.id === id && candidate.customerId === customerId); if (!item) throw new AppError("NOT_FOUND", "Family member not found.", 404); Object.assign(item, input); return item; }
  deleteFamilyMember(customerId: string, id: string) { const index = this.familyMembers.findIndex((candidate) => candidate.id === id && candidate.customerId === customerId); if (index < 0) throw new AppError("NOT_FOUND", "Family member not found.", 404); this.familyMembers.splice(index, 1); }
  ownsFamilyMember(customerId: string, id?: string) { return !id || this.familyMembers.some((item) => item.id === id && item.customerId === customerId); }

  listAddresses(customerId: string) { return this.addresses.filter((item) => item.customerId === customerId); }
  getAddressForSystem(id: string) { const item = this.addresses.find((candidate) => candidate.id === id); if (!item) throw new AppError("NOT_FOUND", "Address not found.", 404); return item; }
  createAddress(customerId: string, input: CustomerAddressInput) { const item = { id: randomUUID(), customerId, ...input }; this.addresses.push(item); return item; }
  updateAddress(customerId: string, id: string, input: CustomerAddressPatch) { const item = this.addresses.find((candidate) => candidate.id === id && candidate.customerId === customerId); if (!item) throw new AppError("NOT_FOUND", "Address not found.", 404); Object.assign(item, input); return item; }
  deleteAddress(customerId: string, id: string) { const index = this.addresses.findIndex((candidate) => candidate.id === id && candidate.customerId === customerId); if (index < 0) throw new AppError("NOT_FOUND", "Address not found.", 404); this.addresses.splice(index, 1); }
  ownsAddress(customerId: string, id: string) { return this.addresses.some((item) => item.id === id && item.customerId === customerId); }

  createBooking(input: Omit<Booking, "id" | "reference" | "createdAt" | "events">) {
    if (input.idempotencyKey) { const existing = this.bookings.find((item) => item.customerId === input.customerId && item.idempotencyKey === input.idempotencyKey); if (existing) return existing; }
    const createdAt = new Date().toISOString(); const event: BookingEvent = { id: randomUUID(), bookingId: "pending", type: "BOOKING_CREATED", createdAt, customerVisible: true, note: "Booking request created. Payment is not yet collected." };
    const booking = { ...input, id: randomUUID(), reference: `PC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, createdAt, events: [] as BookingEvent[] }; event.bookingId = booking.id; booking.events = [event]; this.bookings.push(booking); return booking;
  }
  listBookings(customerId: string) { return this.bookings.filter((item) => item.customerId === customerId); }
  listAllBookings() { return this.bookings; }
  getBookingForSystem(id: string) { const booking = this.bookings.find((item) => item.id === id); if (!booking) throw new AppError("NOT_FOUND", "Booking not found.", 404); return booking; }
  getBooking(customerId: string, id: string) { const booking = this.bookings.find((item) => item.id === id && item.customerId === customerId); if (!booking) throw new AppError("NOT_FOUND", "Booking not found.", 404); return booking; }
  cancelBooking(customerId: string, id: string) { const booking = this.getBooking(customerId, id); if (!["PENDING_PAYMENT", "SEARCHING_PROVIDER"].includes(booking.state)) throw new AppError("BOOKING_NOT_CANCELLABLE", "This booking can no longer be cancelled.", 409); booking.state = "CANCELLED"; booking.events.push({ id: randomUUID(), bookingId: booking.id, type: "BOOKING_CANCELLED", createdAt: new Date().toISOString(), customerVisible: true, note: "Booking cancelled before provider confirmation." }); return booking; }
  transitionForMatching(id: string) { const booking = this.getBookingForSystem(id); if (!["PENDING_PAYMENT", "PAID", "SEARCHING_PROVIDER"].includes(booking.state)) throw new AppError("BOOKING_NOT_MATCHABLE", "This booking is not available for matching.", 409); if (booking.state !== "SEARCHING_PROVIDER") { booking.state = "SEARCHING_PROVIDER"; this.addEvent(booking, "BOOKING_SEARCHING", "We are looking for a suitable assistant."); } return booking; }
  assignProvider(id: string, providerId: string) { const booking = this.getBookingForSystem(id); if (booking.state !== "SEARCHING_PROVIDER") throw new AppError("BOOKING_NOT_ASSIGNABLE", "This booking is no longer available for assignment.", 409); const start = Date.parse(booking.scheduledStart); const end = start + booking.durationMinutes * 60_000; const conflict = this.bookings.some((item) => item.id !== id && item.assignedProviderId === providerId && ["PROVIDER_ASSIGNED", "CONFIRMED"].includes(item.state) && start < Date.parse(item.scheduledStart) + item.durationMinutes * 60_000 && Date.parse(item.scheduledStart) < end); if (conflict) throw new AppError("PROVIDER_TIME_CONFLICT", "That provider is no longer available for this time.", 409); booking.assignedProviderId = providerId; booking.state = "PROVIDER_ASSIGNED"; this.addEvent(booking, "PROVIDER_ASSIGNED", "A suitable assistant has been assigned."); return booking; }
  addEvent(booking: Booking, type: string, note: string, customerVisible = true) { booking.events.push({ id: randomUUID(), bookingId: booking.id, type, createdAt: new Date().toISOString(), customerVisible, note }); }
}

export const customerStore = new CustomerStore();
