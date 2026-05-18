// content/resume.ts
// Source-of-truth for the /resume HTML render (Plan 05-02) and the
// Puppeteer PDF pipeline (Plan 05-05). DO NOT re-parse
// Olive_Elliott_Resume.docx — pre-extracted verbatim per
// .planning/phases/05-about-+-resume-+-contact/05-RESEARCH.md
// § Resume Data — Pre-Extracted (verified 2026-05-17).
//
// Plan 07-03 resolved the four Phase 5 PLACEHOLDERs (LinkedIn handle,
// Fathom repo URL, Stemz live URL, Aktiga role title) atomically — see
// .planning/phases/07-content-pass-+-launch/07-03-placeholder-resolutions.md
// for Olive's verbatim answers. Same plan corrected the GitHub canonical
// handle from `olivelliott` → `ophelia-xo` (Phase 5 picked the wrong handle;
// the email local-part matches but the GitHub handle differs).
//
// Remaining open question (NOT a PLACEHOLDER — schema-clean):
//   - Events & services entries from .docx (Mast Farm Inn 2018, Melanie's
//     2015–2019) omitted — confirm with Olive whether to surface for
//     hiring-manager audience or drop for engineer-positioned distribution.
//
// Banned-word note (UI-SPEC § Copywriting Contract):
//   - The .docx PROFILE word "Passionate" is rewritten to "Active in" in
//     the summary below.
//   - The Myco bullet "broader autonomous-agent ecosystem" is rewritten to
//     "broader autonomous-agent community" — "ecosystem" is on the Phase 4
//     banned-words carry-forward list (UI-SPEC § Banned-words list); the
//     same word appears verbatim in RESEARCH § Resume Data — Pre-Extracted
//     but the banned-words contract takes precedence (it's enforced by the
//     banned-words regression test in tests/resume/content.test.ts).
//
// Pitfall 12 (dual-gate):
//   - `satisfies Resume` — static check at typecheck time
//   - `ResumeSchema.parse(data)` — runtime check at module load; throws if
//     the data is malformed in a way TypeScript can't catch (bad URL, empty
//     bullet array bypassing the static `string[]` type, etc.)
import { type Resume, ResumeSchema } from '@/lib/schemas'

