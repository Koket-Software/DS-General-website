import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const noopDevtoolsModule = path.resolve(
  __dirname,
  "./src/lib/devtools/noop.tsx",
);

const plugins: PluginOption[] = [
  tsconfigPaths({ ignoreConfigErrors: true }) as PluginOption,
  tailwindcss() as PluginOption,
  tanstackRouter({}) as PluginOption,
  react() as PluginOption,
];

function manualChunks(id: string) {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  const packagePath = id.split("node_modules/").at(-1);
  const packageSegments = packagePath?.split("/") ?? [];
  const packageName = packageSegments[0]?.startsWith("@")
    ? `${packageSegments[0]}-${packageSegments[1]}`
    : packageSegments[0];
  const skipManualChunkPackages = new Set([
    "@simplewebauthn-browser",
    "detect-node-es",
    "radix-ui",
    "seroval",
    "seroval-plugins",
  ]);

  if (
    id.includes("/@lexical/") ||
    id.includes("/lexical/") ||
    id.includes("/prismjs/")
  ) {
    return "vendor-lexical";
  }

  if (
    id.includes("/@tanstack/react-devtools/") ||
    id.includes("/@tanstack/react-query-devtools/") ||
    id.includes("/@tanstack/react-router-devtools/")
  ) {
    return "vendor-devtools";
  }

  if (
    id.includes("/@tanstack/react-router") ||
    id.includes("/@tanstack/router-core") ||
    id.includes("/@tanstack/history") ||
    id.includes("/@tanstack/react-query") ||
    id.includes("/@tanstack/query-core") ||
    id.includes("/@tanstack/react-form") ||
    id.includes("/@tanstack/form-core") ||
    id.includes("/@tanstack/react-table") ||
    id.includes("/@tanstack/table-core")
  ) {
    return "vendor-tanstack";
  }

  if (
    id.includes("/react/") ||
    id.includes("/react-dom/") ||
    id.includes("/scheduler/")
  ) {
    return "vendor-react";
  }

  if (
    id.includes("/@radix-ui/") ||
    id.includes("/cmdk/") ||
    id.includes("/lucide-react/")
  ) {
    return "vendor-ui";
  }

  if (
    id.includes("/framer-motion/") ||
    id.includes("/motion/") ||
    id.includes("/gsap/") ||
    id.includes("/embla-carousel-react/") ||
    id.includes("/embla-carousel-autoplay/") ||
    id.includes("/ogl/")
  ) {
    return "vendor-motion";
  }

  if (!packageName) {
    return "vendor-misc";
  }

  if (skipManualChunkPackages.has(packageName)) {
    return undefined;
  }

  return `vendor-${packageName.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const rootEnv = loadEnv(mode, rootDir, "");
  const shouldLoadProdEnv =
    mode === "production" || process.env.ENV_FILE?.endsWith(".env.prod");
  const prodEnv = shouldLoadProdEnv ? loadEnv("prod", rootDir, "") : {};
  const env = { ...rootEnv, ...prodEnv };
  const isProdBuild = mode === "production";

  return {
    plugins,
    resolve: {
      alias: {
        ...(isProdBuild
          ? {
              "@tanstack/react-devtools": noopDevtoolsModule,
              "@tanstack/react-query-devtools": noopDevtoolsModule,
              "@tanstack/react-router-devtools": noopDevtoolsModule,
            }
          : {}),
        "@": path.resolve(__dirname, "./src"),
        "@web": path.resolve(__dirname, "./src"),
        "@rich-text": path.resolve(
          __dirname,
          "./src/components/common/rich-text",
        ),
      },
    },
    define: {
      "import.meta.env.VITE_SERVER_URL": JSON.stringify(env.VITE_SERVER_URL),
      "import.meta.env.VITE_FRONTEND_URL": JSON.stringify(
        env.VITE_FRONTEND_URL,
      ),
    },
    build: {
      manifest: !isSsrBuild,
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
    },
  };
});
