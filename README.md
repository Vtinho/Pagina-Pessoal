# Portfólio — Vitor Manzotti

Portfólio pessoal bilíngue (PT/EN) de Data Analyst / Automação de Processos,
com segurança da informação tratada como requisito e não como detalhe.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zod · Vitest
· tsParticles — sem banco de dados, sem biblioteca de UI, sem CDN de terceiros.

---

## Índice

1. [Rodar o projeto](#1-rodar-o-projeto)
2. [Onde editar o conteúdo](#2-onde-editar-o-conteúdo)
3. [Trocar foto e currículos](#3-trocar-foto-e-currículos)
4. [Adicionar um projeto](#4-adicionar-um-projeto)
5. [Deploy na Vercel com domínio próprio](#5-deploy-na-vercel-com-domínio-próprio)
6. [Segurança: o que está implementado](#6-segurança-o-que-está-implementado)
7. [Exceções da CSP](#7-exceções-da-csp)
8. [CHECKLIST DE SEGURANÇA MANUAL](#8-checklist-de-segurança-manual)
9. [Testes](#9-testes)
10. [Ligar o envio de e-mail (Resend)](#10-ligar-o-envio-de-e-mail-resend)
11. [Plugar a API em Python (FastAPI no Render)](#11-plugar-a-api-em-python-fastapi-no-render)
12. [Estrutura de pastas](#12-estrutura-de-pastas)

---

## 1. Rodar o projeto

Precisa de **Node.js 20 ou superior** (o projeto foi desenvolvido e testado no
Node 24).

```bash
npm install
cp .env.example .env.local     # no Windows: copy .env.example .env.local
npm run dev
```

Abra <http://localhost:3000>. Você é redirecionado para `/pt` ou `/en` conforme
o idioma do seu navegador.

| Comando             | O que faz                                                      |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento com hot reload                      |
| `npm run build`     | Build de produção (falha se houver erro de tipo)                |
| `npm start`         | Sobe o build de produção — **use este para testar os headers**  |
| `npm test`          | Roda a suíte de testes uma vez                                  |
| `npm run test:watch`| Testes em modo observador                                       |
| `npm run typecheck` | Só a checagem de tipos, sem build                               |
| `npm run audit`     | Falha se houver vulnerabilidade alta nas dependências           |

> **Atenção ao testar segurança:** os headers em `npm run dev` são
> propositalmente mais frouxos que em produção — o modo de desenvolvimento
> precisa de `'unsafe-eval'` para o hot reload funcionar. Sempre valide com
> `npm run build && npm start`.

### Windows: "a execução de scripts foi desabilitada neste sistema"

Se o PowerShell recusar o `npm` com `PSSecurityException`, é a *execution
policy* do Windows bloqueando o `npm.ps1`. O padrão em Windows cliente é
`Restricted`, que não deixa rodar nenhum `.ps1`.

Três saídas, da que não muda nada para a definitiva:

```powershell
# 1. Sem mudar nada: chame o .cmd, que não é script do PowerShell
npm.cmd run dev

# 2. Só nesta janela (volta ao normal quando você fechar)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 3. Definitivo, para o seu usuário (NÃO precisa de admin)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

A opção 3 é a que a Microsoft recomenda para quem desenvolve. `RemoteSigned`
significa: script que você escreveu localmente roda; script **baixado da
internet** só roda se tiver assinatura digital válida. É bem menos permissivo
que `Bypass` ou `Unrestricted` — não deixe em `Bypass` de forma permanente.

> **Primeiro build precisa de internet.** O `next/font` baixa os arquivos das
> fontes uma vez e passa a servi-los do seu próprio domínio. Depois disso fica
> em cache.

---

## 2. Onde editar o conteúdo

**Todo o texto do site vive em dois arquivos.** Não há texto escrito dentro de
componente — se você encontrar uma frase em um `.tsx`, é bug.

```
content/
├── types.ts      <- o CONTRATO. Define quais campos existem.
├── site.pt.ts    <- textos em português   (idioma padrão)
├── site.en.ts    <- textos em inglês
└── index.ts      <- junta os dois
```

### A garantia que impede tradução esquecida

`site.pt.ts` e `site.en.ts` são anotados com a mesma interface `SiteContent`:

```ts
export const pt: SiteContent = { ... };
```

Consequência prática: **faltar um campo em um idioma é erro de compilação**, e
`npm run build` falha. Não existe cenário em que você publique o site com
metade da tradução faltando.

O que o TypeScript **não** consegue ver acontece dentro de arrays (um idioma com
2 projetos e o outro com 3, por exemplo). Isso é coberto por
`tests/content-parity.test.ts`.

### Para adicionar um campo novo ao site

1. Adicione o campo em `content/types.ts`.
2. Rode `npm run typecheck`. Ele vai apontar os dois arquivos a preencher.
3. Preencha em `site.pt.ts` e `site.en.ts`.
4. Use no componente.

Nessa ordem. Começar pelo componente funciona, mas você perde a checagem que
garante os dois idiomas.

### Encontrar o que falta preencher

Tudo que ainda precisa da sua informação está marcado com `// TODO`:

```bash
# PowerShell
Select-String -Path content\*.ts -Pattern "TODO"

# bash / git bash
grep -rn "TODO" content/
```

O `npm test` também imprime a lista de campos com placeholder a cada execução.

---

## 3. Trocar foto e currículos

| O quê      | Arquivo atual                 | O que fazer                                                                |
| ---------- | ----------------------------- | -------------------------------------------------------------------------- |
| Foto       | `public/foto-placeholder.png` | Coloque a sua (800×800, quadrada) em `public/` e ajuste o `src` em `components/About.tsx` |
| CV (PT)    | `public/cv-pt.pdf`            | Substitua o arquivo. O nome não muda.                                       |
| CV (EN)    | `public/cv-en.pdf`            | Substitua o arquivo. O nome não muda.                                       |

Os dois PDFs atuais são placeholders válidos — o botão "Baixar CV" já funciona,
só entrega um PDF dizendo que é placeholder.

O recorte da foto é circular, então **centralize o rosto**. O texto alternativo
fica em `content/site.*.ts` → `about.photoAlt`.

---

## 4. Adicionar um projeto

Em `content/site.pt.ts`, dentro de `projects.items`, copie um bloco:

```ts
{
  id: "nome-unico-do-projeto",   // precisa ser IGUAL em site.en.ts
  title: "Título do projeto",
  problem: "O que estava errado antes. Seja concreto.",
  solution: "O que você construiu.",
  stack: ["Python", "pandas", "MySQL"],
  result: "O que mudou. Com número, sempre que possível.",
  repoUrl: "https://github.com/Vtinho/repo",   // omita a chave se for privado
  demoUrl: "https://...",                       // omita a chave se não houver
  year: "2025",
},
```

Depois **repita o mesmo bloco em `site.en.ts`**, traduzindo os textos e mantendo
`id`, `stack`, `year` e as URLs idênticos. O teste de paridade verifica isso.

Dica sobre o campo `result`: "otimizei o processo" não diz nada; "de 8h para
10min, sem erro de digitação" é o que fica na cabeça de quem lê.

---

## 5. Deploy na Vercel com domínio próprio

### 5.1 Subir o código

```bash
git init
git add .
git commit -m "portfolio inicial"
git branch -M main
git remote add origin https://github.com/Vtinho/SEU-REPO.git
git push -u origin main
```

Confirme que `.env.local` **não** foi comitado (`git status` não deve mostrá-lo).

### 5.2 Importar na Vercel

1. <https://vercel.com/new> → importe o repositório.
2. A Vercel detecta Next.js sozinha. Não mude nada nas configurações de build.
3. Em **Environment Variables**, adicione antes do primeiro deploy:

   | Nome                   | Valor                       | Ambientes            |
   | ---------------------- | --------------------------- | -------------------- |
   | `NEXT_PUBLIC_SITE_URL` | `https://seudominio.com`    | Production           |

   Sem essa variável o site funciona, mas o sitemap, as tags Open Graph e os
   links dos scanners de segurança apontam para `localhost`.

4. Deploy.

### 5.3 Domínio próprio

1. Project → **Settings → Domains** → adicione `seudominio.com`.
2. No seu registrador (Registro.br, Cloudflare, Namecheap...), crie os
   registros que a Vercel mostrar — normalmente:
   - `A` de `@` apontando para `76.76.21.21`
   - `CNAME` de `www` apontando para `cname.vercel-dns.com`
3. A Vercel emite o certificado TLS automaticamente. Pode levar alguns minutos.
4. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio final e faça um **redeploy**
   (variável de ambiente só entra em vigor em build novo).

### 5.4 Depois do deploy — não pule

- [ ] Trocar o e-mail e o domínio em `public/.well-known/security.txt`
- [ ] Trocar o e-mail em `content/site.pt.ts` e `site.en.ts` (`contact.email`)
- [ ] Apontar `footer.sourceUrl` para o repositório de verdade
- [ ] Rodar o [checklist de segurança](#8-checklist-de-segurança-manual)
- [ ] Submeter o sitemap no Google Search Console (`https://seudominio.com/sitemap.xml`)

---

## 6. Segurança: o que está implementado

A seção "Segurança" do próprio site explica cada medida em linguagem simples —
é conteúdo do portfólio. Aqui fica o mapa técnico, para quem vai mexer no código.

| Medida | Onde |
| --- | --- |
| CSP com nonce por requisição, sem `unsafe-eval` | `lib/security.ts` + `proxy.ts` |
| HSTS 2 anos, `includeSubDomains`, `preload` | `lib/security.ts` |
| `frame-ancestors 'none'` + `X-Frame-Options: DENY` | `lib/security.ts` |
| `X-Content-Type-Options: nosniff` | `lib/security.ts` |
| `Referrer-Policy: strict-origin-when-cross-origin` | `lib/security.ts` |
| `Permissions-Policy` (câmera, mic, geo, USB... desligados) | `lib/security.ts` |
| COOP / CORP `same-origin` | `lib/security.ts` |
| Headers em assets estáticos | `next.config.ts` |
| Validação no servidor com Zod, limites de tamanho | `lib/contact-schema.ts` |
| Proibição de caractere de controle (anti header injection) | `lib/contact-schema.ts` |
| Só POST, só `application/json`, `Origin` conferido | `app/api/contact/route.ts` |
| Honeypot | `components/ContactForm.tsx` + `route.ts` |
| Rate limit por IP | `lib/rate-limit.ts` |
| Erros genéricos, sem stack trace | `app/api/contact/route.ts` |
| Escape de HTML no corpo do e-mail | `lib/contact-delivery.ts` |
| `security.txt` (RFC 9116) | `public/.well-known/security.txt` |
| Dependabot + `npm run audit` | `.github/dependabot.yml` |
| Segredos só em env, `.env` no gitignore | `.env.example` |
| Zero recurso de terceiro (fontes self-hosted) | `app/layout.tsx` |

### Sobre o nome `proxy.ts`

Até o Next.js 15 este arquivo se chamava `middleware.ts`. No Next.js 16 a
convenção passou a ser **`proxy.ts`**, exportando uma função `proxy`. É o mesmo
mecanismo — código que roda antes de toda requisição. `middleware.ts` ainda
funciona, mas imprime aviso de deprecação a cada build.

### Custo do nonce: renderização dinâmica

Um nonce muda a cada requisição, então o Next **não consegue** pré-gerar HTML
estático das páginas — elas viram `ƒ (Dynamic)` no output do build. Para um
portfólio isso é irrelevante (a página é leve e a Vercel responde em
milissegundos).

Se algum dia pesar, a alternativa é trocar nonce por **hashes** de script no
CSP e recuperar o HTML estático. Fica registrado aqui para você não descobrir
isso do zero depois.

---

## 7. Exceções da CSP

A política está em `lib/security.ts`. Existe **uma
única exceção**, e ela é consciente:

### `style-src 'self' 'unsafe-inline'`

**Por quê:** o Next.js injeta tags `<style>` inline (CSS crítico e, em
desenvolvimento, o CSS do hot reload) sem aplicar o nonce nelas. Trocar por
nonce quebra o estilo de forma silenciosa em algumas rotas — o site carrega sem
CSS e nada avisa.

**Qual é o risco real:** CSS injetado consegue deformar o layout e, em ataques
elaborados, exfiltrar dados **já visíveis na página** através de seletores de
atributo e requisições de background-image. É um risco real, porém bem menor
que o de script — **CSS não executa JavaScript**.

**O que continua fechado:** `script-src` **não** tem `'unsafe-inline'` nem
`'unsafe-eval'`. A diretiva que de fato barra XSS permanece estrita.

Há um teste (`tests/security-headers.test.ts`) que trava essa decisão: se
alguém remover a exceção, o teste falha e aponta para cá.

### O que foi deixado de fora de propósito

- **`Cross-Origin-Embedder-Policy: require-corp`** — só faz sentido para quem
  precisa de `SharedArrayBuffer`, e quebra qualquer recurso cross-origin sem
  CORP explícito. Custo alto, benefício zero aqui. Scanner não penaliza.
- **`X-XSS-Protection`** — descontinuado. Em navegadores antigos o filtro
  chegou a **criar** vulnerabilidades. Nenhum scanner atual exige.

---

## 8. CHECKLIST DE SEGURANÇA MANUAL

Rode isto **depois de cada deploy que mexa em headers, na API ou em
dependências**. Ferramenta automática não substitui olhar — ela testa
configuração, não lógica.

### 8.1 Mozilla HTTP Observatory

<https://developer.mozilla.org/en-US/observatory>

1. Digite o seu domínio e rode a análise.
2. **Meta: A+.**
3. Se a nota vier abaixo disso, compare o relatório com a tabela da seção 6 —
   provavelmente algum header sumiu.

> A seção "Segurança" do site já mostra um link direto com o seu domínio
> preenchido, para você exibir o resultado a quem visita.

### 8.2 securityheaders.com

<https://securityheaders.com>

1. Analise o domínio com **"Follow redirects"** marcado.
2. **Meta: A+.**
3. Confirme item a item: CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
   Referrer-Policy, Permissions-Policy.

### 8.3 Conferência rápida pelo terminal

```bash
curl -sI https://seudominio.com/pt | grep -i -E "content-security|strict-transport|x-frame|x-content-type|referrer|permissions"
```

Confirme também que o nonce **muda** entre duas requisições:

```bash
curl -sI https://seudominio.com/pt | grep -i content-security-policy
curl -sI https://seudominio.com/pt | grep -i content-security-policy
# os valores de 'nonce-...' têm de ser diferentes
```

Nonce repetido significa que a geração quebrou — e uma CSP com nonce fixo não
protege nada.

### 8.4 Burp Suite — formulário de contato

Community Edition basta.

**Preparação:** configure o navegador para usar o proxy do Burp (127.0.0.1:8080)
e instale o certificado CA do Burp.

Envie uma mensagem normal, capture a requisição para `POST /api/contact` e mande
para o **Repeater** (Ctrl+R). A partir dela, teste cada linha:

| # | O que alterar na requisição | Resposta esperada |
| - | --------------------------- | ----------------- |
| 1 | Nada (linha de base) | `200 {"ok":true}` |
| 2 | Trocar o método para `GET` | `405` + header `Allow: POST` |
| 3 | `Content-Type: text/plain` | `415 UNSUPPORTED_MEDIA_TYPE` |
| 4 | Remover o header `Content-Type` | `415` |
| 5 | `Origin: https://atacante.net` | `403 FORBIDDEN_ORIGIN` |
| 6 | Remover o header `Origin` | `403` |
| 7 | Apagar o campo `message` | `422` com `fields: ["message"]` |
| 8 | `"email": "nao-e-email"` | `422` com `fields: ["email"]` |
| 9 | `message` com 50.000 caracteres | `413 PAYLOAD_TOO_LARGE` |
| 10 | Corpo `{{{` (JSON quebrado) | `400`, **sem** mensagem de parser |
| 11 | Adicionar `"isAdmin": true` | `422`, e `isAdmin` **não** aparece na resposta |
| 12 | `"website": "spam"` (honeypot) | `200 {"ok":true}` — e **nenhum e-mail chega** |
| 13 | `"name": "Ana\r\nBcc: x@y.com"` | `422` (injeção de cabeçalho barrada) |
| 14 | Enviar 6 vezes seguidas | da 6ª em diante: `429` + `Retry-After` |
| 15 | `"message": "<script>alert(1)</script>"` | `200` — aceito como texto; confira que chega **escapado** no e-mail |

**O que procurar em toda resposta:** stack trace, caminho de arquivo, nome de
biblioteca, versão, mensagem do Zod. Nada disso pode aparecer. Se aparecer,
algo mudou em `route.ts`.

**Intruder (opcional):** use o Sniper no campo `email` com a lista de payloads
de XSS do Burp e confirme que nenhuma resposta muda de comportamento — todas
devem dar `422` (formato inválido) ou `200` (texto aceito), nunca `500`.

### 8.5 OWASP ZAP — varredura automatizada

1. Baixe em <https://www.zaproxy.org>.
2. **Automated Scan** → cole a URL → **Attack**.
3. Aceite o *spider* e o *passive scan*.

**Faça a varredura contra o ambiente local** (`npm run build && npm start`),
não contra a produção: scanner ativo gera muita requisição e pode fazer a
Vercel te limitar por rate limit — além de sujar suas métricas.

**Resultado esperado:** nenhum alerta Alto ou Médio. Alertas Baixos e
Informativos comuns e aceitáveis neste projeto:

- *"Storable and Cacheable Content"* nas páginas públicas — é conteúdo público
  mesmo; a rota `/api/contact` já responde `no-store`.
- *"Cross-Domain JavaScript Source File Inclusion"* — falso positivo, não há
  script de terceiro. Confirme que todo `src` é do seu domínio.

Se aparecer um alerta Alto ou Médio, ele é real até prova em contrário.
Investigue antes do próximo deploy.

### 8.6 Dependências

```bash
npm run audit
```

Falha em vulnerabilidade **alta ou crítica**. O Dependabot abre PR
automaticamente toda segunda-feira; revise e faça merge.

### 8.7 Acessibilidade (conta como qualidade, e o AA é requisito)

No Chrome: DevTools → **Lighthouse** → marque *Accessibility* → analise.

- Alvo: **90+**, idealmente 100.
- Teste também **só com o teclado**: Tab do topo ao rodapé. O primeiro Tab tem
  de revelar "Pular para o conteúdo", e o foco tem de estar **sempre visível**.
- Ative o "reduzir movimento" no sistema operacional e recarregue: as partículas
  do fundo devem **sumir** e o efeito de digitação deve parar.

> **Um alerta que pode aparecer e é esperado:** o campo honeypot do formulário
> fica dentro de um container `aria-hidden="true"` e é tecnicamente focável
> (`tabindex="-1"`). Dependendo da versão, a regra `aria-hidden-focus` do axe
> pode sinalizar isso. É o padrão consagrado de honeypot e o campo não está na
> ordem do Tab — a alternativa (`display: none`) é justamente a que vários bots
> sabem detectar e pular. Se o alerta aparecer, é conhecido e aceito.

---

## 9. Testes

```bash
npm test
```

100 testes em três arquivos:

| Arquivo | O que cobre |
| --- | --- |
| `tests/contact-api.test.ts` | A API inteira: payload válido, campos faltando, campos gigantes, e-mail inválido, honeypot, método errado, Content-Type errado, Origin de terceiro, rate limit, XSS/HTML injection, injeção de cabeçalho de e-mail, vazamento de informação em mensagem de erro |
| `tests/security-headers.test.ts` | Todos os headers, entropia e unicidade do nonce, ausência de `unsafe-eval`/`unsafe-inline` em `script-src`, redirecionamento por `Accept-Language`, `isAllowedOrigin` |
| `tests/content-parity.test.ts` | `site.pt.ts` e `site.en.ts` com a mesma forma, mesmos níveis de skill, mesmos ids, traduções que não ficaram para trás |

Os testes chamam as funções reais (`POST`, `proxy`) direto, sem subir servidor —
rodam em menos de um segundo.

Há um teste propositalmente desativado em `content-parity.test.ts`: "não sobrou
nenhum TODO no conteúdo". Apague o `.skip` quando terminar de preencher tudo, e
ele passa a impedir que um placeholder escape para produção.

### Integração contínua

`.github/workflows/ci.yml` roda **tipos + testes + build + `npm audit`** em todo
push na `main` e em todo pull request.

Isso importa especialmente por causa do Dependabot: ele abre PR de atualização
toda semana, e sem CI cada um desses PRs chegaria sem nenhuma verificação. Com o
workflow, um pacote que quebre o build é pego antes de você clicar em merge.

**Depois do primeiro push, ative a proteção do branch** no GitHub —
*Settings → Branches → Add rule* para `main`, marcando *Require status checks to
pass before merging* e selecionando os jobs `verify` e `audit`. Sem essa regra o
CI roda mas não bloqueia nada.

### O que NÃO é testado automaticamente

Por honestidade, para você saber onde está o buraco:

- **Nenhum teste de componente React.** Não há jsdom nem testing-library no
  projeto (decisão de manter a árvore de dependências pequena). O formulário é
  validado pela suíte da API e à mão pelo checklist da seção 8.
- **Nada visual.** Não há teste de regressão de layout.
- **A validação local do formulário** (`validateLocally` em `ContactForm.tsx`)
  não tem teste próprio. Ela importa os limites de `lib/contact-schema.ts`, o
  mesmo objeto que o servidor usa, então os dois lados não divergem quando você
  mudar um limite — mas o formato de e-mail é checado por uma regex simples ali
  e por `z.email()` no servidor, e essas duas regras **podem** discordar em
  casos exóticos. Na prática o servidor é quem decide, então o pior cenário é a
  API recusar algo que o cliente deixou passar — que é a direção segura.

---

## 10. Ligar o envio de e-mail (Resend)

Hoje `/api/contact` valida, aplica todas as proteções e responde sucesso — mas
não envia e-mail. O passo a passo completo está no bloco TODO dentro de
**`lib/contact-delivery.ts`**, incluindo os três pontos de segurança do envio
(`replyTo` em vez de `from`, assunto fixo, escape de HTML).

Resumo:

```bash
npm i resend
```

```bash
# .env.local e Environment Variables da Vercel
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=seu-email@exemplo.com
CONTACT_FROM_EMAIL=site@seudominio.com
```

Nenhuma dessas variáveis tem prefixo `NEXT_PUBLIC_` — **isso é proposital**.
Variável com esse prefixo é embutida no JavaScript que vai para o navegador;
publicar a chave da API seria equivalente a comitá-la.

### Rate limit confiável (Upstash Redis)

O rate limit atual é em memória e **não é confiável em serverless** — o motivo
completo está no cabeçalho de `lib/rate-limit.ts`, junto com o código de
substituição pronto. Resumo: a Vercel roda várias instâncias, cada uma com o
próprio contador.

Quando o formulário começar a receber spam de verdade, migre. Antes disso,
o que está lá resolve o caso comum.

---

## 11. Plugar a API em Python (FastAPI no Render)

`lib/api.ts` já está escrito para isso, com um exemplo de uso comentado no fim
do arquivo. A decisão importante — **quem chama a API, o servidor ou o
navegador** — está explicada logo abaixo.

Resumo: chame **pelo servidor** (Server Component ou Route Handler). O token
nunca chega ao cliente, não há CORS para configurar e a CSP nem entra na
história.

```bash
# .env.local
DATA_API_BASE_URL=https://sua-api.onrender.com
DATA_API_TOKEN=...
```

Se algum dia você precisar chamar direto do navegador, a origem da API tem de
entrar em `connect-src` — `lib/security.ts` já faz isso automaticamente a partir
de `DATA_API_BASE_URL`.

O checklist do lado do Python (autenticação com `compare_digest`, CORS restrito,
rate limit, `/docs` desligado em produção) está no topo de `lib/api.ts`.

---

## 12. Estrutura de pastas

```
.
├── .github/
│   ├── dependabot.yml            PRs semanais de atualização
│   └── workflows/ci.yml          tipos + testes + build + audit em todo PR
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx            metadata + hreflang por idioma
│   │   ├── page.tsx              a página: monta as 7 seções
│   │   ├── error.tsx             limite de erro, sem vazar stack trace
│   │   └── opengraph-image.tsx   card de compartilhamento, gerado por código
│   ├── api/contact/route.ts      o back-end leve
│   ├── globals.css               TOKENS DE DESIGN (cores num lugar só)
│   ├── icon.svg                  favicon (o Next injeta o <link> sozinho)
│   ├── layout.tsx                <html>, fontes self-hosted
│   ├── not-found.tsx             404 bilíngue
│   ├── robots.ts                 -> /robots.txt
│   └── sitemap.ts                -> /sitemap.xml
├── components/                   um arquivo por seção + utilitários
├── content/
│   ├── types.ts                  O CONTRATO — comece por aqui
│   ├── site.pt.ts                textos em português
│   ├── site.en.ts                textos em inglês
│   └── index.ts
├── lib/
│   ├── security.ts               headers + CSP + nonce  (arquivo mais crítico)
│   ├── contact-schema.ts         validação com Zod
│   ├── contact-delivery.ts       stub de envio (plugar Resend aqui)
│   ├── rate-limit.ts             limite por IP
│   ├── i18n.ts                   idiomas, sem biblioteca
│   └── api.ts                    cliente da futura API em Python
├── public/
│   ├── .well-known/security.txt  canal de reporte de vulnerabilidade
│   ├── foto-placeholder.png
│   ├── cv-pt.pdf  /  cv-en.pdf
├── tests/
├── proxy.ts                      roda a cada requisição (era middleware.ts)
├── next.config.ts
├── LICENSE                       MIT para o código; conteúdo pessoal de fora
└── vitest.config.mts
```

### Onde você vai mexer com mais frequência

1. `content/site.pt.ts` e `content/site.en.ts` — textos
2. `app/globals.css` — cores e tipografia
3. `content/types.ts` — quando precisar de um campo novo

### O que NÃO mexer sem entender

- `lib/security.ts` — cada diretiva tem um motivo; eles estão explicados na
  seção 6 e na seção 7 deste README, não no arquivo
- `proxy.ts` — principalmente o `matcher`: cada caminho excluído passa a ser
  servido **sem CSP**

---

## Licença

Código sob licença MIT — sinta-se livre para usar de base.
O conteúdo (textos, foto, currículo) é pessoal e não está incluído.
