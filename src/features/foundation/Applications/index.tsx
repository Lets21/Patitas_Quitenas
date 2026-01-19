// src/features/foundation/ApplicationsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import ScoreIndicator from "@/components/ScoreIndicator";
import RejectApplicationModal from "../RejectApplicationModal";
import ApplicationDetailsModal from "../ApplicationDetailsModal";
import toast from "react-hot-toast";

// >>> IMPORTA TU HEADER DE FUNDACIÓN <<<
import FoundationHeader from "@/components/admin/FoundationHeader";

type ViewMode = "all" | "ranking";

const VIEW_MODE_TABS: { id: ViewMode; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "ranking", label: "Ranking por puntuación" },
];

type AppRow = {
  _id: string;
  status: "RECEIVED" | "IN_REVIEW" | "HOME_VISIT" | "APPROVED" | "REJECTED";
  createdAt: string;
  scorePct?: number;
  eligible?: boolean;
  rejectReason?: string;
  animalId?:
    | {
        _id: string;
        name: string;
        photos?: string[];
        attributes?: any;
      }
    | string;
  adopterId?:
    | {
        _id: string;
        email: string;
        profile?: { firstName?: string; lastName?: string };
      }
    | string;
  form?: any;
  // Campos ML Prediction
  propensityPred?: 0 | 1;        // 0 = No propenso, 1 = Propenso a adoptar
  propensityProba?: number;      // Probabilidad 0-1
  mlVersion?: string;            // Versión del modelo
};

