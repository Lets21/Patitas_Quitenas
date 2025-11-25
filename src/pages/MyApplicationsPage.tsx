import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, urlFromBackend } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PawPrint, CheckCircle2, Clock4, Home, MailWarning, ListChecks } from "lucide-react";
import MyApplicationResponsesModal from "@/features/application/MyApplicationResponsesModal";

type AppRow = {
  _id: string;
  status: "RECEIVED" | "IN_REVIEW" | "HOME_VISIT" | "APPROVED" | "REJECTED" | string;
  createdAt: string;
  animalId: any; // viene populado: { name, photos, attributes? }
  rejectReason?: string;
};

const STATUS_META: Record<
  AppRow["status"],
  {
    label: string;
    tone: "success" | "warning" | "info" | "neutral";
    badgeClasses: string;
    chipClasses: string;
    icon: JSX.Element;
    description: string;
  }
> = {
  RECEIVED: {
    label: "Recibida",
    tone: "info",
    badgeClasses: "bg-blue-50 text-blue-700 border border-blue-200",
    chipClasses: "bg-blue-100 text-blue-700",
    icon: <Clock4 className="h-4 w-4" />,
    description: "Tu solicitud llegó a la fundación y pronto será evaluada.",
  },
  IN_REVIEW: {
    label: "En evaluación",
    tone: "warning",
    badgeClasses: "bg-amber-50 text-amber-700 border border-amber-200",
    chipClasses: "bg-amber-100 text-amber-700",
    icon: <PawPrint className="h-4 w-4" />,
    description: "El equipo está analizando tu perfil. Mantente atento a tu correo.",
  },
  HOME_VISIT: {
    label: "Visita domiciliaria",
    tone: "info",
    badgeClasses: "bg-purple-50 text-purple-700 border border-purple-200",
    chipClasses: "bg-purple-100 text-purple-700",
    icon: <Home className="h-4 w-4" />,
    description: "Quieren conocerte mejor. Coordinarán una visita domiciliaria.",
  },
  APPROVED: {
    label: "Aprobada",
    tone: "success",
    badgeClasses: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    chipClasses: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "¡Felicidades! Tu adopción fue aprobada. Te contactarán para continuar.",
  },
  REJECTED: {
    label: "Rechazada",
    tone: "neutral",
    badgeClasses: "bg-rose-50 text-rose-700 border border-rose-200",
    chipClasses: "bg-rose-100 text-rose-700",
    icon: <MailWarning className="h-4 w-4" />,
    description: "La fundación dejó un comentario para que mejores tu postulación.",
  },
};

function StatusBadge({ s }: { s: AppRow["status"] }) {
  const meta = STATUS_META[s] || { label: s, tone: "neutral" as const };
  return (
    <Badge variant={meta.tone} className={`uppercase tracking-wide ${meta.badgeClasses || ""}`}>
      {meta.label}
    </Badge>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyApplicationsPage() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const r = await apiClient.getMyApplications();
        const list = (r as any)?.applications ?? r ?? [];
        setRows(list);
      } catch (e: any) {
        setErr(e?.message || "No se pudieron cargar tus solicitudes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-gray-500">
        Cargando tus solicitudes…
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-red-600 font-medium mb-2">No se pudo cargar</p>
          <p className="text-gray-600">{err}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Reintentar</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3ef] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10 rounded-3xl bg-white shadow-sm p-6 flex flex-col gap-3 border border-amber-50">
          <div className="inline-flex items-center gap-3 text-primary-600">
            <PawPrint className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Seguimiento personal
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Mis solicitudes</h1>
          <p className="text-gray-600 text-lg">
            Revisa el avance de cada postulación y mantente atento a los mensajes de la fundación.
          </p>
        </div>

        {rows.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600">Aún no tienes solicitudes de adopción.</p>
            <Link to="/catalog">
              <Button className="mt-4">Ir al catálogo</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {rows.map((a) => {
              const dog = a.animalId || {};
              const photo = dog?.photos?.[0] ? urlFromBackend(dog.photos[0]) : undefined;
              const statusMeta = STATUS_META[a.status] || null;
              return (
                <Card
                  key={a._id}
                  className="p-6 flex flex-col gap-5 border border-white rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-[22px] bg-gradient-to-br from-primary-200/60 via-white to-primary-50 p-[3px] shadow-inner">
                        <div className="w-full h-full rounded-[18px] overflow-hidden bg-gray-100 ring-1 ring-white shadow">
                          {photo ? (
                            <img
                              src={photo}
                              alt={dog?.name || "Perro"}
                              className="w-full h-full object-cover transition duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs text-center px-2">
                              Sin foto
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                          {dog?.name || "Perro"}
                        </h2>
                        {statusMeta && (
                          <div
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${statusMeta.chipClasses}`}
                          >
                            {statusMeta.icon}
                            {statusMeta.label}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Creada el {formatDate(a.createdAt)}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {dog?.attributes?.breed && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                            <span className="text-xs uppercase tracking-wide text-gray-500">Raza</span>
                            {dog.attributes.breed}
                          </span>
                        )}
                        {dog?.attributes?.age !== undefined && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                            <span className="text-xs uppercase tracking-wide text-gray-500">Edad</span>
                            {dog.attributes.age} año(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {statusMeta && (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 flex items-start gap-3">
                      <div className={`p-2 rounded-full ${statusMeta.chipClasses}`}>{statusMeta.icon}</div>
                      <div className="text-sm text-gray-700 leading-relaxed">{statusMeta.description}</div>
                    </div>
                  )}

                  {a.status === "REJECTED" && a.rejectReason && (
                    <div className="text-sm text-rose-900 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                      <div className="font-semibold flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        Motivo del rechazo
                      </div>
                      <p className="mt-1 leading-relaxed">{a.rejectReason}</p>
                    </div>
                  )}

                  {a.status === "APPROVED" && (
                    <div className="text-sm text-emerald-900 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                      ¡Felicitaciones! La fundación aprobó tu solicitud, te contactarán para los siguientes pasos.
                    </div>
                  )}

                  {a.status === "IN_REVIEW" && (
                    <div className="text-sm text-amber-900 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      Tu solicitud está siendo evaluada. Pronto recibirás novedades en tu correo.
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setViewingAppId(a._id)}
                    >
                      <ListChecks className="h-4 w-4" />
                      Ver cuestionario
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      {viewingAppId && (
        <MyApplicationResponsesModal
          applicationId={viewingAppId}
          onClose={() => setViewingAppId(null)}
        />
      )}
    </div>
  );
}
