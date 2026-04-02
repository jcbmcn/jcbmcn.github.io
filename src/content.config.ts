import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    featuredImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    subtitle: z.string().optional(),
    fontawesome: z.boolean().optional(),
    code: z.object({ copy: z.boolean() }).optional(),
  }),
});

export const collections = { blog };
