# Agenda Ministerial (Iglesias)

Aplicacion web responsive (mobile-first) para lideres y pastores.

## Tecnologias

- Next.js (React)
- Tailwind CSS
- TypeScript
- localStorage para persistencia local

## Funcionalidades incluidas

- Calendario con vistas diaria, semanal y mensual
- Crear, editar y eliminar eventos
- Filtro por tipo de actividad (`Reunion`, `Iglesia`, `Personal`)
- Lista de tareas con pendientes/completadas
- Opcion para eliminar tareas automaticamente al completar
- Dashboard con actividades del dia, proximos eventos y tareas pendientes
- Modo oscuro
- Recordatorios simples con Notifications API (eventos dentro de 10 minutos)

## Estructura

- `app/layout.tsx`: layout global y metadatos.
- `app/page.tsx`: pagina principal.
- `components/church-planner-app.tsx`: estado principal y logica de negocio.
- `components/dashboard-panel.tsx`: panel de resumen inicial.
- `components/calendar-section.tsx`: calendario + formulario y listado de eventos.
- `components/task-section.tsx`: tareas pendientes/completadas.
- `components/theme-toggle.tsx`: interruptor de modo oscuro.
- `lib/types.ts`: tipos compartidos.
- `lib/storage.ts`: lectura/escritura en `localStorage`.
- `lib/constants.ts`: opciones de filtros y vistas.
- `lib/date-utils.ts`: utilidades de fechas.

## Ejecucion

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).
