import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedRoot = join(projectRoot, "src/shared/api/generated");
const temporaryRoot = await mkdtemp(join(tmpdir(), "bulletproof-api-check-"));

async function fileMap(root: string, current = root): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const path = join(current, entry.name);
    if (entry.isDirectory()) {
      for (const [name, content] of await fileMap(root, path)) result.set(name, content);
    } else if (entry.isFile()) {
      result.set(relative(root, path), await readFile(path, "utf8"));
    }
  }
  return result;
}

try {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const generated = spawnSync(command, ["exec", "orval", "--config", "orval.config.ts"], {
    cwd: projectRoot,
    encoding: "utf8",
    env: { ...process.env, ORVAL_CHECK_OUTPUT_DIR: temporaryRoot },
  });

  if (generated.error || generated.status !== 0) {
    process.stderr.write(generated.stdout ?? "");
    process.stderr.write(generated.stderr ?? "");
    if (generated.error) process.stderr.write(`${generated.error.message}\n`);
    process.exitCode = generated.status ?? 1;
  } else {
    const expected = await fileMap(temporaryRoot);
    const actual = await fileMap(generatedRoot);
    const names = new Set([...expected.keys(), ...actual.keys()]);
    const differences = [...names].filter((name) => expected.get(name) !== actual.get(name));

    if (differences.length > 0) {
      process.stderr.write(
        `Generated API drift: ${differences.join(", ")}\nRun pnpm api:gen and review the output.\n`,
      );
      for (const name of differences) {
        const before = actual.get(name)?.split("\n") ?? [];
        const after = expected.get(name)?.split("\n") ?? [];
        const line = after.findIndex((text, index) => text !== before[index]);
        process.stderr.write(
          `${name}:${line + 1}\n  checked-in: ${before[line] ?? "<missing>"}\n  generated:  ${after[line] ?? "<missing>"}\n`,
        );
      }
      process.exitCode = 1;
    } else {
      process.stdout.write("Generated API matches the OpenAPI contract.\n");
    }
  }
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
