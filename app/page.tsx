"use client";

import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Folder,
  LockKeyhole,
  LogOut,
  Monitor,
  Play,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Send,
  Shield,
  Sparkles,
  Stethoscope,
  UserCheck,
  Video,
  X
} from "lucide-react";
import {
  adminActions,
  campusTrainingStats,
  campuses,
  courses,
  demoUsers,
  initialRequests,
  roleLabels,
  roleNavigation,
  trainingProgress,
  type Course,
  type DemoUser,
  type RequestStatus,
  type RiskLevel,
  type SupportRequest,
  type TrainingProgress
} from "@/lib/demo-data";
import { WellbeingScene } from "./WellbeingScene";

type ViewKey =
  | "resumen"
  | "gestiones"
  | "formacion"
  | "usuarios"
  | "privacidad"
  | "solicitud"
  | "crisis"
  | "casos_curso"
  | "casos_completados";
type CaseActionKind = "take" | "refer" | "attend" | "noshow";

const statusTone: Record<RequestStatus, "green" | "blue" | "orange" | "red"> = {
  Pendiente: "orange",
  "En proceso": "blue",
  Atendida: "green",
  Derivada: "red",
  "No se presentó": "red"
};

const riskTone: Record<RiskLevel, "green" | "orange" | "red"> = {
  Bajo: "green",
  Medio: "orange",
  Alto: "red"
};

export default function Home() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>("formacion");
  const [requests, setRequests] = useState<SupportRequest[]>(initialRequests);
  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [progressList, setProgressList] = useState<TrainingProgress[]>(trainingProgress);

  function handleLogin(user: DemoUser) {
    setCurrentUser(user);
    setActiveView("formacion");
  }

  function handleLogout() {
    setCurrentUser(null);
    setActiveView("formacion");
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const navigation = roleNavigation[currentUser.role];
  const navCounts = navigationCounts(currentUser, requests);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">UMG</div>
          <div className="brand-copy">
            <strong>Bienestar UMG</strong>
            <span>Arquitectura · Gestion, derivacion y prevencion</span>
          </div>
        </div>
        <div className="user-pill">
          <div>
            <strong>{currentUser.name}</strong>
            <span>{roleLabels[currentUser.role]} · {currentUser.campus}</span>
          </div>
          <div className="avatar" aria-hidden="true">{currentUser.name.slice(0, 1)}</div>
          <button className="button secondary" type="button" onClick={handleLogout}>
            <LogOut size={18} aria-hidden="true" />
            Salir
          </button>
        </div>
      </header>

      <nav className="mobile-tabs" aria-label="Navegacion principal">
        {navigation.map(({ key, label, Icon }) => (
          <button
            className={`nav-button ${activeView === key ? "active" : ""}`}
            key={key}
            type="button"
            onClick={() => setActiveView(key as ViewKey)}
          >
            <Icon size={18} aria-hidden="true" />
            <span className="nav-label">{label}</span>
            {navCounts[key] ? <span className="nav-count">{navCounts[key]}</span> : null}
          </button>
        ))}
      </nav>

      <div className="layout-grid">
        <aside className="sidebar">
          <nav aria-label="Menu del sistema">
            {navigation.map(({ key, label, Icon }) => (
              <button
                className={`nav-button ${activeView === key ? "active" : ""}`}
                key={key}
                type="button"
                onClick={() => setActiveView(key as ViewKey)}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="nav-label">{label}</span>
                {navCounts[key] ? <span className="nav-count">{navCounts[key]}</span> : null}
              </button>
            ))}
          </nav>
        </aside>

        <section className="main-content">
          {activeView !== "formacion" ? (
            <DashboardHero user={currentUser} requests={requests} setActiveView={setActiveView} />
          ) : null}
          {activeView === "resumen" && <Overview user={currentUser} requests={requests} />}
          {activeView === "gestiones" && <CasesPanel user={currentUser} requests={requests} setRequests={setRequests} />}
          {activeView === "casos_curso" && (
            <PsychologistCasesWorkspace
              mode="curso"
              user={currentUser}
              requests={requests}
              setRequests={setRequests}
              courseList={courseList}
              progressList={progressList}
              setProgressList={setProgressList}
            />
          )}
          {activeView === "casos_completados" && (
            <PsychologistCasesWorkspace
              mode="completados"
              user={currentUser}
              requests={requests}
              setRequests={setRequests}
              courseList={courseList}
              progressList={progressList}
              setProgressList={setProgressList}
            />
          )}
          {activeView === "solicitud" && <SupportForm user={currentUser} setRequests={setRequests} setActiveView={setActiveView} />}
          {activeView === "formacion" && (
            <TrainingCenter
              user={currentUser}
              courseList={courseList}
              setCourseList={setCourseList}
              progressList={progressList}
              setProgressList={setProgressList}
              setActiveView={setActiveView}
            />
          )}
          {activeView === "usuarios" && <UsersPanel />}
          {activeView === "crisis" && <CrisisPanel requests={requests} />}
          {activeView === "privacidad" && <PrivacyPanel user={currentUser} />}
        </section>
      </div>
    </main>
  );
}

function LoginPage({ onLogin }: { onLogin: (user: DemoUser) => void }) {
  const [email, setEmail] = useState("decano@umg.edu.gt");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = demoUsers.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setError("Correo no encontrado en la base demo. Usa una cuenta institucional de prueba.");
      return;
    }
    setError("");
    onLogin(user);
  }

  return (
    <main className="login-page">
      <section className="welcome-panel">
        <WellbeingScene />
        <div>
          <div className="brand-row">
            <div className="brand-mark" aria-hidden="true">UMG</div>
            <div className="brand-copy">
              <strong>Bienestar UMG</strong>
              <span>Facultad de Arquitectura</span>
            </div>
          </div>
          <span className="hero-kicker">Experiencia institucional de bienestar</span>
          <h1>Un sistema humano para cuidar, derivar y prevenir.</h1>
          <p>
            Un centro de mando discreto para ordenar solicitudes de apoyo, proteger informacion sensible
            y convertir cada senal en acciones preventivas para estudiantes, docentes y sedes.
          </p>
        </div>
        <div className="privacy-strip" aria-label="Principios de seguridad">
          <div className="privacy-item"><Shield size={22} aria-hidden="true" /> Minimo necesario por rol</div>
          <div className="privacy-item"><LockKeyhole size={22} aria-hidden="true" /> Notas clinicas restringidas</div>
          <div className="privacy-item"><BookOpen size={22} aria-hidden="true" /> Formacion preventiva</div>
        </div>
      </section>

      <section className="login-card-wrap">
        <form className="login-card" onSubmit={submit}>
          <span className="badge blue"><Sparkles size={15} aria-hidden="true" /> Demo premium navegable</span>
          <h2 style={{ marginTop: 14 }}>Validacion institucional</h2>
          <p>Escribe un correo demo o elige un perfil para cargar nombre, campus y permisos automaticamente.</p>
          <div className="field">
            <label htmlFor="email">Correo institucional</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="nombre@umg.edu.gt"
            />
          </div>
          {error ? <p className="crisis-box" role="alert">{error}</p> : null}
          <button className="button primary" type="submit" style={{ width: "100%", marginTop: 18 }}>
            Validar acceso
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <div className="demo-grid" aria-label="Cuentas demo">
            {demoUsers.map((user) => (
              <button className="demo-account" key={user.id} type="button" onClick={() => onLogin(user)}>
                <strong>{roleLabels[user.role]}</strong>
                <span>{user.email}</span>
              </button>
            ))}
          </div>
        </form>
      </section>
    </main>
  );
}

function DashboardHero({
  user,
  requests,
  setActiveView
}: {
  user: DemoUser;
  requests: SupportRequest[];
  setActiveView: (view: ViewKey) => void;
}) {
  const pending = visibleRequests(user, requests).filter((request) => request.status === "Pendiente").length;
  const inProcess = visibleRequests(user, requests).filter((request) => request.status === "En proceso").length;
  const urgent = visibleRequests(user, requests).filter((request) => request.urgent).length;

  return (
    <section className="hero-card">
      <div className="hero-copy">
        <span className="badge blue"><Building2 size={15} aria-hidden="true" /> {user.campus}</span>
        <h1>{heroTitle(user)}</h1>
        <p>{heroDescription(user)}</p>
        <div className="case-actions" style={{ marginTop: 18 }}>
          {canRequestSupport(user) ? (
            <button className="button primary" type="button" onClick={() => setActiveView("solicitud")}>
              <Send size={18} aria-hidden="true" />
              Solicitar apoyo
            </button>
          ) : null}
          <button className="button secondary" type="button" onClick={() => setActiveView("formacion")}>
            <BookOpen size={18} aria-hidden="true" />
            Ver formacion
          </button>
        </div>
      </div>
      <div className="hero-visual" aria-label="Estado del sistema">
        <WellbeingScene compact />
        <div className="pulse-card">
          <div className="metric-header"><span>Abiertos visibles</span><Clock size={18} aria-hidden="true" /></div>
          <div className="metric-value">{pending + inProcess}</div>
          <div className="metric-note">{pending} pendientes · {inProcess} en proceso</div>
        </div>
        <div className="pulse-card">
          <div className="metric-header"><span>Casos urgentes</span><AlertTriangle size={18} aria-hidden="true" /></div>
          <div className="metric-value">{urgent}</div>
          <div className="metric-note">Activan protocolo de prioridad</div>
        </div>
      </div>
    </section>
  );
}

