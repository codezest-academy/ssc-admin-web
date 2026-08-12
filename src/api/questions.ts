import { api } from "@/lib/axios";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ExamType = "SSC_CGL" | "SSC_CHSL" | "SSC_MTS" | "SSC_CPO" | "SSC_GD";
export type Language = "EN" | "HI";

export interface QuestionOption {
  key: string;
  text: string;
  imageUrl?: string | null;
  rationale?: string | null;
  formatType?: "TEXT" | "RICH_TEXT";
}

export interface Question {
  id: string;
  subjectId: string;
  chapterId: string;
  questionText: string;
  questionImageUrl?: string | null;
  options: QuestionOption[];
  correctOption: string;
  explanation?: string | null;
  explanationImageUrl?: string | null;
  difficulty: Difficulty;
  examTypes: ExamType[];
  pyqYear?: number | null;
  pyqShift?: number | null;
  pyqDate?: string | null;
  isPYQ: boolean;
  tags: string[];
  language: Language;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: string;
  chapterId?: string;
}

export interface PaginatedQuestions {
  data: Question[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type CreateQuestionInput = Omit<
  Question,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateQuestionInput = Partial<CreateQuestionInput>;

export const getQuestions = async (params?: GetQuestionsParams): Promise<PaginatedQuestions> => {
  const response = await api.get("/questions", { params });
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
};

export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await api.get(`/questions/${id}`);
  return response.data.data;
};

export const createQuestion = async (data: CreateQuestionInput): Promise<Question> => {
  const response = await api.post("/questions", data);
  return response.data.data;
};

export const updateQuestion = async (id: string, data: UpdateQuestionInput): Promise<Question> => {
  const response = await api.patch(`/questions/${id}`, data);
  return response.data.data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

export const bulkImportQuestions = async (questions: CreateQuestionInput[]): Promise<{ count: number }> => {
  const response = await api.post("/questions/bulk", { questions });
  return response.data.data;
};
