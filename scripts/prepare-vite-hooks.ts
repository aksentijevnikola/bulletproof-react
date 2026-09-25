import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (process.env.VP_GIT_HOOKS === "0") {
  process.stdout.write("Git hooks skipped by VP_GIT_HOOKS=0.\n");
} else if (!existsSync(resolve(root, ".git"))) {
  process.stdout.write("No Git checkout found; hook setup skipped.\n");
} else {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const result = spawnSync(command, ["exec", "vp", "hooks", "enable"], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.error) process.stderr.write(`${result.error.message}\n`);
  process.exitCode = result.status ?? 1;
}
