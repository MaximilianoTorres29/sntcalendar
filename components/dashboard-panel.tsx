"use client";

import { format, isAfter, isSameDay, parseISO } from "date-fns";
import { EventItem, TaskItem } from "@/lib/types";
import { CalendarClock, CheckCircle2, Clock3, Inbox, Plus } from "lucide-react";

interface DashboardPanelProps {
  events: EventItem[];
  tasks: TaskItem[];
  now: Date;
  onGoToTasks: () => void;
}

export function DashboardPanel({ events, tasks, now, onGoToTasks }: DashboardPanelProps) {
  const todayEvents = events
    .filter((event) => isSameDay(parseISO(event.datetime), now))
    .sort((a, b) => a.datetime.localeCompare(b.datetime));

  const upcomingEvents = events
    .filter((event) => isAfter(parseISO(event.datetime), now))
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
    .slice(0, 4);

  const pendingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const aDate = `${a.deadlineDate ?? ""} ${a.deadlineTime ?? ""}`.trim();
      const bDate = `${b.deadlineDate ?? ""} ${b.deadlineTime ?? ""}`.trim();
      return aDate.localeCompare(bDate);
    })
    .slice(0, 5);

  return (
    <section className="card space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Dashboard de hoy</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Resumen rápido para planificar tu jornada</p>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-slate-700 dark:text-brand-100">
          {format(now, "dd/MM/yyyy")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-3.5 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Actividades hoy</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-brand-700 dark:text-brand-100">{todayEvents.length}</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-3.5 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Próximos eventos</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-brand-700 dark:text-brand-100">{upcomingEvents.length}</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-3.5 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Tareas pendientes</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-brand-700 dark:text-brand-100">{pendingTasks.length}</p>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end">
        <button
          type="button"
          onClick={onGoToTasks}
          className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold tracking-tight text-brand-700 shadow-md shadow-brand-100/40 transition duration-200 hover:-translate-y-[1px] hover:border-brand-300 hover:shadow-lg hover:shadow-brand-200/50 dark:border-slate-600 dark:bg-slate-700 dark:text-brand-100 dark:shadow-none"
        >
          <span className="rounded-full bg-brand-100 p-1 text-brand-700 dark:bg-slate-600 dark:text-brand-100">
            <Plus size={14} />
          </span>
          Agregar tarea
        </button>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">Actividades de hoy</h3>
        {todayEvents.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay actividades para hoy.
          </p>
        ) : (
          todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-700/40">
              <span className="rounded-xl bg-brand-100 p-1.5 text-brand-700 dark:bg-slate-700 dark:text-brand-100">
                <CalendarClock size={15} />
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-100">
                <span className="font-semibold">{event.title}</span> - {format(parseISO(event.datetime), "HH:mm")}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">Próximos eventos</h3>
        {upcomingEvents.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay eventos próximos.
          </p>
        ) : (
          upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-700/40">
              <span className="rounded-xl bg-brand-100 p-1.5 text-brand-700 dark:bg-slate-700 dark:text-brand-100">
                <Clock3 size={15} />
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-100">
                <span className="font-semibold">{event.title}</span> - {format(parseISO(event.datetime), "dd/MM HH:mm")}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">Tareas pendientes</h3>
        {pendingTasks.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay tareas pendientes.
          </p>
        ) : (
          pendingTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 p-2.5 dark:border-slate-700 dark:bg-slate-700/40">
              <span className="rounded-xl bg-brand-100 p-1.5 text-brand-700 dark:bg-slate-700 dark:text-brand-100">
                <CheckCircle2 size={15} />
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-100">
                <span className="font-semibold">{task.name}</span>
                {task.deadlineDate || task.deadlineTime
                  ? ` - ${task.deadlineDate ? `Fecha: ${task.deadlineDate}` : ""}${
                      task.deadlineDate && task.deadlineTime ? " - " : ""
                    }${task.deadlineTime ? `Hora: ${task.deadlineTime}` : ""}`
                  : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
