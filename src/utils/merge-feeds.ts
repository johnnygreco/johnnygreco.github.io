import { getCollection } from 'astro:content';
import { projects } from '../data/projects';

export type FeedItemType = 'note' | 'external';
export type ActivityItemType = FeedItemType | 'log' | 'project';

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

export interface ActivityItem {
  type: ActivityItemType;
  title: string;
  date: Date;
  url: string;
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

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const [notes, logEntries, externalPosts] = await Promise.all([
    getCollection('notes', ({ data }) => !data.draft && !data.hideFromActivity),
    getCollection('log', ({ data }) => !data.draft && !data.hideFromActivity),
    getCollection('external', ({ data }) => !data.hideFromActivity),
  ]);

  const items: ActivityItem[] = [
    ...notes.map((post) => ({
      type: 'note' as const,
      title: post.data.title,
      date: post.data.date,
      url: `/notes/${post.id}/`,
      id: `note-${post.id}`,
    })),
    ...logEntries.map((entry) => ({
      type: 'log' as const,
      title: entry.data.title,
      date: entry.data.date,
      url: `/log/${entry.id}/`,
      id: `log-${entry.id}`,
    })),
    ...externalPosts.map((post) => ({
      type: 'external' as const,
      title: post.data.title,
      date: post.data.date,
      url: post.data.url,
      id: `external-${post.id}`,
    })),
    ...projects
      .filter((p) => !p.hideFromActivity)
      .map((p) => ({
        type: 'project' as const,
        title: p.name,
        date: p.addedDate,
        url: p.url,
        id: `project-${p.name}`,
      })),
  ];

  items.sort((a, b) => {
    const diff = b.date.getTime() - a.date.getTime();
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });

  return items;
}
