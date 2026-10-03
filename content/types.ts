export type Locale = "pt" | "en";

export const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "security",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type NavSectionId = Exclude<SectionId, "hero">;

export interface TimelineItem {
  title: string;
  org: string;
  period: string;
  bullets: string[];
}

export interface Skill {
  name: string;
  note: string;
}

export interface SkillGroup {
  id: "data" | "automation" | "security";
  label: string;
  caption: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  problem: string;
  solution: string;
  stack: string[];
  result: string;
  repoUrl?: string;
  demoUrl?: string;
  year: string;
}

export interface StudyCard {
  id: string;
  title: string;
  description: string;
  tag: string;
  url?: string;
  progress?: string;
}

export interface HardeningItem {
  id: string;
  title: string;
  what: string;
  why: string;
  where: string;
}

export interface ScannerLink {
  id: "observatory" | "securityheaders";
  label: string;
  description: string;
}

export interface MetaContent {
  htmlLang: string;
  ogLocale: string;
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  ogImageAlt: string;
}

export interface UiContent {
  skipToContent: string;
  langSwitchLabel: string;
  langNames: Record<Locale, string>;
  opensInNewTab: string;
  navLabel: string;
  openMenu: string;
  closeMenu: string;
  backToTop: string;
}

export interface HeroContent {
  terminalTitle: string;
  prompt: string;
  typedCommands: string[];
  outputLines: string[];
  name: string;
  role: string;
  tagline: string;
  actions: {
    github: string;
    linkedin: string;
    cv: string;
  };
  cvPath: string;
}

export interface AboutContent {
  kicker: string;
  heading: string;
  bio: string[];
  photoAlt: string;
  education: {
    heading: string;
    items: TimelineItem[];
  };
  experience: {
    heading: string;
    items: TimelineItem[];
  };
}

export interface SkillsContent {
  kicker: string;
  heading: string;
  intro: string;
  groups: SkillGroup[];
}

export interface ProjectsContent {
  kicker: string;
  heading: string;
  intro: string;
  labels: {
    problem: string;
    solution: string;
    stack: string;
    result: string;
    repo: string;
    demo: string;
  };
  emptyState: string;
  items: Project[];
}

export interface SecurityContent {
  kicker: string;
  heading: string;
  intro: string;
  studying: {
    heading: string;
    intro: string;
    items: StudyCard[];
  };
  hardening: {
    heading: string;
    intro: string;
    items: HardeningItem[];
    labels: {
      what: string;
      why: string;
      where: string;
    };
    scannersHeading: string;
    scanners: ScannerLink[];
    disclaimer: string;
  };
}

export interface ContactContent {
  kicker: string;
  heading: string;
  intro: string;
  /** Seu e-mail. TODO: preencher. */
  email: string;
  labels: {
    email: string;
    linkedin: string;
    github: string;
  };
  form: {
    legend: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    requiredHint: string;
    honeypotLabel: string;
    fieldErrors: {
      name: string;
      email: string;
      message: string;
    };
  };
  feedback: {
    success: string;
    invalid: string;
    rateLimited: string;
    rejected: string;
    serverError: string;
    network: string;
  };
}

export interface FooterContent {
  copyright: string;
  builtWith: string;
  sourceLabel: string;
  /** URL do repositorio deste site. TODO: criar o repo e apontar aqui. */
  sourceUrl: string;
  securityTxtLabel: string;
}

export interface SiteContent {
  meta: MetaContent;
  ui: UiContent;
  nav: Record<NavSectionId, string>;
  hero: HeroContent;
  about: AboutContent;
  skills: SkillsContent;
  projects: ProjectsContent;
  security: SecurityContent;
  contact: ContactContent;
  footer: FooterContent;
}

export const SOCIAL = {
  github: "https://github.com/Vtinho",
  linkedin: "https://www.linkedin.com/in/vitor-manzotti-5b0731290",
} as const;
