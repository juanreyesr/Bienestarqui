-- Bienestar UMG - esquema base para gestion operativa en Supabase.
-- En produccion: usar Supabase Auth, app_metadata para roles y RLS en todas las tablas expuestas.

create extension if not exists pgcrypto;

create type public.bienestar_arq_app_role as enum (
  'coordinador_proyecto',
  'decano',
  'psicologo',
  'coordinador_sede',
  'estudiante_docente'
);

create type public.bienestar_arq_request_status as enum ('Pendiente', 'En proceso', 'Atendida', 'Derivada', 'No se presentó');
create type public.bienestar_arq_risk_level as enum ('Bajo', 'Medio', 'Alto');

create table public.bienestar_arq_campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  carnet text unique,
  full_name text not null,
  role public.bienestar_arq_app_role not null,
  person_kind text not null,
  campus_id uuid references public.bienestar_arq_campuses(id),
  title text,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_support_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.bienestar_arq_profiles(id),
  campus_id uuid not null references public.bienestar_arq_campuses(id),
  reason_general text not null,
  preferred_channel text not null,
  contact_method text not null,
  phone text not null,
  personal_email text not null,
  informed_consent boolean not null default false,
  record_consent boolean not null default false,
  status public.bienestar_arq_request_status not null default 'Pendiente',
  risk public.bienestar_arq_risk_level not null default 'Medio',
  urgent boolean not null default false,
  assigned_to uuid references public.bienestar_arq_profiles(id),
  session_count integer not null default 0 check (session_count >= 0),
  no_show_session_coordinated boolean not null default false,
  no_show_communication_insisted boolean not null default false,
  no_show_contact_means text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bienestar_arq_clinical_records (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.bienestar_arq_support_requests(id) on delete cascade,
  psychologist_id uuid references public.bienestar_arq_profiles(id),
  private_note text,
  referral_plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bienestar_arq_clinical_sessions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.bienestar_arq_support_requests(id) on delete cascade,
  psychologist_id uuid not null references public.bienestar_arq_profiles(id),
  session_date timestamptz not null,
  private_note text not null,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_support_request_reopen_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.bienestar_arq_support_requests(id) on delete cascade,
  actor_id uuid not null references public.bienestar_arq_profiles(id),
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_support_request_action_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.bienestar_arq_support_requests(id) on delete cascade,
  actor_id uuid not null references public.bienestar_arq_profiles(id),
  action text not null check (action in ('tomar_caso', 'dejar_pendiente', 'referir', 'marcar_atendida', 'no_se_presento')),
  note text not null,
  referred_to text,
  process_detail text,
  decision_reason text,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  audience text not null,
  classification text not null check (classification in ('Habilidades blandas', 'Habilidades técnicas', 'Bienestar integral')),
  category text not null,
  specialty text not null,
  description text,
  duration text,
  platform text check (platform in ('YouTube', 'Vimeo', 'Teams')),
  cover_url text,
  publish_date date,
  certificate_evaluation boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_course_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.bienestar_arq_courses(id),
  assigned_to uuid not null references public.bienestar_arq_profiles(id),
  assigned_by uuid not null references public.bienestar_arq_profiles(id),
  progress integer not null default 0 check (progress between 0 and 100),
  grade numeric(5,2) check (grade between 0 and 100),
  due_date date,
  assigned_at date not null default current_date,
  approved_at date,
  created_at timestamptz not null default now()
);

