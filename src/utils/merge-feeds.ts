import { getCollection } from 'astro:content';

export type FeedItemType = 'note' | 'external';

export interface FeedItem {
  type: FeedItemType;
  title: string;
  description: string;
  date: Date;
  url: string;
  tags: string[];
  publication?: string;
  id: string;
}

export async function getMergedFeed(): Promise<FeedItem[]> {
  const [notes, externalPosts] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('external'),
  ]);

  const items: FeedItem[] = [
    ...notes.map((post) => ({
      type: 'note' as const,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      url: `/notes/${post.id}/`,
      tags: post.data.tags,
      id: `note-${post.id}`,
    })),
    ...externalPosts.map((post) => ({
      type: 'external' as const,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      url: post.data.url,
      tags: post.data.tags,
      publication: post.data.publication,
      id: `external-${post.id}`,
    })),
  ];

  items.sort((a, b) => {
    const diff = b.date.getTime() - a.date.getTime();
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });

  return items;
}
