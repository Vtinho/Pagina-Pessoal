# Portfólio — Vitor Manzotti

Portfólio pessoal bilíngue (PT/EN) de Data Analyst e Automação de Processos.

🔗 **[vitormanzotti.vercel.app](https://vitormanzotti.vercel.app)**

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zod · Vitest

Sem banco de dados, sem biblioteca de UI e sem recurso de terceiros — todas as
fontes e scripts são servidos pelo próprio domínio.

## Segurança

É um requisito do projeto, não um detalhe. O site explica cada medida na
página **Segurança**; em resumo:

- Content-Security-Policy com nonce por requisição, sem `unsafe-eval`
- HSTS, `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy
- `/api/contact` com validação no servidor, checagem de Origin, honeypot,
  rate limit por IP e mensagens de erro genéricas
- [security.txt](public/.well-known/security.txt) para reporte de vulnerabilidade
- 113 testes automatizados cobrindo a API, os headers, as rotas e a paridade PT/EN

Encontrou uma falha? O canal de contato está no `security.txt`.

## Licença

Código sob [MIT](LICENSE). O conteúdo pessoal — textos e foto — não está incluído na licença.
