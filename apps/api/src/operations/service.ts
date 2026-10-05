import { customerStore } from "../customer/store.js";
import { paymentService } from "../payments/service.js";
import { providerRepository } from "../provider/repository.js";
import { safetyService } from "../safety/service.js";
export class OperationsService { async overview() { const bookings = customerStore.listAllBookings(); const payments = paymentService.listPayments(); const earnings = paymentService.listEarnings(); const providers = await providerRepository.listProviders(); const completed = bookings.filter((item) => item.state === "SERVICE_COMPLETED").length; const cancelled = bookings.filter((item) => item.state === "CANCELLED").length; return { bookings: bookings.length, completedBookings: completed, cancellationRate: bookings.length ? cancelled / bookings.length : 0, revenueMinor: payments.filter((item) => item.status === "CAPTURED").reduce((sum, item) => sum + item.amountMinor, 0), commissionMinor: earnings.reduce((sum, item) => sum + item.commissionMinor, 0), providerCount: providers.length, openIncidents: safetyService.listIncidents().filter((item) => item.status !== "RESOLVED").length, noProviderRate: bookings.length ? bookings.filter((item) => item.events.some((event) => event.type === "NO_PROVIDER_AVAILABLE")).length / bookings.length : 0 }; }
  customers() { return [...new Set(customerStore.listAllBookings().map((item) => item.customerId))].map((id) => ({ customerId: id, bookingCount: customerStore.listBookings(id).length })); }
  bookings() { return customerStore.listAllBookings().map((item) => ({ id: item.id, reference: item.reference, customerId: item.customerId, state: item.state, serviceName: item.serviceName, assignedProviderId: item.assignedProviderId, createdAt: item.createdAt })); }
}
export const operationsService = new OperationsService();
