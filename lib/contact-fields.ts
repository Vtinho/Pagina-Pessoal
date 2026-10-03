// Constantes do formulário de contato, separadas do schema de propósito.
//
// O formulário (componente de cliente) precisa dos limites para validar antes
// de chamar a API. Se ele importasse de contact-schema.ts, puxaria o Zod junto
// para o bundle do navegador — centenas de KB para usar dois números.
//
// Aqui não há nenhum import, então o cliente leva só estes valores.
// contact-schema.ts consome este arquivo e constrói o schema por cima.

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 254 }, // 254 é o máximo de um endereço válido (RFC 5321)
  message: { min: 10, max: 2000 },
} as const;

export const MAX_BODY_BYTES = 8 * 1024;

export const HONEYPOT_FIELD = "website";

export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
