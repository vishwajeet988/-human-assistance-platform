import { AppError } from "../errors.js";
import type { ServiceCategory } from "./types.js";

export function estimatePrice(category: ServiceCategory, durationMinutes: number) {
  if (!category.active) throw new AppError("SERVICE_UNAVAILABLE", "This service is not currently available.", 409);
  if (!category.durationOptionsMinutes.includes(durationMinutes)) throw new AppError("INVALID_DURATION", "Choose one of the available duration options.", 400);
  const additionalHours = Math.max(0, durationMinutes / 60 - 1);
  const base = category.basePriceMinor;
  const duration = Math.round(additionalHours * category.hourlyRateMinor);
  return { baseChargeMinor: base, durationChargeMinor: duration, additionalChargeMinor: 0, totalMinor: base + duration, currency: "INR" as const };
}

export function validateScheduledStart(value: string, now = new Date()): Date {
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) throw new AppError("INVALID_DATE", "Use a timezone-aware date and time.", 400);
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date <= now) throw new AppError("INVALID_DATE", "Choose a date and time in the future.", 400);
  return date;
}
