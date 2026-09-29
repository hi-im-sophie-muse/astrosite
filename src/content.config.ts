console.log('works config here');
// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { defineCollection } from "astro:content";
// Import Zod
import { z } from "astro/zod";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string())
    })
});
// Export a single `collections` object to register your collection(s)

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['game', 'album', 'concert','Easy Listening', 'SUPERCALIFRAGILISTICacapellaDOCIOUS']),
    year: z.number(),
    summary: z.string().min(80).max(320),
    tracks: z
      .array(
        z.object({
          title: z.string(),
          duration: z.string().regex(/^\d+:\d{2}$/),
          description: z.string().min(40),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, works };