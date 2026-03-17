import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const ansibleDir = path.join(projectRoot, "ansible");

const app = express();
const port = Number(process.env.PORT || 4000);
const apiToken = process.env.API_TOKEN || "";

app.use(cors());
app.use(express.json({ limit: "256kb" }));

const ALLOWED_JOBS = {
  deploySite: {
    playbook: path.join(ansibleDir, "playbooks", "deploy-site.yml"),
    inventory: path.join(ansibleDir, "inventory", "production.ini"),
  },
};

let currentJob = {
  running: false,
  job: null,
  startedAt: null,
  endedAt: null,
  exitCode: null,
  logs: [],
  pid: null,
};

function appendLog(source, chunk) {
  const text = chunk.toString();
  const lines = text.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    currentJob.logs.push({
      at: new Date().toISOString(),
      source,
      line,
    });
  }

  // Keep memory bounded for MVP
  if (currentJob.logs.length > 3000) {
    currentJob.logs = currentJob.logs.slice(-3000);
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token || token !== apiToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "deploy-backend" });
});

app.get("/api/deploy/status", authMiddleware, (_req, res) => {
  res.json({
    running: currentJob.running,
    job: currentJob.job,
    startedAt: currentJob.startedAt,
    endedAt: currentJob.endedAt,
    exitCode: currentJob.exitCode,
    pid: currentJob.pid,
    logs: currentJob.logs,
  });
});

app.post("/api/deploy", authMiddleware, (req, res) => {
  const { job, extraVars = {} } = req.body || {};

  if (!job || !ALLOWED_JOBS[job]) {
    return res.status(400).json({ error: "Invalid job" });
  }

  if (currentJob.running) {
    return res.status(409).json({ error: "Deployment already running" });
  }

  if (typeof extraVars !== "object" || Array.isArray(extraVars) || extraVars === null) {
    return res.status(400).json({ error: "extraVars must be an object" });
  }

  const { playbook, inventory } = ALLOWED_JOBS[job];
  const args = ["-i", inventory, playbook, "--extra-vars", JSON.stringify(extraVars)];

  currentJob = {
    running: true,
    job,
    startedAt: new Date().toISOString(),
    endedAt: null,
    exitCode: null,
    logs: [],
    pid: null,
  };

  const child = spawn("ansible-playbook", args, {
    cwd: ansibleDir,
    shell: false,
    env: {
      ...process.env,
      ANSIBLE_FORCE_COLOR: "false",
    },
  });

  currentJob.pid = child.pid ?? null;

  child.stdout.on("data", (chunk) => appendLog("stdout", chunk));
  child.stderr.on("data", (chunk) => appendLog("stderr", chunk));

  child.on("error", (error) => {
    appendLog("stderr", `Process error: ${error.message}`);
    currentJob.running = false;
    currentJob.endedAt = new Date().toISOString();
    currentJob.exitCode = -1;
  });

  child.on("close", (code) => {
    currentJob.running = false;
    currentJob.endedAt = new Date().toISOString();
    currentJob.exitCode = code;
  });

  return res.status(202).json({
    status: "started",
    job,
    pid: currentJob.pid,
    startedAt: currentJob.startedAt,
  });
});

app.listen(port, () => {
  console.log(`Deploy backend listening on port ${port}`);
});
