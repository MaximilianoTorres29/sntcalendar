import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { EventItem } from "./types";

export const toDate = (value: string) => parseISO(value);

export const formatEventDate = (dateString: string) =>
  format(parseISO(dateString), "dd/MM/yyyy HH:mm");

export const isEventInCurrentDay = (event: EventItem, baseDate: Date) =>
  isSameDay(parseISO(event.datetime), baseDate);

export const isEventInCurrentWeek = (event: EventItem, baseDate: Date) => {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });
  return isWithinInterval(parseISO(event.datetime), { start, end });
};

export const isEventInCurrentMonth = (event: EventItem, baseDate: Date) =>
  isSameMonth(parseISO(event.datetime), baseDate);

export const getIntervalForView = (baseDate: Date, view: "dia" | "semana" | "mes") => {
  if (view === "dia") {
    return { start: startOfDay(baseDate), end: endOfDay(baseDate) };
  }
  if (view === "semana") {
    return {
      start: startOfWeek(baseDate, { weekStartsOn: 1 }),
      end: endOfWeek(baseDate, { weekStartsOn: 1 })
    };
  }
  return {
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate)
  };
};
