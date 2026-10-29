// Tiny lint for the Shepherd trial. Rules: no `var` declarations, no trailing whitespace.
// `--fix` rewrites `var` to `let` and strips trailing whitespace. No dependencies.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const fix = process.argv.includes("--fix");
const files = readdirSync("src").filter((f) => f.endsWith(".js")).map((f) => join("src", f));
let problems = 0;
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  const out = lines.map((line, i) => {
    let l = line;
    if (/\s+$/.test(l)) { problems++; console.error(`${file}:${i + 1}: trailing whitespace`); l = l.replace(/\s+$/, ""); }
    if (/^\s*var\s/.test(l)) { problems++; console.error(`${file}:${i + 1}: use let or const, not var`); l = l.replace(/^(\s*)var\s/, "$1let "); }
    return l;
  });
  if (fix) writeFileSync(file, out.join("\n"));
}
if (problems && !fix) { console.error(`lint: ${problems} problem(s)`); process.exit(1); }
console.log(fix ? `lint --fix: ${problems} fixed` : "lint: ok");
