"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { ContactContent } from "@/content/types";
import { HONEYPOT_FIELD, LIMITS } from "@/lib/contact-fields";

type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "FORBIDDEN_ORIGIN"
  | "PAYLOAD_TOO_LARGE"
  | "VALIDATION"
  | "RATE_LIMITED"
  | "METHOD_NOT_ALLOWED"
  | "SERVER_ERROR";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type FieldName = "name" | "email" | "message";

export function ContactForm({ content }: { content: ContactContent }) {
  const { form, feedback } = content;

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [invalid, setInvalid] = useState<FieldName[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    message: `${uid}-message`,
    honeypot: `${uid}-hp`,
    status: `${uid}-status`,
    nameError: `${uid}-name-error`,
    emailError: `${uid}-email-error`,
    messageError: `${uid}-message-error`,
  };

  function messageFor(code: ApiErrorCode): string {
    switch (code) {
      case "VALIDATION":
        return feedback.invalid;
      case "RATE_LIMITED":
        return feedback.rateLimited;
      case "BAD_REQUEST":
      case "UNSUPPORTED_MEDIA_TYPE":
      case "FORBIDDEN_ORIGIN":
      case "PAYLOAD_TOO_LARGE":
      case "METHOD_NOT_ALLOWED":
        return feedback.rejected;
      case "SERVER_ERROR":
      default:
        return feedback.serverError;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status.kind === "submitting") return;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
    };

    // Checagem local = usabilidade, não segurança (qualquer um a remove no
    // DevTools). Existe para o visitante não gastar a cota do rate limit
    // em typos: o limite é checado ANTES da validação no servidor.
    const localErrors = validateLocally(payload);
    if (localErrors.length > 0) {
      setInvalid(localErrors);
      setStatus({ kind: "error", message: feedback.invalid });
      return;
    }

    setStatus({ kind: "submitting" });
    setInvalid([]);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus({ kind: "success" });
        formRef.current?.reset();
        return;
      }

      const body: unknown = await response.json().catch(() => null);
      const code = extractCode(body);

      if (code === "VALIDATION") {
        setInvalid(extractFields(body));
      }

      setStatus({ kind: "error", message: messageFor(code) });
    } catch {
      setStatus({ kind: "error", message: feedback.network });
    }
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">

      <fieldset disabled={submitting} className="space-y-5 border-0 p-0">
        <legend className="sr-only">{form.legend}</legend>

        <Field
          id={ids.name}
          errorId={ids.nameError}
          name="name"
          label={form.nameLabel}
          placeholder={form.namePlaceholder}
          autoComplete="name"
          maxLength={LIMITS.name.max}
          invalid={invalid.includes("name")}
          errorMessage={form.fieldErrors.name}
        />

        <Field
          id={ids.email}
          errorId={ids.emailError}
          name="email"
          type="email"
          label={form.emailLabel}
          placeholder={form.emailPlaceholder}
          autoComplete="email"
          maxLength={LIMITS.email.max}
          invalid={invalid.includes("email")}
          errorMessage={form.fieldErrors.email}
        />

        <Field
          id={ids.message}
          errorId={ids.messageError}
          name="message"
          label={form.messageLabel}
          placeholder={form.messagePlaceholder}
          maxLength={LIMITS.message.max}
          invalid={invalid.includes("message")}
          errorMessage={form.fieldErrors.message}
          multiline
        />

        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor={ids.honeypot}>{form.honeypotLabel}</label>
          <input
            id={ids.honeypot}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="submit"
            className="rounded-md bg-accent px-6 py-2.5 font-mono text-sm font-semibold text-page transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? form.submitting : form.submit}
          </button>

          <p className="font-mono text-xs text-muted">{form.requiredHint}</p>
        </div>
      </fieldset>

      <p
        id={ids.status}
        role="status"
        aria-live="polite"
        className={
          status.kind === "success"
            ? "text-sm text-success"
            : status.kind === "error"
              ? "text-sm text-danger"
              : "sr-only"
        }
      >
        {status.kind === "success" && feedback.success}
        {status.kind === "error" && status.message}
        {status.kind === "submitting" && form.submitting}
      </p>
    </form>
  );
}

function Field({
  id,
  errorId,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  maxLength,
  invalid,
  errorMessage,
  multiline = false,
}: {
  id: string;
  errorId: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  maxLength: number;
  invalid: boolean;
  errorMessage: string;
  multiline?: boolean;
}) {
  const base =
    "w-full rounded-md border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-line-strong transition-colors focus:outline-none";
  const border = invalid
    ? "border-danger focus:border-danger"
    : "border-line focus:border-accent";

  const shared = {
    id,
    name,
    placeholder,
    required: true,
    maxLength,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? errorId : undefined,
    className: `${base} ${border}`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-xs text-muted">
        {label}
      </label>

      {multiline ? (
        <textarea {...shared} rows={5} className={`${shared.className} resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}

      {invalid && (
        <p id={errorId} className="mt-1.5 text-xs text-danger">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLocally(payload: {
  name: string;
  email: string;
  message: string;
}): FieldName[] {
  const errors: FieldName[] = [];

  if (
    payload.name.length < LIMITS.name.min ||
    payload.name.length > LIMITS.name.max
  ) {
    errors.push("name");
  }

  if (
    payload.email.length < LIMITS.email.min ||
    payload.email.length > LIMITS.email.max ||
    !EMAIL_SHAPE.test(payload.email)
  ) {
    errors.push("email");
  }

  if (
    payload.message.length < LIMITS.message.min ||
    payload.message.length > LIMITS.message.max
  ) {
    errors.push("message");
  }

  return errors;
}

function extractCode(body: unknown): ApiErrorCode {
  if (body !== null && typeof body === "object" && "error" in body) {
    const value = (body as { error: unknown }).error;
    if (typeof value === "string") return value as ApiErrorCode;
  }
  return "SERVER_ERROR";
}

function extractFields(body: unknown): FieldName[] {
  if (body === null || typeof body !== "object" || !("fields" in body)) return [];

  const value = (body as { fields: unknown }).fields;
  if (!Array.isArray(value)) return [];

  return value.filter(
    (field): field is FieldName =>
      field === "name" || field === "email" || field === "message",
  );
}
