import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import "./load-root-env";

const DEFAULT_MAX_KB = 420;

type AssetStat = {
  fileName: string;
  filePath: string;
  sizeBytes: number;
};

function parseMaxKb(): number {
  const raw = process.env.WEB_LARGEST_JS_ASSET_MAX_KB;

  if (!raw) {
    return DEFAULT_MAX_KB;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid WEB_LARGEST_JS_ASSET_MAX_KB value: ${raw}. Provide a positive number.`,
    );
  }

  return parsed;
}

async function main() {
  const maxKb = parseMaxKb();
  const assetsDir = path.resolve(import.meta.dir, "../dist/assets");
  const files = (await readdir(assetsDir)).filter((fileName) =>
    fileName.endsWith(".js"),
  );

  if (files.length === 0) {
    throw new Error(`No JS files found in ${assetsDir}`);
  }

  const stats = await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(assetsDir, fileName);
      const fileStat = await stat(filePath);

      return {
        fileName,
        filePath,
        sizeBytes: fileStat.size,
      } satisfies AssetStat;
    }),
  );

  const sorted = stats.sort((a, b) => b.sizeBytes - a.sizeBytes);
  const largestAsset = sorted[0];
  const largestKb = largestAsset.sizeBytes / 1024;

  process.stdout.write(
    `[perf:budget] Largest JS asset ${largestAsset.fileName}: ${largestKb.toFixed(2)} KiB (limit: ${maxKb.toFixed(2)} KiB)\n`,
  );

  if (largestKb > maxKb) {
    throw new Error(
      `[perf:budget] Largest JS asset exceeds limit by ${(largestKb - maxKb).toFixed(2)} KiB: ${largestAsset.filePath}`,
    );
  }
}

await main();