function Overview({ user, requests }: { user: DemoUser; requests: SupportRequest[] }) {
  const visible = visibleRequests(user, requests);
  const pending = visible.filter((request) => request.status === "Pendiente").length;
  const inProcess = visible.filter((request) => request.status === "En proceso").length;
  const attended = visible.filter((request) => request.status === "Atendida").length;
  const noShow = visible.filter((request) => request.status === "No se presentó").length;
  const sessions = visible.reduce((sum, request) => sum + request.sessions, 0);
  const urgent = visible.filter((request) => request.urgent).length;
  const showCareStats = user.role !== "estudiante_docente";

  return (
    <>
      {showCareStats ? (
        <section className="metric-grid">
          <Metric label="Gestiones visibles" value={visible.length} note="Solicitudes segun rol" />
          <Metric label="En proceso" value={pending + inProcess} note={`${pending} pendientes · ${inProcess} tomadas`} />
          <Metric label="Atendidas" value={attended} note="Cerradas o resueltas" />
          <Metric label="No se presento" value={noShow} note={`${sessions} sesiones acumuladas`} />
        </section>
      ) : null}

      <section className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Cumplimiento formativo por campus</h2>
              <p className="muted">Comparativa porcentual segun poblacion asignada a cada campus.</p>
            </div>
          </div>
          <TrainingUsageStats compact />
        </div>
        {showCareStats ? (
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2>Alertas internas</h2>
                <p className="muted">Solo para roles de gestion y atencion, nunca como estadistica publica.</p>
              </div>
            </div>
            <div className="grid-2">
              <div className="mini-card">
                <span className="badge red"><AlertTriangle size={15} aria-hidden="true" /> Riesgo alto</span>
                <div className="metric-value">{urgent}</div>
                <p className="muted">Derivacion prioritaria y contacto humano.</p>
              </div>
              <div className="mini-card">
                <span className="badge blue"><BookOpen size={15} aria-hidden="true" /> Formacion</span>
                <div className="metric-value">{courses.length}</div>
                <p className="muted">Rutas preventivas disponibles.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2>Uso publico del aula</h2>
                <p className="muted">Solo muestra personas que usan o completan formaciones; no expone casos de apoyo.</p>
              </div>
            </div>
            <TrainingUsageStats compact />
          </div>
        )}
      </section>
    </>
  );
}

function CasesPanel({
  user,
  requests,
  setRequests
}: {
  user: DemoUser;
  requests: SupportRequest[];
  setRequests: React.Dispatch<React.SetStateAction<SupportRequest[]>>;
}) {
  const baseVisible = visibleRequests(user, requests);
  const visible = user.role === "psicologo" ? baseVisible.filter(isPsychologistInboxRequest) : baseVisible;
  const [selectedCampus, setSelectedCampus] = useState(user.role === "coordinador_sede" ? user.campus : "");
  const [searchTerm, setSearchTerm] = useState("");
  const [reopenTarget, setReopenTarget] = useState<SupportRequest | null>(null);
  const canClinical = user.role === "psicologo";
  const canManage = user.role === "psicologo" || user.role === "coordinador_proyecto" || user.role === "coordinador_sede";
  const canSeeExecutive = user.role === "decano" || user.role === "coordinador_proyecto" || user.role === "coordinador_sede";
  const searchable = searchRequests(
    visible.filter((request) => !selectedCampus || request.campus === selectedCampus),
    searchTerm
  );
  const shouldShowSpecificCases = user.role !== "decano" || Boolean(selectedCampus) || Boolean(searchTerm.trim());
  const casesForList = shouldShowSpecificCases ? searchable : [];
  const activeCases = casesForList.filter((request) => !isClosedRequest(request));
  const attendedCases = casesForList.filter((request) => isClosedRequest(request));

  function updateStatus(id: string, status: RequestStatus) {
    const now = new Date().toISOString().slice(0, 10);
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              lastUpdate: now,
              sessions: status === "Atendida" ? Math.max(request.sessions, 1) : request.sessions,
              auditNotes: status === "Pendiente"
                ? [...(request.auditNotes ?? []), `${now} · ${user.name}: Caso devuelto a pendiente para nueva revision.`]
                : request.auditNotes
            }
          : request
      )
    );
  }

  function handleCaseAction(requestId: string, action: CaseActionKind, values: Record<string, string | boolean>) {
    const now = new Date().toISOString().slice(0, 10);
    setRequests((current) =>
      current.map((request) => {
        if (request.id !== requestId) return request;
        const auditPrefix = `${now} · ${user.name}:`;

        if (action === "take") {
          return {
            ...request,
            status: "En proceso",
            assignedTo: user.name,
            lastUpdate: now,
            auditNotes: [...(request.auditNotes ?? []), `${auditPrefix} tomo el caso para seguimiento.`]
          };
        }

        if (action === "refer") {
          const note = `${auditPrefix} Referido a ${values.referredTo}. Proceso: ${values.process}. Decision: ${values.decision}.`;
          return {
            ...request,
            status: "Derivada",
            referral: String(values.referredTo),
            lastUpdate: now,
            referralNotes: [...(request.referralNotes ?? []), note],
            auditNotes: [...(request.auditNotes ?? []), note]
          };
        }

        if (action === "attend") {
          const note = `${auditPrefix} Caso marcado como atendido. Motivo: ${values.reason}.`;
          return {
            ...request,
            status: "Atendida",
            sessions: Math.max(request.sessions, 1),
            lastUpdate: now,
            closureNotes: [...(request.closureNotes ?? []), note],
            auditNotes: [...(request.auditNotes ?? []), note]
          };
        }

        const note = `${auditPrefix} Cierre por no presentarse. Medios utilizados: ${values.means}.`;
        return {
          ...request,
          status: "No se presentó",
          lastUpdate: now,
          noShowNote: {
            coordinated: Boolean(values.coordinated),
            insisted: Boolean(values.insisted),
            means: String(values.means),
            actor: user.name,
            date: now
          },
          closureNotes: [...(request.closureNotes ?? []), note],
          auditNotes: [...(request.auditNotes ?? []), note]
        };
      })
    );
  }

  function reopenCase(reason: string) {
    if (!reopenTarget) return;
    const note = `${new Date().toISOString().slice(0, 10)} · ${user.name}: ${reason}`;
    setRequests((current) =>
      current.map((request) =>
        request.id === reopenTarget.id
          ? {
              ...request,
              status: "En proceso",
              lastUpdate: new Date().toISOString().slice(0, 10),
              reopenNotes: [...(request.reopenNotes ?? []), note]
            }
          : request
      )
    );
    setReopenTarget(null);
  }

  return (
    <section className="panel">
      {canSeeExecutive ? (
        <CareExecutiveDashboard
          user={user}
          requests={visible}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      ) : null}

      <div className="panel-head">
        <div>
          <h2>{canClinical ? "Casos y expedientes clinicos" : "Detalle de gestiones"}</h2>
          <p className="muted">
            {canClinical
              ? "Bandeja de entrada: al tomar un caso pasara a Casos en curso y dejara de aparecer aqui."
              : user.role === "decano" && !shouldShowSpecificCases
                ? "Selecciona un campus o usa busqueda para revisar casos especificos."
                : "Esta vista mantiene datos limitados: motivo general, rol, sede y numero de sesiones."}
          </p>
        </div>
        <div className="case-actions">
          <button className="button secondary" type="button" onClick={() => window.print()}>
            <Printer size={18} aria-hidden="true" />
            Imprimir reporte PDF
          </button>
          <span className="badge blue"><Eye size={15} aria-hidden="true" /> {casesForList.length} visibles</span>
        </div>
      </div>

      <div className="search-panel">
        <label htmlFor="case-search"><Search size={18} aria-hidden="true" /> Buscar caso o seccion</label>
        <input
          id="case-search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Nombre, correo institucional o carné"
          list="case-search-options"
        />
        <datalist id="case-search-options">
          {visible.map((request) => (
            <option key={request.id} value={`${request.personName} · ${request.personEmail} · ${request.personCarnet}`} />
          ))}
        </datalist>
      </div>

      {user.role === "decano" && !shouldShowSpecificCases ? (
        <div className="consent-box">
          <strong>Detalle protegido</strong>
          <p className="muted">El decano ve estadistica global primero. Para revisar casos especificos debe elegir un campus o buscar por nombre, correo o carné.</p>
        </div>
      ) : (
        <>
          <CaseList
            title="Casos activos"
            requests={activeCases}
            canClinical={canClinical}
            canManage={canManage}
            canReopen={false}
            canViewReopenNotes={canViewReopenNotes(user)}
            updateStatus={updateStatus}
            onCaseAction={handleCaseAction}
            onReopen={setReopenTarget}
          />
          <CaseList
            title="Carpeta de casos atendidos"
            requests={attendedCases}
            canClinical={canClinical}
            canManage={false}
            canReopen={canReopenCases(user)}
            canViewReopenNotes={canViewReopenNotes(user)}
            updateStatus={updateStatus}
            onCaseAction={handleCaseAction}
            onReopen={setReopenTarget}
          />
        </>
      )}

      {reopenTarget ? (
        <ReopenDialog
          request={reopenTarget}
          onCancel={() => setReopenTarget(null)}
          onConfirm={reopenCase}
        />
      ) : null}
    </section>
  );
}

