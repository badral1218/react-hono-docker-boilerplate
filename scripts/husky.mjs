if (process.env.NODE_ENV === "production") {
  console.log("Skipping husky init in production");
  process.exit(0);
}

if (process.env.CI === "true") {
  console.log("Skipping husky init in CI");
  process.exit(0);
}

const husky = (await import("husky")).default;
console.log(husky());
