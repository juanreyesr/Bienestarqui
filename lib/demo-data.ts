import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  LifeBuoy,
  Settings,
  Shield,
  Stethoscope,
  UserCheck,
  Users
} from "lucide-react";

export type Role =
  | "coordinador_proyecto"
  | "decano"
  | "psicologo"
  | "coordinador_sede"
  | "estudiante_docente";

export type UserKind = "Estudiante" | "Docente" | "Coordinador" | "Decano" | "Psicologo";
export type RequestStatus = "Pendiente" | "En proceso" | "Atendida" | "Derivada" | "No se presentó";
export type RiskLevel = "Bajo" | "Medio" | "Alto";
export type CourseClassification = "Habilidades blandas" | "Habilidades técnicas" | "Bienestar integral";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  carnet: string;
  role: Role;
  kind: UserKind;
  campus: string;
  title: string;
};

export type SupportRequest = {
  id: string;
  personId: string;
  personName: string;
  personEmail: string;
  personCarnet: string;
  personalEmail?: string;
  phone?: string;
  personKind: UserKind;
  campus: string;
  reason: string;
  channel: string;
  contactMethod?: string;
  status: RequestStatus;
  risk: RiskLevel;
  sessions: number;
  createdAt: string;
  lastUpdate: string;
  generalNote: string;
  clinicalNote: string;
  referral: string;
  urgent: boolean;
  informedConsent?: boolean;
  assignedTo?: string;
  auditNotes?: string[];
  referralNotes?: string[];
  closureNotes?: string[];
  noShowNote?: {
    coordinated: boolean;
    insisted: boolean;
    means: string;
    actor: string;
    date: string;
  };
  reopenNotes?: string[];
};

export type Course = {
  id: string;
  title: string;
  audience: string;
  classification: CourseClassification;
  category: string;
  specialty: string;
  duration: string;
  modules: string[];
  completion: number;
  assignedBy: string;
  description: string;
  platform: "YouTube" | "Vimeo" | "Teams";
  coverUrl?: string;
  publishDate?: string;
  certificateEvaluation: boolean;
};

export type TrainingProgress = {
  assignmentId: string;
  person: string;
  campus: string;
  role: UserKind;
  course: string;
  progress: number;
  due: string;
  assignedBy: string;
  assignedAt: string;
  grade?: number;
  approvedAt?: string;
};

export type CampusTrainingStat = {
  campus: string;
  assignedPopulation: number;
  peopleUsingTraining: number;
  peopleCompletedTraining: number;
};

export type NavItem = {
  key: string;
  label: string;
  Icon: LucideIcon;
};

