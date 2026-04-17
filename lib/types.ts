export type ActivityType = "reunion" | "iglesia" | "personal";

export type CalendarView = "dia" | "semana" | "mes";

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  datetime: string;
  location?: string;
  type: ActivityType;
}

export interface TaskItem {
  id: string;
  name: string;
  deadlineDate?: string;
  deadlineTime?: string;
  completed: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  triggerAt: string;
}
