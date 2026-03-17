export type DeployResponse = {
  status: "started";
  job: string;
  pid: number | null;
  startedAt: string;
};

export type DeployStatusLog = {
  at: string;
  source: "stdout" | "stderr";
  line: string;
};

export type DeployStatusResponse = {
  running: boolean;
  job: string | null;
  startedAt: string | null;
  endedAt: string | null;
  exitCode: number | null;
  pid: number | null;
  logs: DeployStatusLog[];
};

export async function triggerDeploy(apiBaseUrl: string, token: string, extraVars: Record<string, unknown> = {}) {
  const res = await fetch(`${apiBaseUrl}/api/deploy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      job: "deploySite",
      extraVars,
    }),
  });

  if (!res.ok) {
    throw new Error(`Deploy trigger failed (${res.status})`);
  }

  return (await res.json()) as DeployResponse;
}

export async function getDeployStatus(apiBaseUrl: string, token: string) {
  const res = await fetch(`${apiBaseUrl}/api/deploy/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Status check failed (${res.status})`);
  }

  return (await res.json()) as DeployStatusResponse;
}
