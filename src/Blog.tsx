import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ArrowLeft } from "lucide-react";
import {
  formatDate, formatShortDate, readingMinutes, renderPost, tagLabel, type Post, type TocEntry,
} from "./lib/blog";
import { POSTS, findPost, neighbours, postNumber } from "./posts";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

const noteNumber = (slug: string) => `N° ${String(postNumber(slug)).padStart(3, "0")}`;

function TagLine({ tags, minutes }: { tags: string[]; minutes?: number }) {
  if (!tags.length && !minutes) return null;
  return (
    <p className="nb-tags">
      {tags.map(tagLabel).join(" ")}
      {minutes ? <span className="nb-muted"> · {minutes} min</span> : null}
    </p>
  );
}

export function BlogIndex() {
  useDocumentTitle("Blog | Hardik Nanda");

  return (
    <section className="notebook max-w-3xl mx-auto px-6 py-16 fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4 mbe-8">
        <div>
          <p className="nb-mono text-[var(--accent)] mbe-2">~/blog</p>
          <h1 className="nb-serif text-4xl sm:text-5xl font-semibold tracking-tight">Blog</h1>
          <p className="mbs-3 text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] max-w-xl">
            Notes on application security, web security and DevSecOps.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-[var(--muted)]">
          <span>{POSTS.length} {POSTS.length === 1 ? "post" : "posts"}</span>
          <a href="/rss.xml" className="underline underline-offset-3 hover:text-[var(--ink)] transition-colors">
            RSS
          </a>
        </div>
      </div>

      <ol className="nb-sheet nb-list" aria-label="All posts">
        {POSTS.map(post => (
          <li key={post.slug} className="nb-entry">
            <div className="nb-gutter">
              <time dateTime={post.date}>{formatShortDate(post.date)}</time>
            </div>
            <article>
              <h2 className="nb-entry-title">
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h2>
              <p className="nb-entry-desc">{post.description}</p>
              <TagLine tags={post.tags} minutes={readingMinutes(post.body)} />
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The last section heading that has scrolled past the top of the screen. */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.25;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API needs a secure context; fall back to a hidden textarea.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** Copy buttons come from the markdown renderer as plain HTML, so one listener handles them all. */
function useCopyButtons(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers = new WeakMap<HTMLButtonElement, number>();
    const onClick = async (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>(".copy-code");
      if (!button) return;
      const label = button.dataset.label ?? "Copy code";
      const code = button.closest(".code-block")?.querySelector("code")?.textContent ?? "";
      const ok = await copyText(code);
      button.textContent = ok ? "Copied" : "Failed";
      button.setAttribute("aria-label", ok ? "Copied" : "Copy failed");
      window.clearTimeout(timers.get(button));
      timers.set(button, window.setTimeout(() => {
        button.textContent = "Copy";
        button.setAttribute("aria-label", label);
      }, 1500));
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [ref]);
}

const RICH_BLOCKS = ".nb-post-header, .nb-toc-mobile, .nb-prose > :is(.code-block, .table-wrap, .margin-note, blockquote, hr, p:has(img))";

/** Pads blocks whose height is not a whole number of ruled lines, so the text after them stays on the lines. */
function useRuledRhythm(ref: RefObject<HTMLElement | null>, html: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(RICH_BLOCKS));
    const base = new Map(blocks.map(el => [el, parseFloat(getComputedStyle(el).marginBlockEnd) || 0]));
    const snap = () => {
      const rule = parseFloat(getComputedStyle(root).getPropertyValue("--rule-h")) || 32;
      for (const el of blocks) {
        const own = base.get(el) ?? 0;
        const extra = (rule - ((el.getBoundingClientRect().height + own) % rule)) % rule;
        el.style.marginBlockEnd = extra > 0.5 ? `${own + extra}px` : "";
      }
    };
    const observer = new ResizeObserver(snap);
    blocks.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ref, html]);
}

function TocList({ toc, active }: { toc: TocEntry[]; active: string }) {
  return (
    <ol className="nb-toc-list">
      {toc.map((t, i) => (
        <li key={t.id}>
          <a href={`#${t.id}`} aria-current={t.id === active ? "location" : undefined}>
            <span aria-hidden="true">§{i + 1} </span>{t.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

function PostCard({ post, label, align }: { post: Post; label: string; align?: "end" }) {
  return (
    <a href={`/blog/${post.slug}`} className={`nb-card${align === "end" ? " nb-card-end" : ""}`}>
      <span className="nb-mono nb-muted">{label}</span>
      <span className="nb-serif nb-card-title">{post.title}</span>
    </a>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const post = findPost(slug);
  const { html, toc } = useMemo(() => (post ? renderPost(post.body) : { html: "", toc: [] }), [post]);
  const ids = useMemo(() => toc.map(t => t.id), [toc]);
  // A new __html object makes React rewrite innerHTML, wiping copy labels and line padding on every re-render.
  const prose = useMemo(() => ({ __html: html }), [html]);
  const active = useActiveHeading(ids);
  const articleRef = useRef<HTMLElement>(null);
  useCopyButtons(articleRef);
  useRuledRhythm(articleRef, html);
  useDocumentTitle(post ? `${post.title} | Hardik Nanda` : "Not found | Hardik Nanda");

  if (!post) return <NotFound />;

  const { older, newer } = neighbours(post.slug);
  const minutes = readingMinutes(post.body);

  return (
    <div className="notebook max-w-6xl mx-auto px-3 sm:px-6 pbs-6 sm:pbs-10 pbe-16 fade-in">
      <a href="/blog" className="with-icon nb-mono nb-back">
        <ArrowLeft /> All posts
      </a>

      <div className="nb-post-layout">
        <article ref={articleRef} className="nb-sheet nb-post">
          <header className="nb-post-header">
            <p className="nb-gutter nb-post-meta">
              <span>{noteNumber(post.slug)}</span>
              <time dateTime={post.date} title={formatDate(post.date)}>{formatShortDate(post.date)}</time>
              <span>{minutes} min read</span>
            </p>
            <h1 className="nb-serif nb-post-title">{post.title}</h1>
            <p className="nb-serif nb-post-desc">{post.description}</p>
            <TagLine tags={post.tags} />
          </header>

          {toc.length > 1 && (
            <details className="nb-toc-mobile">
              <summary>On this page</summary>
              <TocList toc={toc} active={active} />
            </details>
          )}

          <div className="prose-blog nb-prose" dangerouslySetInnerHTML={prose} />

          <footer className="nb-post-footer">
            {(older || newer) && (
              <nav aria-label="More posts" className="nb-pager">
                {older && <PostCard post={older} label="← Older" />}
                {newer && <PostCard post={newer} label="Newer →" align="end" />}
              </nav>
            )}
          </footer>
        </article>

        {toc.length > 1 && (
          <aside aria-label="On this page" className="nb-toc">
            <p className="nb-mono nb-muted nb-eyebrow">On this page</p>
            <TocList toc={toc} active={active} />
          </aside>
        )}
      </div>
    </div>
  );
}

export function NotFound() {
  useDocumentTitle("Not found | Hardik Nanda");
  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <p className="text-sm font-medium text-[var(--accent)] mbe-4">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mbs-4 text-[var(--muted)]">
        <a href="/" className="underline underline-offset-2 hover:text-[var(--ink)] transition-colors">Home</a>
        {" · "}
        <a href="/blog" className="underline underline-offset-2 hover:text-[var(--ink)] transition-colors">Blog</a>
      </p>
    </section>
  );
}
