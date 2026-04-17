import { ActivityType } from "./types";

export const ACTIVITY_OPTIONS: Array<{ value: ActivityType; label: string }> = [
  { value: "reunion", label: "Reunión" },
  { value: "iglesia", label: "Iglesia" },
  { value: "personal", label: "Personal" }
];

export const VIEW_OPTIONS = [
  { value: "dia", label: "Día" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" }
] as const;
