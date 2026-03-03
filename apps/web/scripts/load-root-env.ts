import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../../..");
const mode = process.env.NODE_ENV || "development";
const shouldLoadProdEnv =
  mode === "production" || process.env.ENV_FILE?.endsWith(".env.prod");

const rootEnv = loadEnv(mode, rootDir, "");
Object.assign(process.env, rootEnv);

if (shouldLoadProdEnv) {
  const prodEnv = loadEnv("prod", rootDir, "");
  Object.assign(process.env, prodEnv);
}
