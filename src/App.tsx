import { useEffect, useState } from "react";
import {
  Github, Twitter, Linkedin, Rss, ExternalLink, Menu, X, Sun, Moon, ArrowUp,
  ShieldCheck, Bot, Radar, Cloud, SignalHigh, Building2, Award
} from "lucide-react";
import { SiPython, SiGo, SiCloudflare } from "react-icons/si";
import { BlogIndex, BlogPost, NotFound } from "./Blog";
import { POSTS } from "./posts";

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

type Route = { name: "home" } | { name: "blog" } | { name: "post"; slug: string } | { name: "notFound" };

// Every route is served as a real file by the build (see vite.config.ts), so
// links are plain anchors and the route is read once from the URL.
function getRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html") return { name: "home" };
  if (path === "/blog") return { name: "blog" };
  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) return { name: "post", slug: decodeURIComponent(post[1]) };
  return { name: "notFound" };
}

export default function App() {
  const route = getRoute();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans">
      <Header section={route.name === "blog" || route.name === "post" ? "writing" : undefined} />
      <main>
        {route.name === "home" && (
          <>
            <About />
            <Experience />
            <Focus />
            <Projects />
            <Writing />
            <Certifications />
            <Contact />
          </>
        )}
        {route.name === "blog" && <BlogIndex />}
        {route.name === "post" && <BlogPost slug={route.slug} />}
        {route.name === "notFound" && <NotFound />}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#focus", label: "Focus" },
  { href: "/#work", label: "Work" },
  { href: "/#certifications", label: "Certifications" },
  { href: "/#writing", label: "Writing" },
  { href: "/#contact", label: "Contact" }
];

const sectionId = (href: string) => href.slice(href.indexOf("#") + 1);
const SECTION_IDS = NAV_LINKS.map(link => sectionId(link.href));

function Header({ section }: { section?: string }) {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const observed = useActiveSection(SECTION_IDS);
  const active = section ?? observed;

  return (
    <header className="sticky inset-bs-0 z-50 bg-[var(--bg)]/90 backdrop-blur-sm border-be border-[var(--line)]">
      <nav className="max-w-3xl mx-auto px-6 h-(--header-h) flex items-center justify-between">
        <a href="/" className="font-medium tracking-tight">
          Hardik Nanda
        </a>
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-6 text-sm">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={
                  active === sectionId(link.href)
                    ? "text-[var(--accent)] transition-colors"
                    : "text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="icon-button p-1 text-[var(--muted)] hover:text-[var(--ink)]"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="icon-button sm:hidden p-1 text-[var(--ink)]"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      {open && (
        <div className="sm:hidden border-bs border-[var(--line)] px-6 py-4 flex flex-col gap-4 text-sm">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                active === sectionId(link.href)
                  ? "text-[var(--accent)] transition-colors"
                  : "text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0 })}
      className="icon-button fixed inset-be-6 end-6 p-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--accent)]/40 shadow-sm"
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

const SKILLS = [
  { label: "AppSec", icon: null },
  { label: "Cloud Security", icon: null },
  { label: "Supply Chain Security", icon: null },
  { label: "AI Governance", icon: null },
  { label: "AI Sandboxing", icon: null },
  { label: "LLM Workflow Automation", icon: null },
  { label: "Cloudflare", icon: <SiCloudflare /> },
  { label: "Python", icon: <SiPython /> },
  { label: "Go", icon: <SiGo /> }
];

function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <h2 className="text-sm font-medium text-[var(--accent)] mbe-6">About</h2>
      <div className="grid gap-5 text-[1.0625rem] text-[var(--ink-soft)] leading-relaxed">
        <p>
          Product security work that lives at the intersection of vulnerability analysis and
          DevSecOps, finding the risks across the software development lifecycle, then
          building tools that catch them automatically next time.
        </p>
        <p>
          Creator of <span className="font-medium text-[var(--ink)]">Oralyzer</span>, an open-redirect
          analyzer, and <span className="font-medium text-[var(--ink)]">FireEye</span>, an AWS
          monitoring toolkit for threat detection. Contributor to{" "}
          <span className="font-medium text-[var(--ink)]">safedep/vet</span> and{" "}
          <span className="font-medium text-[var(--ink)]">chainguard-dev/malcontent</span>, vetting
          open-source dependencies and catching malicious packages before they land.
        </p>
        <p className="text-[var(--muted)]">
          Automate the known, investigate the unknown.
        </p>
      </div>
      <div className="mbs-8 flex flex-wrap gap-2">
        {SKILLS.map(skill => (
          <span key={skill.label} className="with-icon text-xs px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--muted)]">
            {skill.icon}
            {skill.label}
          </span>
        ))}
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    company: "Funding Societies | Modalku",
    location: "Singapore (HQ)",
    period: "Dec 2024 – Present",
    roles: [
      { title: "Senior Product Security Engineer", period: "Jul 2026 – Present" },
      { title: "Product Security Engineer", period: "Dec 2024 – Jul 2026" }
    ],
    description: "Southeast Asia's largest unified SME digital financing platform, licensed in Singapore, Indonesia, and Thailand."
  },
  {
    company: "FPL Technologies (OneCard)",
    location: "Pune, India",
    period: "Jan 2024 – Dec 2024",
    roles: [{ title: "Security Engineer", period: "Jan 2024 – Dec 2024" }],
    description: "Fintech behind OneCard, a mobile-first metal credit card."
  }
];

