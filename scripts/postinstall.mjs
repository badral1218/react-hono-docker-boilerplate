if (process.env.CI === "true") {
  console.log("Skipping postinstall in CI");
  process.exit(0);
}

console.log("Running postinstall for all apps...");

import { execSync } from "node:child_process";

execSync("bun run --filter '*' postinstall", { stdio: "inherit" });
