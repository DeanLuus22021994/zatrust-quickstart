#!/usr/bin/env node
/**
 * Dev server launcher.
 * Behaviors:
 *  - If user passes -p <port> or --port <port>, we REQUIRE that port be free; if not, exit with error.
 *  - Else, we find the first free port starting at WEB_PORT | PORT | 3000.
 *  - Exposes chosen port via process.env.PORT for downstream tooling.
 */
const { spawn } = require("child_process");
const net = require("net");

let baseStart = parseInt(
  process.env.WEB_PORT || process.env.PORT || "3000",
  10
);
let requestedPort;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "-p" || args[i] === "--port") {
    const val = args[i + 1];
    if (val && !val.startsWith("-")) {
      requestedPort = parseInt(val, 10);
      if (!Number.isNaN(requestedPort)) baseStart = requestedPort;
    }
  }
}

function findFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(findFree(port + 1)));
    srv.once("listening", () => srv.close(() => resolve(port)));
    srv.listen(port, "0.0.0.0");
  });
}

function ensureAvailable(port) {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once("error", (err) => reject(err));
    srv.once("listening", () => srv.close(() => resolve(port)));
    srv.listen(port, "0.0.0.0");
  });
}

(async () => {
  let chosen;
  if (requestedPort) {
    try {
      await ensureAvailable(requestedPort);
      chosen = requestedPort;
    } catch (err) {
      console.error(
        `[dev] Requested port ${requestedPort} is not available. Stop the process using it or choose another port.`,
        err && err.message ? `Error: ${err.message}` : ""
      );
      process.exit(1);
    }
  } else {
    chosen = await findFree(baseStart);
  }
  process.env.PORT = String(chosen);
  console.log(`[dev] Using port ${chosen}`);
  const child = spawn("npx", ["next", "dev", "-p", String(chosen)], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code || 0));
})();