export const demoUsers: DemoUser[] = [
  {
    id: "u-admin",
    name: "M.A. Juan J. Reyes",
    email: "coordinacion@arq.edu.gt",
    carnet: "EMP-0001",
    role: "coordinador_proyecto",
    kind: "Coordinador",
    campus: "Central",
    title: "Coordinador del Proyecto"
  },
  {
    id: "u-decano",
    name: "Arq. MA. Julio Hernández",
    email: "decano@arq.edu.gt",
    carnet: "EMP-0002",
    role: "decano",
    kind: "Decano",
    campus: "Facultad",
    title: "Decano de Arquitectura"
  },
  {
    id: "u-psico",
    name: "Licda. Camila Torres",
    email: "psicologia@arq.edu.gt",
    carnet: "EMP-0003",
    role: "psicologo",
    kind: "Psicologo",
    campus: "Central",
    title: "Psicologa de Planta"
  },
  {
    id: "u-coord-xela",
    name: "Mtra. Paola Alvarez",
    email: "coord.xela@arq.edu.gt",
    carnet: "EMP-0101",
    role: "coordinador_sede",
    kind: "Coordinador",
    campus: "Quetzaltenango",
    title: "Coordinadora de Sede"
  },
  {
    id: "u-student",
    name: "Maria Jose Alvarez",
    email: "maria.alvarez@arq.edu.gt",
    carnet: "ARQ-2023-0145",
    role: "estudiante_docente",
    kind: "Estudiante",
    campus: "Central",
    title: "Estudiante de Diseno Arquitectonico"
  },
  {
    id: "u-teacher",
    name: "Luis Fernando Ramos",
    email: "luis.ramos@arq.edu.gt",
    carnet: "EMP-0241",
    role: "estudiante_docente",
    kind: "Docente",
    campus: "Quetzaltenango",
    title: "Docente de Taller"
  },
  {
    id: "u-coord-sm",
    name: "Mtro. Diego Fuentes",
    email: "coord.sanmarcos@arq.edu.gt",
    carnet: "EMP-0102",
    role: "coordinador_sede",
    kind: "Coordinador",
    campus: "San Marcos",
    title: "Coordinador de Sede"
  },
  {
    id: "u-student-sm",
    name: "Sofia Marroquin",
    email: "sofia.marroquin@arq.edu.gt",
    carnet: "ARQ-2022-0318",
    role: "estudiante_docente",
    kind: "Estudiante",
    campus: "San Marcos",
    title: "Estudiante de Urbanismo"
  },
  {
    id: "u-student-jut",
    name: "Carlos Mendez",
    email: "carlos.mendez@arq.edu.gt",
    carnet: "ARQ-2021-0097",
    role: "estudiante_docente",
    kind: "Estudiante",
    campus: "Jutiapa",
    title: "Estudiante de Construccion"
  },
  {
    id: "u-student-zac",
    name: "Ana Lucia Perez",
    email: "ana.perez@arq.edu.gt",
    carnet: "ARQ-2024-0062",
    role: "estudiante_docente",
    kind: "Estudiante",
    campus: "Zacapa",
    title: "Estudiante de Dibujo Arquitectonico"
  }
];

export const initialRequests: SupportRequest[] = [
  {
    id: "BA-1024",
    personId: "u-student",
    personName: "Maria Jose Alvarez",
    personEmail: "maria.alvarez@arq.edu.gt",
    personCarnet: "ARQ-2023-0145",
    personalEmail: "maria.personal@example.com",
    phone: "5555-0145",
    personKind: "Estudiante",
    campus: "Central",
    reason: "Ansiedad academica y sobrecarga por entregas de taller",
    channel: "Videollamada",
    contactMethod: "Videollamada",
    status: "En proceso",
    risk: "Medio",
    sessions: 2,
    createdAt: "2026-06-22",
    lastUpdate: "2026-07-03",
    generalNote: "Solicita apoyo para organizar rutinas de entrega y manejo de ansiedad.",
    clinicalNote: "Se trabaja psicoeducacion, regulacion fisiologica y plan semanal. Sin ideacion activa reportada.",
    referral: "Seguimiento interno",
    urgent: false,
    informedConsent: true,
    assignedTo: "Licda. Camila Torres",
    auditNotes: ["2026-06-22 · Licda. Camila Torres tomo el caso para seguimiento inicial."]
  },
  {
    id: "BA-1025",
    personId: "u-teacher",
    personName: "Luis Fernando Ramos",
    personEmail: "luis.ramos@arq.edu.gt",
    personCarnet: "EMP-0241",
    personalEmail: "luis.personal@example.com",
    phone: "5555-0241",
    personKind: "Docente",
    campus: "Quetzaltenango",
    reason: "Conflicto interpersonal con grupo de estudiantes",
    channel: "Presencial",
    contactMethod: "Presencial",
    status: "Pendiente",
    risk: "Bajo",
    sessions: 0,
    createdAt: "2026-06-27",
    lastUpdate: "2026-06-27",
    generalNote: "Busca orientacion para mediacion y comunicacion con estudiantes.",
    clinicalNote: "Pendiente primera entrevista.",
    referral: "Formacion en comunicacion y mediacion",
    urgent: false,
    informedConsent: true
  },
  {
    id: "BA-1026",
    personId: "u-student-sm",
    personName: "Sofia Marroquin",
    personEmail: "sofia.marroquin@arq.edu.gt",
    personCarnet: "ARQ-2022-0318",
    personalEmail: "sofia.personal@example.com",
    phone: "5555-0318",
    personKind: "Estudiante",
    campus: "San Marcos",
    reason: "Crisis familiar con impacto en asistencia y entregas",
    channel: "Telefono",
    contactMethod: "Telefono",
    status: "Derivada",
    risk: "Alto",
    sessions: 1,
    createdAt: "2026-07-01",
    lastUpdate: "2026-07-02",
    generalNote: "Requiere apoyo urgente y coordinacion academica temporal.",
    clinicalNote: "Se activa protocolo de seguridad, red de apoyo y derivacion externa especializada.",
    referral: "Derivacion externa prioritaria",
    urgent: true,
    informedConsent: true,
    assignedTo: "Licda. Camila Torres",
    referralNotes: ["2026-07-02 · Licda. Camila Torres: Referido a red externa prioritaria. Proceso coordinado por llamada. Decision tomada por riesgo alto y necesidad de apoyo especializado."]
  },
  {
    id: "BA-1027",
    personId: "u-student-jut",
    personName: "Carlos Mendez",
    personEmail: "carlos.mendez@arq.edu.gt",
    personCarnet: "ARQ-2021-0097",
    personalEmail: "carlos.personal@example.com",
    phone: "5555-0097",
    personKind: "Estudiante",
    campus: "Jutiapa",
    reason: "Desmotivacion y bajo rendimiento sostenido",
    channel: "Videollamada",
    contactMethod: "Correo personal",
    status: "Atendida",
    risk: "Medio",
    sessions: 4,
    createdAt: "2026-05-16",
    lastUpdate: "2026-06-20",
    generalNote: "Cierre con plan de seguimiento academico y habitos de estudio.",
    clinicalNote: "Mejora adherencia a rutina; se recomienda monitoreo mensual por coordinacion.",
    referral: "Tutorias academicas",
    urgent: false,
    informedConsent: true,
    assignedTo: "Licda. Camila Torres",
    closureNotes: ["2026-06-20 · Licda. Camila Torres: Se marca atendida por cumplimiento de sesiones iniciales y plan academico acordado."],
    reopenNotes: ["2026-06-25 · Psicologia: Se deja disponible historial por posible seguimiento academico."]
  }
];