const STATUS_LABEL: Record<AppRow["status"], string> = {
  RECEIVED: "Recibida",
  IN_REVIEW: "En evaluación",
  HOME_VISIT: "Visita domiciliaria",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const STATUS_VARIANT: Record<
  AppRow["status"],
  "info" | "warning" | "success" | "danger" | "default"
> = {
  RECEIVED: "info",
  IN_REVIEW: "warning",
  HOME_VISIT: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

// Helper para determinar si un animal es cachorro
function isPuppy(animal: AppRow["animalId"]): boolean {
  if (!animal || typeof animal === "string") return false;
  const age = animal.attributes?.age;
  if (typeof age === "number") {
    return age <= 1; // <= 1 año = cachorro
  }
  return false;
}

export default function FoundationApplicationsPage() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>(""); // filtro
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all"); // Por defecto mostrar todas
  const [rankingRows, setRankingRows] = useState<AppRow[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectingAppIsPuppy, setRejectingAppIsPuppy] = useState(false);
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    applicationId: string | null;
    animalName: string;
  }>({ isOpen: false, applicationId: null, animalName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Score mínimo fijo para ranking: 70%
  const RANKING_MIN_SCORE = 70;

  async function load() {
    setLoading(true);
    try {
      const data = await apiClient.getApplications(status || undefined);
      const list: AppRow[] = (data as any)?.applications ?? data ?? [];
      console.log("📋 Solicitudes cargadas (vista Todas):", list.length, list);
      setRows(list);
    } catch (error) {
      console.error("❌ Error cargando solicitudes:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadRanking() {
    setLoadingRanking(true);
    try {
      // Siempre usar 70% como mínimo para ranking
      const data = await apiClient.getApplicationsRanking(undefined, RANKING_MIN_SCORE);
      const list: AppRow[] = (data as any)?.applications ?? data?.applications ?? [];
      console.log("📊 Solicitudes cargadas (vista Ranking):", list.length, list);
      setRankingRows(list);
    } catch (error) {
      console.error("❌ Error cargando ranking:", error);
      setRankingRows([]);
    } finally {
      setLoadingRanking(false);
    }
  }

  useEffect(() => {
    if (viewMode === "ranking") {
      loadRanking();
    } else {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, viewMode]);

  const filterBySearchAndStatus = (
    list: AppRow[],
    term: string,
    statusFilter: string
  ) => {
    const normalized = term.trim().toLowerCase();
    return list.filter((r) => {
      const matchesStatus = !statusFilter || r.status === statusFilter;
      if (!matchesStatus) return false;
      if (!normalized) return true;

      const animal =
        typeof r.animalId === "string" ? r.animalId : r.animalId?.name || "";

      const adopterFirst =
        typeof r.adopterId === "string"
          ? ""
          : r.adopterId?.profile?.firstName ?? "";
      const adopterLast =
        typeof r.adopterId === "string"
          ? ""
          : r.adopterId?.profile?.lastName ?? "";
      const adopterEmail =
        typeof r.adopterId === "string" ? r.adopterId : r.adopterId?.email ?? "";

      const adopterName = `${adopterFirst} ${adopterLast} ${adopterEmail}`.trim();

      return (
        animal.toLowerCase().includes(normalized) ||
        adopterName.toLowerCase().includes(normalized)
      );
    });
  };

  const filtered = useMemo(
    () => filterBySearchAndStatus(rows, q, status),
    [rows, q, status]
  );

  const filteredRanking = useMemo(
    () => filterBySearchAndStatus(rankingRows, q, status),
    [rankingRows, q, status]
  );

  async function updateStatus(id: string, next: AppRow["status"]) {
    try {
      await apiClient.updateApplicationStatus(id, next);
      
      const statusMessages: Record<AppRow["status"], string> = {
        RECEIVED: "Solicitud marcada como recibida",
        IN_REVIEW: "Solicitud en evaluación",
        HOME_VISIT: "Visita domiciliaria programada",
        APPROVED: "¡Solicitud aprobada!",
        REJECTED: "Solicitud rechazada",
      };
      
      toast.success(statusMessages[next]);
      
      // Recargar la vista actual
      if (viewMode === "ranking") {
        await loadRanking();
      } else {
        await load();
      }
    } catch (error) {
      console.error("❌ Error actualizando estado:", error);
      toast.error("Error al actualizar el estado. Por favor intenta nuevamente.");
    }
  }

  function openDeleteConfirm(app: AppRow) {
    const animalName = formatAnimalName(app);
    setDeleteConfirmDialog({
      isOpen: true,
      applicationId: app._id,
      animalName: animalName,
    });
  }

  async function confirmDelete() {
    const { applicationId } = deleteConfirmDialog;
    if (!applicationId) return;

    setIsDeleting(true);
    try {
      await apiClient.deleteApplication(applicationId);
      
      toast.success("Solicitud eliminada exitosamente");
      
      // Recargar la vista actual
      if (viewMode === "ranking") {
        await loadRanking();
      } else {
        await load();
      }
      
      setDeleteConfirmDialog({ isOpen: false, applicationId: null, animalName: "" });
    } catch (error) {
      console.error("❌ Error eliminando solicitud:", error);
      toast.error("Error al eliminar la solicitud. Por favor intenta nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleRejectClick(app: AppRow) {
    setRejectingAppIsPuppy(isPuppy(app.animalId));
    setRejectingAppId(app._id);
  }

  function handleRejectSuccess() {
    if (viewMode === "ranking") {
      loadRanking();
    } else {
      load();
    }
  }

  function formatAdopterName(a: AppRow): string {
    if (!a.adopterId) return "—";
    if (typeof a.adopterId === "string") return a.adopterId;
    const first = a.adopterId.profile?.firstName ?? "";
    const last = a.adopterId.profile?.lastName ?? "";
    const name = `${first} ${last}`.trim();
    return name || a.adopterId.email || "—";
  }

  function formatAnimalName(a: AppRow): string {
    if (!a.animalId) return "—";
    return typeof a.animalId === "string" ? a.animalId : a.animalId.name ?? "—";
  }

  return (
    <>
      {/* Header de Fundación arriba del todo */}
      <FoundationHeader />

      {/* Padding top para que el contenido no quede oculto bajo el header sticky */}
      <div className="max-w-7xl mx-auto p-6 pt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📋 Solicitudes de Adopción
          </h1>

          <div className="flex flex-col gap-3 items-start sm:items-end w-full sm:w-auto">
            <div className="inline-flex w-full sm:w-auto items-center rounded-full border border-purple-200 bg-white p-1 shadow-sm min-w-[280px]">
              {VIEW_MODE_TABS.map((tab) => {
                const isActive = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewMode(tab.id)}
                    aria-pressed={isActive}
                    className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold text-center transition-all duration-200 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {viewMode === "ranking" && (
              <p className="text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 text-left sm:text-right w-full">
                Score mínimo: {RANKING_MIN_SCORE}%
              </p>
            )}
            <div className="w-full sm:w-auto">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Buscar por adoptante o perro..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full sm:w-64"
                />

                <select
                  className="border rounded-lg px-3 py-2 w-full sm:w-48 text-sm font-medium text-gray-700 bg-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-200 transition-all"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="RECEIVED">Recibidas</option>
                  <option value="IN_REVIEW">En evaluación</option>
                  <option value="HOME_VISIT">Visita domiciliaria</option>
                  <option value="APPROVED">Aprobadas</option>
                  <option value="REJECTED">Rechazadas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "ranking" ? (
          loadingRanking ? (
            <Card className="p-8 text-gray-500 text-lg font-semibold text-center">⏳ Cargando ranking…</Card>
          ) : filteredRanking.length === 0 ? (
            <Card className="p-8 text-gray-500 text-lg font-semibold text-center">
              📊 No hay solicitudes con score ≥ {RANKING_MIN_SCORE}%.
            </Card>
          ) : (
            <div className="grid gap-5">
              {filteredRanking.map((a) => {
                const animalName = formatAnimalName(a);
                const adopterName = formatAdopterName(a);
                const scorePct = a.scorePct ?? 0;

                return (
                  <Card key={a._id} className="p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold text-gray-800">🐕 {animalName}</div>
                          <span
                            className={`text-2xl font-black px-4 py-1 rounded-full ${
                              scorePct >= 85
                                ? "bg-green-100 text-green-700 border-2 border-green-300"
                                : scorePct >= 70
                                ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                                : "bg-red-100 text-red-700 border-2 border-red-300"
                            }`}
                          >
                            {scorePct}%
                          </span>
                        </div>
                        <div className="text-base text-gray-700 font-semibold mb-3 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                            <span className="text-white text-sm">👤</span>
                          </span>
                          {adopterName}
                        </div>
                        <div className="mb-3">
                          <ScoreIndicator pct={scorePct} />
                        </div>
                        <div className="mb-3 flex items-center gap-2">
                          {a.eligible ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-bold border-2 border-green-300">
                              ✅ Elegible para adopción
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-sm font-bold border-2 border-red-300">
                              ❌ No cumple requisitos
                            </span>
                          )}
                        </div>
                        {/* ML Prediction Display - Diseño Profesional */}
                        {a.propensityPred !== undefined && (
                          <div className="mb-3 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-indigo-900 mb-1">
                                  Análisis Predictivo de Adopción
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                      a.propensityPred === 1
                                        ? "bg-green-100 text-green-800 border border-green-300"
                                        : "bg-amber-100 text-amber-800 border border-amber-300"
                                    }`}
                                  >
                                    {a.propensityPred === 1 ? "✓ Favorable" : "⚠ Atención Requerida"}
                                  </span>
                                </div>
                                
                                {/* Explicación del Análisis */}
                                {(a as any).mlExplanation && (
                                  <div className="space-y-2">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-md p-3 border border-indigo-100">
                                      <div className="text-xs font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Casos Similares Analizados (K={((a as any).mlExplanation.k_neighbors || 15)})
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-2 bg-green-50 rounded px-2 py-1.5 border border-green-200">
                                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                          <span className="text-green-900 font-medium">
                                            {(a as any).mlExplanation.adopted_neighbors || 0} Adoptados
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-red-50 rounded px-2 py-1.5 border border-red-200">
                                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                          <span className="text-red-900 font-medium">
                                            {(a as any).mlExplanation.not_adopted_neighbors || 0} No Adoptados
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {(a as any).mlExplanation.key_factors && (a as any).mlExplanation.key_factors.length > 0 && (
                                      <div className="bg-white/60 backdrop-blur-sm rounded-md p-3 border border-indigo-100">
                                        <div className="text-xs font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                          </svg>
                                          Factores Determinantes
                                        </div>
                                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                          {(a as any).mlExplanation.key_factors.slice(0, 5).map((factor: any, idx: number) => (
                                            <div 
                                              key={idx}
                                              className={`text-xs p-2 rounded-md border ${
                                                factor.impact === 'positivo' 
                                                  ? 'bg-green-50 border-green-200 text-green-900' 
                                                  : factor.impact === 'negativo'
                                                  ? 'bg-red-50 border-red-200 text-red-900'
                                                  : 'bg-gray-50 border-gray-200 text-gray-800'
                                              }`}
                                            >
                                              <div className="font-semibold mb-0.5">{factor.factor}</div>
                                              <div className="text-xs opacity-90">{factor.reason}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Fecha: {new Date(a.createdAt).toLocaleString()}
                        </div>
                        <div className="mt-2">
                          <Badge variant={STATUS_VARIANT[a.status]}>
                            {STATUS_LABEL[a.status]}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">ID: {a._id.slice(-8)}</div>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingAppId(a._id)}
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold hover:border-gray-400 transition-all"
                          >
                            📄 Ver respuestas
                          </Button>
                          {a.status !== "IN_REVIEW" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(a._id, "IN_REVIEW")}
                              className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold hover:border-blue-400 transition-all"
                            >
                              🔍 Evaluar
                            </Button>
                          )}
                          {a.status !== "HOME_VISIT" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(a._id, "HOME_VISIT")}
                              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold hover:border-purple-400 transition-all"
                            >
                              🏠 Visita
                            </Button>
                          )}
                          {a.status !== "APPROVED" && (
                            <Button 
                              size="sm"
                              onClick={() => updateStatus(a._id, "APPROVED")}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-md hover:shadow-lg transition-all"
                            >
                              ✅ Aprobar
                            </Button>
                          )}
                          {a.status !== "REJECTED" && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectClick(a)}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-md hover:shadow-lg transition-all"
                            >
                              ❌ Rechazar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteConfirm(a)}
                            className="border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold hover:border-gray-500 transition-all"
                            title="Eliminar solicitud"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )
        ) : loading ? (
          <Card className="p-6 text-gray-500">Cargando…</Card>
        ) : filtered.length === 0 ? (
          <Card className="p-6 text-gray-500">
            No hay solicitudes con ese criterio.
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((a) => {
              const animalName = formatAnimalName(a);
              const adopterName = formatAdopterName(a);
              const scorePct = a.scorePct ?? 0;

              return (
                <Card key={a._id} className="p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-bold text-gray-800">{animalName}</div>
                        {scorePct > 0 && (
                          <span
                            className={`text-lg font-bold px-3 py-1 rounded-full ${
                              scorePct >= 85
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : scorePct >= 70
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                          >
                            {scorePct}%
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Adoptante: {adopterName}
                      </div>
                      {scorePct > 0 && (
                        <div className="my-2">
                          <ScoreIndicator pct={scorePct} />
                        </div>
                      )}
                      {/* ML Prediction Display - Diseño Profesional */}
                      {a.propensityPred !== undefined && (
                        <div className="my-3 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-indigo-900 mb-1">
                                Análisis Predictivo de Adopción
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                    a.propensityPred === 1
                                      ? "bg-green-100 text-green-800 border border-green-300"
                                      : "bg-amber-100 text-amber-800 border border-amber-300"
                                  }`}
                                >
                                  {a.propensityPred === 1 ? "✓ Favorable" : "⚠ Atención Requerida"}
                                </span>
                              </div>
                              
                              {/* Explicación del Análisis */}
                              {(a as any).mlExplanation && (
                                <div className="space-y-2">
                                  <div className="bg-white/60 backdrop-blur-sm rounded-md p-3 border border-indigo-100">
                                    <div className="text-xs font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      Casos Similares Analizados (K={((a as any).mlExplanation.k_neighbors || 15)})
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-2 bg-green-50 rounded px-2 py-1.5 border border-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-900 font-medium">
                                          {(a as any).mlExplanation.adopted_neighbors || 0} Adoptados
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 bg-red-50 rounded px-2 py-1.5 border border-red-200">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-red-900 font-medium">
                                          {(a as any).mlExplanation.not_adopted_neighbors || 0} No Adoptados
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {(a as any).mlExplanation.key_factors && (a as any).mlExplanation.key_factors.length > 0 && (
                                    <div className="bg-white/60 backdrop-blur-sm rounded-md p-3 border border-indigo-100">
                                      <div className="text-xs font-semibold text-indigo-800 mb-2 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        Factores Determinantes
                                      </div>
                                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                        {(a as any).mlExplanation.key_factors.slice(0, 5).map((factor: any, idx: number) => (
                                          <div 
                                            key={idx}
                                            className={`text-xs p-2 rounded-md border ${
                                              factor.impact === 'positivo' 
                                                ? 'bg-green-50 border-green-200 text-green-900' 
                                                : factor.impact === 'negativo'
                                                ? 'bg-red-50 border-red-200 text-red-900'
                                                : 'bg-gray-50 border-gray-200 text-gray-800'
                                            }`}
                                          >
                                            <div className="font-semibold mb-0.5">{factor.factor}</div>
                                            <div className="text-xs opacity-90">{factor.reason}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Fecha: {new Date(a.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2">
                        <Badge variant={STATUS_VARIANT[a.status]}>
                          {STATUS_LABEL[a.status]}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-gray-500">ID: {a._id}</div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingAppId(a._id)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Ver respuestas
                        </Button>
                        {a.status !== "IN_REVIEW" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(a._id, "IN_REVIEW")}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Evaluar
                          </Button>
                        )}
                        {a.status !== "HOME_VISIT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(a._id, "HOME_VISIT")}
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          >
                            Visita
                          </Button>
                        )}
                        {a.status !== "APPROVED" && (
                          <Button 
                            size="sm"
                            onClick={() => updateStatus(a._id, "APPROVED")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Aprobar
                          </Button>
                        )}
                        {a.status !== "REJECTED" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRejectClick(a)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Rechazar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteConfirm(a)}
                          className="border-gray-400 text-gray-700 hover:bg-gray-100"
                          title="Eliminar solicitud"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de rechazo */}
      {rejectingAppId && (
        <RejectApplicationModal
          applicationId={rejectingAppId}
          animalIsPuppy={rejectingAppIsPuppy}
          onClose={() => setRejectingAppId(null)}
          onSuccess={handleRejectSuccess}
        />
      )}

      {/* Modal de detalles de respuestas */}
      {viewingAppId && (
        <ApplicationDetailsModal
          applicationId={viewingAppId}
          onClose={() => setViewingAppId(null)}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        onClose={() => setDeleteConfirmDialog({ isOpen: false, applicationId: null, animalName: "" })}
        onConfirm={confirmDelete}
        title="Eliminar solicitud"
        message={`¿Estás seguro de que deseas eliminar la solicitud para ${deleteConfirmDialog.animalName}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
