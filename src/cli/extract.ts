import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { resolve } from "path";

const usage = `Usage: nix-i18n-extract <paths...> [--output <file>]

Extracts translation keys from source files by scanning calls to t(), n(),
i18n.t(), i18n.n(), etc. Outputs a JSON file with the discovered keys.
`;

function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf("--output");
  const output = outputIndex !== -1 ? args[outputIndex + 1] : "extracted-keys.json";
  if (outputIndex !== -1) {
    args.splice(outputIndex, 2);
  }

  const paths = args.length > 0 ? args : ["./src"];
  const files = collectFiles(paths);
  const keys = new Set<string>();

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    extractKeys(content, keys);
  }

  const sorted = [...keys].sort();
  writeFileSync(output, JSON.stringify(sorted, null, 2));
  console.log(`Extracted ${sorted.length} keys from ${files.length} files into ${output}`);
}

function collectFiles(paths: string[]): string[] {
  const files: string[] = [];
  for (const path of paths) {
    const stat = statSync(path);
    if (stat.isFile()) {
      files.push(resolve(path));
    } else if (stat.isDirectory()) {
      collectDirectoryFiles(path, files);
    }
  }
  return files;
}

function collectDirectoryFiles(dir: string, files: string[]): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectDirectoryFiles(fullPath, files);
    } else if (/\.(ts|tsx|js|jsx|vue|svelte)$/.test(entry)) {
      files.push(fullPath);
    }
  }
}

function extractKeys(content: string, keys: Set<string>): void {
  const patterns = [
    /(?:\bt\(|i18n\.t\(|i18nWithNs\.t\()\s*["']([^"']+)["']\s*[,)]/g,
    /(?:\bn\(|i18n\.n\(|i18nWithNs\.n\()\s*[^,]+,\s*["']([^"']+)["']\s*[,)]/g,
  ];
  for (const regex of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
    }
  }
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

main();
