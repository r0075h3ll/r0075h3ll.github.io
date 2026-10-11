import { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { formatDate, readingMinutes, renderMarkdown, type Post } from "./lib/blog";
import { POSTS, findPost } from "./posts";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="text-sm text-[var(--muted)]">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span> · {readingMinutes(post.body)} min read</span>
    </p>
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--muted)]">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function BlogIndex() {
  useDocumentTitle("Blog | Hardik Nanda");

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4 mbe-10">
        <h1 className="text-sm font-medium text-[var(--accent)]">Blog</h1>
        <a href="/rss.xml" className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          RSS
        </a>
      </div>
      <div className="grid gap-12">
        {POSTS.map(post => (
          <article key={post.slug}>
            <a href={`/blog/${post.slug}`} className="group block">
              <h2 className="text-xl font-medium group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
            </a>
            <div className="mbs-1">
              <Meta post={post} />
            </div>
            <p className="text-[var(--ink-soft)] leading-relaxed mbs-3">{post.description}</p>
            <div className="mbs-4">
              <Tags tags={post.tags} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlogPost({ slug }: { slug: string }) {
  const post = findPost(slug);
  const html = useMemo(() => (post ? renderMarkdown(post.body) : ""), [post]);
  useDocumentTitle(post ? `${post.title} | Hardik Nanda` : "Not found | Hardik Nanda");

  if (!post) return <NotFound />;

  return (
    <article className="max-w-3xl mx-auto px-6 pbs-12 pbe-16 fade-in">
      <a
        href="/blog"
        className="with-icon text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
      >
        <ArrowLeft /> All posts
      </a>
      <header className="mbs-8 mbe-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">{post.title}</h1>
        <div className="mbs-3">
          <Meta post={post} />
        </div>
        <div className="mbs-4">
          <Tags tags={post.tags} />
        </div>
      </header>
      <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
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
