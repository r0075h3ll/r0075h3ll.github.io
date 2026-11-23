import { Marked, type Tokens } from "marked";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import php from "highlight.js/lib/languages/php";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

// Shared by the browser bundle and the build-time prerenderer in vite.config.ts,
// so keep it free of DOM and Node APIs.

export const SITE_URL = "https://r0075h3ll.github.io";

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover?: string;
  originalUrl?: string;
  body: string;
}

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("php", php);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("yaml", yaml);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A top-level section of a post, listed under "On this page". */
export interface TocEntry {
  id: string;
  text: string;
}

/** Set on tokens by prepare() and read by the renderer. */
interface Plan {
  nbId?: string;
  nbLevel?: number;
  nbSection?: boolean;
  nbTape?: boolean;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "section";

const plainText = (s: string) => s.replace(/[`*_~]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim();

const ALERT_LABELS: Record<string, string> = {
  NOTE: "Margin note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
};

const marked = new Marked({
  gfm: true,
  renderer: {
    // Copy buttons are wired up in Blog.tsx.
    code(token) {
      const { text, lang } = token;
      const taped = (token as typeof token & Plan).nbTape ? " taped" : "";
      const language = (lang ?? "").trim().split(/\s+/)[0];
      const body = hljs.getLanguage(language)
        ? hljs.highlight(text, { language, ignoreIllegals: true }).value
        : escapeHtml(text);
      const cls = language ? ` class="hljs language-${escapeHtml(language)}"` : ' class="hljs"';
      const label = escapeHtml(language || "code");
      const name = language ? `Copy ${label} code` : "Copy code";
      return (
        `<div class="code-block${taped}"><div class="code-head"><span>${label}</span>` +
        `<button type="button" class="copy-code icon-button" aria-label="${name}" data-label="${name}">Copy</button>` +
        `</div><pre><code${cls}>${body}</code></pre></div>\n`
      );
    },
    heading(token) {
      const plan = token as typeof token & Plan;
      const level = Math.min(6, plan.nbLevel ?? token.depth);
      const id = plan.nbId ? ` id="${plan.nbId}"` : "";
      const sec = plan.nbSection ? " data-sec" : "";
      return `<h${level}${id}${sec}>${this.parser.parseInline(token.tokens)}</h${level}>\n`;
    },
    // GitHub alert blockquotes ("> [!NOTE]", "> [!TIP]", etc.) become margin notes.
    blockquote({ tokens }) {
      const inner = this.parser.parse(tokens);
      const alert = inner.match(/^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n?/i);
      if (alert) {
        const label = ALERT_LABELS[alert[1].toUpperCase()];
        const after = inner.slice(alert[0].length);
        const body = after.startsWith("</p>") ? after.replace(/^<\/p>\s*/, "") : `<p>${after}`;
        return `<aside class="margin-note"><span class="margin-note-label">${label}</span>${body}</aside>\n`;
      }
      return `<blockquote>\n${inner}</blockquote>\n`;
    },
    // Wide tables scroll inside their own box instead of the whole page.
    table(token) {
      const head = this.tablerow({ text: token.header.map(c => this.tablecell(c)).join("") });
      const rows = token.rows.map(r => this.tablerow({ text: r.map(c => this.tablecell(c)).join("") })).join("");
      return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
    },
  },
});

/**
 * Posts start their sections at ## or ###. This shifts headings so the top level is
 * always <h2>, gives each a unique id and marks top-level ones as numbered sections.
 * Only headings at the document root count; ones inside quotes or lists are left alone.
 */
function prepare(md: string) {
  const tokens = marked.lexer(md);
  const headings = tokens.filter((t): t is Tokens.Heading & Plan => t.type === "heading");
  const codes: (Tokens.Code & Plan)[] = [];
  marked.walkTokens(tokens, t => {
    if (t.type === "code") codes.push(t as Tokens.Code);
  });
  if (codes[0]) codes[0].nbTape = true;

  const top = headings.length ? Math.min(...headings.map(h => h.depth)) : 2;
  const used = new Set<string>();
  const toc: TocEntry[] = [];
  for (const h of headings) {
    const text = plainText(h.text);
    const base = slugify(text);
    let id = base;
    for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    h.nbId = id;
    h.nbLevel = h.depth - top + 2;
    h.nbSection = h.depth === top;
    if (h.nbSection) toc.push({ id, text });
  }
  return { tokens, toc };
}

export function renderPost(md: string): { html: string; toc: TocEntry[] } {
  const { tokens, toc } = prepare(md);
  return { html: marked.parser(tokens), toc };
}

export function renderMarkdown(md: string): string {
  return renderPost(md).html;
}

/** Parses a `---` delimited block of flat `key: value` pairs. Values are JSON or bare strings. */
export function parsePost(slug: string, raw: string): Post {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`Post "${slug}" is missing front matter`);
  const meta: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 0) throw new Error(`Post "${slug}": bad front matter line "${line}"`);
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    try {
      meta[key] = JSON.parse(val);
    } catch {
      meta[key] = val;
    }
  }
  const need = (k: string) => {
    if (typeof meta[k] !== "string" || !meta[k]) throw new Error(`Post "${slug}" is missing "${k}"`);
    return String(meta[k]);
  };
  return {
    slug,
    title: need("title"),
    date: need("date"),
    description: need("description"),
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
    cover: typeof meta.cover === "string" ? meta.cover : undefined,
    originalUrl: typeof meta.originalUrl === "string" ? meta.originalUrl : undefined,
    body: m[2].trim(),
  };
}

export const sortPosts = (posts: Post[]) =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export function formatDate(iso: string): string {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

/** "31 May 2025", for the narrow margin column. */
export function formatShortDate(iso: string): string {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString("en-GB", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}

/** "#web-security" from a front-matter tag like "Web Security". */
export const tagLabel = (tag: string) => `#${slugify(tag)}`;

export function readingMinutes(md: string): number {
  return Math.max(1, Math.round(md.split(/\s+/).length / 220));
}
