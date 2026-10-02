import { getResend } from "@utils/resend";
import { confirmationEmailTemplate } from "./confirmationTemplate";

const FALLBACK_FROM_EMAIL = "no-reply@sumanezhumalai.com";

async function getFromEmail(): Promise<string> {
  try {
    const { env } = await import("cloudflare:workers");
    if (env.SEND_FROM_EMAIL) return env.SEND_FROM_EMAIL;
  } catch {
    // cloudflare:workers not available
  }
  return import.meta.env.SEND_FROM_EMAIL || FALLBACK_FROM_EMAIL;
}

export const sendNewsletterEmail = async (to: string, uuid: string) => {
  const resend = await getResend();
  const fromEmail = await getFromEmail();
  const html = await confirmationEmailTemplate(uuid);
  await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: "One step left - confirm your subscription",
    html,
  });
};
