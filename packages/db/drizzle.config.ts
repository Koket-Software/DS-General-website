import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
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

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://suba:suba_password@localhost:5432/suba_app",
  },
});
