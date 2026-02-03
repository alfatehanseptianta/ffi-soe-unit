import chokidar from "chokidar";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const LOG_DIR = ".codex";
const LOG_FILE = `${LOG_DIR}/last_error.log`;

let running = false;
let timer = null;

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, {
      shell: true, // penting untuk Windows
      stdio: ["ignore", "pipe", "pipe"],
      ...opts,
    });

    let out = "";
    p.stdout.on("data", (d) => (out += d.toString()));
    p.stderr.on("data", (d) => (out += d.toString()));
    p.on("close", (code) => resolve({ code, out }));
  });
}

async function smoke() {
  return run("pnpm", ["-s", "test:smoke"]);
}

async function codexFix() {
  const prompt = [
    `Fix the issue described in ${LOG_FILE}.`,
    `Make minimal safe changes (defaults/guards) to prevent Next.js runtime crashes.`,
    `Then re-run "pnpm -s test:smoke" until it passes.`,
    `Do not change unrelated files.`,
  ].join(" ");

  // --full-auto biar Codex jalan tanpa banyak tanya
  return run("codex", ["exec", "--full-auto", prompt]);
}

async function cycle() {
  if (running) return;
  running = true;

  try {
    const res = await smoke();
    if (res.code === 0) return;

    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.writeFile(LOG_FILE, res.out, "utf8");

    console.log("\n[ai] Smoke test failed → asking Codex to fix…\n");
    await codexFix();

    const res2 = await smoke();
    if (res2.code !== 0) {
      await fs.writeFile(LOG_FILE, res2.out, "utf8");
      console.log("[ai] Still failing. Check .codex/last_error.log");
    } else {
      console.log("[ai] Fixed ✅");
    }
  } finally {
    running = false;
  }
}

function debouncedCycle() {
  clearTimeout(timer);
  timer = setTimeout(cycle, 800);
}

console.log("[ai] Watching files… (app/, components/, lib/)");
chokidar
  .watch(["app/**/*", "components/**/*", "lib/**/*"], {
    ignored: ["**/.next/**", "**/node_modules/**", "**/.git/**"],
    ignoreInitial: true,
  })
  .on("all", debouncedCycle);

// run once at start
cycle();
