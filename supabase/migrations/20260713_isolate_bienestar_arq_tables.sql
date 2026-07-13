-- Renombra el esquema inicial de Bienestar ARQ para convivir con otros
-- proyectos dentro de la misma base Supabase sin mezclar tablas ni tipos.

alter type public.app_role rename to bienestar_arq_app_role;
alter type public.request_status rename to bienestar_arq_request_status;
alter type public.risk_level rename to bienestar_arq_risk_level;

alter table public.campuses rename to bienestar_arq_campuses;
alter table public.profiles rename to bienestar_arq_profiles;
alter table public.support_requests rename to bienestar_arq_support_requests;
alter table public.clinical_records rename to bienestar_arq_clinical_records;
alter table public.clinical_sessions rename to bienestar_arq_clinical_sessions;
alter table public.support_request_reopen_notes rename to bienestar_arq_support_request_reopen_notes;
alter table public.support_request_action_notes rename to bienestar_arq_support_request_action_notes;
alter table public.courses rename to bienestar_arq_courses;
alter table public.course_assignments rename to bienestar_arq_course_assignments;
alter table public.audit_log rename to bienestar_arq_audit_log;

alter index public.profiles_campus_id_idx rename to bienestar_arq_profiles_campus_id_idx;
alter index public.support_requests_requester_id_idx rename to bienestar_arq_support_requests_requester_id_idx;
alter index public.support_requests_campus_id_idx rename to bienestar_arq_support_requests_campus_id_idx;
alter index public.support_requests_assigned_to_idx rename to bienestar_arq_support_requests_assigned_to_idx;
alter index public.clinical_records_psychologist_id_idx rename to bienestar_arq_clinical_records_psychologist_id_idx;
alter index public.clinical_sessions_request_id_idx rename to bienestar_arq_clinical_sessions_request_id_idx;
alter index public.clinical_sessions_psychologist_id_idx rename to bienestar_arq_clinical_sessions_psychologist_id_idx;
alter index public.support_request_reopen_notes_request_id_idx rename to bienestar_arq_support_request_reopen_notes_request_id_idx;
alter index public.support_request_reopen_notes_actor_id_idx rename to bienestar_arq_support_request_reopen_notes_actor_id_idx;
alter index public.support_request_action_notes_request_id_idx rename to bienestar_arq_support_request_action_notes_request_id_idx;
alter index public.support_request_action_notes_actor_id_idx rename to bienestar_arq_support_request_action_notes_actor_id_idx;
alter index public.course_assignments_course_id_idx rename to bienestar_arq_course_assignments_course_id_idx;
alter index public.course_assignments_assigned_to_idx rename to bienestar_arq_course_assignments_assigned_to_idx;
alter index public.course_assignments_assigned_by_idx rename to bienestar_arq_course_assignments_assigned_by_idx;
alter index public.audit_log_actor_id_idx rename to bienestar_arq_audit_log_actor_id_idx;

alter function public.current_user_role() rename to bienestar_arq_current_user_role;

create or replace function public.bienestar_arq_current_user_role()
returns public.bienestar_arq_app_role
language sql
stable
security invoker
set search_path = public, auth
as $$
  select role from public.bienestar_arq_profiles where id = (select auth.uid())
$$;

grant execute on function public.bienestar_arq_current_user_role() to authenticated, service_role;
