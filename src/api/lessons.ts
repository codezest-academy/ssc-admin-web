import { api } from "@/lib/axios";

export type LessonType = "VIDEO" | "ARTICLE" | "PDF";

export interface Lesson {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  slug: string;
  type: LessonType;
  videoUrl: string | null;
  articleHtml: string | null;
  pdfUrl: string | null;
  durationMins: number | null;
  thumbnailUrl: string | null;
  order: number;
  accessTier: 'FREE' | 'PRO' | 'EXCLUSIVE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getLessonsByChapter = async (chapterId: string): Promise<Lesson[]> => {
  const response = await api.get(`/chapters/${chapterId}/lessons`);
  return response.data.data;
};

export const createLesson = async (data: {
  chapterId: string;
  subjectId: string;
  title: string;
  type: LessonType;
  videoUrl?: string;
  articleHtml?: string;
  pdfUrl?: string;
  durationMins?: number;
  thumbnailUrl?: string;
  accessTier?: 'FREE' | 'PRO' | 'EXCLUSIVE';
}): Promise<Lesson> => {
  const response = await api.post("/lessons", data);
  return response.data.data;
};

export const updateLesson = async ({
  id,
  ...data
}: {
  id: string;
  title?: string;
  type?: LessonType;
  videoUrl?: string | null;
  articleHtml?: string | null;
  pdfUrl?: string | null;
  durationMins?: number | null;
  thumbnailUrl?: string | null;
  order?: number;
  accessTier?: 'FREE' | 'PRO' | 'EXCLUSIVE';
  isActive?: boolean;
}): Promise<Lesson> => {
  const response = await api.patch(`/lessons/${id}`, data);
  return response.data.data;
};

export const deleteLesson = async (id: string): Promise<void> => {
  await api.delete(`/lessons/${id}`);
};
