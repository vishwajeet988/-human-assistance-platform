import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16).default("development-only-change-me-please")
}).superRefine((value, context) => {
  if (value.NODE_ENV === "production" && value.JWT_SECRET === "development-only-change-me-please") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["JWT_SECRET"], message: "JWT_SECRET must be explicitly configured in production." });
  }
});

export function parseConfig(env: NodeJS.ProcessEnv = process.env) {
  return schema.parse(env);
}

export const config = parseConfig();
