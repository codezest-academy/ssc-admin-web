import { api } from "@/lib/axios";

export interface Article {
  id: string;
  title: string;
  slug: string;
  contentMd: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string } | null;
  author?: { id: string; name: string } | null;
}

export interface ArticleFormData {
  title: string;
  contentMd: string;
  categoryId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
}

export const getArticles = async (params?: {
  isPublished?: boolean;
  categoryId?: string;
}): Promise<Article[]> => {
  const response = await api.get("/articles", { params });
  return response.data.data;
};

export const getArticleById = async (id: string): Promise<Article> => {
  const response = await api.get("/articles");
  const all: Article[] = response.data.data;
  const found = all.find((a) => a.id === id);
  if (!found) throw new Error(`Article ${id} not found`);
  return found;
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const response = await api.get(`/articles/${slug}`);
  return response.data.data;
};

export const createArticle = async (data: ArticleFormData): Promise<Article> => {
  const response = await api.post("/articles", data);
  return response.data.data;
};

export const updateArticle = async ({
  id,
  ...data
}: { id: string } & Partial<ArticleFormData>): Promise<Article> => {
  const response = await api.patch(`/articles/${id}`, data);
  return response.data.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/articles/${id}`);
};
