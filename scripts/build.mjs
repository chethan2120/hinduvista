import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const generated = spawnSync("npx prisma generate", { stdio: "inherit", shell: true });
const clientReady = existsSync("node_modules/.prisma/client/index.js");

if (generated.status !== 0) {
  if (!clientReady) {
    process.exit(generated.status ?? 1);
  }
  console.warn(
    "Prisma generate could not replace the engine file because a running server has it open. The existing client is already generated, so the site build will continue.",
  );
}

const built = spawnSync("npx next build", { stdio: "inherit", shell: true });
process.exit(built.status ?? 1);
