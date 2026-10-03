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
      "I am a Computer Science student at UFABC (Brazil) working in automation and process management, turning spreadsheets and manual routines into data flows that run on their own.",
      "Day to day I use Python and SQL to extract, clean and join data scattered across PDFs, emails and spreadsheets — and Power Automate to remove the repetitive work left in between.",
      "In parallel I study information security: web security labs, writeups, and hands-on practice with analysis tools. This site is part of that study — the Security section explains every protection it uses.",
    ],
    // TODO: replace the image at public/foto-placeholder.jpg and adjust this alt.
    photoAlt: "Vitor Manzotti",
    education: {
      heading: "Education",
      items: [
        {
          title: "BSc in Computer Science",
          org: "UFABC — Federal University of ABC, Brazil",
          period: "2022 — present",
          bullets: [
            // TODO: optional — mention relevant coursework or projects.
            "Focus on data structures, databases and programming.",
          ],
        },
      ],
    },
    experience: {
      heading: "Experience",
      items: [
        {
          title: "Automation & Process Management Intern",
          org: "Vora Energia",
          period: "Aug 2025 — present",
          bullets: [
            "Extracting and processing operational data with Python and SQL.",
            "Automating manual routines with Power Automate and scripts.",
            "Automated reading of PDF documents to feed reports.",
            // TODO: add a bullet with a number. E.g. "cut monthly closing from 6h to 40min".
          ],
        },
      ],
    },
  },

  skills: {
    kicker: "02 / skills",
    heading: "Tools I work with",
    intro:
      "An honest self-assessment, not a certificate. If something sits at 60%, it means I still check the docs — and I would rather say that here than find out in a technical interview.",
    levelLabel: "level",
    groups: [
      {
        id: "data",
        label: "Data",
        caption: "Extract, clean, join and explain.",
        skills: [
          { name: "Python", level: 80, note: "pandas, requests, ETL scripts" },
          { name: "SQL (MySQL)", level: 75, note: "joins, aggregations, views" },
          { name: "Excel / VBA", level: 85, note: "macros, pivot tables" },
          { name: "PDF data extraction", level: 75, note: "pdfplumber, regex" },
        ],
      },
      {
        id: "automation",
        label: "Automation",
        caption: "Take the human out of the repetitive loop.",
        skills: [
          { name: "Power Automate", level: 80, note: "flows, connectors, approvals" },
          { name: "Automation with Python", level: 75, note: "scheduling, integrations" },
          { name: "Git / GitHub", level: 65, note: "branches, pull requests" },
        ],
      },
      {
        id: "security",
        label: "Security",
        caption: "What I study — see the Security section below.",
        skills: [
          { name: "Web security (OWASP Top 10)", level: 55, note: "XSS, injection, CSRF" },
          { name: "Burp Suite", level: 40, note: "proxy, repeater, intruder" },
          { name: "Application hardening", level: 50, note: "CSP, headers, validation" },
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
      // TODO: EXAMPLE PROJECT 1 — replace with a real project of yours.
      {
        id: "relatorio-automatizado",
        title: "Automated operational report",
        problem:
          "The monthly report was assembled by hand, copying numbers from four different spreadsheets. It took a full day and errors were frequent.",
        solution:
          "A Python script that reads every source, validates the data against consistency rules and generates the final formatted spreadsheet.",
        stack: ["Python", "pandas", "openpyxl", "SQL"],
        result: "From ~8 hours of manual work to ~10 minutes of execution, with no typos.",
        repoUrl: "https://github.com/Vtinho",
        year: "2025",
      },
      // TODO: EXAMPLE PROJECT 2 — replace with a real project of yours.
      {
        id: "extrator-pdf",
        title: "PDF invoice data extractor",
        problem:
          "Hundreds of PDF invoices per month, with the data being typed manually into an internal system.",
        solution:
          "An extractor that locates fields by text pattern, normalises values and dates, and exports a CSV ready for import.",
        stack: ["Python", "pdfplumber", "regex", "Power Automate"],
        result: "Manual typing eliminated; human review became exception sampling.",
        year: "2025",
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
        // TODO: the cards below are placeholders. Update `progress` and delete what you are not doing.
        {
          id: "portswigger",
          title: "PortSwigger Web Security Academy",
          description:
            "Hands-on labs on web vulnerabilities: SQL injection, XSS, CSRF, SSRF and access control.",
          tag: "lab",
          url: "https://portswigger.net/web-security",
          progress: "TODO: 0/0 labs",
        },
        {
          id: "burp",
          title: "Burp Suite",
          description:
            "Intercepting proxy for inspecting and replaying requests. I use Repeater to test form validation.",
          tag: "tool",
          url: "https://portswigger.net/burp",
          progress: "TODO: what you can already do with it",
        },
        {
          id: "zap",
          title: "OWASP ZAP",
          description:
            "Open source alternative to Burp, with an automated scanner. Good for a first pass before manual analysis.",
          tag: "tool",
          url: "https://www.zaproxy.org/",
          progress: "TODO",
        },
        {
          id: "owasp-top-10",
          title: "OWASP Top 10",
          description:
            "The ten most critical classes of web application failure. It is the vocabulary of the field.",
          tag: "reading",
          url: "https://owasp.org/www-project-top-ten/",
          progress: "TODO",
        },
        {
          id: "bug-bounty",
          title: "Bug bounty",
          description:
            "TODO: write this once you actually start. Platforms, scope you work in, and any accepted report.",
          tag: "bug bounty",
          progress: "TODO: not started yet",
        },
        {
          id: "writeups",
          title: "Writeups",
          description:
            "TODO: link your first writeup here. Explaining a flaw in writing is what proves you understood it.",
          tag: "writing",
          progress: "TODO",
        },
      ],
    },

    hardening: {
      heading: "How this site was hardened",
      intro:
        "Every item below is implemented on this site, not theory. I point to the file so you can check it in the repository.",
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
          what: "No key in the code. .env is gitignored and a valueless .env.example is committed instead.",
          why: "A key committed to Git stays in history forever, even after you delete it — and bots scan GitHub for exactly that.",
          where: ".env.example + .gitignore",
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
        "An honest caveat: a high scanner grade means the headers are right, not that the application is secure. Scanners do not test business logic, authentication or broken authorization. That is why I also test the form by hand, with Burp Suite and OWASP ZAP.",
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
    sourceLabel: "Source of this site",
    sourceUrl: "https://github.com/Vtinho/Pagina-Pessoal",
    securityTxtLabel: "security.txt",
  },
};
