"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { sendLead, type LeadState } from "@/app/actions";
import { gsap } from "@/lib/gsap";
import { useDict, useLang } from "./providers";

const initial: LeadState = { status: "idle" };

export function LeadForm({
  subject,
  defaultMessage = "",
  reasons,
  tone = "light",
}: {
  subject?: string;
  defaultMessage?: string;
  reasons?: Record<string, string>;
  tone?: "light" | "dark";
}) {
  const d = useDict();
  const lang = useLang();
  const id = useId();
  const [state, action, pending] = useActionState(sendLead, initial);
  const done = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    if (state.status === "ok") gsap.from(done.current, { y: 24, autoAlpha: 0, duration: 1, ease: "expo.out" });
  }, [state.status]);

  if (state.status === "ok") {
    return (
      <div ref={done} role="status" className={`border-t pt-8 ${dark ? "border-paper/25" : "border-line"}`}>
        <p className="display text-[clamp(2rem,3.5vw,3rem)]">{d.form.success}</p>
        {state.demo && <p className={`mt-4 text-sm ${dark ? "text-paper/60" : "text-muted"}`}>{d.form.demo}</p>}
      </div>
    );
  }

  const err = state.errors ?? {};
  const v = state.values;
  const fieldCls = `field ${dark ? "border-paper/25 text-paper placeholder:text-paper/40 focus:border-paper" : ""}`;
  const labelCls = `field-label ${dark ? "text-paper/60" : ""}`;
  const errCls = "mt-2 text-sm text-clay";

  return (
    <form action={action} noValidate className="grid gap-7 sm:grid-cols-2">
      <input type="hidden" name="lang" value={lang} />
      {subject && <input type="hidden" name="subject" value={subject} />}
      <div className="hidden" aria-hidden>
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={`${id}-name`} className={labelCls}>
          {d.form.name}
        </label>
        <input id={`${id}-name`} name="name" defaultValue={v?.name} autoComplete="name" required aria-invalid={!!err.name} aria-describedby={err.name ? `${id}-name-e` : undefined} className={fieldCls} />
        {err.name && <p id={`${id}-name-e`} className={errCls}>{err.name}</p>}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className={labelCls}>
          {d.form.email}
        </label>
        <input id={`${id}-email`} name="email" defaultValue={v?.email} type="email" autoComplete="email" required aria-invalid={!!err.email} aria-describedby={err.email ? `${id}-email-e` : undefined} className={fieldCls} />
        {err.email && <p id={`${id}-email-e`} className={errCls}>{err.email}</p>}
      </div>
      <div className={reasons ? "" : "sm:col-span-2"}>
        <label htmlFor={`${id}-phone`} className={labelCls}>
          {d.form.phone}
        </label>
        <input id={`${id}-phone`} name="phone" defaultValue={v?.phone} type="tel" autoComplete="tel" className={fieldCls} />
      </div>
      {reasons && (
        <div>
          <label htmlFor={`${id}-reason`} className={labelCls}>
            {d.contact.reason}
          </label>
          <select id={`${id}-reason`} name="reason" className={`${fieldCls} appearance-none`}>
            {Object.entries(reasons).map(([k, v]) => (
              <option key={k} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={labelCls}>
          {d.form.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          required
          defaultValue={v?.message ?? defaultMessage}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? `${id}-message-e` : undefined}
          className={`${fieldCls} resize-none`}
        />
        {err.message && <p id={`${id}-message-e`} className={errCls}>{err.message}</p>}
      </div>
      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-sm ${dark ? "text-paper/55" : "text-muted"}`}>{d.form.privacy}</p>
        <button type="submit" disabled={pending} className={`btn ${dark ? "btn-light" : "btn-solid"} w-full sm:w-auto disabled:opacity-60`}>
          {pending ? d.form.sending : d.form.send}
          <span aria-hidden>→</span>
        </button>
      </div>
      {err.form && <p className={`${errCls} sm:col-span-2`} role="alert">{err.form}</p>}
    </form>
  );
}
