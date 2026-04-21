# Configuracion de Supabase para Agenda Ministerial

## 1) Variables de entorno

1. Copia `.env.local.example` a `.env.local`.
2. Completa:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) Crear tabla para datos por usuario

Ejecuta esto en el SQL Editor de Supabase:

```sql
create table if not exists public.planner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tasks jsonb not null default '[]'::jsonb,
  events jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.planner_profiles enable row level security;

drop policy if exists "planner_profiles_owner_policy" on public.planner_profiles;
create policy "planner_profiles_owner_policy"
on public.planner_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3) Activar login por email

En Supabase:
- `Authentication` -> `Providers` -> habilita `Email`.

## 4) Reiniciar app

```bash
npm run dev -- -p 3000
```

## Notas

- Cada miembro inicia sesion con su email.
- Sus tareas y eventos quedan aislados por usuario.
- Si no configuras Supabase, la app sigue funcionando en modo local (localStorage).
