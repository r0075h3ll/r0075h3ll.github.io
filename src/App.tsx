import { useEffect, useState } from "react";
import {
  Github, Twitter, Linkedin, Rss, ExternalLink, Menu, X, Sun, Moon, ArrowUp,
  ShieldCheck, Bot, Radar, Cloud, GitPullRequest, Building2, Award
} from "lucide-react";
import { SiPython, SiGo, SiCloudflare } from "react-icons/si";

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
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

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans">
      <Header />
      <main>
        <About />
        <Experience />
        <Focus />
        <Projects />
        <Writing />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#focus", label: "Focus" },
  { href: "#work", label: "Work" },
  { href: "#certifications", label: "Certifications" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" }
];

const SECTION_IDS = NAV_LINKS.map(link => link.href.slice(1));

function Header() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-sm border-b border-[var(--line)]">
      <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-medium tracking-tight">
          Hardik Nanda <span className="text-[var(--muted)] font-normal">· Bangalore</span>
        </span>
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center gap-6 text-sm">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={
                  active === link.href.slice(1)
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
              className="p-1 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="sm:hidden p-1 text-[var(--ink)]"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
      {open && (
        <div className="sm:hidden border-t border-[var(--line)] px-6 py-4 flex flex-col gap-4 text-sm">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                active === link.href.slice(1)
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
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 p-2.5 rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--accent)]/40 transition-colors shadow-sm"
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
  { label: "Cloudflare", icon: <SiCloudflare className="w-3 h-3" /> },
  { label: "Python", icon: <SiPython className="w-3 h-3" /> },
  { label: "Go", icon: <SiGo className="w-3.5 h-3.5" /> }
];

function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 pt-16 pb-16 fade-in">
      <h2 className="text-sm font-medium text-[var(--accent)] mb-6">About</h2>
      <div className="space-y-5 text-[17px] text-[var(--ink-soft)] leading-relaxed">
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
      <div className="mt-8 flex flex-wrap gap-2">
        {SKILLS.map(skill => (
          <span key={skill.label} className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--muted)]">
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
    <section id="experience" className="max-w-3xl mx-auto px-6 py-16 border-t border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mb-6">Experience</h2>
      <div className="space-y-8">
        {EXPERIENCE.map(job => (
          <div key={job.company}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="flex items-center gap-2.5 font-medium">
                <Building2 className="w-4 h-4 text-[var(--muted)]" />
                {job.company}
              </h3>
              <span className="text-sm text-[var(--muted)]">{job.location}</span>
            </div>
            <div className="mt-1 space-y-0.5">
              {job.roles.map(role => (
                <p key={role.title} className="text-sm">
                  <span className="text-[var(--accent)]">{role.title}</span>
                  <span className="text-[var(--muted)]"> · {role.period}</span>
                </p>
              ))}
            </div>
            <p className="text-[var(--muted)] leading-relaxed mt-2">{job.description}</p>
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
    title: "Dependency Alert Triage",
    description: "Reachability analysis to triage Dependabot alerts, cutting alert fatigue by roughly 50%.",
    icon: <GitPullRequest className="w-5 h-5" />
  }
];

function Focus() {
  return (
    <section id="focus" className="max-w-3xl mx-auto px-6 py-16 border-t border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mb-6">Current Focus</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {FOCUS_AREAS.map(area => (
          <div key={area.title}>
            <div className="text-[var(--accent)] mb-4">{area.icon}</div>
            <h3 className="font-medium mb-2">{area.title}</h3>
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
    <section id="work" className="max-w-3xl mx-auto px-6 py-16 border-t border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mb-6">Work</h2>
      <div className="space-y-8">
        {PROJECTS.map(project => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-medium group-hover:text-[var(--accent)] transition-colors">
                {project.title}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[var(--muted)] leading-relaxed mt-1">{project.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

const POSTS = [
  {
    title: "Hacking Electron Applications 101",
    link: "https://r0075h3ll.hashnode.dev/hacking-electron-applications-101"
  },
  {
    title: "Content Security Policy for Dummies",
    link: "https://r0075h3ll.hashnode.dev/content-security-policy-for-dummies"
  },
  {
    title: "Open Redirects: Everything That You Should Know",
    link: "https://r0075h3ll.hashnode.dev/open-redirects-everything-that-you-should-know"
  }
];

function Writing() {
  return (
    <section id="writing" className="max-w-3xl mx-auto px-6 py-16 border-t border-[var(--line)]">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h2 className="text-sm font-medium text-[var(--accent)]">Writing</h2>
        <a href="https://r0075h3ll.hashnode.dev" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          All posts
        </a>
      </div>
      <div className="space-y-4">
        {POSTS.map(post => (
          <a
            key={post.link}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-2"
          >
            <h3 className="font-medium group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="max-w-3xl mx-auto px-6 py-16 border-t border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mb-6">Certifications</h2>
      <a
        href="https://certs.ine.com/bf186f59-189c-4301-8b83-6ec92e1303c9#acc.oEBS96C4"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between"
      >
        <div className="flex items-start gap-4">
          <Award className="w-5 h-5 text-[var(--accent)] mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium group-hover:text-[var(--accent)] transition-colors">eWPTX v3</h3>
            <p className="text-[var(--muted)]">eLearnSecurity Certified Web Penetration Tester eXtreme, INE Security</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-16 border-t border-[var(--line)]">
      <h2 className="text-sm font-medium text-[var(--accent)] mb-6">Contact</h2>
      <a href="mailto:hnanda21@gmail.com" className="text-2xl font-medium hover:text-[var(--accent)] transition-colors">
        hnanda21@gmail.com
      </a>
      <div className="flex gap-6 mt-6 text-sm text-[var(--muted)]">
        <a href="https://r0075h3ll.hashnode.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--ink)] transition-colors">
          <Rss className="w-4 h-4" /> Blog
        </a>
        <a href="https://github.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--ink)] transition-colors">
          <Github className="w-4 h-4" /> GitHub
        </a>
        <a href="https://twitter.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--ink)] transition-colors">
          <Twitter className="w-4 h-4" /> Twitter
        </a>
        <a href="https://www.linkedin.com/in/r0075h3ll/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--ink)] transition-colors">
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-6 py-10 border-t border-[var(--line)] text-sm text-[var(--muted)]">
      © {new Date().getFullYear()} Hardik Nanda
    </footer>
  );
}
