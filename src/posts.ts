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
