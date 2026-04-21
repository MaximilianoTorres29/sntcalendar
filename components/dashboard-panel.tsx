"use client";

import { useMemo, useState } from "react";
import { format, isAfter, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { EventItem, TaskItem } from "@/lib/types";
import { CalendarClock, CheckCircle2, Circle, Inbox, MoreVertical, PlusCircle } from "lucide-react";

interface DashboardPanelProps {
  events: EventItem[];
  tasks: TaskItem[];
  now: Date;
  onGoToTasks: () => void;
  onQuickCreateTask: (name: string) => void;
  onToggleTask: (id: string, checked: boolean) => void;
}

const toLocalTaskDate = (task: TaskItem) => {
  if (!task.deadlineDate) {
    return null;
  }

  const [year, month, day] = task.deadlineDate.split("-").map((value) => Number(value));
  if (!year || !month || !day) {
    return null;
  }

  const [hours, minutes] = (task.deadlineTime ?? "23:59").split(":").map((value) => Number(value));
  return new Date(year, month - 1, day, Number.isNaN(hours) ? 23 : hours, Number.isNaN(minutes) ? 59 : minutes);
};

export function DashboardPanel({ events, tasks, now, onGoToTasks, onQuickCreateTask, onToggleTask }: DashboardPanelProps) {
  const [quickTaskName, setQuickTaskName] = useState("");

  const pendingTasks = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed)
        .sort((a, b) => {
          const aDate = toLocalTaskDate(a);
          const bDate = toLocalTaskDate(b);

          if (aDate && bDate) {
            return aDate.getTime() - bDate.getTime();
          }
          if (aDate && !bDate) {
            return -1;
          }
          if (!aDate && bDate) {
            return 1;
          }
          return a.createdAt.localeCompare(b.createdAt);
        }),
    [tasks]
  );
  const completedCount = tasks.filter((task) => task.completed).length;

  const importantEvents = events
    .filter((event) => isSameDay(parseISO(event.datetime), now) || isAfter(parseISO(event.datetime), now))
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
    .slice(0, 3);

  const handleQuickTaskSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!quickTaskName.trim()) {
      return;
    }
    onQuickCreateTask(quickTaskName.trim());
    setQuickTaskName("");
  };

  const formattedDate = format(now, "EEEE, dd MMMM", { locale: es });
  const formattedDateWithCapital = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <section className="space-y-4">
      <article className="card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Mis tareas diarias</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {formattedDateWithCapital}
            </h2>
          </div>
          <button type="button" className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
            <MoreVertical size={16} />
          </button>
        </div>

        <form
          onSubmit={handleQuickTaskSubmit}
          className="flex items-center gap-2 rounded-xl px-1 py-1"
        >
          <button
            type="submit"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-slate-700"
            aria-label="Agregar tarea"
          >
            <PlusCircle size={18} />
          </button>
          <input
            className="w-full bg-transparent text-sm font-medium text-brand-700 outline-none placeholder:text-brand-700/80 dark:text-brand-200 dark:placeholder:text-brand-200/80"
            placeholder="Agregar una tarea"
            value={quickTaskName}
            onChange={(event) => setQuickTaskName(event.target.value)}
          />
        </form>

        <div className="rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-700/60 dark:text-slate-200">
          Mis tareas ({pendingTasks.length})
        </div>

        <div>
          {pendingTasks.length === 0 ? (
            <p className="empty-state">
              <Inbox size={15} />
              No hay tareas pendientes.
            </p>
          ) : (
            pendingTasks.map((task, index) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onToggleTask(task.id, true)}
                className="relative flex w-full items-center gap-2.5 px-2 py-2 text-left transition hover:bg-slate-50/70 dark:hover:bg-slate-700/20"
              >
                <span className="text-slate-500 dark:text-slate-300">
                  <Circle size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.03rem] text-slate-800 dark:text-slate-100">{task.name}</span>
                  {task.deadlineDate && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {(() => {
                        const dueDate = toLocalTaskDate(task);
                        if (!dueDate) {
                          return null;
                        }
                        return `Fecha: ${format(dueDate, "dd/MM/yyyy HH:mm", { locale: es })}`;
                      })()}
                    </span>
                  )}
                </span>
                {index !== pendingTasks.length - 1 ? (
                  <span className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-400/70 to-transparent dark:via-slate-500/80" />
                ) : null}
              </button>
            ))
          )}
        </div>

        <div className="pt-1">
          <button type="button" onClick={onGoToTasks} className="text-sm font-medium text-brand-700 underline-offset-2 transition hover:underline dark:text-brand-200">
            Ver lista completa
          </button>
        </div>

        <div className="border-t border-slate-200 pt-2 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Completadas ({completedCount})
          </p>
        </div>
      </article>

      <article className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="section-title">Eventos y fechas importantes</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
            {importantEvents.length}
          </span>
        </div>
        {importantEvents.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay eventos próximos.
          </p>
        ) : (
          importantEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-700/40">
              <span className="rounded-xl bg-brand-100 p-1.5 text-brand-700 dark:bg-slate-700 dark:text-brand-100">
                <CalendarClock size={15} />
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-100">
                <span className="font-semibold">{event.title}</span> - {format(parseISO(event.datetime), "dd/MM HH:mm")}
              </p>
            </div>
          ))
        )}
        <div className="flex justify-end">
          <button type="button" onClick={onGoToTasks} className="button-secondary inline-flex items-center gap-2">
            <CheckCircle2 size={15} />
            Ir a tareas
          </button>
        </div>
      </article>
    </section>
  );
}