create table public.bienestar_arq_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.bienestar_arq_profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index bienestar_arq_profiles_campus_id_idx on public.bienestar_arq_profiles(campus_id);
create index bienestar_arq_support_requests_requester_id_idx on public.bienestar_arq_support_requests(requester_id);
create index bienestar_arq_support_requests_campus_id_idx on public.bienestar_arq_support_requests(campus_id);
create index bienestar_arq_support_requests_assigned_to_idx on public.bienestar_arq_support_requests(assigned_to);
create index bienestar_arq_clinical_records_psychologist_id_idx on public.bienestar_arq_clinical_records(psychologist_id);
create index bienestar_arq_clinical_sessions_request_id_idx on public.bienestar_arq_clinical_sessions(request_id);
create index bienestar_arq_clinical_sessions_psychologist_id_idx on public.bienestar_arq_clinical_sessions(psychologist_id);
create index bienestar_arq_support_request_reopen_notes_request_id_idx on public.bienestar_arq_support_request_reopen_notes(request_id);
create index bienestar_arq_support_request_reopen_notes_actor_id_idx on public.bienestar_arq_support_request_reopen_notes(actor_id);
create index bienestar_arq_support_request_action_notes_request_id_idx on public.bienestar_arq_support_request_action_notes(request_id);
create index bienestar_arq_support_request_action_notes_actor_id_idx on public.bienestar_arq_support_request_action_notes(actor_id);
create index bienestar_arq_course_assignments_course_id_idx on public.bienestar_arq_course_assignments(course_id);
create index bienestar_arq_course_assignments_assigned_to_idx on public.bienestar_arq_course_assignments(assigned_to);
create index bienestar_arq_course_assignments_assigned_by_idx on public.bienestar_arq_course_assignments(assigned_by);
create index bienestar_arq_audit_log_actor_id_idx on public.bienestar_arq_audit_log(actor_id);

alter table public.bienestar_arq_campuses enable row level security;
alter table public.bienestar_arq_profiles enable row level security;
alter table public.bienestar_arq_support_requests enable row level security;
alter table public.bienestar_arq_clinical_records enable row level security;
alter table public.bienestar_arq_clinical_sessions enable row level security;
alter table public.bienestar_arq_support_request_reopen_notes enable row level security;
alter table public.bienestar_arq_support_request_action_notes enable row level security;
alter table public.bienestar_arq_courses enable row level security;
alter table public.bienestar_arq_course_assignments enable row level security;
alter table public.bienestar_arq_audit_log enable row level security;

create or replace function public.bienestar_arq_current_user_role()
returns public.bienestar_arq_app_role
language sql
stable
security invoker
set search_path = public, auth
as $$
  select role from public.bienestar_arq_profiles where id = (select auth.uid())
$$;

create policy "profiles_read_own_or_admin"
on public.bienestar_arq_profiles for select
to authenticated
using (
  id = (select auth.uid())
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
);

create policy "requests_read_by_need_to_know"
on public.bienestar_arq_support_requests for select
to authenticated
using (
  requester_id = (select auth.uid())
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
  )
);

create policy "requests_create_self_or_coordinator"
on public.bienestar_arq_support_requests for insert
to authenticated
with check (
  requester_id = (select auth.uid())
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'coordinador_sede')
);

create policy "requests_update_care_team"
on public.bienestar_arq_support_requests for update
to authenticated
using (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo', 'decano')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
  )
)
with check (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo', 'decano')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
  )
);

create policy "clinical_records_psychologist_only"
on public.bienestar_arq_clinical_records for all
to authenticated
using (public.bienestar_arq_current_user_role() = 'psicologo')
with check (public.bienestar_arq_current_user_role() = 'psicologo');

create policy "clinical_sessions_psychologist_only"
on public.bienestar_arq_clinical_sessions for all
to authenticated
using (public.bienestar_arq_current_user_role() = 'psicologo')
with check (public.bienestar_arq_current_user_role() = 'psicologo');

create policy "reopen_notes_care_team_read"
on public.bienestar_arq_support_request_reopen_notes for select
to authenticated
using (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and exists (
      select 1 from public.bienestar_arq_support_requests sr
      where sr.id = request_id
      and sr.campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
    )
  )
);

create policy "reopen_notes_allowed_create"
on public.bienestar_arq_support_request_reopen_notes for insert
to authenticated
with check (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo', 'decano', 'coordinador_sede'));

create policy "action_notes_care_team_read"
on public.bienestar_arq_support_request_action_notes for select
to authenticated
using (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and exists (
      select 1 from public.bienestar_arq_support_requests sr
      where sr.id = request_id
      and sr.campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
    )
  )
);