const data = {
  header: {
    name: 'Olive Elliott',
    role: 'Software Engineer  ·  AI Workflow Architect  ·  System Architect',
    location: 'Asheville, NC  ·  919-917-4777',
    links: {
      github: 'https://github.com/ophelia-xo',
      email: 'olivelliott48@gmail.com',
      linkedin: 'https://www.linkedin.com/in/olivelliott',
    },
  },
  // Banned word "Passionate" rewritten to "Active in" per UI-SPEC § Copywriting Contract.
  summary:
    'Software engineer with 3+ years of experience designing and shipping scalable, local-first products. Focused on autonomous workflows, decentralized networks, and AI-driven systems that give people freedom to pursue what matters most. Active in open-source contribution, knowledge-graph architectures, and tools that support distributed communities. Brings a polymath perspective rooted in anthropology, sustainability, and creative problem solving.',
  experience: [
    {
      role: 'Software Engineer',
      company: 'Aktiga',
      period: '2023 – Present',
      bullets: [
        'Lead system architecture and AI workflow design for internal tooling and developer platforms',
        'Authored and maintained developer documentation using Starlight (Astro), improving onboarding and cross-team alignment',
        'Serve as project lead coordinating engineering priorities, sprint planning, and delivery milestones',
        'Design autonomous workflow pipelines integrating AI agents to reduce manual overhead across product operations',
      ],
    },
    {
      role: 'Operations Manager',
      company: 'The Care Collective',
      period: 'Feb 2021 – 2023',
      bullets: [
        'Oversaw client-facing and business operations for a 19-person company including wholesale, scheduling, inventory, sales, marketing, and client relations',
        'Joined during an unprecedented growth phase and expanded responsibilities to match evolving business demands',
        'Recognized as an integral contributor to visionary business strategy while managing day-to-day execution',
      ],
    },
  ],
  projects: [
    {
      name: 'Myco',
      tagline: 'Persistent Cognitive Layer for AI Agents',
      link: 'https://github.com/ophelia-xo/myco',
      period: '2024 – Present',
      bullets: [
        'Designed a local-first agent memory system modeled on mycorrhizal networks, enabling persistent context across AI sessions',
        'Implemented knowledge-graph architecture (Node + SQLite + Ollama) for semantic memory retrieval without cloud dependency',
        'Released as open-source under Apache 2.0 to support the broader autonomous-agent community',
      ],
    },
    {
      name: 'Fathom',
      tagline: 'Headless AI Dev-Cost Intelligence',
      link: 'https://github.com/ophelia-xo/fathom',
      period: '2025 – Present',
      bullets: [
        'Built a headless CLI and MCP server that tracks and analyzes AI development costs across LLM providers in real time',
        'Architected a pluggable store and provider system, allowing teams to swap backends and models without code changes',
        'Shipped as a Claude Code plugin, integrating cost intelligence directly into developer workflows',
      ],
    },
    {
      name: 'Agenda Keeper',
      tagline: 'Meeting-Management SaaS',
      // private — no link rendered
      period: '2024 – Present',
      bullets: [
        'Developed a full-stack meeting management platform with real-time collaborative editing via TipTap/ProseMirror',
        'Integrated OAuth-based calendar sync to unify scheduling across Google Calendar and Outlook',
        'Built on Convex for reactive, real-time data with zero-config backend infrastructure',
      ],
    },
    {
      name: 'Trade Bot',
      tagline: 'Autonomous Trading System',
      // private
      period: '2025',
      bullets: [
        'Engineered an autonomous trading system shipping 4 milestones in ~5 days, from strategy design to paper-trading',
        'Implemented crypto intraday trading with strategy diversification, entirely local-first (SQLite + Ollama, no cloud)',
      ],
    },
    {
      name: 'Stemz',
      tagline: 'Custom E-Commerce Platform for Music Discovery',
      link: 'https://findstemz.com',
      period: '2023',
      bullets: [
        'Developed a complex custom WordPress platform for Aktiga, transforming design into a fully functional e-commerce site with two types of custom ordering systems',
        'Engineered the backend using SQL and PHP, integrating WooCommerce for product management and transactions',
        'Optimized performance, enhanced user experience, and ensured scalability for future growth',
      ],
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5', 'CSS'],
    },
    {
      category: 'Frameworks & Libraries',
      items: [
        'Next.js',
        'React',
        'Node.js',
        'Express',
        'Convex',
        'Astro',
        'TipTap/ProseMirror',
        'Tailwind CSS',
        'WordPress',
      ],
    },
    {
      category: 'AI & Autonomous Systems',
      items: [
        'Ollama',
        'Claude / MCP',
        'Knowledge Graphs',
        'Agent Memory Architecture',
        'Autonomous Workflows',
      ],
    },
    {
      category: 'Data & Infrastructure',
      items: [
        'SQLite',
        'MongoDB',
        'MySQL',
        'PostgreSQL',
        'REST APIs',
        'Git/GitHub',
        'Vercel',
      ],
    },
    {
      category: 'Focus Areas',
      items: [
        'Decentralized Networks',
        'Local-First / P2P Systems',
        'Open-Source Development',
        'AI Architecture',
      ],
    },
  ],
  education: [
    {
      degree: 'Full Stack Web Development Certificate',
      institution: 'UNC Chapel Hill Coding Bootcamp',
      year: 'September 2022',
      bullets: ['6-month intensive, 450+ hours of full stack web development'],
    },
    {
      degree: 'Bachelor of Science, Cum Laude — Cultural Anthropology',
      institution: 'Appalachian State University',
      year: 'June 2019',
      bullets: [
        'Minor in Spanish',
        'Minor in Sustainable Development',
        'Senior Honors Award for Applied Anthropology',
      ],
    },
  ],
} satisfies Resume

export const RESUME: Resume = ResumeSchema.parse(data)
