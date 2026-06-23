const spawnOptions = {
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
} as const;

const run = () => {
  Bun.spawn(["bun", "run", "dev:rpc"], spawnOptions);
  Bun.spawn(["bun", "run", "dev:api"], spawnOptions);

  process.on("SIGINT", () => {
    console.log("Cleaning up...");
    process.exit(0);
  });
};

run();
