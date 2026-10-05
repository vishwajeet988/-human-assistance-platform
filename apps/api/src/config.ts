import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16).default("development-only-change-me-please"),
  PAYMENT_WEBHOOK_SECRET: z.string().min(16).default("development-payment-secret"),
  PLATFORM_COMMISSION_RATE: z.coerce.number().min(0).max(1).default(0.2),
  PERSISTENCE_MODE: z.enum(["memory", "postgres"]).default("memory"),
  STORAGE_MODE: z.enum(["development", "s3"]).default("development"),
  NOTIFICATION_MODE: z.enum(["development", "configured"]).default("development"),
  MAP_MODE: z.enum(["development", "configured"]).default("development")
}).superRefine((value, context) => {
  if (value.NODE_ENV === "production" && value.JWT_SECRET === "development-only-change-me-please") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["JWT_SECRET"], message: "JWT_SECRET must be explicitly configured in production." });
  }
  if (value.NODE_ENV === "production" && !value.DATABASE_URL) context.addIssue({ code: z.ZodIssueCode.custom, path: ["DATABASE_URL"], message: "DATABASE_URL is required in production." });
  if (value.NODE_ENV === "production" && value.PAYMENT_WEBHOOK_SECRET === "development-payment-secret") context.addIssue({ code: z.ZodIssueCode.custom, path: ["PAYMENT_WEBHOOK_SECRET"], message: "PAYMENT_WEBHOOK_SECRET must be explicitly configured in production." });
  if (value.NODE_ENV === "production" && value.PERSISTENCE_MODE !== "postgres") context.addIssue({ code: z.ZodIssueCode.custom, path: ["PERSISTENCE_MODE"], message: "PERSISTENCE_MODE must be postgres in production." });
});

export function parseConfig(env: NodeJS.ProcessEnv = process.env) {
  return schema.parse(env);
}

export const config = parseConfig();
