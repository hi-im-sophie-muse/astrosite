// console.log('works config here');
// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { defineCollection } from "astro:content";
// Import Zod
import { z } from "astro/zod";
// Define a `loader` and `schema` for each collection

// THIS MODIFIES BLOG!!
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string(),
      }),
      tags: z.array(z.string())
    })
});
// Export a single `collections` object to register your collection(s)

// THIS IS THE ONE YOU WANT!!

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
    title: z.string(),
    kind: z.enum(['album', 'single']), // Rest in peace Easy Listening (0, 2) & 'SUPERCALIFRAGILISTICacapellaDOCIOUS' (1)
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
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    instrumentation: z.array(z.string()).default([]),
    coverArt: image().optional(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    group: z.string().default('Works'),
    client: z.string().optional(),
    role: z.string().default('Composer'),
    collaborators: z.array(z.object({ name: z.string(), role: z.string().optional(), url: z.url().optional() })).default([]),
    icon: z.string().optional(),
  }),
});

export const collections = { blog, works };
export const schemaTypeFor: Record<string, string> = {
  single: 'MusicRecording',
  album: 'MusicAlbum',
};