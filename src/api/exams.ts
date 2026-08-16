import { api } from '@/lib/axios';

export interface TargetExam {
  id: string;
  name: string;
  examYear?: number;
  description?: string;
  isActive: boolean;
  _count?: {
    syllabusNodes: number;
  };
}

export interface SyllabusNode {
  id: string;
  examId: string;
  subjectId: string;
  chapterId?: string;
  weightage: number;
  order: number;
  subject: {
    id: string;
    name: string;
    slug: string;
  };
  chapter?: {
    id: string;
    title: string;
    slug: string;
  };
}

export const examsApi = {
  // Exams
  getAll: async () => {
    const res = await api.get('/exams');
    return res.data?.data || [];
  },
  
  getById: async (id: string) => {
    const res = await api.get(`/exams/${id}`);
    return res.data?.data;
  },

  create: async (data: Partial<TargetExam>) => {
    const res = await api.post('/exams', data);
    return res.data?.data;
  },

  update: async (id: string, data: Partial<TargetExam>) => {
    const res = await api.put(`/exams/${id}`, data);
    return res.data?.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/exams/${id}`);
    return res.data?.data;
  },

  // Syllabus
  getSyllabus: async (examId: string) => {
    const res = await api.get(`/exams/${examId}/syllabus`);
    return res.data?.data || [];
  },

  addSyllabusNode: async (examId: string, data: Partial<SyllabusNode>) => {
    const res = await api.post(`/exams/${examId}/syllabus`, data);
    return res.data?.data;
  },

  deleteSyllabusNode: async (examId: string, nodeId: string) => {
    const res = await api.delete(`/exams/${examId}/syllabus/${nodeId}`);
    return res.data?.data;
  }
};
