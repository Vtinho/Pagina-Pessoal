import type { SiteContent } from "./types";

export const en: SiteContent = {
  meta: {
    htmlLang: "en",
    ogLocale: "en_US",
    title: "Vitor Manzotti — Data Analyst & Process Automation",
    titleTemplate: "%s | Vitor Manzotti",
    // TODO: review. Aim for 150-160 characters so Google does not truncate it.
    description:
      "Portfolio of Vitor Manzotti: data analysis, process automation with Python and SQL, and information security studies. Computer Science at UFABC, Brazil.",
    keywords: [
      "data analyst",
      "data analysis",
      "process automation",
      "Python",
      "SQL",
      "Power Automate",
      "information security",
      "UFABC",
      "Vitor Manzotti",
    ],
    ogImageAlt: "Vitor Manzotti — Data Analyst & Process Automation",
  },

  ui: {
    skipToContent: "Skip to content",
    langSwitchLabel: "Select language",
    langNames: { pt: "Portuguese", en: "English" },
    opensInNewTab: "opens in a new tab",
    navLabel: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToTop: "Back to top",
  },

  nav: {
    about: "About",
    skills: "Skills",
    projects: "Projects",
    security: "Security",
    contact: "Contact",
  },

  hero: {
    terminalTitle: "vitor@portfolio: ~",
    prompt: ">",
    typedCommands: [
      "vitor.analyze(data)",
      "vitor.automate(process)",
      "vitor.secure(application)",
    ],
    outputLines: [
      "loading profile... ok",
      "stack: Python · SQL · Power Automate",
    ],
    name: "Vitor Manzotti",
    role: "Data Analyst · Process Automation",
    // TODO: rewrite in your own words once you have a concrete number to cite.
    tagline:
      "I turn manual processes into reliable data and automated routines — and I care about the security of what I build.",
    actions: {
      github: "GitHub",
      linkedin: "LinkedIn",
      cv: "Download CV",
    },
    // TODO: put the real PDF at public/cv-en.pdf
    cvPath: "/cv-en.pdf",
  },

  about: {
    kicker: "01 / about",
    heading: "About me",
    // TODO: rewrite in your own voice. One paragraph per array item.
    bio: [
      "I am a Computer Science student at UFABC (Brazil), with around a year of experience in data analysis and process automation.",
      "Day to day I use Python and SQL to extract, clean and join data scattered across PDFs, emails and spreadsheets — and Power BI when a number needs to become a decision. I currently do this in the natural gas sector, which is where the processes happen rather than my specialism: extracting, reconciling and analysing scattered data is the same problem in any industry.",
      "In parallel I study information security: web security labs and hands-on practice with analysis tools. This site is part of that study — the Security section explains every protection it uses.",
    ],
    photoAlt: "Vitor Manzotti, wearing a light shirt, looking at the camera",
    education: {
      heading: "Education",
      items: [
        {
          title: "BSc in Computer Science",
          org: "UFABC — Federal University of ABC, Brazil",
          period: "2022 — present",
          bullets: [
            "Databases, Machine Learning, Neural Networks, Distributed Systems, Algorithms and Data Structures, Linear Optimisation.",
            "Undergraduate research: a case study analysing academic data with Python and SQL.",
          ],
        },
      ],
    },
    experience: {
      heading: "Experience",
      items: [
        {
          title: "Process Management & Automation Intern",
          org: "Vora Energia S.A.",
          period: "Aug 2025 — present",
          bullets: [
            "Python pipelines (pdfplumber and regular expressions) processing around 200 natural gas invoices per month from PDF, with a modular architecture and batch tests against real invoices.",
            "An invoice reconciliation tool between Excel and MySQL, matching in two stages: by invoice number and, when that fails, by customer, supplier and period.",
            "VBA macros wired to MySQL over ODBC for daily volume imports and incremental invoice loading, with no duplicate records.",
            "Pricing models for gas contracts indexed to IPCA and Brent, plus a transport charge (TAG) calculation built in Python — which surfaced and fixed a bug in the penalty maths.",
            "Field-by-field extraction rules for an AI invoice-reading agent, and automated email flows in Power Automate.",
          ],
        },
      ],
    },
  },

  skills: {
    kicker: "02 / skills",
    heading: "Tools I work with",
    intro:
      "The tools I actually use day to day, and what I do with each one. I would rather list fewer and be able to talk about all of them in a technical interview.",
    groups: [
      {
        id: "data",
        label: "Data",
        caption: "Extract, clean, join and explain.",
        skills: [
          { name: "Python", note: "Pandas, NumPy, Matplotlib" },
          { name: "SQL", note: "MySQL, PostgreSQL, HeidiSQL" },
          { name: "PDF extraction", note: "pdfplumber, regular expressions" },
          { name: "Web scraping", note: "BeautifulSoup" },
          { name: "Power BI", note: "reports and indicators" },
          { name: "Excel / VBA", note: "macros, pivot tables, ODBC" },
        ],
      },
      {
        id: "automation",
        label: "Automation",
        caption: "Take the human out of the repetitive loop.",
        skills: [
          { name: "Power Automate", note: "flows, connectors, approvals" },
          { name: "GitHub Actions", note: "scheduling and continuous integration" },
          { name: "Git / GitHub", note: "branches, pull requests" },
          { name: "Docker", note: "reproducible environments" },
          { name: "REST APIs", note: "Java, Spring Boot" },
          { name: "TypeScript", note: "Next.js — this site" },
        ],
      },
      {
        id: "security",
        label: "Security",
        caption: "What I study — see the Security section below.",
        skills: [
          { name: "Web security (OWASP Top 10)", note: "XSS, injection, CSRF" },
          { name: "Burp Suite", note: "proxy, repeater, intruder" },
          { name: "Application hardening", note: "CSP, headers, validation" },
        ],
      },
    ],
  },

  projects: {
    kicker: "03 / projects",
    heading: "Projects",
    intro:
      "Every card follows the same structure: what the problem was, what I built, with what, and what changed afterwards.",
    labels: {
      problem: "Problem",
      solution: "Solution",
      stack: "Stack",
      result: "Result",
      repo: "Repository",
      demo: "Demo",
    },
    emptyState: "Projects coming soon. In the meantime, the source of this site is on GitHub.",
    items: [
      // Sem `repoUrl`: sao projetos internos da empresa e o codigo nao e
      // publico. O card simplesmente nao mostra o botao de repositorio.
      {
        id: "monitor-contratos-anp",
        title: "Natural gas contract monitor (ANP)",
        problem:
          "Brazil's ANP publishes 197 natural gas contracts and changes them without notice. Finding out what moved meant opening the list and comparing by hand, every day.",
        solution:
          "A monitor that reads the publications twice a day, diffs them against the previous read and emails only what changed. Runs serverless on a GitHub Actions schedule, with retry handling on delivery.",
        stack: ["Python", "BeautifulSoup", "GitHub Actions", "API Resend"],
        result:
          "197 contracts tracked automatically, twice a day, at no infrastructure cost and with no email when nothing changed.",
        year: "2026",
      },
      {
        id: "analise-dados-academicos",
        title: "Academic data analysis (UFABC)",
        problem:
          "Student performance data scattered and raw, impossible to read for decision making.",
        solution:
          "Extraction, cleaning and exploratory analysis, with the patterns found written up in a report. Undergraduate research work.",
        stack: ["Python", "Pandas", "Matplotlib", "SQL"],
        result: "A report surfacing the performance patterns the raw data was hiding.",
        year: "2026",
      },
      {
        id: "dashboards-dados-publicos",
        title: "Public data dashboards",
        problem:
          "Public finance and health data is large and hard to reach for the people who need to decide with it.",
        solution:
          "Power BI reports that summarise the indicators and let you filter by segment.",
        stack: ["Power BI", "Excel"],
        result: "Readable indicators on one screen instead of raw spreadsheets.",
        year: "2026",
      },
      {
        id: "api-biblioteca",
        title: "Library management system",
        problem:
          "A back-end exercise on a real domain: lending a collection, rather than the usual sample CRUD.",
        solution:
          "REST API in Java with Spring Boot, SQL persistence and a containerised environment.",
        stack: ["Java", "Spring Boot", "SQL", "Docker"],
        result: "A working API with an environment reproducible through Docker.",
        year: "2026",
      },
    ],
  },

  security: {
    kicker: "04 / security",
    heading: "Information security",
    intro:
      "This is what I study outside of work. Below: what I am currently learning and then exactly how this site was hardened — because talking about security without applying it is easy.",

    studying: {
      heading: "What I am studying",
      intro: "Current track, tools and reading.",
      items: [
        {
          id: "portswigger",
          title: "PortSwigger Web Security Academy",
          description:
            "Hands-on labs on web vulnerabilities: SQL injection, XSS, CSRF, SSRF and access control.",
          tag: "lab",
          url: "https://portswigger.net/web-security",
          // TODO: mesmo número de site.pt.ts.
          progress: "39 labs completed — 26 apprentice, 13 practitioner",
        },
        {
          id: "burp",
          title: "Burp Suite",
          description:
            "Intercepting proxy for inspecting and replaying requests. I use Repeater to test form validation.",
          tag: "tool",
          url: "https://portswigger.net/burp",
        },
        {
          id: "zap",
          title: "OWASP ZAP",
          description:
            "Open source alternative to Burp, with an automated scanner. Good for a first pass before manual analysis.",
          tag: "tool",
          url: "https://www.zaproxy.org/",
        },
        {
          id: "owasp-top-10",
          title: "OWASP Top 10",
          description:
            "The ten most critical classes of web application failure. It is the vocabulary of the field.",
          tag: "reading",
          url: "https://owasp.org/www-project-top-ten/",
        },
      ],
    },

    hardening: {
      heading: "How this site was hardened",
      intro:
        "Every item below is implemented on this site and I point to the file where each measure lives.",
      labels: {
        what: "What it does",
        why: "Why it matters",
        where: "Where it lives",
      },
      items: [
        {
          id: "csp",
          title: "Content-Security-Policy with a nonce",
          what: "A list of what the browser is allowed to load and execute on this page. Every request generates a single-use random number (a nonce), and only scripts carrying that number are allowed to run.",
          why: "It is the last line of defence against XSS: even if a stray script were injected into the HTML, it would not carry that request's nonce and the browser would refuse to execute it. The policy also forbids 'unsafe-eval', so code cannot be created from a string.",
          where: "lib/security.ts + proxy.ts",
        },
        {
          id: "frame-ancestors",
          title: "frame-ancestors 'none'",
          what: "Forbids any other site from placing this page inside an <iframe>.",
          why: "Blocks clickjacking — the technique of overlaying an invisible page on top of yours so the victim clicks something they cannot see.",
          where: "lib/security.ts",
        },
        {
          id: "hsts",
          title: "Strict-Transport-Security (HSTS)",
          what: "Tells the browser to reach this domain over HTTPS only for the next two years, subdomains included.",
          why: "Closes the downgrade attack window: without HSTS, that first http:// request can be intercepted and redirected before HTTPS ever comes into play.",
          where: "lib/security.ts",
        },
        {
          id: "nosniff",
          title: "X-Content-Type-Options: nosniff",
          what: "Forbids the browser from guessing a file's type from its content and ignoring the declared Content-Type.",
          why: "Without it, a file served as text but containing JavaScript can end up being executed as a script.",
          where: "lib/security.ts",
        },
        {
          id: "referrer",
          title: "Referrer-Policy: strict-origin-when-cross-origin",
          what: "When you click an outbound link, only the origin is sent — never the full path or query string.",
          why: "Prevents leaking into third-party logs the information that sometimes lives in a URL (tokens, identifiers, search terms).",
          where: "lib/security.ts",
        },
        {
          id: "permissions",
          title: "Permissions-Policy",
          what: "Explicitly turns off camera, microphone, geolocation, USB, sensors and payment.",
          why: "A portfolio needs none of these permissions. Disabling what you do not use shrinks what a compromised script could ask the browser for.",
          where: "lib/security.ts",
        },
        {
          id: "no-third-party",
          title: "Zero third-party resources",
          what: "No script, font, icon or analytics loaded from a CDN. Fonts are downloaded at build time and served from this domain.",
          why: "Every CDN is a third party allowed to execute code on your page. If it is compromised, so is your site. Being self-contained lets the CSP be far stricter.",
          where: "app/layout.tsx (next/font)",
        },
        {
          id: "validation",
          title: "Server-side validation with Zod",
          what: "The contact form is validated again on the server: type, minimum and maximum length of each field, and email format.",
          why: "Browser validation is a usability convenience, not security — anyone can strip it in DevTools or send the request straight from Burp. The check that counts is the server's.",
          where: "lib/contact-schema.ts",
        },
        {
          id: "method-origin",
          title: "Method, Content-Type and Origin checked",
          what: "The API accepts POST only, Content-Type application/json only, and only requests whose origin is this site.",
          why: "That combination blocks CSRF: a form hosted on another domain cannot send application/json without a CORS preflight, and its origin is not on the allow-list.",
          where: "app/api/contact/route.ts",
        },
        {
          id: "honeypot",
          title: "Anti-bot honeypot",
          what: "There is an extra field in the form, invisible to people. If it arrives filled in, the sender was a robot.",
          why: "Filters automated spam without a CAPTCHA — no puzzle for the visitor to solve and no third-party script embedded in the page.",
          where: "components/ContactForm.tsx",
        },
        {
          id: "rate-limit",
          title: "Per-IP rate limiting",
          what: "Caps how many messages one IP can send per time window; beyond that it answers 429.",
          why: "Stops someone from using the form to flood my inbox or burn through my email sending quota.",
          where: "lib/rate-limit.ts",
        },
        {
          id: "generic-errors",
          title: "Generic error messages",
          what: "The API answers with a short code ('VALIDATION', 'RATE_LIMITED'). It never returns a stack trace, a file name or a library version.",
          why: "A detailed error message is free reconnaissance for an attacker: it reveals the stack, the file paths and sometimes the vulnerable version.",
          where: "app/api/contact/route.ts",
        },
        {
          id: "secrets",
          title: "Secrets in environment variables only",
          what: "No key in the code. Every secret lives in an environment variable, and every .env file is gitignored.",
          why: "A key committed to Git stays in history forever, even after you delete it — and bots scan GitHub for exactly that.",
          where: ".gitignore",
        },
        {
          id: "security-txt",
          title: "security.txt (RFC 9116)",
          what: "A file at /.well-known/security.txt telling you how to report a vulnerability to me.",
          why: "Without a clear channel, whoever finds a flaw either gives up on reporting it or discloses it in public. It is the minimum hygiene for receiving a report responsibly.",
          where: "public/.well-known/security.txt",
        },
        {
          id: "deps",
          title: "Minimal, monitored dependencies",
          what: "Few libraries, no heavy UI framework. Dependabot opens a PR when a fix ships, and 'npm run audit' fails on a high severity finding.",
          why: "Most of the code in a JavaScript project comes from dependencies. Fewer packages means less code you never read running on your server.",
          where: ".github/dependabot.yml",
        },
        {
          id: "no-db",
          title: "No database, no session",
          what: "The site stores nothing: no database, no login, no session cookie.",
          why: "Data that does not exist cannot leak. No database means no SQL injection; no session means no session hijacking. The safest architecture is the one missing the part.",
          where: "project architecture",
        },
      ],
      scannersHeading: "Check it yourself",
      scanners: [
        {
          id: "observatory",
          label: "Mozilla HTTP Observatory",
          description:
            "Analyses the security headers and assigns a grade. The links below already carry this site's domain.",
        },
        {
          id: "securityheaders",
          label: "securityheaders.com",
          description: "A second opinion focused on headers, explained item by item.",
        },
      ],
      disclaimer:
        "Worth saying: a high score on these scanners means the headers are right, not that the site is 100% secure. They do not look at business logic, authentication or broken authorization — that part I test by hand, with Burp Suite and OWASP ZAP.",
    },
  },

  contact: {
    kicker: "05 / contact",
    heading: "Let's talk",
    intro:
      "Open to opportunities in data analysis and automation. Send a message through the form or reach out on LinkedIn.",
    email: "vitormanzotti@gmail.com",
    labels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    form: {
      legend: "Send a message",
      nameLabel: "Name",
      namePlaceholder: "What should I call you",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      messageLabel: "Message",
      messagePlaceholder: "What would you like to talk about?",
      submit: "Send message",
      submitting: "Sending...",
      requiredHint: "All fields are required.",
      honeypotLabel: "Do not fill in this field",
      fieldErrors: {
        name: "Please enter your name (2 to 80 characters).",
        email: "Please enter a valid email address.",
        message: "Please write your message (10 to 2000 characters).",
      },
    },
    feedback: {
      success: "Message received. I will get back to you soon — thank you!",
      invalid: "Please check the highlighted fields and try again.",
      rateLimited: "Too many messages in a short time. Please wait a few minutes and try again.",
      rejected: "This request could not be sent. If you use a privacy extension, try disabling it on this page.",
      serverError: "Something failed on my side. Try again in a moment, or reach me on LinkedIn.",
      network: "No connection to the server. Check your internet and try again.",
    },
  },

  footer: {
    copyright: "© {year} Vitor Manzotti",
    builtWith: "Next.js · TypeScript · Tailwind CSS",
    securityTxtLabel: "security.txt",
  },
};
