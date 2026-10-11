import { Marked } from "marked";
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

const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const language = (lang ?? "").trim().split(/\s+/)[0];
      const body = hljs.getLanguage(language)
        ? hljs.highlight(text, { language, ignoreIllegals: true }).value
        : escapeHtml(text);
      const cls = language ? ` class="hljs language-${escapeHtml(language)}"` : ' class="hljs"';
      return `<pre><code${cls}>${body}</code></pre>\n`;
    },
    // Wide tables scroll inside their own box instead of the whole page.
    table(token) {
      const head = this.tablerow({ text: token.header.map(c => this.tablecell(c)).join("") });
      const rows = token.rows.map(r => this.tablerow({ text: r.map(c => this.tablecell(c)).join("") })).join("");
      return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
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

export function readingMinutes(md: string): number {
  return Math.max(1, Math.round(md.split(/\s+/).length / 220));
}
