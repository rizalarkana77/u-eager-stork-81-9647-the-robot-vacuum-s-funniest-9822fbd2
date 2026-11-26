import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 120;

function excuseLine(): string {
  return "I skipped that spot because the crumb swiped right, and even a vacuum doesn't eat its date on the first pass.";
}

function validate(line: string): void {
  if (line.length === 0) throw new Error("line must not be empty");
  if (line.length > MAX_CHARS) throw new Error(`line exceeds ${MAX_CHARS} characters`);
  if (line.includes("\n") || line.includes("\r")) throw new Error("line must be a single line");
  if (line !== line.trim()) throw new Error("line must not have leading/trailing whitespace");
  if (!/[.!?]$/.test(line)) throw new Error("line must end with terminal punctuation");
}

function main(): void {
  const line = excuseLine();
  validate(line);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  const back = readFileSync(outPath, "utf8");
  if (back !== line) throw new Error("read-back mismatch");
  const sha = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(line);
  console.log(`chars=${line.length} sha256=${sha}`);
}

main();
