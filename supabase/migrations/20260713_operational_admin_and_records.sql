-- Bienestar UMG - gestion operativa de usuarios y expedientes.
-- Todas las tablas nuevas usan prefijo bienestar_arq_ para convivir con otros proyectos.

insert into public.bienestar_arq_campuses (name)
values ('Central'), ('Quetzaltenango'), ('San Marcos'), ('Jutiapa'), ('Zacapa')
on conflict (name) do nothing;

alter table public.bienestar_arq_profiles
  add column if not exists active boolean not null default true,
  add column if not exists permissions jsonb not null default '[]'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

alter table public.bienestar_arq_support_requests
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid references public.bienestar_arq_profiles(id),
  add column if not exists deletion_reason text;

create table if not exists public.bienestar_arq_admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  carnet text unique,
  role public.bienestar_arq_app_role not null check (role <> 'estudiante_docente'),
  campus_id uuid references public.bienestar_arq_campuses(id),
  title text,
  permissions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_by uuid references public.bienestar_arq_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bienestar_arq_student_directory (
  id uuid primary key default gen_random_uuid(),
  institutional_id text unique,
  email text unique,
  full_name text not null,
  person_kind text not null check (person_kind in ('Estudiante', 'Docente')),
  campus_id uuid references public.bienestar_arq_campuses(id),
  program text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bienestar_arq_admin_users_role_idx
  on public.bienestar_arq_admin_users(role);
create index if not exists bienestar_arq_admin_users_campus_id_idx
  on public.bienestar_arq_admin_users(campus_id);
create index if not exists bienestar_arq_student_directory_campus_id_idx
  on public.bienestar_arq_student_directory(campus_id);
create index if not exists bienestar_arq_student_directory_lookup_idx
  on public.bienestar_arq_student_directory using btree (full_name, institutional_id, email);
create index if not exists bienestar_arq_support_requests_status_created_idx
  on public.bienestar_arq_support_requests(status, created_at desc)
  where deleted_at is null;
create index if not exists bienestar_arq_support_requests_risk_idx
  on public.bienestar_arq_support_requests(risk, urgent)
  where deleted_at is null;
create index if not exists bienestar_arq_support_requests_deleted_at_idx
  on public.bienestar_arq_support_requests(deleted_at);

alter table public.bienestar_arq_admin_users enable row level security;
alter table public.bienestar_arq_student_directory enable row level security;

grant select, insert, update, delete on public.bienestar_arq_admin_users to authenticated, service_role;
grant select, insert, update, delete on public.bienestar_arq_student_directory to authenticated, service_role;
grant delete on public.bienestar_arq_support_requests to authenticated, service_role;

drop policy if exists "admin_users_read_management" on public.bienestar_arq_admin_users;
create policy "admin_users_read_management"
on public.bienestar_arq_admin_users for select
to authenticated
using (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
  )
);

drop policy if exists "admin_users_write_project" on public.bienestar_arq_admin_users;
create policy "admin_users_write_project"
on public.bienestar_arq_admin_users for all
to authenticated
using (public.bienestar_arq_current_user_role() = 'coordinador_proyecto')
with check (public.bienestar_arq_current_user_role() = 'coordinador_proyecto');

drop policy if exists "student_directory_read_management" on public.bienestar_arq_student_directory;
create policy "student_directory_read_management"
on public.bienestar_arq_student_directory for select
to authenticated
using (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
  )
);

drop policy if exists "student_directory_write_project" on public.bienestar_arq_student_directory;
create policy "student_directory_write_project"
on public.bienestar_arq_student_directory for all
to authenticated
using (public.bienestar_arq_current_user_role() = 'coordinador_proyecto')
with check (public.bienestar_arq_current_user_role() = 'coordinador_proyecto');

drop policy if exists "requests_delete_project" on public.bienestar_arq_support_requests;
create policy "requests_delete_project"
on public.bienestar_arq_support_requests for delete
to authenticated
using (public.bienestar_arq_current_user_role() = 'coordinador_proyecto');

drop policy if exists "audit_log_project_insert" on public.bienestar_arq_audit_log;
create policy "audit_log_project_insert"
on public.bienestar_arq_audit_log for insert
to authenticated
with check (
  actor_id = (select auth.uid())
  and public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo', 'coordinador_sede')
);
