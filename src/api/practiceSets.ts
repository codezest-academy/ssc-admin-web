import { api } from "@/lib/axios";
import type { Question } from "./questions";

export interface PracticeSet {
  id: string;
  title: string;
  subjectId: string;
  chapterId?: string | null;
  lessonId?: string | null;
  questionCount: number;
  accessTier: 'FREE' | 'PRO' | 'EXCLUSIVE';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Included when fetching by ID
  questions?: {
    question: Question;
    order: number;
  }[];
}

export interface GetPracticeSetsParams {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: string;
  chapterId?: string;
}

export interface PaginatedPracticeSets {
  data: PracticeSet[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type CreatePracticeSetInput = {
  title: string;
  subjectId: string;
  chapterId?: string | null;
  lessonId?: string | null;
  accessTier?: 'FREE' | 'PRO' | 'EXCLUSIVE';
  order?: number;
  isActive?: boolean;
};

export type UpdatePracticeSetInput = Partial<CreatePracticeSetInput>;

export const getPracticeSets = async (params?: GetPracticeSetsParams): Promise<PaginatedPracticeSets> => {
  const response = await api.get("/practice-sets", { params });
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
};

export const getPracticeSetById = async (id: string): Promise<PracticeSet> => {
  const response = await api.get(`/practice-sets/${id}`);
  return response.data.data;
};

export const createPracticeSet = async (data: CreatePracticeSetInput): Promise<PracticeSet> => {
  const response = await api.post("/practice-sets", data);
  return response.data.data;
};

export const updatePracticeSet = async (id: string, data: UpdatePracticeSetInput): Promise<PracticeSet> => {
  const response = await api.patch(`/practice-sets/${id}`, data);
  return response.data.data;
};

export const deletePracticeSet = async (id: string): Promise<void> => {
  await api.delete(`/practice-sets/${id}`);
};

export const assignQuestionsToSet = async (id: string, questionIds: string[]): Promise<void> => {
  await api.post(`/practice-sets/${id}/questions`, { questionIds });
};

export const removeQuestionFromSet = async (id: string, questionId: string): Promise<void> => {
  await api.delete(`/practice-sets/${id}/questions/${questionId}`);
};
