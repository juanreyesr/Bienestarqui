# Bienestar UMG — Guía del proyecto

Actualizada: 6 de septiembre de 2026  
Propósito: mantener una experiencia institucional, clara y segura para el bienestar de la Facultad de Arquitectura UMG.

## Qué es el producto

Bienestar UMG reúne tres frentes que deben conservarse separados en la interfaz y en los permisos:

- Acompañamiento: solicitudes de apoyo, priorización, derivación y seguimiento.
- Prevención: cursos y rutas formativas para estudiantes, docentes y personal.
- Gestión: indicadores agregados por sede para coordinación y decanato.

No es un portal público ni un expediente clínico completo. Los datos sensibles se muestran solamente a los roles que los necesitan.

## Dirección visual aprobada

La referencia es el lenguaje institucional de UMG: azul profundo como color principal, rojo para acciones críticas y alertas, y dorado solo como detalle de jerarquía. El escudo oficial vive en `public/umg-seal.png` y debe conservar su proporción circular, sin filtros ni recoloración.

Principios que deben permanecer:

1. Fondos claros, superficies blancas y lectura sobria; no usar gradientes decorativos detrás de datos.
2. Una acción principal por área. El rojo queda reservado para urgencias, eliminación y crisis.
3. Las cifras y textos sobre fondos oscuros deben ser blancos o casi blancos; comprobar contraste antes de publicar.
4. Las tarjetas de campus se distribuyen con una cuadrícula adaptable: nunca deben comprimirse en una fila horizontal ilegible.
5. Mantener radios de 8–12 px, bordes discretos y una sola profundidad de sombra.
6. En móvil, la navegación debe seguir siendo alcanzable y no debe aparecer desplazamiento horizontal.

## Mapa de pantallas y responsabilidades

| Área | Audiencia | Regla esencial |
| --- | --- | --- |
| Acceso institucional | Todos | El correo identifica el perfil; no presentar datos de casos antes de iniciar. |
| Formación | Todos | Es la puerta de entrada y no revela actividad de acompañamiento. |
| Gestión de cursos | Coordinación del proyecto | Crea, edita u oculta videos; no elimina historial de asignaciones. |
| Estadísticas de cursos | Coordinación del proyecto y decanato | Solo conteos agregados de visualización y aprobación. |
| Mis certificados | Coordinadores, docentes y estudiantes | Aparecen automáticamente después de aprobar un curso elegible. |
| Solicitud de apoyo | Estudiantes y docentes | Consentimiento visible y ruta urgente clara. |
| Gestiones / casos | Psicología y coordinación autorizada | Aplicar el mínimo necesario por rol. |
| Tablero ejecutivo | Decanato y coordinación | Solo datos agregados; nunca notas clínicas ni identificadores innecesarios. |
| Usuarios y privacidad | Administración | Separar permisos de administración de la atención clínica. |

## Datos y seguridad

- El prototipo guarda datos de demostración en el navegador. No debe presentarse como almacenamiento clínico productivo.
- Para una operación real, activar Supabase Auth, RLS, auditoría, consentimientos, retención de datos y protocolo de crisis validado por UMG.
- Las tablas propias se aíslan con el prefijo `bienestar_arq_`; revisar las migraciones antes de tocar recursos compartidos.
- Nunca introducir datos reales de estudiantes o notas clínicas en el contenido de demostración ni en capturas de presentación.

## Lista de verificación antes de mostrar al decano

- [ ] Abrir el acceso institucional, formación, solicitud, tablero ejecutivo y privacidad con perfiles pertinentes.
- [ ] Verificar a 375 px, 768 px y escritorio que no existe desplazamiento horizontal ni texto cortado.
- [ ] Revisar que los indicadores urgentes son visibles y que el contraste de cada texto alcanza legibilidad suficiente.
- [ ] Confirmar que el escudo oficial se ve nítido y que no sustituye el nombre de la plataforma.
- [ ] Imprimir el tablero ejecutivo y comprobar que el reporte conserva la jerarquía y no incluye navegación.
- [ ] Validar con la Facultad el protocolo de atención, responsables, tiempos de respuesta y texto de consentimiento.

## Propuestas para la siguiente etapa

1. Autenticación real con cuentas UMG y control de acceso por perfil.
2. Flujo de crisis con responsables, escalamiento y bitácora, validado institucionalmente.
3. Tablero con periodos, tendencias y exportación de datos agregados, sin identificación personal.
4. Centro de recursos con contactos, horarios, preguntas frecuentes y canales de apoyo externos verificados.
5. Prueba guiada con estudiantes, docentes, psicología y coordinación antes de una implementación general.

## Operación de cursos y certificados

- **Crear curso** abre una ventana flotante; el video se registra con su plataforma y URL o identificador, junto con audiencia, contenido y opción de evaluación para certificado.
- Los cursos ocultos dejan de aparecer para las personas usuarias y no pueden asignarse, pero coordinación del proyecto y decanato los conservan visibles para gestión y seguimiento.
- Las estadísticas de cada video cuentan personas con avance mayor de cero y personas aprobadas; no muestran nombres ni información clínica.
- Un certificado se considera emitido automáticamente cuando el curso tiene evaluación habilitada y el registro alcanza 100 % con calificación de 70 o más, o cuando ya existe una aprobación registrada. La maqueta del certificado se abordará en una fase posterior.

## Cómo mantener este documento

Al hacer un cambio relevante, actualizar la fecha y la sección correspondiente: propósito para cambios de alcance, mapa de pantallas para nuevas vistas, datos y seguridad para integraciones, y propuestas para decisiones pendientes. Registrar también aquí cualquier decisión que afecte el uso del escudo, los colores UMG o la visibilidad de datos.
