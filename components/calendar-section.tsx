"use client";

import { useMemo, useState } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { EventItem, ActivityType, CalendarView } from "@/lib/types";
import { ACTIVITY_OPTIONS, VIEW_OPTIONS } from "@/lib/constants";
import { getIntervalForView } from "@/lib/date-utils";
import { Inbox, Pencil, Trash2 } from "lucide-react";

interface CalendarSectionProps {
  events: EventItem[];
  selectedDate: Date;
  view: CalendarView;
  activeFilter: ActivityType | "todos";
  onViewChange: (view: CalendarView) => void;
  onDateChange: (newDate: Date) => void;
  onFilterChange: (filter: ActivityType | "todos") => void;
  onSaveEvent: (input: EventFormData, id?: string) => void;
  onDeleteEvent: (id: string) => void;
}

interface EventFormData {
  title: string;
  description?: string;
  datetime: string;
  location?: string;
  type: ActivityType;
}

const emptyForm: EventFormData = {
  title: "",
  description: "",
  datetime: "",
  location: "",
  type: "iglesia"
};

export function CalendarSection({
  events,
  selectedDate,
  view,
  activeFilter,
  onViewChange,
  onDateChange,
  onFilterChange,
  onSaveEvent,
  onDeleteEvent
}: CalendarSectionProps) {
  const [formData, setFormData] = useState<EventFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    const interval = getIntervalForView(selectedDate, view);

    return events
      .filter((event) => {
        const inInterval = isWithinInterval(parseISO(event.datetime), interval);
        const inCategory = activeFilter === "todos" || event.type === activeFilter;
        return inInterval && inCategory;
      })
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
  }, [events, selectedDate, view, activeFilter]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title || !formData.datetime) {
      return;
    }
    onSaveEvent(formData, editingId ?? undefined);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const startEdit = (eventToEdit: EventItem) => {
    setEditingId(eventToEdit.id);
    setFormData({
      title: eventToEdit.title,
      description: eventToEdit.description ?? "",
      datetime: eventToEdit.datetime.slice(0, 16),
      location: eventToEdit.location ?? "",
      type: eventToEdit.type
    });
  };

  return (
    <section className="card space-y-5">
      <div className="space-y-2">
        <h2 className="section-title">Calendario</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Organiza reuniones, células, predicaciones y visitas en una sola vista.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100/80 p-1.5 dark:bg-slate-700/50 sm:max-w-sm">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onViewChange(option.value)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              view === option.value
                ? "bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-100"
                : "text-slate-600 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Fecha de referencia</span>
        <input
          className="input"
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(event) => onDateChange(new Date(event.target.value))}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Filtrar:</span>
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            activeFilter === "todos"
              ? "bg-brand-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          }`}
          onClick={() => onFilterChange("todos")}
        >
          Todos
        </button>
        {ACTIVITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeFilter === option.value
                ? "bg-brand-500 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            }`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form className="space-y-2.5 rounded-2xl border border-slate-200 bg-white/60 p-3.5 dark:border-slate-700 dark:bg-slate-700/30" onSubmit={onSubmit}>
        <h3 className="text-sm font-semibold">{editingId ? "Editar evento" : "Nuevo evento"}</h3>
        <input
          className="input"
          placeholder="Título del evento"
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Descripción (opcional)"
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
        />
        <input
          className="input"
          type="datetime-local"
          value={formData.datetime}
          onChange={(event) => setFormData((prev) => ({ ...prev, datetime: event.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Ubicación (opcional)"
          value={formData.location}
          onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
        />
        <select
          className="input"
          value={formData.type}
          onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value as ActivityType }))}
        >
          {ACTIVITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="button-primary w-full">
            {editingId ? "Guardar cambios" : "Agregar evento"}
          </button>
          {editingId && (
            <button
              type="button"
              className="button-secondary w-full"
              onClick={() => {
                setEditingId(null);
                setFormData(emptyForm);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">Eventos en vista</h3>
          <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 dark:bg-slate-700 dark:text-brand-100">
            {filteredEvents.length}
          </span>
        </div>
        {filteredEvents.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay eventos para esta vista.
          </p>
        ) : (
          filteredEvents.map((eventItem) => (
            <article key={eventItem.id} className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-700/30">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold tracking-tight">{eventItem.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {format(parseISO(eventItem.datetime), "dd/MM/yyyy HH:mm")}
                  </p>
                  {eventItem.location ? <p className="text-xs">Ubicación: {eventItem.location}</p> : null}
                  {eventItem.description ? <p className="mt-1 text-xs">{eventItem.description}</p> : null}
                </div>
                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-slate-600 dark:text-brand-100">
                  {ACTIVITY_OPTIONS.find((item) => item.value === eventItem.type)?.label}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" className="button-secondary inline-flex items-center gap-1" onClick={() => startEdit(eventItem)}>
                  <Pencil size={14} /> Editar
                </button>
                <button
                  type="button"
                  className="button-secondary inline-flex items-center gap-1 text-red-600 dark:text-red-400"
                  onClick={() => onDeleteEvent(eventItem.id)}
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
