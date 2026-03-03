// Load environment variables FIRST before any other imports
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

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

// Now import everything else
import { createApp } from "./core/app";
import { createContainer } from "./core/container";
import { handleError } from "./core/http";
import { registerRoutes } from "./core/router";

const app = createApp();
const container = createContainer();

registerRoutes(app, container);

app.onError((err, c) => {
  return handleError(err, c);
});

export default app;
