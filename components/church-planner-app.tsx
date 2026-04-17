"use client";

import { useEffect, useState } from "react";
import { addMinutes, differenceInMinutes, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { CalendarDays, ClipboardList, Home, Sparkles } from "lucide-react";
import { CalendarSection } from "./calendar-section";
import { DashboardPanel } from "./dashboard-panel";
import { SuccessToast } from "./success-toast";
import { TaskSection } from "./task-section";
import { ThemeToggle } from "./theme-toggle";
import { ActivityType, CalendarView, EventItem, TaskItem } from "@/lib/types";
import { loadEvents, loadTasks, loadTheme, saveEvents, saveTasks, saveTheme } from "@/lib/storage";

const NOTIFICATION_WINDOW_MINUTES = 10;

interface EventFormInput {
  title: string;
  description?: string;
  datetime: string;
  location?: string;
  type: ActivityType;
}

interface TaskInput {
  name: string;
  deadlineDate?: string;
  deadlineTime?: string;
}

type AppTab = "inicio" | "calendario" | "tareas";

export function ChurchPlannerApp() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [view, setView] = useState<CalendarView>("dia");
  const [activeFilter, setActiveFilter] = useState<ActivityType | "todos">("todos");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [autoDeleteCompleted, setAutoDeleteCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>("inicio");
  const [isBooting, setIsBooting] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setEvents(loadEvents());
    setTasks(loadTasks());
    setTheme(loadTheme());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => null);
    }
  }, []);

  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const now = new Date();
    const limit = addMinutes(now, NOTIFICATION_WINDOW_MINUTES);

    const upcomingEvents = events.filter((event) => {
      const eventDate = parseISO(event.datetime);
      return eventDate > now && eventDate <= limit;
    });

    upcomingEvents.forEach((event) => {
      const key = `notified-event-${event.id}`;
      if (window.sessionStorage.getItem(key)) {
        return;
      }
      const minutes = differenceInMinutes(parseISO(event.datetime), now);
      new Notification(`Recordatorio: ${event.title}`, {
        body: `Comienza en ${minutes} minutos${event.location ? ` en ${event.location}` : ""}.`
      });
      window.sessionStorage.setItem(key, "true");
    });
  }, [events]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const saveEvent = (input: EventFormInput, id?: string) => {
    const normalized: EventItem = {
      id: id ?? uuidv4(),
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      datetime: new Date(input.datetime).toISOString(),
      location: input.location?.trim() || undefined,
      type: input.type
    };

    setEvents((prev) => {
      if (!id) {
        return [...prev, normalized];
      }
      return prev.map((event) => (event.id === id ? normalized : event));
    });
    setToastMessage(id ? "Evento actualizado con éxito" : "Evento agregado con éxito");
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const createTask = (input: TaskInput) => {
    const newTask: TaskItem = {
      id: uuidv4(),
      name: input.name.trim(),
      deadlineDate: input.deadlineDate || undefined,
      deadlineTime: input.deadlineTime || undefined,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
    setToastMessage("Tarea creada con éxito");
  };

  const toggleTask = (id: string, checked: boolean) => {
    if (autoDeleteCompleted && checked) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return;
    }
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: checked } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const now = new Date();
  const pendingTaskCount = tasks.filter((task) => !task.completed).length;
  const todayEventCount = events.filter((event) => new Date(event.datetime).toDateString() === now.toDateString()).length;

  const tabClass = (tab: AppTab) =>
    activeTab === tab
      ? "rounded-2xl bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20"
      : "rounded-2xl bg-transparent px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-700";

  if (isBooting) {
    return (
      <main className="splash-enter flex min-h-screen items-center justify-center px-5">
        <section className="card w-full max-w-sm text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-slate-700 dark:text-brand-100">
            <Sparkles size={22} />
          </div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            Agenda Ministerial
            <span className="ml-1 bg-gradient-to-r from-brand-500 via-brand-500 to-brand-700 bg-clip-text text-transparent">
              Sana Nuestra Tierra
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Preparando tu espacio de organización...</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-brand-500" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl space-y-4 px-4 py-4 pb-24 sm:space-y-5 sm:px-6 sm:pb-6">
      {activeTab === "inicio" && (
        <>
          <header className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-[2.05rem]">
                Agenda Ministerial
                <span className="block bg-gradient-to-r from-brand-500 via-brand-500 to-brand-700 bg-clip-text text-transparent">
                  Sana Nuestra Tierra
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Organiza tu calendario, tareas y actividades pastorales en minutos.
              </p>
            </div>
            <ThemeToggle theme={theme} onToggle={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))} />
          </header>

          <section className="card flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-brand-50 px-3 py-2 dark:bg-slate-700/70">
              <Sparkles size={16} className="text-brand-600 dark:text-brand-100" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-300">Hoy</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{todayEventCount} actividades</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right dark:bg-slate-700/70">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-300">Pendientes</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pendingTaskCount} tareas</p>
            </div>
          </section>

        </>
      )}

      <nav className="card hidden sm:block">
        <div className="flex gap-2 rounded-2xl bg-slate-100/90 p-1.5 dark:bg-slate-700/50">
          <button type="button" className={tabClass("inicio")} onClick={() => setActiveTab("inicio")}>
            Inicio
          </button>
          <button type="button" className={tabClass("calendario")} onClick={() => setActiveTab("calendario")}>
            Calendario
          </button>
          <button type="button" className={tabClass("tareas")} onClick={() => setActiveTab("tareas")}>
            Tareas
          </button>
        </div>
      </nav>

      {activeTab === "inicio" && (
        <div key="tab-inicio" className="tab-content-enter">
          <DashboardPanel events={events} tasks={tasks} now={now} onGoToTasks={() => setActiveTab("tareas")} />
        </div>
      )}

      {activeTab === "calendario" && (
        <div key="tab-calendario" className="tab-content-enter">
          <CalendarSection
            events={events}
            selectedDate={selectedDate}
            view={view}
            activeFilter={activeFilter}
            onViewChange={setView}
            onDateChange={setSelectedDate}
            onFilterChange={setActiveFilter}
            onSaveEvent={saveEvent}
            onDeleteEvent={deleteEvent}
          />
        </div>
      )}

      {activeTab === "tareas" && (
        <div key="tab-tareas" className="tab-content-enter">
          <TaskSection
            tasks={tasks}
            autoDeleteCompleted={autoDeleteCompleted}
            onAutoDeleteChange={setAutoDeleteCompleted}
            onCreateTask={createTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/80 bg-white/90 px-4 py-2.5 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 sm:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2 rounded-2xl bg-slate-100/90 p-1.5 dark:bg-slate-800/80">
          <button
            type="button"
            className={`flex flex-col items-center rounded-xl py-2 text-xs font-semibold transition ${
              activeTab === "inicio"
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-100"
                : "text-slate-600 dark:text-slate-300"
            }`}
            onClick={() => setActiveTab("inicio")}
          >
            <Home size={18} />
            Inicio
          </button>
          <button
            type="button"
            className={`flex flex-col items-center rounded-xl py-2 text-xs font-semibold transition ${
              activeTab === "calendario"
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-100"
                : "text-slate-600 dark:text-slate-300"
            }`}
            onClick={() => setActiveTab("calendario")}
          >
            <CalendarDays size={18} />
            Calendario
          </button>
          <button
            type="button"
            className={`relative flex flex-col items-center rounded-xl py-2 text-xs font-semibold transition ${
              activeTab === "tareas"
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-100"
                : "text-slate-600 dark:text-slate-300"
            }`}
            onClick={() => setActiveTab("tareas")}
          >
            <ClipboardList size={18} />
            Tareas
            {pendingTaskCount > 0 ? (
              <span className="absolute right-3 top-1 rounded-full bg-brand-500 px-1.5 text-[10px] font-semibold text-white">
                {pendingTaskCount}
              </span>
            ) : null}
          </button>
        </div>
      </nav>
      {toastMessage ? <SuccessToast message={toastMessage} /> : null}
    </main>
  );
}
