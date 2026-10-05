export const roleRoutes = {
  CUSTOMER: "/app",
  PROVIDER: "/provider",
  ADMIN: "/operations",
  SUPPORT: "/operations"
} as const;

export type AppRole = keyof typeof roleRoutes;

export function routeForRole(role: string | null | undefined): string {
  return role && role in roleRoutes ? roleRoutes[role as AppRole] : "/auth/sign-in";
}
