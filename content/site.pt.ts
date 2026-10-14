import type { SiteContent } from "./types";

/**
 * ===========================================================================
 * CONTEÚDO EM PORTUGUÊS  —  este é o arquivo que você mais vai editar
 * ===========================================================================
 *
 * A anotação `: SiteContent` abaixo é o que faz o TypeScript reclamar se
 * faltar campo. NÃO troque por `satisfies` nem remova a anotação: com
 * `satisfies` o erro de campo faltando também aparece, mas com a anotação
 * explícita a mensagem de erro é mais direta.
 *
 * Procure por "TODO" para achar tudo que ainda precisa da sua informação.
 * Traduziu algo aqui? Traduza o mesmo campo em site.en.ts.
 */
export const pt: SiteContent = {
  meta: {
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
    title: "Vitor Manzotti — Data Analyst e Automação de Processos",
    titleTemplate: "%s | Vitor Manzotti",
    // TODO: revisar. Ideal entre 150 e 160 caracteres para não cortar no Google.
    description:
      "Portfólio de Vitor Manzotti: análise de dados, automação de processos com Python e SQL, e estudos de segurança da informação. Ciência da Computação na UFABC.",
    keywords: [
      "data analyst",
      "análise de dados",
      "automação de processos",
      "Python",
      "SQL",
      "Power Automate",
      "segurança da informação",
      "UFABC",
      "Vitor Manzotti",
    ],
    ogImageAlt: "Vitor Manzotti — Data Analyst e Automação de Processos",
  },

  ui: {
    skipToContent: "Pular para o conteúdo",
    langSwitchLabel: "Selecionar idioma",
    langNames: { pt: "Português", en: "Inglês" },
    opensInNewTab: "abre em nova aba",
    navLabel: "Navegação principal",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    backToTop: "Voltar ao topo",
  },

  nav: {
    about: "Sobre",
    skills: "Skills",
    projects: "Projetos",
    security: "Segurança",
    contact: "Contato",
  },

  hero: {
    terminalTitle: "vitor@portfolio: ~",
    prompt: ">",
    typedCommands: [
      "vitor.analyze(data)",
      "vitor.automate(processo)",
      "vitor.secure(aplicação)",
    ],
    outputLines: [
      "carregando perfil... ok",
      "stack: Python · SQL · Power Automate",
    ],
    name: "Vitor Manzotti",
    role: "Data Analyst · Automação de Processos",
    // TODO: é a frase que o recrutador lê em 3 segundos. Reescreva quando tiver um número concreto para citar.
    tagline:
      "Transformo processos manuais em dados confiáveis e rotinas automatizadas — e me preocupo com a segurança do que construo.",
    actions: {
      github: "GitHub",
      linkedin: "LinkedIn",
      cv: "Baixar CV",
    },
    // TODO: colocar o PDF real em public/cv-pt.pdf
    cvPath: "/cv-pt.pdf",
  },

  about: {
    kicker: "01 / sobre",
    heading: "Sobre mim",
    // TODO: reescrever com a sua voz. Um parágrafo por item: o que faz hoje, como chegou aqui, para onde vai.
    bio: [
      "Sou estudante de Ciência da Computação na UFABC, com cerca de um ano de experiência em análise de dados e automação de processos.",
      "No dia a dia uso Python e SQL para extrair, limpar e cruzar dados que vivem espalhados em PDFs, e-mails e planilhas — e Power BI quando o número precisa virar decisão. Aplico isso hoje no setor de gás natural, que é onde os processos acontecem e não a minha especialidade: extrair, conciliar e analisar dado disperso é o mesmo problema em qualquer área.",
      "Em paralelo, estudo segurança da informação: laboratórios de segurança web e prática com ferramentas de análise. Este site é parte desse estudo — a seção de Segurança explica cada proteção que ele usa.",
    ],
    photoAlt: "Vitor Manzotti, de camisa clara, olhando para a câmera",
    education: {
      heading: "Formação",
      items: [
        {
          title: "Bacharelado em Ciência da Computação",
          org: "UFABC — Universidade Federal do ABC",
          period: "2022 — atual",
          bullets: [
            "Banco de Dados, Aprendizado de Máquina, Redes Neurais, Sistemas Distribuídos, Algoritmos e Estruturas de Dados e Otimização Linear.",
            "Iniciação científica: estudo de caso com análise de dados acadêmicos em Python e SQL.",
          ],
        },
      ],
    },
    experience: {
      heading: "Experiência",
      items: [
        {
          title: "Estagiário de Gestão e Automação de Processos",
          org: "Vora Energia S.A.",
          period: "ago/2025 — atual",
          bullets: [
            "Pipelines em Python (pdfplumber e expressões regulares) que processam cerca de 200 faturas de gás natural por mês em PDF, com arquitetura modular e testes em lote com faturas reais.",
            "Ferramenta de conciliação de faturas entre Excel e MySQL, com correspondência em duas etapas: por nota fiscal e, quando ela falha, por cliente, fornecedor e período.",
            "Macros VBA integradas ao MySQL via ODBC para importação de volumes diários e carga incremental de faturas, sem registros duplicados.",
            "Modelagem da precificação de contratos de gás indexados ao IPCA e ao Brent, e planilha de apuração de encargos de transporte (TAG) em Python — que corrigiu uma falha no cálculo de penalidades.",
            "Regras de extração campo a campo para um agente de IA de leitura de faturas, e fluxos de e-mail automatizados no Power Automate.",
          ],
        },
      ],
    },
  },

  skills: {
    kicker: "02 / skills",
    heading: "Ferramentas que eu uso",
    intro:
      "As ferramentas que eu uso de verdade no dia a dia, e o que faço com cada uma. Prefiro listar menos e poder falar sobre tudo em uma entrevista técnica.",
    groups: [
      {
        id: "data",
        label: "Dados",
        caption: "Extrair, limpar, cruzar e explicar.",
        skills: [
          { name: "Python", note: "Pandas, NumPy, Matplotlib" },
          { name: "SQL", note: "MySQL, PostgreSQL, HeidiSQL" },
          { name: "Extração de PDF", note: "pdfplumber, expressões regulares" },
          { name: "Web scraping", note: "BeautifulSoup" },
          { name: "Power BI", note: "relatórios e indicadores" },
          { name: "Excel / VBA", note: "macros, tabelas dinâmicas, ODBC" },
        ],
      },
      {
        id: "automation",
        label: "Automação",
        caption: "Tirar o humano do meio do caminho repetitivo.",
        skills: [
          { name: "Power Automate", note: "fluxos, conectores, aprovações" },
          { name: "GitHub Actions", note: "agendamento e integração contínua" },
          { name: "Git / GitHub", note: "branches, pull requests" },
          { name: "Docker", note: "ambientes reproduzíveis" },
          { name: "APIs REST", note: "Java, Spring Boot" },
          { name: "TypeScript", note: "Next.js — este site" },
        ],
      },
      {
        id: "security",
        label: "Segurança",
        caption: "Área que estudo — ver a seção de Segurança abaixo.",
        skills: [
          { name: "Segurança web (OWASP Top 10)", note: "XSS, injeção, CSRF" },
          { name: "Burp Suite", note: "proxy, repeater, intruder" },
          { name: "Hardening de aplicação", note: "CSP, headers, validação" },
        ],
      },
    ],
  },

  projects: {
    kicker: "03 / projetos",
    heading: "Projetos",
    intro:
      "Cada card segue a mesma estrutura: qual era o problema, o que eu construí, com o quê, e o que mudou depois.",
    labels: {
      problem: "Problema",
      solution: "Solução",
      stack: "Stack",
      result: "Resultado",
      repo: "Repositório",
      demo: "Demo",
    },
    emptyState: "Projetos chegando. Enquanto isso, o código deste site está no GitHub.",
    items: [
      // Sem `repoUrl`: sao projetos internos da empresa e o codigo nao e
      // publico. O card simplesmente nao mostra o botao de repositorio.
      {
        id: "monitor-contratos-anp",
        title: "Monitor de contratos de gás natural (ANP)",
        problem:
          "A ANP publica 197 contratos de gás natural e os altera sem aviso. Descobrir o que mudou exigia abrir a lista e comparar à mão, todo dia.",
        solution:
          "Monitor que lê as publicações duas vezes ao dia, compara com a leitura anterior e dispara e-mail apenas quando algo muda. Roda sem servidor, agendado pelo GitHub Actions, com tratamento de falha no envio.",
        stack: ["Python", "BeautifulSoup", "GitHub Actions", "API Resend"],
        result:
          "197 contratos acompanhados automaticamente, duas vezes ao dia, sem custo de infraestrutura e sem e-mail quando nada mudou.",
        year: "2026",
      },
      {
        id: "analise-dados-academicos",
        title: "Análise de dados acadêmicos (UFABC)",
        problem:
          "Dados de desempenho discente dispersos e em formato bruto, sem leitura possível para apoiar decisão.",
        solution:
          "Extração, tratamento e análise exploratória dos dados, com os padrões encontrados organizados em relatório. Trabalho de iniciação científica.",
        stack: ["Python", "Pandas", "Matplotlib", "SQL"],
        result: "Relatório com os padrões de desempenho que os dados brutos escondiam.",
        year: "2026",
      },
      {
        id: "dashboards-dados-publicos",
        title: "Dashboards de dados públicos",
        problem:
          "Dados públicos de finanças e saúde são volumosos e pouco acessíveis para quem precisa decidir com eles.",
        solution:
          "Relatórios visuais em Power BI que resumem os indicadores e permitem filtrar por recorte.",
        stack: ["Power BI", "Excel"],
        result: "Indicadores legíveis em uma tela, no lugar de planilhas brutas.",
        year: "2026",
      },
      {
        id: "api-biblioteca",
        title: "Sistema de gerenciamento de biblioteca",
        problem:
          "Exercício de back-end com um domínio de verdade: empréstimo de acervo, em vez do CRUD de exemplo.",
        solution:
          "API REST em Java com Spring Boot, persistência em banco SQL e ambiente containerizado.",
        stack: ["Java", "Spring Boot", "SQL", "Docker"],
        result: "API funcional, com ambiente reproduzível por Docker.",
        year: "2026",
      },
    ],
  },

  security: {
    kicker: "04 / segurança",
    heading: "Segurança da informação",
    intro:
      "É a área que eu estudo por fora do trabalho. Aqui mostro o que estou estudando e, depois, exatamente como este site foi protegido — porque falar de segurança sem aplicar é fácil.",

    studying: {
      heading: "O que estou estudando",
      intro: "Trilha atual, ferramentas e leituras.",
      items: [
        {
          id: "portswigger",
          title: "PortSwigger Web Security Academy",
          description:
            "Laboratórios práticos de vulnerabilidades web: SQL injection, XSS, CSRF, SSRF e controle de acesso.",
          tag: "laboratório",
          url: "https://portswigger.net/web-security",
          // TODO: atualize conforme avançar nos labs.
          progress: "39 labs concluídos — 26 apprentice, 13 practitioner",
        },
        {
          id: "burp",
          title: "Burp Suite",
          description:
            "Proxy de interceptação para inspecionar e reenviar requisições. Uso no Repeater para testar validação de formulários.",
          tag: "ferramenta",
          url: "https://portswigger.net/burp",
        },
        {
          id: "zap",
          title: "OWASP ZAP",
          description:
            "Alternativa open source ao Burp, com scanner automatizado. Bom para uma primeira varredura antes da análise manual.",
          tag: "ferramenta",
          url: "https://www.zaproxy.org/",
        },
        {
          id: "owasp-top-10",
          title: "OWASP Top 10",
          description:
            "As dez classes de falha mais críticas em aplicações web. É o vocabulário base da área.",
          tag: "leitura",
          url: "https://owasp.org/www-project-top-ten/",
        },
      ],
    },

    hardening: {
      heading: "Como este site foi protegido",
      intro:
        "Cada item abaixo está implementado neste site, não é teoria. Indico o arquivo para você conferir no repositório.",
      labels: {
        what: "O que faz",
        why: "Por que importa",
        where: "Onde está",
      },
      items: [
        {
          id: "csp",
          title: "Content-Security-Policy com nonce",
          what: "Uma lista do que o navegador pode carregar e executar nesta página. Cada requisição gera um número aleatório de uso único (nonce), e só scripts marcados com aquele número rodam.",
          why: "É a última linha de defesa contra XSS: mesmo que algum script estranho fosse injetado no HTML, ele não teria o nonce daquela requisição e o navegador se recusaria a executá-lo. A política também não permite 'unsafe-eval', então código não pode ser criado a partir de texto.",
          where: "lib/security.ts + proxy.ts",
        },
        {
          id: "frame-ancestors",
          title: "frame-ancestors 'none'",
          what: "Proíbe que qualquer outro site coloque esta página dentro de um <iframe>.",
          why: "Impede clickjacking — a técnica de sobrepor uma página invisível à sua para que a vítima clique em algo que não vê.",
          where: "lib/security.ts",
        },
        {
          id: "hsts",
          title: "Strict-Transport-Security (HSTS)",
          what: "Diz ao navegador para, pelos próximos dois anos, só acessar este domínio por HTTPS — inclusive nos subdomínios.",
          why: "Fecha a janela do ataque de downgrade: sem HSTS, o primeiro acesso via http:// pode ser interceptado e redirecionado antes de o HTTPS entrar em cena.",
          where: "lib/security.ts",
        },
        {
          id: "nosniff",
          title: "X-Content-Type-Options: nosniff",
          what: "Proíbe o navegador de adivinhar o tipo de um arquivo pelo conteúdo, ignorando o Content-Type declarado.",
          why: "Sem isso, um arquivo enviado como texto mas contendo JavaScript pode acabar sendo executado como script.",
          where: "lib/security.ts",
        },
        {
          id: "referrer",
          title: "Referrer-Policy: strict-origin-when-cross-origin",
          what: "Ao clicar em um link para fora, envia apenas o domínio de origem — nunca o caminho completo nem a query string.",
          why: "Evita vazar em logs de terceiros informação que às vezes vive na URL (tokens, identificadores, termos de busca).",
          where: "lib/security.ts",
        },
        {
          id: "permissions",
          title: "Permissions-Policy",
          what: "Desliga explicitamente câmera, microfone, geolocalização, USB, sensores e pagamento.",
          why: "Um portfólio não precisa de nenhuma dessas permissões. Desligar o que não se usa reduz o que um script comprometido conseguiria pedir ao navegador.",
          where: "lib/security.ts",
        },
        {
          id: "no-third-party",
          title: "Zero recursos de terceiros",
          what: "Nenhum script, fonte, ícone ou analytics vindo de CDN. As fontes são baixadas no build e servidas pelo próprio domínio.",
          why: "Cada CDN é um terceiro com permissão de executar código na sua página. Se ele for comprometido, seu site também foi. Autocontido, a CSP pode ser muito mais restritiva.",
          where: "app/layout.tsx (next/font)",
        },
        {
          id: "validation",
          title: "Validação no servidor com Zod",
          what: "O formulário de contato é validado de novo no servidor: tipo, tamanho mínimo e máximo de cada campo, e formato do e-mail.",
          why: "Validação no navegador é conveniência de usabilidade, não segurança — qualquer um remove com o DevTools ou envia a requisição direto pelo Burp. A checagem que vale é a do servidor.",
          where: "lib/contact-schema.ts",
        },
        {
          id: "method-origin",
          title: "Método, Content-Type e Origin conferidos",
          what: "A API aceita apenas POST, apenas Content-Type application/json, e apenas requisições cuja origem é o próprio site.",
          why: "Essa combinação bloqueia CSRF: um formulário hospedado em outro domínio não consegue mandar application/json sem passar pelo preflight de CORS, e a origem dele não está na lista permitida.",
          where: "app/api/contact/route.ts",
        },
        {
          id: "honeypot",
          title: "Honeypot anti-bot",
          what: "Existe um campo extra no formulário, invisível para pessoas. Se ele vier preenchido, quem enviou foi um robô.",
          why: "Filtra spam automatizado sem CAPTCHA — sem cobrar da pessoa um quebra-cabeça e sem embutir script de terceiro na página.",
          where: "components/ContactForm.tsx",
        },
        {
          id: "rate-limit",
          title: "Rate limiting por IP",
          what: "Limita quantas mensagens o mesmo IP pode enviar por janela de tempo; acima disso, responde 429.",
          why: "Impede que alguém use o formulário para inundar sua caixa de entrada ou torrar sua cota de envio de e-mail.",
          where: "lib/rate-limit.ts",
        },
        {
          id: "generic-errors",
          title: "Mensagens de erro genéricas",
          what: "A API responde com um código curto ('VALIDATION', 'RATE_LIMITED'). Nunca devolve stack trace, nome de arquivo nem versão de biblioteca.",
          why: "Mensagem de erro detalhada é reconhecimento gratuito para quem está te atacando: revela o stack, o caminho dos arquivos e às vezes a versão vulnerável.",
          where: "app/api/contact/route.ts",
        },
        {
          id: "secrets",
          title: "Segredos só em variáveis de ambiente",
          what: "Nenhuma chave no código. Tudo que é segredo vive em variável de ambiente, e todo arquivo .env está no .gitignore.",
          why: "Chave comitada no Git fica no histórico para sempre, mesmo depois de apagada — e bots varrem o GitHub procurando exatamente isso.",
          where: ".gitignore",
        },
        {
          id: "security-txt",
          title: "security.txt (RFC 9116)",
          what: "Um arquivo em /.well-known/security.txt dizendo como me avisar de uma vulnerabilidade.",
          why: "Sem um canal claro, quem encontra uma falha ou desiste de avisar ou divulga em público. É o mínimo de higiene para receber report de forma responsável.",
          where: "public/.well-known/security.txt",
        },
        {
          id: "deps",
          title: "Dependências mínimas e monitoradas",
          what: "Poucas bibliotecas, sem framework de UI pesado. O Dependabot abre PR quando sai correção, e 'npm run audit' falha em vulnerabilidade alta.",
          why: "A maior parte do código de um projeto JavaScript vem de dependências. Menos pacote é menos código que você não leu rodando no seu servidor.",
          where: ".github/dependabot.yml",
        },
        {
          id: "no-db",
          title: "Sem banco de dados e sem sessão",
          what: "O site não guarda nada: não tem banco, não tem login, não tem cookie de sessão.",
          why: "Dado que não existe não vaza. Sem banco não há SQL injection; sem sessão não há roubo de sessão. A arquitetura mais segura é a que não tem a peça.",
          where: "arquitetura do projeto",
        },
      ],
      scannersHeading: "Confira você mesmo",
      scanners: [
        {
          id: "observatory",
          label: "Mozilla HTTP Observatory",
          description:
            "Analisa os headers de segurança e dá uma nota. Os links já vêm com o domínio deste site preenchido.",
        },
        {
          id: "securityheaders",
          label: "securityheaders.com",
          description:
            "Segunda opinião, focada em headers, com explicação item por item.",
        },
      ],
      disclaimer:
        "Vale o aviso: nota alta nesses scanners quer dizer que os headers estão certos, não que o site é 100% seguro. Eles não olham lógica de negócio, autenticação nem falha de autorização — isso eu testo na mão, com Burp Suite e OWASP ZAP.",
    },
  },

  contact: {
    kicker: "05 / contato",
    heading: "Vamos conversar",
    intro:
      "Aberto a oportunidades em análise de dados e automação. Manda mensagem pelo formulário ou chama direto no LinkedIn.",
    email: "vitormanzotti@gmail.com",
    labels: {
      email: "E-mail",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    form: {
      legend: "Enviar mensagem",
      nameLabel: "Nome",
      namePlaceholder: "Como devo te chamar",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@empresa.com",
      messageLabel: "Mensagem",
      messagePlaceholder: "Sobre o que você quer falar?",
      submit: "Enviar mensagem",
      submitting: "Enviando...",
      requiredHint: "Todos os campos são obrigatórios.",
      honeypotLabel: "Não preencha este campo",
      fieldErrors: {
        name: "Escreva seu nome (2 a 80 caracteres).",
        email: "Escreva um e-mail válido.",
        message: "Escreva sua mensagem (10 a 2000 caracteres).",
      },
    },
    feedback: {
      success: "Mensagem recebida. Respondo em breve — obrigado!",
      invalid: "Confira os campos destacados e tente de novo.",
      rateLimited: "Muitas mensagens em pouco tempo. Aguarde alguns minutos e tente novamente.",
      rejected: "Não foi possível enviar esta requisição. Se você usa alguma extensão de privacidade, tente desativá-la nesta página.",
      serverError: "Algo falhou do meu lado. Tente novamente em instantes ou me chame no LinkedIn.",
      network: "Sem conexão com o servidor. Verifique sua internet e tente de novo.",
    },
  },

  footer: {
    copyright: "© {year} Vitor Manzotti",
    builtWith: "Next.js · TypeScript · Tailwind CSS",
    sourceLabel: "Código deste site",
    sourceUrl: "https://github.com/Vtinho/Pagina-Pessoal",
    securityTxtLabel: "security.txt",
  },
};
