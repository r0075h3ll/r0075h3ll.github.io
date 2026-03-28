import { motion } from "motion/react";
import { Github, Twitter, Linkedin, Shield, Terminal, ExternalLink } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#00FF00] selection:text-black font-sans relative">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-20" />
      <div className="fixed inset-0 scanline pointer-events-none" />
      <Header />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Expertise />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1F1F1F]">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 font-mono text-sm tracking-tighter"
        >
          <span className="text-[#00FF00] font-bold">r0075h3ll</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40 uppercase tracking-widest text-[10px]">Hardik Nanda</span>
        </motion.div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
          {["About", "Work", "Skills", "Certifications", "Contact"].map((item) => (
            <motion.a
              key={item}
              href={`#${item === "Work" ? "work" : item.toLowerCase()}`}
              whileHover={{ color: "#00FF00" }}
              className="transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/r0075h3ll" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 text-white/40 hover:text-[#00FF00] transition-colors" />
          </a>
          <a href="https://twitter.com/r0075h3ll" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-4 h-4 text-white/40 hover:text-[#00FF00] transition-colors" />
          </a>
          <a href="https://www.linkedin.com/in/r0075h3ll/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-4 h-4 text-white/40 hover:text-[#00FF00] transition-colors" />
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF00]/20 bg-[#00FF00]/5 text-[#00FF00] text-[10px] font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse" />
                System Status: Secure
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-mono uppercase tracking-widest">
                Security Engineer
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.95]">
              Hardik Nanda. <br />
              <span className="text-[#00FF00]">Product Security.</span>
            </h1>
            <p className="max-w-md text-lg text-white/40 font-light leading-relaxed mb-8">
              I build tools to detect and mitigate modern attack vectors, specializing in vulnerability analysis, supply chain security, and DevSecOps.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a 
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#00FF00] text-black px-6 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-[#00FF00]/90 transition-colors"
              >
                View Work
              </motion.a>
              <motion.a 
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-white/10 px-6 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Establish Connection
              </motion.a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-full border border-[#1F1F1F] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-radial-gradient from-[#00FF00]/10 to-transparent blur-3xl opacity-50" />
              <div className="w-3/4 h-3/4 rounded-full border border-[#00FF00]/20 border-dashed animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-32 h-32 text-[#00FF00]/20" />
              </div>
              <div className="absolute top-1/4 right-1/4 bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-lg shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3 h-3 text-[#00FF00]" />
                  <span className="text-[10px] font-mono text-white/40">r0075h3ll@terminal</span>
                </div>
                <div className="font-mono text-[10px] text-[#00FF00] space-y-1">
                  <div>$ npx vet scan .</div>
                  <div className="text-white/40">Scanning dependencies...</div>
                  <div className="text-white/40">Analysis complete: 0 vulnerabilities</div>
                  <div>$ status: 200 OK</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-32 px-6 border-b border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#00FF00] mb-8 font-mono">/ Introduction</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
              Securing the software lifecycle through <span className="text-[#00FF00]">offensive engineering</span> and <span className="text-[#00FF00]">defensive automation</span>.
            </h3>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-lg text-white/40 leading-relaxed font-light"
          >
            <p>
              I am a Product Security Engineer dedicated to identifying and mitigating security risks across the entire software development lifecycle. My work focuses on the intersection of vulnerability analysis and DevSecOps, where I build tools that automate the detection of complex attack vectors.
            </p>
            <p>
              I am the creator of original security tools like <span className="text-white font-medium">Oralyzer</span>, an open-redirect analyzer, and <span className="text-white font-medium">FireEye</span>, an AWS monitoring toolkit for threat detection.
            </p>
            <p>
              With a deep interest in supply chain security, I am also a frequent contributor to critical open-source security tools like <span className="text-white font-medium">safedep/vet</span> and <span className="text-white font-medium">chainguard-dev/malcontent</span>, helping organizations vet their dependencies and detect malicious packages.
            </p>
            <p>
              My philosophy is simple: <span className="text-[#00FF00] italic">Automate the known, investigate the unknown.</span> I believe in empowering developers with security tooling that is both powerful and seamless.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    title: "vet",
    description: "Policy-driven vetting of open-source dependencies. Significant contributor to the safedep/vet ecosystem.",
    tags: ["Supply Chain", "Security", "Go"],
    link: "https://github.com/safedep/vet"
  },
  {
    title: "malcontent",
    description: "Advanced supply chain attack detection and malware analysis. Contributor to the chainguard-dev/malcontent project.",
    tags: ["Malware", "Detection", "Security"],
    link: "https://github.com/chainguard-dev/malcontent"
  },
  {
    title: "FireEye",
    description: "AWS Monitoring Toolkit for enterprise-grade threat detection and cloud security analysis.",
    tags: ["AWS", "Cloud Security", "Python"],
    link: "https://github.com/r0075h3ll/FireEye"
  },
  {
    title: "Oralyzer",
    description: "Open Redirect Analyzer - A tool to identify open redirect vulnerabilities in web applications.",
    tags: ["Web Security", "Bug Bounty", "Python"],
    link: "https://github.com/r0075h3ll/Oralyzer"
  },
  {
    title: "Endomorph",
    description: "Command-line utility for endianness conversion written in C.",
    tags: ["C", "CLI", "Low-level"],
    link: "https://github.com/r0075h3ll/Endomorph"
  },
  {
    title: "semgrep-rules",
    description: "Custom Semgrep rules registry for identifying security vulnerabilities in source code.",
    tags: ["SAST", "Semgrep", "Automation"],
    link: "https://github.com/r0075h3ll/semgrep-rules"
  }
];

function Projects() {
  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#00FF00] mb-4 font-mono">/ Work Done</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Selected Contributions.</h3>
          </div>
          <p className="max-w-xs text-white/40 text-[11px] leading-relaxed font-mono uppercase tracking-wider">
            A collection of open-source tools and security projects focused on securing the modern software supply chain.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 border border-[#1F1F1F] bg-[#0A0A0A] hover:border-[#00FF00]/40 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-[#00FF00]" />
              </div>
              <div className="text-[10px] font-mono text-white/20 mb-4 uppercase tracking-widest">Project 0{i + 1}</div>
              <h4 className="text-xl font-bold mb-3 group-hover:text-[#00FF00] transition-colors">{project.title}</h4>
              <p className="text-sm text-white/40 leading-relaxed mb-6 h-12 overflow-hidden">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-2 py-0.5 border border-white/10 text-white/40 uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  { category: "Security", items: ["AppSec", "Cloud Security", "AI/LLM Security", "Supply Chain Security"] },
  { category: "Specialization", items: ["API Security", "OWASP Top 10", "LLM Prompt Injection", "RAG Defenses"] },
  { category: "Tooling", items: ["Semgrep", "Burp Suite", "Nmap", "Postman", "Selenium"] },
  { category: "Infrastructure", items: ["AWS (Lambda, EventBridge)", "GitHub Actions", "Docker", "DevSecOps"] },
  { category: "Languages", items: ["Python", "Go", "Java", "JavaScript", "Bash", "C"] },
];

function Certifications() {
  return (
    <section id="certifications" className="py-32 px-6 border-b border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#00FF00] mb-4 font-mono">/ Credentials</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">Certifications.</h3>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.a
            href="https://certs.ine.com/bf186f59-189c-4301-8b83-6ec92e1303c9#acc.oEBS96C4"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-8 border border-[#1F1F1F] bg-[#0A0A0A] hover:border-[#00FF00]/40 transition-all relative overflow-hidden flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-[#00FF00] mb-2 uppercase tracking-widest">INE Security</div>
              <h4 className="text-2xl font-bold group-hover:text-[#00FF00] transition-colors">eWPTX v3</h4>
              <p className="text-sm text-white/40 mt-2">eLearnSecurity Certified Web Penetration Tester eXtreme</p>
            </div>
            <ExternalLink className="w-6 h-6 text-white/20 group-hover:text-[#00FF00] transition-colors" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section id="skills" className="py-32 px-6 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#00FF00] mb-8 font-mono">/ Skills & Expertise</h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
              A specialized stack for <span className="text-[#00FF00]">modern</span> security challenges.
            </h3>
            <p className="text-lg text-white/40 leading-relaxed mb-12">
              My technical expertise spans from low-level vulnerability analysis to high-level security architecture. I leverage automation to scale security practices without compromising on depth.
            </p>
            <div className="p-6 border border-[#1F1F1F] bg-[#0A0A0A] rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-[#00FF00]" />
                <span className="text-xs font-mono uppercase tracking-widest">Core Focus</span>
              </div>
              <p className="text-[11px] font-mono text-white/40 leading-relaxed italic">
                "Building resilient systems requires a deep understanding of how they break. I bridge the gap between security analysis and engineering."
              </p>
            </div>
          </div>
          <div className="grid gap-8">
            {SKILLS.map((skill) => (
              <div key={skill.category} className="p-8 border border-[#1F1F1F] bg-[#0A0A0A] relative group">
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-[#00FF00] transition-all duration-500" />
                <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-white/20 mb-6">{skill.category}</h4>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  {skill.items.map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#00FF00]" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-mono uppercase tracking-widest mb-12">
          Secure Channel
        </div>
        <h3 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
          Establish <br /> Connection.
        </h3>
        <div className="flex flex-col items-center gap-8">
          <motion.a 
            href="mailto:hnanda21@gmail.com" 
            whileHover={{ scale: 1.05 }}
            className="text-2xl md:text-4xl font-mono font-bold text-[#00FF00] border-b-2 border-[#00FF00]/20 pb-2"
          >
            hnanda21@gmail.com
          </motion.a>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
            <a href="https://github.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF00] transition-colors">GitHub</a>
            <a href="https://twitter.com/r0075h3ll" target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF00] transition-colors">Twitter</a>
            <a href="https://www.linkedin.com/in/r0075h3ll/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF00] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          © {new Date().getFullYear()} r0075h3ll // Hardik Nanda
        </div>
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00]" />
          Encrypted Session Active
        </div>
      </div>
    </footer>
  );
}
