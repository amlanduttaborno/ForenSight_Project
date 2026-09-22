import type { Analysis, ResearchStatus } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function ensureOk(response: Response) {
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail ?? message;
    } catch {}
    throw new Error(message);
  }
  return response;
}

export function absoluteArtifact(path: string) {
  return `${API_URL}${path}`;
}

export async function createAnalysis(file: File, caption: string): Promise<Analysis> {
  const form = new FormData();
  form.append("image", file);
  form.append("caption", caption);
  form.append("analysis_mode", "supervisor-demo");
  const response = await fetch(`${API_URL}/api/v1/analyses`, { method: "POST", body: form });
  await ensureOk(response);
  return response.json();
}

export async function getAnalyses(): Promise<Analysis[]> {
  const response = await fetch(`${API_URL}/api/v1/analyses`, { cache: "no-store" });
  await ensureOk(response);
  return response.json();
}

export async function getResearchStatus(): Promise<ResearchStatus> {
  const response = await fetch(`${API_URL}/api/v1/research/status`, { cache: "no-store" });
  await ensureOk(response);
  return response.json();
}
