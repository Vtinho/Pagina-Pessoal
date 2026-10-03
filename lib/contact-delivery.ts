import { escapeHtml, type ContactPayload } from "./contact-schema";

export interface DeliveryResult {
  delivered: boolean;
}

export async function deliverContactMessage(
  payload: ContactPayload,
): Promise<DeliveryResult> {
  console.info(
    "[contact] mensagem válida recebida",
    JSON.stringify({
      nameLength: payload.name.length,
      emailDomain: payload.email.split("@")[1] ?? "?",
      messageLength: payload.message.length,
      at: new Date().toISOString(),
    }),
  );

  return { delivered: true };

  /* =======================================================================
   * TODO: LIGAR O ENVIO DE E-MAIL COM RESEND
   * =======================================================================
   *
   * PASSO A PASSO
   *
   * 1. Crie a conta em resend.com e verifique o seu domínio (Domains > Add).
   *    Sem domínio verificado você só consegue enviar para o próprio e-mail
   *    de cadastro, e o e-mail cai em spam.
   *
   * 2. npm i resend
   *
   * 3. Preencha no .env.local e nas Environment Variables da Vercel:
   *      RESEND_API_KEY=re_xxxxxxxx
   *      CONTACT_TO_EMAIL=seu-email@exemplo.com
   *      CONTACT_FROM_EMAIL=site@seudominio.com   <- do domínio verificado
   *
   *    Note que NENHUMA delas tem o prefixo NEXT_PUBLIC_. Isso é
   *    proposital e é a parte de segurança deste passo: variável com
   *    NEXT_PUBLIC_ é injetada no JavaScript que vai para o navegador, ou
   *    seja, publicar a chave da API seria o mesmo que comitá-la.
   *
   * 4. Apague o `return { delivered: true }` acima e descomente:
   *
   *    import { Resend } from "resend";
   *
   *    const apiKey = process.env.RESEND_API_KEY;
   *    const to = process.env.CONTACT_TO_EMAIL;
   *    const from = process.env.CONTACT_FROM_EMAIL;
   *
   *    // Se faltar configuração, NÃO quebre o site: registre e devolva
   *    // false. O visitante vê a mensagem de erro genérica e você descobre
   *    // pelo log — melhor que uma exceção 500 em produção.
   *    if (!apiKey || !to || !from) {
   *      console.error("[contact] envio não configurado");
   *      return { delivered: false };
   *    }
   *
   *    try {
   *      const resend = new Resend(apiKey);
   *      const { error } = await resend.emails.send({
   *        from,
   *        to,
   *
   *        // ATENÇÃO AOS TRÊS PONTOS DE SEGURANÇA ABAIXO:
   *
   *        // (a) replyTo recebe o e-mail de quem escreveu, para você
   *        //     responder com um clique. O campo `from` continua sendo o
   *        //     SEU domínio — nunca coloque o e-mail do visitante em
   *        //     `from`, ou o seu domínio começa a falhar em SPF/DKIM e a
   *        //     sua reputação de envio vai junto.
   *        replyTo: payload.email,
   *
   *        // (b) O assunto é texto fixo. Não interpole o nome aqui: o
   *        //     assunto vira um cabeçalho de e-mail, e é exatamente por
   *        //     isso que o schema já proíbe \r e \n em `name`.
   *        subject: "Nova mensagem pelo portfólio",
   *
   *        // (c) escapeHtml em TODO campo que vem do visitante. Sem isso,
   *        //     uma mensagem com <img src=x onerror=...> viraria HTML ativo
   *        //     no SEU cliente de e-mail. É o mesmo raciocínio do XSS, só
   *        //     que a vítima é você.
   *        html: buildEmailHtml(payload),
   *
   *        // Versão em texto puro: alguns clientes preferem, e ela não tem
   *        //     como executar nada.
   *        text: buildEmailText(payload),
   *      });
   *
   *      if (error) {
   *        // Registra o erro do provedor no SERVIDOR e devolve só um
   *        // booleano. O detalhe nunca vai para a resposta HTTP.
   *        console.error("[contact] falha no envio:", error.message);
   *        return { delivered: false };
   *      }
   *
   *      return { delivered: true };
   *    } catch (err) {
   *      console.error("[contact] exceção no envio:", err);
   *      return { delivered: false };
   *    }
   * ===================================================================== */
}

export function buildEmailHtml(payload: ContactPayload): string {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const message = escapeHtml(payload.message).replace(/\n/g, "<br>");

  return [
    "<h2>Nova mensagem pelo portfólio</h2>",
    `<p><strong>Nome:</strong> ${name}</p>`,
    `<p><strong>E-mail:</strong> ${email}</p>`,
    "<hr>",
    `<p>${message}</p>`,
  ].join("\n");
}

export function buildEmailText(payload: ContactPayload): string {
  return [
    "Nova mensagem pelo portfólio",
    "",
    `Nome:   ${payload.name}`,
    `E-mail: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");
}
