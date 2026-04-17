import { EventItem, TaskItem } from "./types";

const EVENT_KEY = "churchplanner-events-v1";
const TASK_KEY = "churchplanner-tasks-v1";
const THEME_KEY = "churchplanner-theme-v1";

const canUseStorage = typeof window !== "undefined";

const safeRead = <T>(key: string, fallback: T): T => {
  if (!canUseStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("Error leyendo localStorage", error);
    return fallback;
  }
};

const safeWrite = <T>(key: string, value: T) => {
  if (!canUseStorage) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error guardando localStorage", error);
  }
};

export const loadEvents = () => safeRead<EventItem[]>(EVENT_KEY, []);
export const saveEvents = (events: EventItem[]) => safeWrite(EVENT_KEY, events);

export const loadTasks = () => safeRead<TaskItem[]>(TASK_KEY, []);
export const saveTasks = (tasks: TaskItem[]) => safeWrite(TASK_KEY, tasks);

export const loadTheme = () => safeRead<"light" | "dark">(THEME_KEY, "light");
export const saveTheme = (theme: "light" | "dark") => safeWrite(THEME_KEY, theme);
