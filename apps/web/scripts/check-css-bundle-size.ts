import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import "./load-root-env";

const DEFAULT_MAX_KB = 190;

function parseMaxKb(): number {
  const raw = process.env.WEB_CSS_BUNDLE_MAX_KB;

  if (!raw) {
    return DEFAULT_MAX_KB;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid WEB_CSS_BUNDLE_MAX_KB value: ${raw}. Provide a positive number.`,
    );
  }

  return parsed;
}

async function main() {
  const maxKb = parseMaxKb();
  const assetsDir = path.resolve(import.meta.dir, "../dist/assets");
  const cssFiles = (await readdir(assetsDir)).filter((fileName) =>
    fileName.endsWith(".css"),
  );

  if (cssFiles.length === 0) {
    throw new Error(`No CSS bundles found in ${assetsDir}`);
  }

  const stats = await Promise.all(
    cssFiles.map(async (fileName) => {
      const filePath = path.join(assetsDir, fileName);
      const fileStat = await stat(filePath);
      return {
        fileName,
        filePath,
        sizeBytes: fileStat.size,
      };
    }),
  );

  const totalBytes = stats.reduce((sum, item) => sum + item.sizeBytes, 0);
  const totalKb = totalBytes / 1024;

  process.stdout.write(
    `[perf:budget] CSS bundle total: ${totalKb.toFixed(2)} KiB (limit: ${maxKb.toFixed(2)} KiB)\n`,
  );

  if (totalKb > maxKb) {
    throw new Error(
      `[perf:budget] CSS bundles exceed limit by ${(totalKb - maxKb).toFixed(2)} KiB`,
    );
  }
}

await main();
