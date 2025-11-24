// src/features/foundation/ApplicationsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import ScoreIndicator from "@/components/ScoreIndicator";
import ApplicationFormView from "@/components/ApplicationFormView";
import RejectApplicationModal from "../RejectApplicationModal";

// >>> IMPORTA TU HEADER DE FUNDACIÓN <<<
import FoundationHeader from "@/components/admin/FoundationHeader";

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
  const [viewMode, setViewMode] = useState<"all" | "ranking">("all"); // Por defecto mostrar todas
  const [rankingRows, setRankingRows] = useState<AppRow[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectingAppIsPuppy, setRejectingAppIsPuppy] = useState(false);
  
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

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter((r) => {
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
        animal.toLowerCase().includes(term) ||
        adopterName.toLowerCase().includes(term)
      );
    });
  }, [rows, q]);

  async function updateStatus(id: string, next: AppRow["status"]) {
    await apiClient.updateApplicationStatus(id, next);
    await load();
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Solicitudes de adopción</h1>

          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "all" ? "primary" : "outline"}
                onClick={() => setViewMode("all")}
                className={viewMode === "all" ? "bg-primary-600 text-white" : "border-gray-300 text-gray-700"}
              >
                Todas
              </Button>
              <Button
                variant={viewMode === "ranking" ? "primary" : "outline"}
                onClick={() => setViewMode("ranking")}
                className={viewMode === "ranking" ? "bg-primary-600 text-white" : "border-gray-300 text-gray-700"}
              >
                Ranking por puntuación
              </Button>
            </div>

           {viewMode === "ranking" && (
             <div className="flex gap-2 items-center">
               <span className="text-sm text-gray-600">
                 Mostrando solo solicitudes con score ≥ {RANKING_MIN_SCORE}%
               </span>
             </div>
           )}
           {viewMode === "all" && (
              <>
                <Input
                  placeholder="Buscar por adoptante o perro..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />

                <select
                  className="border rounded-md px-3 py-2"
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
              </>
            )}
          </div>
        </div>

        {viewMode === "ranking" ? (
          loadingRanking ? (
            <Card className="p-6 text-gray-500">Cargando ranking…</Card>
          ) : rankingRows.length === 0 ? (
            <Card className="p-6 text-gray-500">
              No hay solicitudes con score ≥ {RANKING_MIN_SCORE}%.
            </Card>
          ) : (
            <div className="grid gap-4">
              {rankingRows.map((a) => {
                const animalName = formatAnimalName(a);
                const adopterName = formatAdopterName(a);
                const scorePct = a.scorePct ?? 0;

                return (
                  <Card key={a._id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg font-semibold">{animalName}</div>
                          <span
                            className={`text-lg font-bold ${
                              scorePct >= 85
                                ? "text-green-600"
                                : scorePct >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {scorePct}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Adoptante: {adopterName}
                        </div>
                        <div className="mb-3">
                          <ScoreIndicator pct={scorePct} />
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {a.eligible ? (
                            <span className="text-green-600">✅ Elegible</span>
                          ) : (
                            <span className="text-red-600">❌ No elegible</span>
                          )}
                        </div>
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
                          {a.status !== "IN_REVIEW" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(a._id, "IN_REVIEW")}
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              Pasar a evaluación
                            </Button>
                          )}
                          {a.status !== "HOME_VISIT" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(a._id, "HOME_VISIT")}
                              className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            >
                              Visita domiciliaria
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
                        </div>
                      </div>
                    </div>
                    
                    {a.form && (
                      <div className="mt-4">
                        <ApplicationFormView form={a.form} />
                      </div>
                    )}
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
                <Card key={a._id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-semibold">{animalName}</div>
                        {scorePct > 0 && (
                          <span
                            className={`text-sm font-semibold ${
                              scorePct >= 85
                                ? "text-green-600"
                                : scorePct >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {scorePct}%
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Adoptante: {adopterName}
                      </div>
                      {scorePct > 0 && (
                        <div className="my-2">
                          <ScoreIndicator pct={scorePct} />
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
                        {a.status !== "IN_REVIEW" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(a._id, "IN_REVIEW")}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Pasar a evaluación
                          </Button>
                        )}
                        {a.status !== "HOME_VISIT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(a._id, "HOME_VISIT")}
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          >
                            Visita domiciliaria
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
                      </div>
                    </div>
                  </div>

                  {a.form && (
                    <div className="mt-4">
                      <ApplicationFormView form={a.form} />
                    </div>
                  )}
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
    </>
  );
}