function PsychologistCasesWorkspace({
  mode,
  user,
  requests,
  setRequests,
  courseList,
  progressList,
  setProgressList
}: {
  mode: "curso" | "completados";
  user: DemoUser;
  requests: SupportRequest[];
  setRequests: React.Dispatch<React.SetStateAction<SupportRequest[]>>;
  courseList: Course[];
  progressList: TrainingProgress[];
  setProgressList: React.Dispatch<React.SetStateAction<TrainingProgress[]>>;
}) {
  const cases = requests
    .filter((request) => request.assignedTo === user.name)
    .filter((request) => mode === "curso" ? !isClosedRequest(request) : isClosedRequest(request));
  const [selectedId, setSelectedId] = useState("");
  const [courseTitle, setCourseTitle] = useState(courseList[0]?.title ?? "");
  const [due, setDue] = useState("2026-08-15");
  const [showVideoAssigner, setShowVideoAssigner] = useState(false);
  const [actionTarget, setActionTarget] = useState<{ request: SupportRequest; action: CaseActionKind } | null>(null);
  const selected = cases.find((request) => request.id === selectedId) ?? cases[0];
  const selectedAssignments = selected
    ? progressList.filter((item) => item.person === selected.personName)
    : [];
  const completedAssignments = selectedAssignments.filter((item) => item.approvedAt || item.progress >= 100);
  const title = mode === "curso" ? "Casos en curso" : "Casos completados";

  function handleCaseAction(requestId: string, action: CaseActionKind, values: Record<string, string | boolean>) {
    const now = new Date().toISOString().slice(0, 10);
    setRequests((current) =>
      current.map((request) => {
        if (request.id !== requestId) return request;
        const auditPrefix = `${now} · ${user.name}:`;

        if (action === "refer") {
          const note = `${auditPrefix} Referido a ${values.referredTo}. Proceso: ${values.process}. Decision: ${values.decision}.`;
          return {
            ...request,
            status: "Derivada",
            referral: String(values.referredTo),
            lastUpdate: now,
            referralNotes: [...(request.referralNotes ?? []), note],
            auditNotes: [...(request.auditNotes ?? []), note]
          };
        }

        if (action === "attend") {
          const note = `${auditPrefix} Caso marcado como atendido. Motivo: ${values.reason}.`;
          return {
            ...request,
            status: "Atendida",
            sessions: Math.max(request.sessions, 1),
            lastUpdate: now,
            closureNotes: [...(request.closureNotes ?? []), note],
            auditNotes: [...(request.auditNotes ?? []), note]
          };
        }

        const note = `${auditPrefix} Cierre por no presentarse. Medios utilizados: ${values.means}.`;
        return {
          ...request,
          status: "No se presentó",
          lastUpdate: now,
          noShowNote: {
            coordinated: Boolean(values.coordinated),
            insisted: Boolean(values.insisted),
            means: String(values.means),
            actor: user.name,
            date: now
          },
          closureNotes: [...(request.closureNotes ?? []), note],
          auditNotes: [...(request.auditNotes ?? []), note]
        };
      })
    );
  }

  function assignVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !courseTitle) return;
    const now = new Date().toISOString().slice(0, 10);
    setProgressList((current) => [
      {
        assignmentId: `asig-${Date.now()}-${selected.personId}`,
        person: selected.personName,
        campus: selected.campus,
        role: selected.personKind,
        course: courseTitle,
        progress: 0,
        due,
        assignedBy: user.name,
        assignedAt: now
      },
      ...current
    ]);
    setShowVideoAssigner(false);
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <span className="badge blue"><Stethoscope size={15} aria-hidden="true" /> Psicologia</span>
          <h2 style={{ marginTop: 10 }}>{title}</h2>
          <p className="muted">
            {mode === "curso"
              ? "Casos tomados por el psicologo. Desde aqui se asignan videos, se revisa avance y se cierra el caso cuando corresponda."
              : "Historial de casos cerrados por el psicologo con trazabilidad y avances formativos."}
          </p>
        </div>
        {mode === "curso" ? <span className="badge orange"><Clock size={15} aria-hidden="true" /> {cases.length} casos</span> : null}
      </div>

      {mode === "curso" ? (
        <section className="metric-grid">
          <Metric label="Casos visibles" value={cases.length} note="Asignados a ti" />
          <Metric label="Videos asignados" value={selectedAssignments.length} note={selected ? selected.personName : "Sin caso abierto"} />
          <Metric label="Videos terminados" value={completedAssignments.length} note="Con aprobado o avance completo" />
          <Metric label="Sesiones" value={cases.reduce((sum, request) => sum + request.sessions, 0)} note="Acumuladas en esta carpeta" />
        </section>
      ) : null}

      <div className="case-workspace">
        <div className="case-picker">
          <div className="folder-head">
            <h3><Folder size={18} aria-hidden="true" /> {title}</h3>
            {mode === "curso" ? <span className="badge blue">{cases.length}</span> : null}
          </div>
          {cases.length === 0 ? (
            <p className="muted">No hay casos en esta carpeta.</p>
          ) : null}
          {cases.map((request) => (
            <button
              className={`case-pick ${selected?.id === request.id ? "selected" : ""}`}
              key={request.id}
              type="button"
              onClick={() => setSelectedId(request.id)}
            >
              <strong>{request.personName}</strong>
              <span>{request.id} · {request.status} · Riesgo {request.risk}</span>
              <small>Abrir caso</small>
            </button>
          ))}
        </div>

        <div className="case-detail-panel">
          {selected ? (
            <>
              <div className="case-top">
                <div>
                  <h3 className="case-title">{selected.id} · {selected.personName}</h3>
                  <p className="muted">{selected.personKind} · {selected.campus} · {selected.personEmail} · {selected.personCarnet}</p>
                </div>
                <div className="status-row">
                  <span className={`badge ${statusTone[selected.status]}`}>{selected.status}</span>
                  <span className={`badge ${riskTone[selected.risk]}`}>Riesgo {selected.risk}</span>
                </div>
              </div>

              <div className="clinical-box">
                <strong>Nota clinica restringida</strong>
                <p>{selected.clinicalNote}</p>
                <strong>Motivo general</strong>
                <p>{selected.generalNote}</p>
              </div>

              {mode === "curso" ? (
                <div className="assignment-compact">
                  <div>
                    <h3>Intervencion formativa</h3>
                    <p className="muted">Asigna videos o rutas guiadas sin ocupar espacio permanente en el expediente.</p>
                  </div>
                  <button className="button primary" type="button" onClick={() => setShowVideoAssigner(true)}>
                    <Video size={18} aria-hidden="true" />
                    Asignar video
                  </button>
                </div>
              ) : null}

              <div className="panel-subsection">
                <div className="panel-head">
                  <div>
                    <h3>Videos asignados y avance</h3>
                    <p className="muted">Permite revisar si termino, fecha limite, quien asigno y nota obtenida.</p>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Video</th>
                        <th>Avance</th>
                        <th>Nota</th>
                        <th>Vence</th>
                        <th>Asignado por</th>
                        <th>Asignado</th>
                        <th>Aprobado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAssignments.map((item) => (
                        <tr key={item.assignmentId}>
                          <td>{item.course}</td>
                          <td>{item.progress}%</td>
                          <td>{item.grade ? `${item.grade}/100` : "Pendiente"}</td>
                          <td>{item.due}</td>
                          <td>{item.assignedBy}</td>
                          <td>{item.assignedAt}</td>
                          <td>{item.approvedAt ?? "Pendiente"}</td>
                        </tr>
                      ))}
                      {selectedAssignments.length === 0 ? (
                        <tr>
                          <td colSpan={7}>No hay videos asignados todavia.</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>

              {mode === "curso" ? (
                <div className="case-actions">
                  <button className="button secondary" type="button" onClick={() => setActionTarget({ request: selected, action: "refer" })}>
                    <FileText size={18} aria-hidden="true" />
                    Referir
                  </button>
                  <button className="button secondary" type="button" onClick={() => setActionTarget({ request: selected, action: "noshow" })}>
                    <X size={18} aria-hidden="true" />
                    No se presento
                  </button>
                  <button className="button primary" type="button" onClick={() => setActionTarget({ request: selected, action: "attend" })}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Marcar atendida
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="consent-box">
              <strong>Sin caso seleccionado</strong>
              <p className="muted">Cuando tomes un caso desde Bienestar estudiantil aparecera aqui.</p>
            </div>
          )}
        </div>
      </div>

      {actionTarget ? (
        <CaseActionDialog
          request={actionTarget.request}
          action={actionTarget.action}
          onCancel={() => setActionTarget(null)}
          onConfirm={(values) => {
            handleCaseAction(actionTarget.request.id, actionTarget.action, values);
            setActionTarget(null);
          }}
        />
      ) : null}
      {showVideoAssigner && selected ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="video-assign-title">
          <form className="modal-panel" onSubmit={assignVideo}>
            <div className="panel-head">
              <div>
                <h2 id="video-assign-title">Asignar video a {selected.personName}</h2>
                <p className="muted">El registro quedara vinculado al expediente formativo del solicitante.</p>
              </div>
              <button className="button secondary" type="button" onClick={() => setShowVideoAssigner(false)}>
                <X size={18} aria-hidden="true" />
                Cerrar
              </button>
            </div>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="psych-course">Video educativo</label>
                <select id="psych-course" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)}>
                  {courseList.map((course) => <option key={course.id}>{course.title}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="psych-due">Fecha limite</label>
                <input id="psych-due" type="date" value={due} onChange={(event) => setDue(event.target.value)} />
              </div>
            </div>
            <div className="case-actions">
              <button className="button secondary" type="button" onClick={() => setShowVideoAssigner(false)}>Cancelar</button>
              <button className="button primary" type="submit">
                <Video size={18} aria-hidden="true" />
                Asignar video
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

function CareExecutiveDashboard({
  user,
  requests,
  selectedCampus,
  setSelectedCampus
}: {
  user: DemoUser;
  requests: SupportRequest[];
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
}) {
  const scopedRequests = user.role === "coordinador_sede" ? requests.filter((request) => request.campus === user.campus) : requests;
  const metrics = careMetrics(scopedRequests);
  const campusRows = campuses
    .filter((campus) => user.role !== "coordinador_sede" || campus === user.campus)
    .map((campus) => ({ campus, metrics: careMetrics(scopedRequests.filter((request) => request.campus === campus)) }));

  return (
    <div className="executive-dashboard">
      <div className="panel-head">
        <div>
          <span className="badge blue"><Building2 size={15} aria-hidden="true" /> Pais: Guatemala</span>
          <h2 style={{ marginTop: 10 }}>Tablero ejecutivo de bienestar estudiantil</h2>
          <p className="muted">Datos globales, por pais y por campus. Los coordinadores de sede ven solo su campus.</p>
        </div>
        <button className="button secondary" type="button" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" />
          Imprimir reporte PDF
        </button>
      </div>
      <section className="metric-grid executive-metrics">
        <Metric label="Apoyo solicitado" value={metrics.total} note="Gestiones registradas" />
        <Metric label="En proceso" value={metrics.pending + metrics.inProcess} note={`${metrics.pending} pendientes · ${metrics.inProcess} tomadas`} />
        <Metric label="Derivados" value={metrics.derived} note="Referidos a apoyo externo" />
        <Metric label="Resueltos" value={metrics.resolved} note="En carpeta atendida" />
        <Metric label="Alertas urgentes" value={metrics.urgent} note="Riesgo alto o prioridad" />
        <Metric label="No se presento" value={metrics.noShow} note="Cierres por inasistencia" />
        <Metric label="Sesiones globales" value={metrics.sessions} note="Acumulado del alcance visible" />
        <Metric label="Campus con casos" value={metrics.campuses} note="Sedes con actividad" />
      </section>
      <div className="campus-dashboard-grid">
        {campusRows.map(({ campus, metrics: row }) => (
          <button
            className={`campus-card ${selectedCampus === campus ? "selected" : ""}`}
            key={campus}
            type="button"
            onClick={() => setSelectedCampus(selectedCampus === campus ? "" : campus)}
          >
            <div className="campus-card-title">
              <strong>{campus}</strong>
              <span>Total {row.total}</span>
            </div>
            <div className="campus-status-grid">
              <span>Pendientes <strong>{row.pending}</strong></span>
              <span>En proceso <strong>{row.inProcess}</strong></span>
              <span>Derivados <strong>{row.derived}</strong></span>
              <span>Resueltos <strong>{row.resolved}</strong></span>
              <span>No se presento <strong>{row.noShow}</strong></span>
            </div>
            <span className="campus-alert">Alertas urgentes: {row.urgent}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CaseList({
  title,
  requests,
  canClinical,
  canManage,
  canReopen,
  canViewReopenNotes,
  updateStatus,
  onCaseAction,
  onReopen
}: {
  title: string;
  requests: SupportRequest[];
  canClinical: boolean;
  canManage: boolean;
  canReopen: boolean;
  canViewReopenNotes: boolean;
  updateStatus: (id: string, status: RequestStatus) => void;
  onCaseAction: (requestId: string, action: CaseActionKind, values: Record<string, string | boolean>) => void;
  onReopen: (request: SupportRequest) => void;
}) {
  const [actionTarget, setActionTarget] = useState<{ request: SupportRequest; action: CaseActionKind } | null>(null);

  return (
    <div className="case-folder">
      <div className="folder-head">
        <h3><Folder size={18} aria-hidden="true" /> {title}</h3>
        <span className="badge blue">{requests.length} casos</span>
      </div>
      <div className="case-list">
        {requests.length === 0 ? <p className="muted">No hay casos en esta carpeta con los filtros actuales.</p> : null}
        {requests.map((request) => (
          <article className="case-card" key={request.id}>
            <div className="case-top">
              <div>
                <h3 className="case-title">{request.id} · {request.personName}</h3>
                <p className="muted">{request.personKind} · {request.campus} · {request.personEmail} · {request.personCarnet}</p>
                <p className="muted">{request.reason}</p>
              </div>
              <div className="status-row">
                <span className={`badge ${statusTone[request.status]}`}>{request.status}</span>
                <span className={`badge ${riskTone[request.risk]}`}>Riesgo {request.risk}</span>
              </div>
            </div>
            <div className="grid-3">
              <div><strong>Canal</strong><p className="muted">{request.channel}</p></div>
              <div><strong>Sesiones</strong><p className="muted">{request.sessions}</p></div>
              <div><strong>Ultima actualizacion</strong><p className="muted">{request.lastUpdate}</p></div>
            </div>
            <div className="grid-3">
              <div><strong>Contacto cita</strong><p className="muted">{request.contactMethod ?? request.channel}</p></div>
              <div><strong>Telefono</strong><p className="muted">{request.phone ?? "Pendiente"}</p></div>
              <div><strong>Correo personal</strong><p className="muted">{request.personalEmail ?? "Pendiente"}</p></div>
            </div>
            {request.assignedTo ? (
              <div className="audit-note">
                <strong>Responsable asignado</strong>
                <span>{request.assignedTo}</span>
              </div>
            ) : null}
            <div className="consent-box">
              <strong>Motivo general visible</strong>
              <p className="muted">{request.generalNote}</p>
            </div>
            {canClinical ? (
              <div className="clinical-box">
                <strong>Nota clinica restringida</strong>
                <p>{request.clinicalNote}</p>
                <strong>Derivacion</strong>
                <p>{request.referral}</p>
                {request.referralNotes?.map((note) => <p key={note}>{note}</p>)}
                {request.closureNotes?.map((note) => <p key={note}>{note}</p>)}
                {request.noShowNote ? (
                  <p>
                    No se presento: sesion coordinada {request.noShowNote.coordinated ? "si" : "no"},
                    comunicacion insistida {request.noShowNote.insisted ? "si" : "no"}.
                    Medios: {request.noShowNote.means}.
                  </p>
                ) : null}
              </div>
            ) : null}
            {canViewReopenNotes && request.auditNotes?.length ? (
              <div className="clinical-box">
                <strong>Auditoria de gestion</strong>
                {request.auditNotes.map((note) => <p key={note}>{note}</p>)}
              </div>
            ) : null}
            {canViewReopenNotes && request.reopenNotes?.length ? (
              <div className="clinical-box">
                <strong>Contexto de reapertura</strong>
                {request.reopenNotes.map((note) => <p key={note}>{note}</p>)}
              </div>
            ) : null}
            {canManage ? (
              <div className="case-actions">
                <button className="button secondary" type="button" onClick={() => updateStatus(request.id, "Pendiente")}>
                  <RotateCcw size={18} aria-hidden="true" />
                  Dejar pendiente
                </button>
                <button className="button secondary" type="button" onClick={() => setActionTarget({ request, action: "take" })}>
                  <Clock size={18} aria-hidden="true" />
                  Tomar caso
                </button>
                <button className="button secondary" type="button" onClick={() => setActionTarget({ request, action: "refer" })}>
                  <FileText size={18} aria-hidden="true" />
                  Derivar
                </button>
                <button className="button secondary" type="button" onClick={() => setActionTarget({ request, action: "noshow" })}>
                  <X size={18} aria-hidden="true" />
                  No se presento
                </button>
                <button className="button primary" type="button" onClick={() => setActionTarget({ request, action: "attend" })}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Marcar atendida
                </button>
              </div>
            ) : null}
            {canReopen ? (
              <div className="case-actions">
                <button className="button secondary" type="button" onClick={() => onReopen(request)}>
                  <RotateCcw size={18} aria-hidden="true" />
                  Reabrir caso
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
      {actionTarget ? (
        <CaseActionDialog
          request={actionTarget.request}
          action={actionTarget.action}
          onCancel={() => setActionTarget(null)}
          onConfirm={(values) => {
            onCaseAction(actionTarget.request.id, actionTarget.action, values);
            setActionTarget(null);
          }}
        />
      ) : null}
    </div>
  );
}

function CaseActionDialog({
  request,
  action,
  onCancel,
  onConfirm
}: {
  request: SupportRequest;
  action: CaseActionKind;
  onCancel: () => void;
  onConfirm: (values: Record<string, string | boolean>) => void;
}) {
  const [referredTo, setReferredTo] = useState("");
  const [process, setProcess] = useState("");
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [coordinated, setCoordinated] = useState(false);
  const [insisted, setInsisted] = useState(false);
  const [means, setMeans] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (action === "take") {
      onConfirm({});
      return;
    }
    if (action === "refer") {
      if (!referredTo.trim() || !process.trim() || !decision.trim()) return;
      onConfirm({ referredTo: referredTo.trim(), process: process.trim(), decision: decision.trim() });
      return;
    }
    if (action === "attend") {
      if (!reason.trim()) return;
      onConfirm({ reason: reason.trim() });
      return;
    }
    if (!coordinated || !insisted || !means.trim()) return;
    onConfirm({ coordinated, insisted, means: means.trim() });
  }

  const title = {
    take: `Tomar caso ${request.id}`,
    refer: `Referir caso ${request.id}`,
    attend: `Marcar atendida ${request.id}`,
    noshow: `Cerrar por inasistencia ${request.id}`
  }[action];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="case-action-title">
      <form className="modal-panel" onSubmit={submit}>
        <h2 id="case-action-title">{title}</h2>
        <p className="muted">{request.personName} · {request.campus} · {request.personCarnet}</p>

        {action === "take" ? (
          <div className="consent-box">
            <strong>Confirmacion requerida</strong>
            <p className="muted">¿Esta seguro(a) de tomar el caso? Al confirmar, tu nombre quedara marcado como responsable de atencion para seguimiento y auditoria.</p>
          </div>
        ) : null}

        {action === "refer" ? (
          <>
            <div className="field">
              <label htmlFor="referred-to">¿A donde se refirio?</label>
              <input id="referred-to" value={referredTo} onChange={(event) => setReferredTo(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="referral-process">¿Como fue el proceso?</label>
              <textarea id="referral-process" value={process} onChange={(event) => setProcess(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="referral-decision">¿Por que se tomo esa decision?</label>
              <textarea id="referral-decision" value={decision} onChange={(event) => setDecision(event.target.value)} required />
            </div>
          </>
        ) : null}

        {action === "attend" ? (
          <div className="field">
            <label htmlFor="attend-reason">¿Por que se esta marcando como atendida?</label>
            <textarea id="attend-reason" value={reason} onChange={(event) => setReason(event.target.value)} required />
          </div>
        ) : null}

        {action === "noshow" ? (
          <div className="no-show-box">
            <label>
              <input type="checkbox" checked={coordinated} onChange={(event) => setCoordinated(event.target.checked)} required />
              Se coordino la sesion con el solicitante.
            </label>
            <label>
              <input type="checkbox" checked={insisted} onChange={(event) => setInsisted(event.target.checked)} required />
              Se insistio la comunicacion con el estudiante.
            </label>
            <div className="field">
              <label htmlFor="no-show-means">Medios utilizados</label>
              <textarea
                id="no-show-means"
                value={means}
                onChange={(event) => setMeans(event.target.value)}
                placeholder="Ejemplo: correo institucional, llamada telefonica y mensaje al correo personal."
                required
              />
            </div>
          </div>
        ) : null}

        <div className="case-actions">
          <button className="button secondary" type="button" onClick={onCancel}>Cancelar</button>
          <button className={action === "noshow" ? "button warning" : "button primary"} type="submit">
            {action === "take" ? <Clock size={18} aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
            {action === "take" ? "Si, tomar caso" : action === "noshow" ? "Cerrar caso" : "Guardar registro"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ReopenDialog({
  request,
  onCancel,
  onConfirm
}: {
  request: SupportRequest;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reopen-title">
      <form className="modal-panel" onSubmit={submit}>
        <h2 id="reopen-title">Reabrir caso {request.id}</h2>
        <p className="muted">Escribe la razon de reapertura. Esta nota quedara visible para psicologia y coordinacion.</p>
        <div className="field">
          <label htmlFor="reopen-reason">Razon de reapertura</label>
          <textarea id="reopen-reason" value={reason} onChange={(event) => setReason(event.target.value)} required />
        </div>
        <div className="case-actions">
          <button className="button secondary" type="button" onClick={onCancel}>Cancelar</button>
          <button className="button primary" type="submit">
            <RotateCcw size={18} aria-hidden="true" />
            Reabrir con contexto
          </button>
        </div>
      </form>
    </div>
  );
}

function SupportForm({
  user,
  setRequests,
  setActiveView
}: {
  user: DemoUser;
  setRequests: React.Dispatch<React.SetStateAction<SupportRequest[]>>;
  setActiveView: (view: ViewKey) => void;
}) {
  const [reason, setReason] = useState("Necesito apoyo para manejar estres y carga academica.");
  const [channel, setChannel] = useState("Videollamada");
  const [contactMethod, setContactMethod] = useState("Telefono");
  const [phone, setPhone] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [recordConsent, setRecordConsent] = useState(false);
  const [informedConsent, setInformedConsent] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [campus, setCampus] = useState(user.campus);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recordConsent || !informedConsent || !phone.trim() || !personalEmail.trim()) return;
    const now = new Date().toISOString().slice(0, 10);
    const newRequest: SupportRequest = {
      id: `BA-${Math.floor(1100 + Math.random() * 800)}`,
      personId: user.id,
      personName: user.name,
      personEmail: user.email,
      personCarnet: user.carnet,
      personalEmail,
      phone,
      personKind: user.kind,
      campus,
      reason,
      channel,
      contactMethod,
      status: "Pendiente",
      risk: urgent ? "Alto" : "Medio",
      sessions: 0,
      createdAt: now,
      lastUpdate: now,
      generalNote: reason,
      clinicalNote: "Pendiente primera entrevista. Nota visible solo para psicologia.",
      referral: urgent ? "Revision prioritaria y activacion de protocolo" : "Pendiente evaluacion inicial",
      urgent,
      informedConsent,
      auditNotes: [`${now} · Sistema: Solicitud creada con consentimiento informado y autorizacion de registro minimo.`]
    };
    setRequests((current) => [newRequest, ...current]);
    setActiveView("gestiones");
  }

  return (
    <form className="request-form" onSubmit={submit}>
      <div className="panel-head">
        <div>
          <h2>Solicitud de apoyo</h2>
          <p className="muted">La solicitud llega a gestiones pendientes y al psicologo segun prioridad.</p>
        </div>
        <span className="badge blue"><LockKeyhole size={15} aria-hidden="true" /> Consentimiento requerido</span>
      </div>
      <div className="crisis-box">
        <strong>Importante</strong>
        <p>Este prototipo no representa un canal de emergencia 24/7. Si hay peligro inmediato, debe activarse el protocolo institucional y los servicios locales de emergencia.</p>
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="campus">Campus o sede</label>
          <select id="campus" value={campus} onChange={(event) => setCampus(event.target.value)}>
            {campuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="channel">Canal preferido para atencion</label>
          <select id="channel" value={channel} onChange={(event) => setChannel(event.target.value)}>
            <option>Videollamada</option>
            <option>Presencial</option>
            <option>Telefono</option>
            <option>Correo institucional</option>
          </select>
        </div>
      </div>
      <div className="grid-3">
        <div className="field">
          <label htmlFor="contact-method">Medio para coordinar cita</label>
          <select id="contact-method" value={contactMethod} onChange={(event) => setContactMethod(event.target.value)} required>
            <option>Telefono</option>
            <option>Correo personal</option>
            <option>Correo institucional</option>
            <option>WhatsApp</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="phone">Numero de telefono</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ej. 5555-0000"
            autoComplete="tel"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="personal-email">Correo personal</label>
          <input
            id="personal-email"
            type="email"
            value={personalEmail}
            onChange={(event) => setPersonalEmail(event.target.value)}
            placeholder="nombre@correo.com"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="reason">Motivo general de solicitud</label>
        <textarea id="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
      </div>
      <label className="consent-box">
        <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
        {" "}Esta solicitud requiere atencion prioritaria por posible riesgo o crisis.
      </label>
      <div className="consent-box">
        <label>
          <input required type="checkbox" checked={recordConsent} onChange={(event) => setRecordConsent(event.target.checked)} />{" "}
          Acepto que la facultad registre esta solicitud para gestionar apoyo y derivacion, separando datos generales de notas clinicas.
        </label>
      </div>
      <div className="legal-consent">
        <label>
          <input required type="checkbox" checked={informedConsent} onChange={(event) => setInformedConsent(event.target.checked)} />{" "}
          He leido y acepto el consentimiento informado basico: comprendo que este servicio es de orientacion, apoyo y derivacion; no es un canal de emergencia 24/7 ni sustituye atencion medica o psicologica externa cuando sea necesaria. Autorizo el uso minimo de mis datos para coordinar la cita, dar seguimiento y documentar la gestion, manteniendo las notas clinicas restringidas al personal autorizado.
        </label>
      </div>
      <button className="button primary" type="submit">
        <Send size={18} aria-hidden="true" />
        Enviar solicitud
      </button>
    </form>
  );
}

function TrainingCenter({
  user,
  courseList,
  setCourseList,
  progressList,
  setProgressList,
  setActiveView
}: {
  user: DemoUser;
  courseList: Course[];
  setCourseList: React.Dispatch<React.SetStateAction<Course[]>>;
  progressList: TrainingProgress[];
  setProgressList: React.Dispatch<React.SetStateAction<TrainingProgress[]>>;
  setActiveView: (view: ViewKey) => void;
}) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAssigner, setShowAssigner] = useState(false);
  const [courseQuery, setCourseQuery] = useState("");
  const [classificationFilter, setClassificationFilter] = useState<Course["classification"] | "Todas">("Todas");
  const canCreateCourses = user.role === "coordinador_proyecto";
  const canAssignCourses = user.role === "decano" || user.role === "coordinador_proyecto" || user.role === "coordinador_sede";
  const visibleProgress = user.role === "coordinador_sede"
    ? progressList.filter((item) => item.campus === user.campus)
    : user.role === "estudiante_docente"
      ? progressList.filter((item) => item.person === user.name)
      : progressList;
  const wellbeingView = user.role === "estudiante_docente" || user.role === "coordinador_sede" ? "solicitud" : "gestiones";
  const isStudentView = user.role === "estudiante_docente";
  const classifications: Array<Course["classification"] | "Todas"> = ["Todas", "Habilidades blandas", "Habilidades técnicas", "Bienestar integral"];
  const assignmentsByCourse = visibleProgress.reduce<Map<string, TrainingProgress[]>>((map, item) => {
    const current = map.get(item.course) ?? [];
    map.set(item.course, [...current, item]);
    return map;
  }, new Map());
  const filteredCourses = courseList
    .filter((course) => classificationFilter === "Todas" || course.classification === classificationFilter)
    .filter((course) => courseMatchesSearch(course, courseQuery))
    .sort((a, b) => {
      if (!isStudentView) return a.title.localeCompare(b.title);
      const aAssigned = assignmentsByCourse.has(a.title) ? 1 : 0;
      const bAssigned = assignmentsByCourse.has(b.title) ? 1 : 0;
      return bAssigned - aAssigned || a.title.localeCompare(b.title);
    });

  return (
    <section className="panel training-home">
      <div className="panel-head">
        <div>
          <span className="badge blue"><BookOpen size={15} aria-hidden="true" /> Primero: formacion preventiva</span>
          <h2 style={{ marginTop: 10 }}>Centro de Formacion ARQ</h2>
          <p className="muted">Cursos disponibles para bienestar, convivencia, manejo de conflictos y acompanamiento humano.</p>
        </div>
        <div className="case-actions">
          <button className="button secondary" type="button" onClick={() => setActiveView(wellbeingView)}>
            <Shield size={18} aria-hidden="true" />
            Bienestar estudiantil
          </button>
          {canAssignCourses ? (
            <button className="button secondary" type="button" onClick={() => setShowAssigner((current) => !current)}>
              <UserCheck size={18} aria-hidden="true" />
              Asignar cursos
            </button>
          ) : null}
          {canCreateCourses ? (
            <button className="button primary" type="button" onClick={() => setShowBuilder((current) => !current)}>
              <Plus size={18} aria-hidden="true" />
              Crear curso
            </button>
          ) : null}
        </div>
      </div>

      {!isStudentView ? <TrainingUsageStats /> : null}

      <div className="course-toolbar">
        <div className="field">
          <label htmlFor="course-search"><Search size={18} aria-hidden="true" /> Buscar videos por especialidad</label>
          <input
            id="course-search"
            value={courseQuery}
            onChange={(event) => setCourseQuery(event.target.value)}
            placeholder="Ej. conflictos, presupuestos, representacion, bienestar"
          />
        </div>
        <div className="classification-tabs" aria-label="Clasificacion de videos educativos">
          {classifications.map((classification) => (
            <button
              className={classificationFilter === classification ? "active" : ""}
              key={classification}
              type="button"
              onClick={() => setClassificationFilter(classification)}
            >
              {classification}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-3 course-grid">
        {filteredCourses.map((course) => {
          const assignments = assignmentsByCourse.get(course.title) ?? [];
          const primaryAssignment = assignments.find((item) => !item.approvedAt) ?? assignments[0];
          return (
          <article className="course-card course-preview" key={course.id}>
            <div className="course-cover" aria-hidden="true">
              {course.platform === "Teams" ? <Monitor size={26} /> : course.platform === "Vimeo" ? <Video size={26} /> : <Play size={26} />}
            </div>
            {isStudentView && primaryAssignment ? (
              <div className="assigned-banner">
                <strong>{primaryAssignment.approvedAt ? "Curso aprobado" : "Tienes asignado este curso"}</strong>
                <span>
                  Tienes hasta {primaryAssignment.due} · Asignado por {primaryAssignment.assignedBy}
                  {assignments.length > 1 ? ` · ${assignments.length} registros conservados` : ""}
                </span>
              </div>
            ) : null}
            <span className="badge blue">{course.category}</span>
            <span className={course.classification === "Habilidades técnicas" ? "badge orange" : "badge green"}>{course.classification}</span>
            <h3>{course.title}</h3>
            <p className="muted">{course.description}</p>
            <div className="course-meta">
              <span className="badge green">{course.audience}</span>
              <span className="badge blue">{course.specialty}</span>
              <span className="badge orange">{course.duration}</span>
              <span className="badge blue">{course.platform}</span>
            </div>
            <div className="progress-track" aria-label={`Avance ${primaryAssignment?.progress ?? course.completion}%`}>
              <div className="progress-fill" style={{ width: `${primaryAssignment?.progress ?? course.completion}%` }} />
            </div>
            {primaryAssignment?.approvedAt ? <p className="muted">Aprobado el {primaryAssignment.approvedAt}</p> : null}
            <p className="muted">{course.modules.join(" · ")}</p>
          </article>
        );})}
      </div>
      {filteredCourses.length === 0 ? (
        <div className="consent-box">
          <strong>No hay videos con ese filtro</strong>
          <p className="muted">Prueba buscando por otra especialidad o cambia la clasificacion.</p>
        </div>
      ) : null}

      {isStudentView ? <TrainingUsageStats /> : null}

      {showBuilder ? <CourseBuilder onCancel={() => setShowBuilder(false)} onSave={(course) => {
        setCourseList((current) => [course, ...current]);
        setShowBuilder(false);
      }} /> : null}

      {showAssigner ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="assign-title">
          <CourseAssignmentPanel
            user={user}
            courseList={courseList}
            setProgressList={setProgressList}
            onClose={() => setShowAssigner(false)}
          />
        </div>
      ) : null}

      <div className="panel-subsection">
        <div className="panel-head">
          <div>
            <h2>Avance asignado</h2>
            <p className="muted">Seguimiento de rutas formativas sin mezclar datos clinicos ni solicitudes de apoyo.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Rol</th>
                <th>Sede</th>
                <th>Curso</th>
                <th>Avance</th>
                <th>Nota</th>
                <th>Vence</th>
                <th>Asignado por</th>
                <th>Aprobado</th>
              </tr>
            </thead>
            <tbody>
              {visibleProgress.map((item) => (
                <tr key={item.assignmentId}>
                  <td>{item.person}</td>
                  <td>{item.role}</td>
                  <td>{item.campus}</td>
                  <td>{item.course}</td>
                  <td>{item.progress}%</td>
                  <td>{item.grade ? `${item.grade}/100` : "Pendiente"}</td>
                  <td>{item.due}</td>
                  <td>{item.assignedBy}</td>
                  <td>{item.approvedAt ?? "Pendiente"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TrainingUsageStats({ compact = false }: { compact?: boolean }) {
  const rows = campusTrainingStats.map((item) => ({
    ...item,
    useRate: Math.round((item.peopleUsingTraining / item.assignedPopulation) * 100),
    completionRate: Math.round((item.peopleCompletedTraining / item.assignedPopulation) * 100)
  }));

  return (
    <div className={compact ? "chart-list" : "training-stats"}>
      {!compact ? (
        <div className="panel-head stats-head">
          <div>
            <h2>Uso y cumplimiento por campus</h2>
            <p className="muted">Comparacion justa: porcentajes calculados contra la poblacion asignada de cada sede.</p>
          </div>
        </div>
      ) : null}
      {rows.map((item) => (
        <div className="stat-row" key={item.campus}>
          <div>
            <strong>{item.campus}</strong>
            <span>{item.peopleUsingTraining}/{item.assignedPopulation} usando · {item.peopleCompletedTraining} completaron</span>
          </div>
          <div className="dual-bars">
            <div className="bar" aria-label={`${item.campus}: ${item.useRate}% usando formaciones`}>
              <span style={{ width: `${item.useRate}%` }} />
            </div>
            <div className="bar completed" aria-label={`${item.campus}: ${item.completionRate}% completaron formaciones`}>
              <span style={{ width: `${item.completionRate}%` }} />
            </div>
          </div>
          <strong>{item.completionRate}%</strong>
        </div>
      ))}
    </div>
  );
}

function CourseBuilder({
  onCancel,
  onSave
}: {
  onCancel: () => void;
  onSave: (course: Course) => void;
}) {
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("2");
  const [category, setCategory] = useState("Bienestar preventivo");
  const [classification, setClassification] = useState<Course["classification"]>("Habilidades blandas");
  const [specialty, setSpecialty] = useState("Bienestar y convivencia");
  const [coverUrl, setCoverUrl] = useState("");
  const [platform, setPlatform] = useState<Course["platform"]>("YouTube");
  const [resourceUrl, setResourceUrl] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState("2026-07-06");
  const [certificateEvaluation, setCertificateEvaluation] = useState(true);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      id: `c-${Date.now()}`,
      title: title || "Nuevo curso de bienestar",
      audience: "Estudiantes y docentes",
      classification,
      category,
      specialty,
      duration: `${hours} horas`,
      modules: [resourceUrl ? "Video principal" : "Contenido inicial", "Material de apoyo", certificateEvaluation ? "Evaluacion para certificado" : "Cierre"],
      completion: 0,
      assignedBy: "M.A. Juan J. Reyes",
      description: description || "Recurso formativo creado como vista previa del aula virtual.",
      platform,
      coverUrl,
      publishDate,
      certificateEvaluation
    });
  }

  return (
    <form className="course-builder" onSubmit={submit}>
      <div className="builder-head">
        <h2>Nuevo recurso formativo</h2>
        <div className="case-actions">
          <button className="button dark-secondary" type="button" onClick={onCancel}>
            <X size={18} aria-hidden="true" />
            Cancelar
          </button>
          <button className="button save" type="submit">
            <Save size={18} aria-hidden="true" />
            Guardar cambios
          </button>
        </div>
      </div>
      <div className="builder-grid">
        <div>
          <div className="field dark">
            <label htmlFor="course-title">Titulo</label>
            <input id="course-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="field dark">
            <label htmlFor="course-category">Categoria</label>
            <input id="course-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Selecciona o escribe una categoria nueva" />
          </div>
          <div className="field dark">
            <label htmlFor="course-classification">Clasificacion</label>
            <select id="course-classification" value={classification} onChange={(event) => setClassification(event.target.value as Course["classification"])}>
              <option>Habilidades blandas</option>
              <option>Habilidades técnicas</option>
              <option>Bienestar integral</option>
            </select>
          </div>
          <fieldset className="platform-field">
            <legend>Plataforma de video</legend>
            <div className="platform-options">
              {(["YouTube", "Vimeo", "Teams"] as Course["platform"][]).map((item) => (
                <button
                  className={`platform-button ${platform === item ? "selected" : ""}`}
                  key={item}
                  type="button"
                  onClick={() => setPlatform(item)}
                >
                  {item === "Teams" ? <Monitor size={18} aria-hidden="true" /> : item === "Vimeo" ? <Video size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="field dark">
            <label htmlFor="resource-url">{platform} ID o URL</label>
            <input id="resource-url" value={resourceUrl} onChange={(event) => setResourceUrl(event.target.value)} placeholder={`ID del video o URL completa de ${platform}`} />
          </div>
        </div>
        <div>
          <div className="field dark">
            <label htmlFor="hours">Duracion (Horas)</label>
            <input id="hours" type="number" min="1" value={hours} onChange={(event) => setHours(event.target.value)} />
          </div>
          <div className="field dark">
            <label htmlFor="specialty">Especialidad</label>
            <input id="specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="Ej. presupuestos, conflictos, bienestar" />
          </div>
          <div className="field dark">
            <label htmlFor="cover">URL imagen portada (opcional)</label>
            <input id="cover" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} />
            <span>Si no se carga, se usara la portada de la plataforma.</span>
          </div>
          <div className="field dark">
            <label htmlFor="description">Descripcion</label>
            <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="field dark">
            <label htmlFor="publish">Programar publicacion</label>
            <input id="publish" type="date" value={publishDate} onChange={(event) => setPublishDate(event.target.value)} />
            <span>Deja vacio para publicar de inmediato.</span>
          </div>
        </div>
      </div>
      <label className="certificate-box">
        <input type="checkbox" checked={certificateEvaluation} onChange={(event) => setCertificateEvaluation(event.target.checked)} />
        Activar evaluacion para certificado
      </label>
    </form>
  );
}

function CourseAssignmentPanel({
  user,
  courseList,
  setProgressList,
  onClose
}: {
  user: DemoUser;
  courseList: Course[];
  setProgressList: React.Dispatch<React.SetStateAction<TrainingProgress[]>>;
  onClose: () => void;
}) {
  const people = demoUsers.filter((person) => {
    if (person.role === "decano" || person.role === "psicologo") return false;
    if (user.role === "coordinador_sede" && person.kind === "Coordinador") return false;
    if (user.role === "coordinador_sede") return person.campus === user.campus;
    return true;
  });
  const [mode, setMode] = useState<"bloque" | "individual">("bloque");
  const blockOptions = [
    { value: "Coordinador", label: "Coordinadores" },
    { value: "Docente", label: "Docentes" },
    { value: "Estudiante", label: "Estudiantes" }
  ].filter((option) => user.role !== "coordinador_sede" || option.value === "Estudiante");
  const [courseTitle, setCourseTitle] = useState(courseList[0]?.title ?? "");
  const [blockKind, setBlockKind] = useState(blockOptions[0]?.value ?? "Estudiante");
  const [personQuery, setPersonQuery] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [due, setDue] = useState("2026-08-15");
  const filteredPeople = people.filter((person) => personMatchesQuery(person, personQuery) || !personQuery.trim());
  const selectedPeopleRecords = people.filter((person) => selectedPeople.includes(person.email));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!courseTitle) return;
    const assignedAt = new Date().toISOString().slice(0, 10);
    const targets = mode === "bloque"
      ? people.filter((person) => person.kind === blockKind)
      : selectedPeopleRecords;
    if (!targets.length) return;
    setProgressList((current) => [
      ...targets.map((person) => ({
        assignmentId: `asig-${Date.now()}-${person.id}`,
        person: person.name,
        campus: person.campus,
        role: person.kind,
        course: courseTitle,
        progress: 0,
        due,
        assignedBy: user.name,
        assignedAt
      })),
      ...current
    ]);
    onClose();
  }

  return (
    <form className="assignment-panel modal-panel wide" onSubmit={submit}>
      <div className="panel-head">
        <div>
          <h2 id="assign-title">Asignar cursos de formacion</h2>
          <p className="muted">Primero por bloques; tambien puedes marcar varias personas por nombre, correo o carné.</p>
        </div>
        <button className="button secondary" type="button" onClick={onClose}>
          <X size={18} aria-hidden="true" />
          Cerrar
        </button>
      </div>
      <div className="segmented-control" aria-label="Tipo de asignacion">
        <button className={mode === "bloque" ? "active" : ""} type="button" onClick={() => setMode("bloque")}>Por bloques</button>
        <button className={mode === "individual" ? "active" : ""} type="button" onClick={() => setMode("individual")}>Individual</button>
      </div>
      <div className="grid-3">
        <div className="field">
          <label htmlFor="assign-course">Curso</label>
          <select id="assign-course" value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)}>
            {courseList.map((course) => <option key={course.id}>{course.title}</option>)}
          </select>
        </div>
        {mode === "bloque" ? (
          <div className="field">
            <label htmlFor="assign-block">Bloque</label>
            <select id="assign-block" value={blockKind} onChange={(event) => setBlockKind(event.target.value)}>
              {blockOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        ) : (
          <div className="field">
            <label htmlFor="assign-person">Buscar personas</label>
            <input
              id="assign-person"
              value={personQuery}
              onChange={(event) => setPersonQuery(event.target.value)}
              placeholder="Nombre, correo o carné"
              list="assign-person-options"
            />
            <datalist id="assign-person-options">
              {people.map((person) => (
                <option key={person.email} value={`${person.name} · ${person.email} · ${person.carnet}`} />
              ))}
            </datalist>
          </div>
        )}
        <div className="field">
          <label htmlFor="assign-due">Fecha limite</label>
          <input id="assign-due" type="date" value={due} onChange={(event) => setDue(event.target.value)} />
        </div>
      </div>
      <div className="consent-box">
        <strong>{mode === "bloque" ? "Asignacion por bloque" : "Asignacion individual"}</strong>
        <p className="muted">
          {mode === "bloque"
            ? `Se asignara a ${people.filter((person) => person.kind === blockKind).length} persona(s) del bloque seleccionado.`
            : selectedPeopleRecords.length
              ? `Seleccionados: ${selectedPeopleRecords.length} persona(s).`
              : "Marca una o varias personas de la base demo."}
        </p>
      </div>
      {mode === "individual" ? (
        <div className="checkbox-list" aria-label="Personas disponibles">
          {filteredPeople.map((person) => (
            <label className="person-check" key={person.email}>
              <input
                type="checkbox"
                checked={selectedPeople.includes(person.email)}
                onChange={(event) => {
                  setSelectedPeople((current) =>
                    event.target.checked
                      ? [...current, person.email]
                      : current.filter((email) => email !== person.email)
                  );
                }}
              />
              <span>
                <strong>{person.name}</strong>
                <small>{person.kind} · {person.campus} · {person.email} · {person.carnet}</small>
              </span>
            </label>
          ))}
          {filteredPeople.length === 0 ? <p className="muted">No hay coincidencias con esa busqueda.</p> : null}
        </div>
      ) : null}
      <button className="button primary" type="submit">
        <UserCheck size={18} aria-hidden="true" />
        Asignar curso
      </button>
    </form>
  );
}

function UsersPanel() {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Usuarios, roles y sedes</h2>
          <p className="muted">Base demo que simula la importacion institucional por correo.</p>
        </div>
      </div>
      <div className="grid-3">
        {adminActions.map(({ label, Icon }) => (
          <button className="button secondary" key={label} type="button">
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div style={{ height: 18 }} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Carné</th>
              <th>Rol</th>
              <th>Sede</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {demoUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.carnet}</td>
                <td>{roleLabels[user.role]}</td>
                <td>{user.campus}</td>
                <td>{user.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CrisisPanel({ requests }: { requests: SupportRequest[] }) {
  const highRisk = requests.filter((request) => request.risk === "Alto" || request.urgent);

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Riesgo y derivacion</h2>
          <p className="muted">Vista clinica para priorizar casos urgentes y documentar derivaciones.</p>
        </div>
        <span className="badge red"><AlertTriangle size={15} aria-hidden="true" /> {highRisk.length} prioridad</span>
      </div>
      <div className="crisis-box">
        <strong>Protocolo visible</strong>
        <p>Confirmar seguridad inmediata, contactar red institucional autorizada, registrar derivacion y no dejar el caso sin responsable asignado.</p>
      </div>
      <div className="case-list" style={{ marginTop: 14 }}>
        {highRisk.map((request) => (
          <article className="case-card" key={request.id}>
            <div className="case-top">
              <div>
                <h3 className="case-title">{request.personName}</h3>
                <p className="muted">{request.campus} · {request.reason}</p>
              </div>
              <span className="badge red">Prioritario</span>
            </div>
            <div className="clinical-box">
              <strong>Nota restringida</strong>
              <p>{request.clinicalNote}</p>
              <strong>Derivacion</strong>
              <p>{request.referral}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PrivacyPanel({ user }: { user: DemoUser }) {
  const items = [
    ["Separacion de datos", "Motivo general y notas clinicas se almacenan como superficies distintas."],
    ["Minimo necesario", `${roleLabels[user.role]} solo ve lo indispensable para su funcion.`],
    ["Auditoria", "Cada acceso sensible debe quedar registrado antes de pasar a produccion."],
    ["Supabase RLS", "Las tablas expuestas requieren politicas por rol, sede y propiedad del registro."]
  ];

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Privacidad y limites eticos</h2>
          <p className="muted">Controles que evitan que el sistema se convierta en una base sensible sin gobierno.</p>
        </div>
      </div>
      <div className="grid-2">
        {items.map(([title, body]) => (
          <article className="mini-card" key={title}>
            <span className="badge blue"><Shield size={15} aria-hidden="true" /> Control</span>
            <h3>{title}</h3>
            <p className="muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <article className="metric-card">
      <div className="metric-header">
        <span>{label}</span>
        <CheckCircle2 size={18} aria-hidden="true" />
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">{note}</div>
    </article>
  );
}

function careMetrics(requests: SupportRequest[]) {
  return {
    total: requests.length,
    pending: requests.filter((request) => request.status === "Pendiente").length,
    inProcess: requests.filter((request) => request.status === "En proceso").length,
    derived: requests.filter((request) => request.status === "Derivada").length,
    resolved: requests.filter((request) => request.status === "Atendida").length,
    noShow: requests.filter((request) => request.status === "No se presentó").length,
    urgent: requests.filter((request) => request.urgent || request.risk === "Alto").length,
    sessions: requests.reduce((sum, request) => sum + request.sessions, 0),
    campuses: new Set(requests.map((request) => request.campus)).size,
    mediumHigh: requests.filter((request) => request.risk === "Medio" || request.risk === "Alto").length
  };
}

function isClosedRequest(request: SupportRequest) {
  return request.status === "Atendida" || request.status === "No se presentó";
}

function searchRequests(requests: SupportRequest[], term: string) {
  const query = term.trim().toLowerCase();
  if (!query) return requests;
  return requests.filter((request) =>
    [
      request.id,
      request.personName,
      request.personEmail,
      request.personCarnet,
      request.campus,
      request.reason
    ].some((value) => value.toLowerCase().includes(query))
  );
}

function courseMatchesSearch(course: Course, term: string) {
  const query = term.trim().toLowerCase();
  if (!query) return true;
  return [
    course.title,
    course.audience,
    course.classification,
    course.category,
    course.specialty,
    course.description,
    course.platform,
    ...course.modules
  ].some((value) => value.toLowerCase().includes(query));
}

function navigationCounts(user: DemoUser, requests: SupportRequest[]) {
  if (user.role !== "psicologo") return {} as Record<string, number>;
  const inProgress = psychologistInProgressRequests(user, requests).length;
  return {
    casos_curso: inProgress
  } as Record<string, number>;
}

function isPsychologistInboxRequest(request: SupportRequest) {
  return !request.assignedTo && !isClosedRequest(request);
}

function psychologistInProgressRequests(user: DemoUser, requests: SupportRequest[]) {
  return requests.filter((request) => request.assignedTo === user.name && !isClosedRequest(request));
}

function psychologistCompletedRequests(user: DemoUser, requests: SupportRequest[]) {
  return requests.filter((request) => request.assignedTo === user.name && isClosedRequest(request));
}

function personMatchesQuery(person: DemoUser, query: string) {
  const normalized = query.toLowerCase();
  if (!normalized.trim()) return false;
  return [person.name, person.email, person.carnet].some((value) => normalized.includes(value.toLowerCase()) || value.toLowerCase().includes(normalized));
}

function canReopenCases(user: DemoUser) {
  return user.role === "decano" || user.role === "psicologo" || user.role === "coordinador_proyecto" || user.role === "coordinador_sede";
}

function canViewReopenNotes(user: DemoUser) {
  return user.role === "psicologo" || user.role === "coordinador_proyecto" || user.role === "coordinador_sede";
}

function visibleRequests(user: DemoUser, requests: SupportRequest[]) {
  if (user.role === "estudiante_docente") {
    return requests.filter((request) => request.personId === user.id);
  }
  if (user.role === "coordinador_sede") {
    return requests.filter((request) => request.campus === user.campus);
  }
  return requests;
}

function canRequestSupport(user: DemoUser) {
  return user.role === "estudiante_docente" || user.role === "coordinador_sede";
}

function heroTitle(user: DemoUser) {
  if (user.role === "decano") return "Tablero ejecutivo para decidir sin invadir.";
  if (user.role === "psicologo") return "Casos, sesiones y derivaciones en un solo lugar.";
  if (user.role === "coordinador_proyecto") return "Operacion central del plan de bienestar.";
  if (user.role === "coordinador_sede") return "Acompanamiento y formacion para tu sede.";
  return "Solicita apoyo y fortalece habilidades para sostener tu proceso.";
}

function heroDescription(user: DemoUser) {
  if (user.role === "decano") return "Consulta indicadores por sede, motivos frecuentes, poblacion atendida y gestiones, con limites claros sobre informacion clinica.";
  if (user.role === "psicologo") return "Prioriza solicitudes, registra sesiones privadas, activa derivaciones y mantiene seguimiento clinico restringido.";
  if (user.role === "coordinador_proyecto") return "Administra solicitudes, sedes, permisos, formacion y estadisticas para que el programa sea sostenible.";
  if (user.role === "coordinador_sede") return "Solicita apoyo para tu campus, asigna rutas formativas y revisa avance docente sin acceder a notas privadas.";
  return "Accede a consulta, da seguimiento a tus solicitudes y completa cursos preventivos del Centro de Formacion ARQ.";
}