export const courses: Course[] = [
  {
    id: "c-1",
    title: "Autogestion emocional para entregas de taller",
    audience: "Estudiantes",
    classification: "Bienestar integral",
    category: "Bienestar preventivo",
    specialty: "Manejo de estrés academico",
    duration: "4 modulos",
    modules: ["Mapa de estres", "Rutinas sostenibles", "Respiracion y pausas", "Plan de entrega"],
    completion: 68,
    assignedBy: "Coordinacion del Proyecto",
    description: "Herramientas practicas para manejar presion, entregas y descanso en ciclos de taller.",
    platform: "YouTube",
    publishDate: "2026-07-06",
    certificateEvaluation: true
  },
  {
    id: "c-2",
    title: "Docencia empatica y alertas tempranas",
    audience: "Docentes",
    classification: "Habilidades blandas",
    category: "Acompanamiento",
    specialty: "Acompanamiento docente",
    duration: "5 modulos",
    modules: ["Senales de alerta", "Conversaciones dificiles", "Derivacion", "Limites eticos", "Registro minimo"],
    completion: 42,
    assignedBy: "Decanato",
    description: "Ruta para que docentes identifiquen situaciones de riesgo y deriven sin invadir privacidad.",
    platform: "Teams",
    publishDate: "2026-07-08",
    certificateEvaluation: true
  },
  {
    id: "c-3",
    title: "Mediacion y convivencia en sedes",
    audience: "Coordinadores",
    classification: "Habilidades blandas",
    category: "Gestion preventiva",
    specialty: "Mediacion y convivencia",
    duration: "3 modulos",
    modules: ["Escucha activa", "Acuerdos reparadores", "Seguimiento"],
    completion: 86,
    assignedBy: "Coordinacion del Proyecto",
    description: "Proceso breve para ordenar conflictos, acuerdos y seguimiento dentro del campus.",
    platform: "Vimeo",
    publishDate: "2026-07-10",
    certificateEvaluation: true
  },
  {
    id: "c-4",
    title: "Manejo de conflictos en equipos de diseno",
    audience: "Estudiantes y docentes",
    classification: "Habilidades blandas",
    category: "Convivencia",
    specialty: "Resolucion de conflictos",
    duration: "3 modulos",
    modules: ["Tipos de conflicto", "Conversaciones de reparacion", "Acuerdos de equipo"],
    completion: 34,
    assignedBy: "Coordinacion del Proyecto",
    description: "Vista previa para practicar acuerdos, roles y comunicacion durante proyectos colaborativos.",
    platform: "YouTube",
    publishDate: "2026-07-12",
    certificateEvaluation: false
  },
  {
    id: "c-5",
    title: "Habitos sostenibles para semanas de entrega",
    audience: "Estudiantes",
    classification: "Bienestar integral",
    category: "Organizacion personal",
    specialty: "Organizacion del tiempo",
    duration: "4 modulos",
    modules: ["Planificacion inversa", "Sueno y energia", "Bloques de avance", "Cierre saludable"],
    completion: 51,
    assignedBy: "Centro de Formacion ARQ",
    description: "Contenido preventivo para reducir agotamiento y mejorar continuidad academica.",
    platform: "Teams",
    publishDate: "2026-07-15",
    certificateEvaluation: true
  },
  {
    id: "c-6",
    title: "Primeros auxilios emocionales para coordinadores",
    audience: "Coordinadores",
    classification: "Bienestar integral",
    category: "Derivacion segura",
    specialty: "Derivacion y primeros auxilios emocionales",
    duration: "5 modulos",
    modules: ["Escucha inicial", "Limites del rol", "Riesgo", "Derivacion", "Registro minimo"],
    completion: 24,
    assignedBy: "Decanato",
    description: "Guia para responder con humanidad y activar apoyo sin asumir funciones clinicas.",
    platform: "Vimeo",
    publishDate: "2026-07-18",
    certificateEvaluation: true
  },
  {
    id: "c-7",
    title: "Representacion digital y laminas claras",
    audience: "Estudiantes",
    classification: "Habilidades técnicas",
    category: "Comunicacion grafica",
    specialty: "Representacion arquitectonica",
    duration: "4 modulos",
    modules: ["Jerarquia visual", "Composicion", "Escalas", "Entrega final"],
    completion: 12,
    assignedBy: "Centro de Formacion ARQ",
    description: "Recurso tecnico para mejorar la claridad de laminas, diagramas y presentaciones de taller.",
    platform: "YouTube",
    publishDate: "2026-07-20",
    certificateEvaluation: true
  },
  {
    id: "c-8",
    title: "Introduccion a presupuestos y cuantificacion",
    audience: "Estudiantes y docentes",
    classification: "Habilidades técnicas",
    category: "Gestion tecnica",
    specialty: "Costos y presupuestos",
    duration: "3 modulos",
    modules: ["Partidas", "Cantidades", "Costos base", "Revision"],
    completion: 18,
    assignedBy: "Centro de Formacion ARQ",
    description: "Vista previa para fortalecer lectura tecnica, estimaciones iniciales y orden de presupuestos.",
    platform: "Teams",
    publishDate: "2026-07-22",
    certificateEvaluation: false
  }
];

