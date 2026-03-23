import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const notes = await getCollection('notes', ({ data }) => !data.draft);

  const items = notes
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/notes/${post.id}/`,
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Johnny Greco',
    description: 'AI engineer, ex-astronomer, perpetual builder.',
    site: context.site!,
    items,
  });
}
