import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every .md file in src/content/blog becomes a post.
// The "front-matter" block at the top of each file must match this schema,
// otherwise the build fails with a clear error (like a compiler type check).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Path to an image in /public, e.g. "/images/my-post.jpg"
    heroImage: z.string().optional(),
    // Drafts show up in `npm run dev` but are left out of the real site.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
