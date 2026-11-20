"use server";

import { getDictionary, hasLocale } from "@/i18n";

export type LeadState = {
  status: "idle" | "ok" | "error";
  demo?: boolean;
  errors?: Partial<Record<"name" | "email" | "message" | "form", string>>;
  /** Echoed back so a failed submit keeps what the visitor typed. */
  values?: Record<"name" | "email" | "phone" | "message", string>;
};

const clean = (v: FormDataEntryValue | null, max = 2000) => String(v ?? "").trim().slice(0, max);

/**
 * Validates an enquiry and, when RESEND_API_KEY and LEADS_TO are set, emails it.
 * Without those variables (the public demo) it validates and reports demo mode.
 */
export async function sendLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const langRaw = clean(form.get("lang"), 2);
  const d = getDictionary(hasLocale(langRaw) ? langRaw : "es");

  // Honeypot: bots fill every field.
  if (clean(form.get("company"))) return { status: "ok", demo: true };

  const name = clean(form.get("name"), 120);
  const email = clean(form.get("email"), 160);
  const phone = clean(form.get("phone"), 40);
  const message = clean(form.get("message"), 3000);
  const reason = clean(form.get("reason"), 60);
  const subject = clean(form.get("subject"), 160);

  const errors: LeadState["errors"] = {};
  if (name.length < 2) errors.name = d.form.errorName;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = d.form.errorEmail;
  if (message.length < 10) errors.message = d.form.errorMessage;
  const values = { name, email, phone, message };
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO;
  if (!key || !to) return { status: "ok", demo: true };

  const text = [`Nombre: ${name}`, `Email: ${email}`, phone && `Teléfono: ${phone}`, reason && `Motivo: ${reason}`, subject && `Referencia: ${subject}`, "", message]
    .filter(Boolean)
    .join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_FROM ?? "Umbral <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Consulta web${subject ? ` · ${subject}` : ""}`,
        text,
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    return { status: "ok" };
  } catch {
    return { status: "error", errors: { form: d.form.errorServer }, values };
  }
}
