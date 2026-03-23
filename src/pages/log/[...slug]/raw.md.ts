import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export async function getStaticPaths() {
  const entries = await getCollection('log', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entryId: entry.id, title: entry.data.title, date: entry.data.date },
  }));
}

export function GET({ props }: APIContext) {
  const { entryId, title, date } = props as { entryId: string; title: string; date: Date };

  // Read raw markdown at build time
  let raw: string;
  try {
    const filePath = join(process.cwd(), 'src', 'content', 'log', `${entryId}.md`);
    raw = readFileSync(filePath, 'utf-8');
  } catch {
    raw = `---\ntitle: "${title}"\ndate: ${date.toISOString().split('T')[0]}\n---\n\nRaw source not available.\n`;
  }

  return new Response(raw, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