create policy "action_notes_allowed_create"
on public.bienestar_arq_support_request_action_notes for insert
to authenticated
with check (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo', 'decano', 'coordinador_sede'));

create policy "courses_read_authenticated"
on public.bienestar_arq_courses for select
to authenticated
using (
  active = true
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano')
);

create policy "assignments_read_self_or_managers"
on public.bienestar_arq_course_assignments for select
to authenticated
using (
  assigned_to = (select auth.uid())
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and assigned_to in (
      select id from public.bienestar_arq_profiles
      where campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
    )
  )
);

create policy "audit_admin_read"
on public.bienestar_arq_audit_log for select
to authenticated
using (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'psicologo'));

create policy "campuses_read_authenticated"
on public.bienestar_arq_campuses for select
to authenticated
using (true);

create policy "courses_create_admins"
on public.bienestar_arq_courses for insert
to authenticated
with check (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano'));

create policy "courses_update_admins"
on public.bienestar_arq_courses for update
to authenticated
using (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano'))
with check (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano'));

create policy "courses_delete_admins"
on public.bienestar_arq_courses for delete
to authenticated
using (public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano'));

create policy "assignments_create_managers"
on public.bienestar_arq_course_assignments for insert
to authenticated
with check (
  public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and assigned_to in (
      select id from public.bienestar_arq_profiles
      where campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
    )
  )
);

create policy "assignments_update_managers"
on public.bienestar_arq_course_assignments for update
to authenticated
using (
  assigned_to = (select auth.uid())
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and assigned_to in (
      select id from public.bienestar_arq_profiles
      where campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
    )
  )
)
with check (
  assigned_to = (select auth.uid())
  or public.bienestar_arq_current_user_role() in ('coordinador_proyecto', 'decano', 'psicologo')
  or (
    public.bienestar_arq_current_user_role() = 'coordinador_sede'
    and assigned_to in (
      select id from public.bienestar_arq_profiles
      where campus_id = (select campus_id from public.bienestar_arq_profiles where id = (select auth.uid()))
    )
  )
);

grant usage on schema public to authenticated, service_role;

grant select on table public.bienestar_arq_campuses to authenticated;
grant select on table public.bienestar_arq_profiles to authenticated;
grant select, insert, update on table public.bienestar_arq_support_requests to authenticated;
grant select, insert, update on table public.bienestar_arq_clinical_records to authenticated;
grant select, insert on table public.bienestar_arq_clinical_sessions to authenticated;
grant select, insert on table public.bienestar_arq_support_request_reopen_notes to authenticated;
grant select, insert on table public.bienestar_arq_support_request_action_notes to authenticated;
grant select, insert, update on table public.bienestar_arq_courses to authenticated;
grant select, insert, update on table public.bienestar_arq_course_assignments to authenticated;
grant select on table public.bienestar_arq_audit_log to authenticated;

grant select, insert, update, delete on table public.bienestar_arq_campuses to service_role;
grant select, insert, update, delete on table public.bienestar_arq_profiles to service_role;
grant select, insert, update, delete on table public.bienestar_arq_support_requests to service_role;
grant select, insert, update, delete on table public.bienestar_arq_clinical_records to service_role;
grant select, insert, update, delete on table public.bienestar_arq_clinical_sessions to service_role;
grant select, insert, update, delete on table public.bienestar_arq_support_request_reopen_notes to service_role;
grant select, insert, update, delete on table public.bienestar_arq_support_request_action_notes to service_role;
grant select, insert, update, delete on table public.bienestar_arq_courses to service_role;
grant select, insert, update, delete on table public.bienestar_arq_course_assignments to service_role;
grant select, insert, update, delete on table public.bienestar_arq_audit_log to service_role;
grant execute on function public.bienestar_arq_current_user_role() to authenticated, service_role;
