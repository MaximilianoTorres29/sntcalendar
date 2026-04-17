"use client";

import { useMemo, useState } from "react";
import { Check, Inbox, Trash2 } from "lucide-react";
import { TaskItem } from "@/lib/types";

interface TaskSectionProps {
  tasks: TaskItem[];
  autoDeleteCompleted: boolean;
  onAutoDeleteChange: (value: boolean) => void;
  onCreateTask: (input: TaskInput) => void;
  onToggleTask: (id: string, checked: boolean) => void;
  onDeleteTask: (id: string) => void;
}

interface TaskInput {
  name: string;
  deadlineDate?: string;
  deadlineTime?: string;
}

const initialTask: TaskInput = {
  name: "",
  deadlineDate: "",
  deadlineTime: ""
};

const QUICK_TASK_OPTIONS = [
  "Célula",
  "Culto",
  "Discipulado",
  "Reunión de equipo",
  "Reunión de líderes"
];

export function TaskSection({
  tasks,
  autoDeleteCompleted,
  onAutoDeleteChange,
  onCreateTask,
  onToggleTask,
  onDeleteTask
}: TaskSectionProps) {
  const [form, setForm] = useState<TaskInput>(initialTask);

  const pendingTasks = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed)
        .sort((a, b) => {
          const aDate = `${a.deadlineDate ?? ""} ${a.deadlineTime ?? ""}`.trim();
          const bDate = `${b.deadlineDate ?? ""} ${b.deadlineTime ?? ""}`.trim();
          return aDate.localeCompare(bDate);
        }),
    [tasks]
  );

  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);

  const submitTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name) {
      return;
    }
    onCreateTask(form);
    setForm(initialTask);
  };

  return (
    <section className="card space-y-5">
      <div className="space-y-2">
        <h2 className="section-title">Lista de tareas</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registra tareas de ministerio, seguimiento pastoral o pendientes personales.
        </p>
      </div>

      <form className="space-y-2.5 rounded-2xl border border-slate-200 bg-white/60 p-3.5 dark:border-slate-700 dark:bg-slate-700/30" onSubmit={submitTask}>
        <input
          className="input"
          placeholder="Nombre de la tarea"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Opciones rápidas
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TASK_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  form.name === option
                    ? "bg-brand-500 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, name: option }))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="block px-1 text-xs font-medium text-slate-500 dark:text-slate-400">Fecha (opcional)</span>
            <input
              className="input min-w-0"
              type="date"
              value={form.deadlineDate}
              onChange={(event) => setForm((prev) => ({ ...prev, deadlineDate: event.target.value }))}
            />
          </label>
          <label className="space-y-1">
            <span className="block px-1 text-xs font-medium text-slate-500 dark:text-slate-400">Hora (opcional)</span>
            <input
              className="input min-w-0"
              type="time"
              value={form.deadlineTime}
              onChange={(event) => setForm((prev) => ({ ...prev, deadlineTime: event.target.value }))}
            />
          </label>
        </div>
        <button type="submit" className="button-primary w-full">
          Agregar tarea
        </button>
      </form>

      <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm dark:border-slate-700 dark:bg-slate-700/30">
        <input
          type="checkbox"
          checked={autoDeleteCompleted}
          onChange={(event) => onAutoDeleteChange(event.target.checked)}
        />
        Eliminar tarea al marcarla como completada
      </label>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight">Pendientes</h3>
          <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 dark:bg-slate-700 dark:text-brand-100">
            {pendingTasks.length}
          </span>
        </div>
        {pendingTasks.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay tareas pendientes.
          </p>
        ) : (
          pendingTasks.map((task) => (
            <article key={task.id} className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-700/30">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight">{task.name}</p>
                  {(task.deadlineDate || task.deadlineTime) && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {task.deadlineDate ? `Fecha: ${task.deadlineDate}` : ""}
                      {task.deadlineDate && task.deadlineTime ? " - " : ""}
                      {task.deadlineTime ? `Hora: ${task.deadlineTime}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    className="button-secondary inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px]"
                    onClick={() => onToggleTask(task.id, true)}
                  >
                    <Check size={12} /> Completar
                  </button>
                  <button
                    type="button"
                    className="button-secondary inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] text-red-600 dark:text-red-400"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {!autoDeleteCompleted && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight">Completadas</h3>
            <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-100">
              {completedTasks.length}
            </span>
          </div>
          {completedTasks.length === 0 ? (
            <p className="empty-state">
              <Inbox size={15} />
              Aún no hay tareas completadas.
            </p>
          ) : (
            completedTasks.map((task) => (
              <article key={task.id} className="rounded-2xl border border-slate-200 bg-white/70 p-3 opacity-80 dark:border-slate-700 dark:bg-slate-700/20">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm line-through">{task.name}</p>
                  <button
                    type="button"
                    className="button-secondary text-red-600 dark:text-red-400"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
