import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {SITE_URL, parsePost, renderMarkdown, sortPosts, type Post} from './src/lib/blog';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadPosts(root: string): Post[] {
  const dir = path.resolve(root, 'content/blog');
  return sortPosts(
    fs
      .readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => parsePost(f.replace(/\.md$/, ''), fs.readFileSync(path.join(dir, f), 'utf8'))),
  );
}

/**
 * GitHub Pages only serves files that exist, so every route gets its own copy of
 * the built index.html with the right <title>/meta tags and, for posts, the
 * article already rendered inside #root. The client bundle then takes over.
 * Also emits 404.html (the SPA shell), rss.xml and sitemap.xml.
 */
function blogPages(): Plugin {
  let root = process.cwd();
  let outDir = 'dist';
  return {
    name: 'blog-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const write = (rel: string, content: string) => {
        const file = path.join(outDir, rel);
        fs.mkdirSync(path.dirname(file), {recursive: true});
        fs.writeFileSync(file, content);
      };
      const page = (o: {title: string; description: string; url: string; image?: string; type: string; body?: string; noindex?: boolean}) => {
        const meta = [
          `<title>${esc(o.title)}</title>`,
          `<meta name="description" content="${esc(o.description)}" />`,
          o.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${o.url}" />`,
          `<meta property="og:type" content="${o.type}" />`,
          `<meta property="og:title" content="${esc(o.title)}" />`,
          `<meta property="og:description" content="${esc(o.description)}" />`,
          `<meta property="og:url" content="${o.url}" />`,
          ...(o.image ? [`<meta property="og:image" content="${o.image}" />`, '<meta name="twitter:card" content="summary_large_image" />'] : []),
        ].join('\n    ');
        let html = shell.replace(/<!-- page-meta:start -->[\s\S]*?<!-- page-meta:end -->/, meta);
        if (o.body) html = html.replace('<div id="root"></div>', () => `<div id="root">${o.body}</div>`);
        return html;
      };

      const posts = loadPosts(root);

      for (const post of posts) {
        const url = `${SITE_URL}/blog/${post.slug}`;
        write(`blog/${post.slug}/index.html`, page({
          title: `${post.title} | Hardik Nanda`,
          description: post.description,
          url,
          type: 'article',
          image: post.cover ? SITE_URL + post.cover : undefined,
          body: `<article><h1>${esc(post.title)}</h1>${renderMarkdown(post.body)}</article>`,
        }));
      }

      write('blog/index.html', page({
        title: 'Blog | Hardik Nanda',
        description: 'Notes on application security, web security and DevSecOps.',
        url: `${SITE_URL}/blog`,
        type: 'website',
      }));

      write('404.html', page({
        title: 'Not found | Hardik Nanda',
        description: 'Page not found.',
        url: SITE_URL,
        type: 'website',
        noindex: true,
      }));

      const rfc822 = (d: string) => new Date(`${d}T00:00:00Z`).toUTCString();
      write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hardik Nanda</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on application security, web security and DevSecOps.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${posts.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.description)}</description>
${p.tags.map(t => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>
`);

      write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
  <url><loc>${SITE_URL}/blog</loc></url>
${posts.map(p => `  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`).join('\n')}
</urlset>
`);
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), blogPages()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Allow disabling HMR via env var when needed in constrained environments.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
