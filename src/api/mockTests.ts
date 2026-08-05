import { api } from "@/lib/axios";
import type { Question } from "./questions";

export interface MockTest {
  id: string;
  title: string;
  examType: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  markingCorrect: number;
  markingIncorrect: number;
  markingSkipped: number;
  isFree: boolean;
  isActive: boolean;
  scheduledAt: string | null;
  sections?: MockTestSection[];
  createdAt: string;
  updatedAt: string;
}

export interface MockTestSection {
  id: string;
  mockTestId: string;
  name: string;
  subjectId: string;
  questionCount: number;
  maxMarks: number;
  durationMins: number | null;
  order: number;
  questions?: MockTestSectionQuestion[];
}

export interface MockTestSectionQuestion {
  sectionId: string;
  questionId: string;
  order: number;
  question: Question;
}

export async function getMockTests() {
  const { data } = await api.get<{ data: MockTest[] }>("/mock-tests");
  return data.data;
}

export async function getMockTestById(id: string) {
  const { data } = await api.get<{ data: MockTest }>(`/mock-tests/${id}`);
  return data.data;
}

export async function createMockTest(payload: Partial<MockTest>) {
  const { data } = await api.post<{ data: MockTest }>("/mock-tests", payload);
  return data.data;
}

export async function updateMockTest(id: string, payload: Partial<MockTest>) {
  const { data } = await api.patch<{ data: MockTest }>(`/mock-tests/${id}`, payload);
  return data.data;
}

export async function deleteMockTest(id: string) {
  const { data } = await api.delete(`/mock-tests/${id}`);
  return data;
}

// Sections
export async function createSection(testId: string, payload: Partial<MockTestSection>) {
  const { data } = await api.post<{ data: MockTestSection }>(`/mock-tests/${testId}/sections`, payload);
  return data.data;
}

export async function updateSection(sectionId: string, payload: Partial<MockTestSection>) {
  const { data } = await api.patch<{ data: MockTestSection }>(`/mock-tests/sections/${sectionId}`, payload);
  return data.data;
}

export async function deleteSection(sectionId: string) {
  const { data } = await api.delete(`/mock-tests/sections/${sectionId}`);
  return data;
}

// Questions in Sections
export async function assignQuestionsToSection(sectionId: string, questionIds: string[]) {
  const { data } = await api.post(`/mock-tests/sections/${sectionId}/questions`, { questionIds });
  return data;
}

export async function removeQuestionFromSection(sectionId: string, questionId: string) {
  const { data } = await api.delete(`/mock-tests/sections/${sectionId}/questions/${questionId}`);
  return data;
}
