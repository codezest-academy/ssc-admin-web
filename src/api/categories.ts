import { api } from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await api.get(`/categories/${slug}`);
  return response.data.data;
};

export const createCategory = async (data: { name: string; description?: string }): Promise<Category> => {
  const response = await api.post("/categories", data);
  return response.data.data;
};

export const updateCategory = async ({ id, ...data }: { id: string; name?: string; description?: string; isActive?: boolean }): Promise<Category> => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
