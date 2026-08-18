import { api } from '@/lib/axios';

export interface ExamNotification {
  id: string;
  title: string;
  organization: string;
  vacancies: number;
  applicationStartDate: string;
  applicationEndDate: string;
  notificationLink: string;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateExamNotificationPayload = Omit<ExamNotification, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExamNotificationPayload = Partial<CreateExamNotificationPayload>;

export const getNotifications = async (all = true) => {
  const res = await api.get<{ data: ExamNotification[] }>(`/notifications?all=${all}`);
  return res.data.data;
};

export const getNotificationById = async (id: string) => {
  const res = await api.get<{ data: ExamNotification }>(`/notifications/${id}`);
  return res.data.data;
};

export const createNotification = async (data: CreateExamNotificationPayload) => {
  const res = await api.post<{ data: ExamNotification }>('/notifications', data);
  return res.data.data;
};

export const updateNotification = async (id: string, data: UpdateExamNotificationPayload) => {
  const res = await api.patch<{ data: ExamNotification }>(`/notifications/${id}`, data);
  return res.data.data;
};

export const deleteNotification = async (id: string) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};
