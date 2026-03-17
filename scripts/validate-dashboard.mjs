import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "src", "pages", "Dashboard.tsx");
const text = fs.readFileSync(file, "utf8");

const checks = [
  { token: "const Dashboard =", expected: 1 },
  { token: "export default Dashboard", expected: 1 },
  { token: 'import { quickAutomations, recentJobs, stats, statusClasses } from "./dashboardData";', expected: 0 },
  { token: "<<<<<<<", expected: 0 },
  { token: "=======", expected: 0 },
  { token: ">>>>>>>", expected: 0 },
];

for (const check of checks) {
  const found = text.split(check.token).length - 1;
  if (found !== check.expected) {
    console.error(
      `[dashboard-guard] Expected ${check.expected} occurrence(s) of: ${check.token} but found ${found}.`,
    );
    process.exit(1);
  }
}

// Ensure there are no stray imports appended after module body (common bad merge symptom)
const importStatements = text.match(/^import\s.+;$/gm) || [];
const firstNonImportLine = text.split("\n").findIndex((line) => line.trim() && !line.trim().startsWith("import "));
const importsAtTop = text
  .split("\n")
  .slice(0, firstNonImportLine)
  .filter((line) => line.trim().startsWith("import ")).length;

if (importStatements.length !== importsAtTop) {
  console.error("[dashboard-guard] Found import statement(s) outside of the import block at file top.");
  process.exit(1);
}

console.log("[dashboard-guard] Dashboard.tsx structure looks valid.");
