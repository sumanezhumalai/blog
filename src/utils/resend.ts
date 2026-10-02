import { Resend } from "resend";

let cached: Resend | null = null;

export async function getResend(): Promise<Resend> {
  if (cached) return cached;

  let apiKey: string | undefined;

  try {
    const { env } = await import("cloudflare:workers");
    apiKey = env.RESEND_API_KEY;
  } catch {
    // cloudflare:workers not available
  }

  if (!apiKey) {
    apiKey = import.meta.env.RESEND_API_KEY;
  }

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required");
  }

  cached = new Resend(apiKey);
  return cached;
}
