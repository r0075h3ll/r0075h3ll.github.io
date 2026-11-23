import { parsePost, sortPosts } from "./lib/blog";

const files = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const POSTS = sortPosts(
  Object.entries(files).map(([path, raw]) =>
    parsePost(path.split("/").pop()!.replace(/\.md$/, ""), raw)
  )
);

export const findPost = (slug: string) => POSTS.find(p => p.slug === slug);

/** Chronological number, oldest post = 1. POSTS is newest first. */
export const postNumber = (slug: string) => {
  const i = POSTS.findIndex(p => p.slug === slug);
  return i < 0 ? 0 : POSTS.length - i;
};

/** The posts written just before and just after this one. */
export function neighbours(slug: string) {
  const i = POSTS.findIndex(p => p.slug === slug);
  return { older: POSTS[i + 1], newer: i > 0 ? POSTS[i - 1] : undefined };
}
