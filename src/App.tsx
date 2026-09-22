import { Github, Twitter, Linkedin, Rss, ExternalLink } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111111] font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Focus />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-[#E5E3DE]">
      <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-medium tracking-tight">Hardik Nanda</span>
        <div className="hidden sm:flex items-center gap-6 text-sm text-[#6B6B6B]">
          <a href="#about" className="hover:text-[#111111] transition-colors">About</a>
          <a href="#experience" className="hover:text-[#111111] transition-colors">Experience</a>
          <a href="#focus" className="hover:text-[#111111] transition-colors">Focus</a>
          <a href="#work" className="hover:text-[#111111] transition-colors">Work</a>
          <a href="#certifications" className="hover:text-[#111111] transition-colors">Certifications</a>
          <a href="https://r0075h3ll.hashnode.dev" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors">Blog</a>
          <a href="#contact" className="hover:text-[#111111] transition-colors">Contact</a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 fade-in">
      <p className="text-sm text-[#B4491D] font-medium mb-4">Senior Product Security Engineer · Bangalore</p>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
        Breaking things before attackers do.
      </h1>
      <p className="max-w-xl text-lg text-[#6B6B6B] leading-relaxed">
        Tools for catching modern attack vectors before they ship: vulnerability analysis,
        supply chain security, and DevSecOps automation.
      </p>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-16 border-t border-[#E5E3DE]">
      <h2 className="text-sm font-medium text-[#B4491D] mb-6">About</h2>
      <div className="space-y-5 text-[17px] text-[#333333] leading-relaxed">
        <p>
          Product security work that lives at the intersection of vulnerability analysis and
          DevSecOps, finding the risks across the software development lifecycle, then
          building tools that catch them automatically next time.
        </p>
        <p>
          Creator of <span className="font-medium text-[#111111]">Oralyzer</span>, an open-redirect
          analyzer, and <span className="font-medium text-[#111111]">FireEye</span>, an AWS
          monitoring toolkit for threat detection. Contributor to{" "}
          <span className="font-medium text-[#111111]">safedep/vet</span> and{" "}
          <span className="font-medium text-[#111111]">chainguard-dev/malcontent</span>, vetting
          open-source dependencies and catching malicious packages before they land.
        </p>
        <p className="text-[#6B6B6B]">
          Automate the known, investigate the unknown.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {["AppSec", "Cloud Security", "Supply Chain Security", "AI Governance", "AI Sandboxing", "LLM Workflow Automation", "Cloudflare", "Python", "Go"].map(skill => (
          <span key={skill} className="text-xs px-2.5 py-1 rounded-full border border-[#E5E3DE] text-[#6B6B6B]">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    company: "Funding Societies | Modalku",
    role: "Senior Security Engineer",
    period: "Dec 2024 – Present",
    location: "Singapore (HQ)",
    description: "Southeast Asia's largest unified SME digital financing platform, licensed in Singapore, Indonesia, and Thailand."
  },
  {
    company: "FPL Technologies (OneCard)",
    role: "Security Engineer",
    period: "Jan 2024 – Dec 2024",
    location: "Pune, India",
    description: "Fintech behind OneCard, a mobile-first metal credit card."
  }
];

function Experience() {
  return (
    <section id="experience" className="max-w-3xl mx-auto px-6 py-16 border-t border-[#E5E3DE]">
      <h2 className="text-sm font-medium text-[#B4491D] mb-6">Experience</h2>
      <div className="space-y-8">
        {EXPERIENCE.map(job => (
          <div key={job.company}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium">{job.company}</h3>
              <span className="text-sm text-[#6B6B6B]">{job.period}</span>
            </div>
            <p className="text-sm text-[#B4491D] mt-1">{job.role} · {job.location}</p>
            <p className="text-[#6B6B6B] leading-relaxed mt-2">{job.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FOCUS_AREAS = [
  {
    title: "AI Sandboxing & Governance",
    description: "Hardening AI products against misuse, including sandboxing and governance work on Claude Code and Claude Cowork."
  },
  {
    title: "LLM-Powered Workflow Automation",
    description: "Designing automation pipelines that put LLMs to work on repetitive security review, including one that flags and blocks malicious IPs from Cloudflare traffic patterns such as DDoS, fuzzing, and directory enumeration."
  },
  {
    title: "Attack Surface Management & Brand Protection",
    description: "Building detection tooling that has flagged and taken down counterfeit sites, fake social accounts, and fraudulent ad campaigns impersonating the brand."
  },
  {
    title: "Cloudflare",
    description: "Applying edge security and infrastructure controls in production environments."
  },
  {
    title: "Dependency Alert Triage",
    description: "Reachability analysis to triage Dependabot alerts, cutting alert fatigue by roughly 50%."
  }
];

function Focus() {
  return (
    <section id="focus" className="max-w-3xl mx-auto px-6 py-16 border-t border-[#E5E3DE]">
      <h2 className="text-sm font-medium text-[#B4491D] mb-6">Current Focus</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {FOCUS_AREAS.map(area => (
          <div key={area.title}>
            <h3 className="font-medium mb-2">{area.title}</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const PROJECTS = [
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
    <section id="work" className="max-w-3xl mx-auto px-6 py-16 border-t border-[#E5E3DE]">
      <h2 className="text-sm font-medium text-[#B4491D] mb-6">Work</h2>
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
              <h3 className="text-lg font-medium group-hover:text-[#B4491D] transition-colors">
                {project.title}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[#6B6B6B] leading-relaxed mt-1">{project.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section id="certifications" className="max-w-3xl mx-auto px-6 py-16 border-t border-[#E5E3DE]">
      <h2 className="text-sm font-medium text-[#B4491D] mb-6">Certifications</h2>
      <a
        href="https://certs.ine.com/bf186f59-189c-4301-8b83-6ec92e1303c9#acc.oEBS96C4"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-medium group-hover:text-[#B4491D] transition-colors">eWPTX v3</h3>
          <p className="text-[#6B6B6B]">eLearnSecurity Certified Web Penetration Tester eXtreme, INE Security</p>
        </div>
        <ExternalLink className="w-4 h-4 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-16 border-t border-[#E5E3DE]">
      <h2 className="text-sm font-medium text-[#B4491D] mb-6">Contact</h2>
      <a href="mailto:hnanda21@gmail.com" className="text-2xl font-medium hover:text-[#B4491D] transition-colors">
        hnanda21@gmail.com
      </a>
      <div className="flex gap-6 mt-6 text-sm text-[#6B6B6B]">
        <a href="https://r0075h3ll.hashnode.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111111] transition-colors">
          <Rss className="w-4 h-4" /> Blog
        </a>
        <a href="https://github.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111111] transition-colors">
          <Github className="w-4 h-4" /> GitHub
        </a>
        <a href="https://twitter.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111111] transition-colors">
          <Twitter className="w-4 h-4" /> Twitter
        </a>
        <a href="https://www.linkedin.com/in/r0075h3ll/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#111111] transition-colors">
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-6 py-10 border-t border-[#E5E3DE] text-sm text-[#6B6B6B]">
      © {new Date().getFullYear()} Hardik Nanda
    </footer>
  );
}
