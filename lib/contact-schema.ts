import { z } from "zod";
import { CONTACT_FIELDS, HONEYPOT_FIELD, LIMITS, type ContactField } from "./contact-fields";

export { LIMITS, MAX_BODY_BYTES, HONEYPOT_FIELD, CONTACT_FIELDS } from "./contact-fields";
export type { ContactField } from "./contact-fields";

// Proibir caractere de controle em name/email fecha a injeção de cabeçalho
// de e-mail: um nome com quebra de linha permitiria inserir um Bcc quando o
// Resend for plugado. Em message a quebra de linha é legítima: por isso
// existem duas regexes diferentes.
const CONTROL_CHARS_ANY = /[\u0000-\u001F\u007F]/;

const CONTROL_CHARS_EXCEPT_NEWLINE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export const contactSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(LIMITS.name.min)
    .max(LIMITS.name.max)
    .refine((value) => !CONTROL_CHARS_ANY.test(value), {
      error: "control characters are not allowed",
    }),

  email: z
    .string()
    .trim()
    .min(LIMITS.email.min)
    .max(LIMITS.email.max)
    .refine((value) => !CONTROL_CHARS_ANY.test(value), {
      error: "control characters are not allowed",
    })
    .pipe(z.email()),

  message: z
    .string()
    .trim()
    .min(LIMITS.message.min)
    .max(LIMITS.message.max)
    .refine((value) => !CONTROL_CHARS_EXCEPT_NEWLINE.test(value), {
      error: "control characters are not allowed",
    }),

  // O honeypot ACEITA valor preenchido de propósito. Trocar por .max(0)
  // faria a API responder 422 e entregaria ao bot que existe uma
  // armadilha. Quem decide o que fazer com ele é o route.ts.
  [HONEYPOT_FIELD]: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export function invalidFields(error: z.ZodError): ContactField[] {
  const fields = new Set<ContactField>();

  for (const issue of error.issues) {
    const first = issue.path[0];
    if (typeof first === "string" && isContactField(first)) {
      fields.add(first);
    }
  }

  return CONTACT_FIELDS.filter((field) => fields.has(field));
}

function isContactField(value: string): value is ContactField {
  return (CONTACT_FIELDS as readonly string[]).includes(value);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;") // precisa ser o primeiro, senão escapa duas vezes
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