export const trainingProgress: TrainingProgress[] = [
  {
    assignmentId: "asig-1001",
    person: "Luis Fernando Ramos",
    campus: "Quetzaltenango",
    role: "Docente",
    course: "Docencia empatica y alertas tempranas",
    progress: 35,
    due: "2026-07-24",
    assignedBy: "Arq. MA. Julio Hernández",
    assignedAt: "2026-07-03"
  },
  {
    assignmentId: "asig-1002",
    person: "Paola Alvarez",
    campus: "Quetzaltenango",
    role: "Coordinador",
    course: "Mediacion y convivencia en sedes",
    progress: 72,
    due: "2026-07-18",
    assignedBy: "M.A. Juan J. Reyes",
    assignedAt: "2026-07-01"
  },
  {
    assignmentId: "asig-1003",
    person: "Maria Jose Alvarez",
    campus: "Central",
    role: "Estudiante",
    course: "Autogestion emocional para entregas de taller",
    progress: 68,
    due: "2026-07-15",
    assignedBy: "M.A. Juan J. Reyes",
    assignedAt: "2026-07-02"
  },
  {
    assignmentId: "asig-1004",
    person: "Maria Jose Alvarez",
    campus: "Central",
    role: "Estudiante",
    course: "Habitos sostenibles para semanas de entrega",
    progress: 100,
    due: "2026-06-28",
    assignedBy: "Arq. MA. Julio Hernández",
    assignedAt: "2026-06-05",
    grade: 94,
    approvedAt: "2026-06-25"
  },
  {
    assignmentId: "asig-1005",
    person: "Sofia Marroquin",
    campus: "San Marcos",
    role: "Estudiante",
    course: "Autogestion emocional para entregas de taller",
    progress: 20,
    due: "2026-07-30",
    assignedBy: "M.A. Juan J. Reyes",
    assignedAt: "2026-07-04"
  }
];

