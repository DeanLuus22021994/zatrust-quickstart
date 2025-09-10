#!/usr/bin/env node
/**
 * Dev server launcher that finds an available host port (starting at WEB_PORT env or 3000)
 * and then runs `next dev -p <port>` so the container can map dynamically.
 */
const { spawn } = require("child_process");
const net = require("net");

const start = parseInt(process.env.WEB_PORT || process.env.PORT || "3000", 10);

function findFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(findFree(port + 1)));
    srv.once("listening", () => srv.close(() => resolve(port)));
    srv.listen(port, "0.0.0.0");
  });
}

(async () => {
  const free = await findFree(start);
  process.env.PORT = String(free);
  console.log(`[dev] Using port ${free}`);
  const child = spawn("npx", ["next", "dev", "-p", String(free)], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code || 0));
})();
