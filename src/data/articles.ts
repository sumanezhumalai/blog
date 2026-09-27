import { getCollection, type CollectionEntry } from "astro:content";

export const getAllArticles = async (): Promise<CollectionEntry<"articles">[]> => {
  const articles = await getCollection("articles");
  return articles.filter((article) => !article.data.draft);
};

export const sortArticlesByPublicationDate = (
  a: CollectionEntry<"articles">,
  b: CollectionEntry<"articles">
): number => {
  return b.data.publicationDate.getTime() - a.data.publicationDate.getTime();
};

export const getDevArticles = async (
  limit?: number
): Promise<CollectionEntry<"articles">[]> => {
  const articles = await getAllArticles();
  return articles.sort(sortArticlesByPublicationDate).slice(0, limit);
};