function Experience() {
  return (
    <section id="experience" className="max-w-3xl mx-auto px-6 py-16 border-bs border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mbe-6">Experience</h2>
      <div className="grid gap-8">
        {EXPERIENCE.map(job => (
          <div key={job.company}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="with-icon font-medium">
                <Building2 className="text-[var(--muted)]" />
                {job.company}
              </h3>
              <span className="text-sm text-[var(--muted)]">{job.location}</span>
            </div>
            <div className="mbs-1 grid gap-0.5">
              {job.roles.map(role => (
                <p key={role.title} className="text-sm">
                  <span className="text-[var(--accent)]">{role.title}</span>
                  <span className="text-[var(--muted)]"> · {role.period}</span>
                </p>
              ))}
            </div>
            <p className="text-[var(--muted)] leading-relaxed mbs-2">{job.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FOCUS_AREAS = [
  {
    title: "AI Sandboxing & Governance",
    description: "Hardening AI products against misuse, including sandboxing and governance work on Claude Code and Claude Cowork.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    title: "LLM-Powered Workflow Automation",
    description: "Designing automation pipelines that put LLMs to work on repetitive security review, including one that flags and blocks malicious IPs from Cloudflare traffic patterns such as DDoS, fuzzing, and directory enumeration.",
    icon: <Bot className="w-5 h-5" />
  },
  {
    title: "Attack Surface Management & Brand Protection",
    description: "Building detection tooling that has flagged and taken down counterfeit sites, fake social accounts, and fraudulent ad campaigns impersonating the brand.",
    icon: <Radar className="w-5 h-5" />
  },
  {
    title: "Cloudflare",
    description: "Applying edge security and infrastructure controls in production environments.",
    icon: <Cloud className="w-5 h-5" />
  },
  {
    title: "High-Signal Alert Prioritization",
    description: "Reachability analysis that triages Dependabot alerts. In a 507-alert pilot, correctly triaged 500 with full agreement on hand-checked results, saved roughly 125 hours of analyst time, and surfaced 10 critical vulnerabilities buried in routine noise.",
    icon: <SignalHigh className="w-5 h-5" />
  }
];

function Focus() {
  return (
    <section id="focus" className="max-w-3xl mx-auto px-6 py-16 border-bs border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mbe-6">Current Focus</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {FOCUS_AREAS.map(area => (
          <div key={area.title}>
            <div className="text-[var(--accent)] mbe-4">{area.icon}</div>
            <h3 className="font-medium mbe-2">{area.title}</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    title: "Toleman",
    description: "Contributor to an open-source DevSecOps vulnerability management platform. Runs Semgrep, Trivy, Gitleaks, and gosec natively, with OSV.dev malicious package detection and GitHub App integration for automatic PR scanning.",
    link: "https://github.com/toleman-platform/toleman-platform"
  },
  {
    title: "ChainWatch",
    description: "Supply chain security CLI that scans every repo in a GitHub org for compromised, malicious, or vulnerable package versions.",
    link: "https://github.com/r0075h3ll/ChainWatch"
  },
  {
    title: "hermes-leash",
    description: "Budget guardrails for a self-hosted Telegram bot on EC2, with auto-shutdown to cap runaway spend.",
    link: "https://github.com/r0075h3ll/hermes-leash"
  },
  {
    title: "vet",
    description: "Policy-driven vetting of open-source dependencies. Contributor to the safedep/vet ecosystem.",
    link: "https://github.com/safedep/vet"
  },
  {
    title: "malcontent",
    description: "Supply chain attack detection and malware analysis. Contributor to chainguard-dev/malcontent.",
    link: "https://github.com/chainguard-dev/malcontent"
  },
  {
    title: "FireEye",
    description: "AWS monitoring toolkit for enterprise-grade threat detection and cloud security analysis.",
    link: "https://github.com/r0075h3ll/FireEye"
  },
  {
    title: "Oralyzer",
    description: "Open redirect analyzer that identifies open redirect vulnerabilities in web applications.",
    link: "https://github.com/r0075h3ll/Oralyzer"
  },
  {
    title: "semgrep-rules",
    description: "Contributor to a Semgrep rules registry for identifying security vulnerabilities in source code.",
    link: "https://github.com/r0075h3ll/semgrep-rules"
  }
];

function Projects() {
  return (
    <section id="work" className="max-w-3xl mx-auto px-6 py-16 border-bs border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mbe-6">Work</h2>
      <div className="grid gap-8">
        {PROJECTS.map(project => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <h3 className="with-icon text-lg font-medium group-hover:text-[var(--accent)] transition-colors">
              {project.title}
              <ExternalLink className="[--icon-scale:1.2] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-[var(--muted)] leading-relaxed mbs-1">{project.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

const WRITING = [
  {
    title: "High Signal, High Impact: Scaling Dependency Security Efficiently",
    href: "https://medium.com/fsmk-engineering/high-signal-high-impact-scaling-dependency-security-efficiently-5f0f6c05c5ac",
    external: true
  },
  ...POSTS.map(post => ({ title: post.title, href: `/blog/${post.slug}`, external: false }))
];

function Writing() {
  return (
    <section id="writing" className="max-w-3xl mx-auto px-6 py-16 border-bs border-[var(--line)]">
      <div className="flex flex-wrap items-end justify-between gap-4 mbe-6">
        <h2 className="text-sm font-medium text-[var(--accent)]">Writing</h2>
        <a href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          All posts
        </a>
      </div>
      <div className="grid gap-4">
        {WRITING.map(post => (
          <a
            key={post.href}
            href={post.href}
            {...(post.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center justify-between gap-2"
          >
            <h3 className="font-medium group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
            {post.external && (
              <ExternalLink className="icon-inline [--icon-scale:1.2] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="max-w-3xl mx-auto px-6 py-16 border-bs border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mbe-6">Certifications</h2>
      <a
        href="https://certs.ine.com/bf186f59-189c-4301-8b83-6ec92e1303c9#acc.oEBS96C4"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between"
      >
        <div className="flex items-start gap-4">
          <Award className="w-5 h-5 text-[var(--accent)] mbs-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium group-hover:text-[var(--accent)] transition-colors">eWPTX v3</h3>
            <p className="text-[var(--muted)]">eLearnSecurity Certified Web Penetration Tester eXtreme, INE Security</p>
          </div>
        </div>
        <ExternalLink className="icon-inline text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-16 border-bs border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mbe-6">Contact</h2>
      <a href="mailto:hnanda21@gmail.com" className="text-2xl font-medium hover:text-[var(--accent)] transition-colors">
        hnanda21@gmail.com
      </a>
      <div className="flex gap-6 mbs-6 text-sm text-[var(--muted)]">
        <a href="/blog" className="with-icon hover:text-[var(--ink)] transition-colors">
          <Rss /> Blog
        </a>
        <a href="https://github.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="with-icon hover:text-[var(--ink)] transition-colors">
          <Github /> GitHub
        </a>
        <a href="https://twitter.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="with-icon hover:text-[var(--ink)] transition-colors">
          <Twitter /> Twitter
        </a>
        <a href="https://www.linkedin.com/in/r0075h3ll/" target="_blank" rel="noopener noreferrer" className="with-icon hover:text-[var(--ink)] transition-colors">
          <Linkedin /> LinkedIn
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-6 py-10 border-bs border-[var(--line)] text-sm text-[var(--muted)]">
      © {new Date().getFullYear()} Hardik Nanda
    </footer>
  );
}
