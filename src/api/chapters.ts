import { api } from "@/lib/axios";

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    lessons: number;
  };
}

export const getChapterById = async (id: string): Promise<Chapter> => {
  const response = await api.get(`/chapters/${id}`);
  return response.data.data;
};

export const getChaptersBySubject = async (subjectId: string): Promise<Chapter[]> => {
  const response = await api.get(`/subjects/${subjectId}/chapters`);
  return response.data.data;
};

export const createChapter = async (data: { subjectId: string; name: string; description?: string }): Promise<Chapter> => {
  const response = await api.post("/chapters", data);
  return response.data.data;
};

export const updateChapter = async ({ id, ...data }: { id: string; name?: string; description?: string; isActive?: boolean; order?: number }): Promise<Chapter> => {
  const response = await api.patch(`/chapters/${id}`, data);
  return response.data.data;
};

export const deleteChapter = async (id: string): Promise<void> => {
  await api.delete(`/chapters/${id}`);
};

export const reorderChapters = async (updates: { id: string; order: number }[]): Promise<void> => {
  await api.patch("/chapters/reorder", { updates });
};
