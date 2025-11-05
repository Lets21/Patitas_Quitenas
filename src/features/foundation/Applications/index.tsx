// src/features/foundation/ApplicationsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

// >>> IMPORTA TU HEADER DE FUNDACIÓN <<<
import FoundationHeader from "@/components/admin/FoundationHeader";

type AppRow = {
  _id: string;
  status: "RECEIVED" | "IN_REVIEW" | "HOME_VISIT" | "APPROVED" | "REJECTED";
  createdAt: string;
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
  "info" | "warning" | "success" | "neutral"
> = {
  RECEIVED: "info",
  IN_REVIEW: "warning",
  HOME_VISIT: "warning",
  APPROVED: "success",
  REJECTED: "neutral",
};

export default function FoundationApplicationsPage() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>(""); // filtro
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await apiClient.getApplications(status || undefined);
      const list: AppRow[] = (data as any)?.applications ?? data ?? [];
      setRows(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

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

          <div className="flex gap-3">
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
          </div>
        </div>

        {loading ? (
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

              return (
                <Card key={a._id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">{animalName}</div>
                      <div className="text-sm text-gray-600">
                        Adoptante: {adopterName}
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
                      <div className="flex gap-2">
                        {a.status !== "IN_REVIEW" && (
                          <Button
                            variant="outline"
                            onClick={() => updateStatus(a._id, "IN_REVIEW")}
                          >
                            Pasar a evaluación
                          </Button>
                        )}
                        {a.status !== "HOME_VISIT" && (
                          <Button
                            variant="outline"
                            onClick={() => updateStatus(a._id, "HOME_VISIT")}
                          >
                            Visita domiciliaria
                          </Button>
                        )}
                        {a.status !== "APPROVED" && (
                          <Button onClick={() => updateStatus(a._id, "APPROVED")}>
                            Aprobar
                          </Button>
                        )}
                        {a.status !== "REJECTED" && (
                          <Button
                            variant="destructive"
                            onClick={() => updateStatus(a._id, "REJECTED")}
                          >
                            Rechazar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {a.form && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-1">
                        Respuestas del cuestionario
                      </div>
                      <pre className="text-xs bg-slate-50 border rounded-md p-3 overflow-auto">
                        {JSON.stringify(a.form, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
