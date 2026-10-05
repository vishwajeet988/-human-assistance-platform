import { AppError } from "../errors.js";
import type { AvailabilityBlock, ProviderProfile } from "./types.js";

const onboardingTransitions: Record<ProviderProfile["onboardingStatus"], readonly ProviderProfile["onboardingStatus"][]> = {
  REGISTERED: ["PROFILE_INCOMPLETE"], PROFILE_INCOMPLETE: ["PROFILE_COMPLETED"], PROFILE_COMPLETED: ["VERIFICATION_PENDING"], VERIFICATION_PENDING: ["VERIFICATION_REVIEW"], VERIFICATION_REVIEW: ["APPROVED", "REJECTED"], APPROVED: ["SUSPENDED", "DEACTIVATED"], REJECTED: ["PROFILE_COMPLETED", "VERIFICATION_PENDING"], SUSPENDED: ["DEACTIVATED"], DEACTIVATED: []
};

export function canTransitionOnboarding(from: ProviderProfile["onboardingStatus"], to: ProviderProfile["onboardingStatus"]) { return onboardingTransitions[from].includes(to); }

export function assertOnboardingTransition(from: ProviderProfile["onboardingStatus"], to: ProviderProfile["onboardingStatus"]) { if (!canTransitionOnboarding(from, to)) throw new AppError("INVALID_ONBOARDING_TRANSITION", `Provider cannot move from ${from} to ${to}.`, 409); }

export function validateAvailability(input: Omit<AvailabilityBlock, "id" | "providerId">) {
  try { new Intl.DateTimeFormat("en-US", { timeZone: input.timezone }); } catch { throw new AppError("INVALID_TIMEZONE", "Use a valid IANA timezone.", 400); }
  if (input.kind === "WEEKLY") { if (!input.dayOfWeek || input.dayOfWeek < 1 || input.dayOfWeek > 7 || !input.startTime || !input.endTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.endTime) || input.startTime >= input.endTime) throw new AppError("INVALID_AVAILABILITY", "Choose a valid weekly day and time range.", 400); }
  if (input.kind === "BLACKOUT") { if (!input.startsAt || !input.endsAt || !input.startsAt.match(/(Z|[+-]\d{2}:\d{2})$/) || new Date(input.startsAt) >= new Date(input.endsAt)) throw new AppError("INVALID_AVAILABILITY", "Choose a valid blackout time range.", 400); }
  return input;
}

export function canEditProfile(profile: ProviderProfile, patch: Record<string, unknown>) {
  const protectedKeys = ["onboardingStatus", "accountStatus", "verificationStatus", "rating", "earnings"];
  if (protectedKeys.some((key) => key in patch)) throw new AppError("FORBIDDEN", "Trust and administrative fields cannot be changed here.", 403);
  if (profile.accountStatus === "DEACTIVATED") throw new AppError("ACCOUNT_DEACTIVATED", "This provider account is deactivated.", 403);
}
