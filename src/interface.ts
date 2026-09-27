import type { CollectionEntry } from "astro:content";

export enum ArticleType {
  DEV = "DEV",
  BEYOND = "BEYOND",
  SYSADMIN = "SYSADMIN",
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface ArticleMeta extends PageMeta {
  article: CollectionEntry<"articles">;
}
