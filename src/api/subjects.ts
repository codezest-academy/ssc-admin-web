import { api } from "@/lib/axios";

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  chapters?: import("./chapters").Chapter[];
}

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get("/subjects");
  return response.data.data;
};

export const getSubjectBySlug = async (slug: string): Promise<Subject> => {
  const response = await api.get(`/subjects/${slug}`);
  return response.data.data;
};

export const createSubject = async (data: { name: string; description?: string }): Promise<Subject> => {
  const response = await api.post("/subjects", data);
  return response.data.data;
};

export const updateSubject = async ({ id, ...data }: { id: string; name?: string; description?: string; isActive?: boolean; order?: number }): Promise<Subject> => {
  const response = await api.patch(`/subjects/${id}`, data);
  return response.data.data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete(`/subjects/${id}`);
};
