import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes', ignore: ['**/.obsidian/**', '**/README.md'] }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    math: z.boolean().default(false),
  }),
});

const external = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/external' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    url: z.string().url(),
    publication: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, external };
