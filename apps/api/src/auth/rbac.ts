export const roles = ["CUSTOMER", "PROVIDER", "ADMIN", "SUPPORT"] as const;
export type Role = (typeof roles)[number];

export type AuthenticatedUser = { id: string; roles: readonly Role[] };

export function hasAnyRole(user: AuthenticatedUser, allowed: readonly Role[]): boolean {
  return allowed.some((role) => user.roles.includes(role));
}

export function canAccessResource(user: AuthenticatedUser, ownerId: string): boolean {
  return user.id === ownerId || hasAnyRole(user, ["ADMIN", "SUPPORT"]);
}
