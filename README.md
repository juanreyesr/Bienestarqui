# Bienestar UMG

Sistema de gestion de bienestar estudiantil/docente para Arquitectura UMG.

## Que incluye

- Validacion por correo institucional con accesos configurables.
- Roles operativos: coordinador del proyecto, decano, psicologo, coordinador de sede y estudiante/docente.
- Entrada inicial al Centro de Formacion UMG, con Bienestar Estudiantil como apoyo disponible desde el menu.
- Solicitud de apoyo con consentimiento y bandera de urgencia.
- Bandeja de gestiones con datos limitados por rol.
- Vista clinica restringida para psicologia.
- Centro de Formacion UMG con cursos de bienestar, convivencia, manejo de conflictos y acompanamiento.
- Creacion de cursos/recurso formativo desde coordinacion del proyecto.
- Asignacion de cursos desde ventana flotante, primero por bloques y luego individual por nombre, correo o carné.
- Coordinadores de sede solo pueden asignar a bloque de estudiantes o estudiantes individuales de su campus.
- Estadisticas porcentuales de uso y cumplimiento formativo por campus, calculadas contra poblacion asignada.
- Tablero ejecutivo de bienestar para decanato/coordinacion con datos globales, por pais y por campus.
- Busqueda de casos por nombre, correo o carné.
- Carpeta de casos atendidos con posibilidad de reapertura documentada.
- Boton para imprimir reporte PDF desde el navegador.
- Directorio administrativo para crear usuarios, asignar rol, sede y permisos.
- Eliminacion controlada de expedientes desde el panel administrativo.
- Esquema Supabase con RLS y migraciones aisladas por prefijo `bienestar_arq_`.

## Accesos iniciales

- `coordinacion@umg.edu.gt`
- `decano@umg.edu.gt`
- `psicologia@umg.edu.gt`
- `coord.xela@umg.edu.gt`
- `maria.alvarez@umg.edu.gt`
- `luis.ramos@umg.edu.gt`

## Desarrollo

```bash
pnpm install
pnpm dev
```

Si el servidor de desarrollo no abre en el navegador, prueba la version tipo produccion:

```bash
pnpm preview
```

Luego abre `http://localhost:3001`.

## Supabase

1. Crea una copia local de `.env.example` como `.env.local`.
2. Completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` con los valores del proyecto Supabase.
3. Aplica las migraciones de `supabase/migrations/` si necesitas reconstruir la base desde cero.

Para compartir una misma base de datos con otros proyectos sin mezclar informacion, todas las tablas, tipos, indices y funciones propias de esta app usan el prefijo `bienestar_arq_`. Si ya se habia aplicado el primer esquema con nombres genericos, la migracion `supabase/migrations/20260713_isolate_bienestar_arq_tables.sql` renombra esos objetos al prefijo correcto.

## Nota de alcance

La interfaz conserva el ingreso por correo solicitado. Para operacion multiusuario con datos sensibles se debe activar Supabase Auth, revisar marco legal, formalizar consentimiento informado, definir retencion de datos, activar auditoria operativa y validar el protocolo de crisis con la universidad.
