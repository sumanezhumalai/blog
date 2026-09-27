import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/articles" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      type: z.enum(["DEV", "BEYOND", "SYSADMIN"]).default("DEV"),
      publicationDate: z.coerce.date().optional(),
      publishDate: z.coerce.date().optional(),
      readingTime: z.number().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    })
    .transform((data) => ({
      ...data,
      publicationDate: data.publicationDate ?? data.publishDate ?? new Date(),
      readingTime: data.readingTime ?? 7,
    })),
});

export const collections = {
  articles,
};