export const campuses = ["Central", "Quetzaltenango", "San Marcos", "Jutiapa", "Zacapa"];

export const campusTrainingStats: CampusTrainingStat[] = [
  { campus: "Central", assignedPopulation: 420, peopleUsingTraining: 246, peopleCompletedTraining: 132 },
  { campus: "Quetzaltenango", assignedPopulation: 180, peopleUsingTraining: 118, peopleCompletedTraining: 81 },
  { campus: "San Marcos", assignedPopulation: 95, peopleUsingTraining: 47, peopleCompletedTraining: 29 },
  { campus: "Jutiapa", assignedPopulation: 120, peopleUsingTraining: 64, peopleCompletedTraining: 37 },
  { campus: "Zacapa", assignedPopulation: 75, peopleUsingTraining: 38, peopleCompletedTraining: 22 }
];

export const roleLabels: Record<Role, string> = {
  coordinador_proyecto: "Coordinador del proyecto",
  decano: "Decano",
  psicologo: "Psicologo",
  coordinador_sede: "Coordinador de sede",
  estudiante_docente: "Estudiante / Docente"
};

export const roleNavigation: Record<Role, NavItem[]> = {
  coordinador_proyecto: [
    { key: "formacion", label: "Centro de Formacion", Icon: BookOpen },
    { key: "gestiones", label: "Bienestar estudiantil", Icon: HeartHandshake },
    { key: "resumen", label: "Estadisticas", Icon: BarChart3 },
    { key: "usuarios", label: "Usuarios y sedes", Icon: Users },
    { key: "privacidad", label: "Privacidad", Icon: Shield }
  ],
  decano: [
    { key: "formacion", label: "Centro de Formacion", Icon: GraduationCap },
    { key: "gestiones", label: "Bienestar estudiantil", Icon: HeartHandshake },
    { key: "resumen", label: "Tablero ejecutivo", Icon: BarChart3 },
    { key: "privacidad", label: "Limites eticos", Icon: Shield }
  ],
  psicologo: [
    { key: "formacion", label: "Centro de Formacion", Icon: BookOpen },
    { key: "gestiones", label: "Bienestar estudiantil", Icon: Stethoscope },
    { key: "casos_curso", label: "Casos en curso", Icon: ClipboardList },
    { key: "casos_completados", label: "Casos completados", Icon: UserCheck },
    { key: "crisis", label: "Riesgo y derivacion", Icon: LifeBuoy },
    { key: "privacidad", label: "Confidencialidad", Icon: Shield }
  ],
  coordinador_sede: [
    { key: "formacion", label: "Centro de Formacion", Icon: GraduationCap },
    { key: "solicitud", label: "Bienestar estudiantil", Icon: HeartHandshake },
    { key: "resumen", label: "Mi sede", Icon: BarChart3 },
    { key: "privacidad", label: "Alcance de datos", Icon: Shield }
  ],
  estudiante_docente: [
    { key: "formacion", label: "Centro de Formacion ARQ", Icon: BookOpen },
    { key: "solicitud", label: "Bienestar estudiantil", Icon: HeartHandshake },
    { key: "privacidad", label: "Privacidad", Icon: Shield }
  ]
};

export const adminActions = [
  { label: "Actualizar directorio", Icon: Users },
  { label: "Revisar permisos", Icon: UserCheck },
  { label: "Configurar sedes", Icon: Settings }
];
