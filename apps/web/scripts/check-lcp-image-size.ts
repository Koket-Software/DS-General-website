import { stat } from "node:fs/promises";
import path from "node:path";

import "./load-root-env";

const DEFAULT_MAX_KB = 180;
const HERO_IMAGE_PATH = path.resolve(
  import.meta.dir,
  "../src/assets/ds/home/DS_Hero.webp",
);

function parseMaxKb(): number {
  const raw = process.env.WEB_LCP_IMAGE_MAX_KB;

  if (!raw) {
    return DEFAULT_MAX_KB;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid WEB_LCP_IMAGE_MAX_KB value: ${raw}. Provide a positive number.`,
    );
  }

  return parsed;
}

async function main() {
  const maxKb = parseMaxKb();
  const fileStat = await stat(HERO_IMAGE_PATH);
  const sizeKb = fileStat.size / 1024;

  process.stdout.write(
    `[perf:budget] LCP image DS_Hero.webp: ${sizeKb.toFixed(2)} KiB (limit: ${maxKb.toFixed(2)} KiB)\n`,
  );

  if (sizeKb > maxKb) {
    throw new Error(
      `[perf:budget] LCP image exceeds limit by ${(sizeKb - maxKb).toFixed(2)} KiB: ${HERO_IMAGE_PATH}`,
    );
  }
}

await main();
