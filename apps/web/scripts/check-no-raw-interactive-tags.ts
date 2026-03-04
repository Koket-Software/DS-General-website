import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const SRC_ROOT = resolve(process.cwd(), "src");
const UI_ROOT = resolve(SRC_ROOT, "components/ui");

const TARGETS = ["button", "input", "textarea", "label"] as const;

const isTsx = (path: string) => path.endsWith(".tsx");

const walk = (dir: string, files: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (stats.isFile() && isTsx(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
};

const isExcluded = (filePath: string) => {
  return filePath.startsWith(UI_ROOT);
};

const findViolations = (filePath: string) => {
  const source = readFileSync(filePath, "utf8");
  const lines = source.split("\n");
  const violations: Array<{ line: number; tag: string; text: string }> = [];

  lines.forEach((line, index) => {
    for (const tag of TARGETS) {
      const regex = new RegExp(`<${tag}\\b`);
      if (regex.test(line)) {
        violations.push({
          line: index + 1,
          tag,
          text: line.trim(),
        });
      }
    }
  });

  return violations;
};

const files = walk(SRC_ROOT);
const report: Array<{ file: string; line: number; tag: string; text: string }> =
  [];

for (const file of files) {
  if (isExcluded(file)) continue;

  const violations = findViolations(file);
  for (const violation of violations) {
    report.push({
      file: relative(process.cwd(), file),
      line: violation.line,
      tag: violation.tag,
      text: violation.text,
    });
  }
}

if (report.length > 0) {
  process.stderr.write(
    "Found raw interactive HTML tags outside components/ui:\n\n",
  );
  for (const violation of report) {
    process.stderr.write(
      `${violation.file}:${violation.line} [${violation.tag}] ${violation.text}\n`,
    );
  }
  process.exit(1);
}

process.stdout.write("No raw interactive tags found outside components/ui.\n");
