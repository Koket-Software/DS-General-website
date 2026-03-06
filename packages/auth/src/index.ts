import path from "node:path";
import { fileURLToPath } from "node:url";

import { db } from "@suba-company-template/db";
import * as schema from "@suba-company-template/db/schema/auth";
import { userProfiles } from "@suba-company-template/db/schema/users";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import dotenv from "dotenv";

// Load environment variables BEFORE any Better Auth initialization
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../..");
const rootEnvPath = path.join(rootDir, ".env");
const productionEnvPath = path.join(rootDir, ".env.prod");

dotenv.config({ path: rootEnvPath });

const overrideEnvPath = process.env.ENV_FILE
  ? path.resolve(rootDir, process.env.ENV_FILE)
  : process.env.NODE_ENV === "production"
    ? productionEnvPath
    : rootEnvPath;

if (overrideEnvPath !== rootEnvPath) {
  dotenv.config({ path: overrideEnvPath, override: true });
}

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  basePath: "/api/v1/auth",
  secret: process.env.BETTER_AUTH_SECRET as string,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // Don't allow setting via sign-up
      },
    },
  },
  // Hook to create user profile on sign-up (for both email/password and OAuth)
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Create user profile in user_profiles table
          try {
            await db
              .insert(userProfiles)
              .values({
                userId: user.id,
                firstName: null,
                lastName: null,
                headshotUrl: null,
                phoneNumber: null,
              })
              .onConflictDoNothing();
          } catch (error) {
            // Log error but don't fail the sign-up
            // eslint-disable-next-line no-console
            console.error("Failed to create user profile:", error);
          }
        },
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
});

export type Auth = typeof auth;
