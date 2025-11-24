import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, urlFromBackend } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type AppRow = {
  _id: string;
  status: "RECEIVED" | "IN_REVIEW" | "HOME_VISIT" | "APPROVED" | "REJECTED" | string;
  createdAt: string;
  animalId: any; // viene populado: { name, photos, attributes? }
  rejectReason?: string;
};

function StatusBadge({ s }: { s: AppRow["status"] }) {
  // Mapeo simple a variantes del Badge disponible en tu UI
  const map: Record<string, { variant: "success" | "warning" | "neutral" | "info"; extra?: string }> = {
    RECEIVED:    { variant: "info" },
    IN_REVIEW:   { variant: "warning" },
    HOME_VISIT:  { variant: "info" },
    APPROVED:    { variant: "success" },
    REJECTED:    { variant: "neutral", extra: "bg-rose-50 text-rose-700 border border-rose-200" },
  };
  const cfg = map[s] || { variant: "neutral" as const };
  return <Badge variant={cfg.variant} className={cfg.extra}>{s}</Badge>;
}

export default function MyApplicationsPage() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Mis solicitudes</h1>

      {rows.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">Aún no tienes solicitudes de adopción.</p>
          <Link to="/catalog">
            <Button className="mt-4">Ir al catálogo</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-3">
          {rows.map((a) => {
            const dog = a.animalId || {};
            const photo = dog?.photos?.[0] ? urlFromBackend(dog.photos[0]) : undefined;
            return (
              <Card key={a._id} className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {photo ? (
                    <img src={photo} alt={dog?.name || "Perro"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin foto
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate">
                      <div className="font-medium truncate">{dog?.name || "Perro"}</div>
                      <div className="text-sm text-gray-600">
                        Creada: {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <StatusBadge s={a.status} />
                  </div>
                  {a.status === "REJECTED" && a.rejectReason && (
                    <div className="mt-2 text-red-600 text-sm">
                      <strong>Motivo del rechazo: </strong> {a.rejectReason}
                    </div>
                  )}
                </div>

                {/* (Opcional) Enlace a detalle si lo agregas más adelante */}
                {/* <Link to={`/mis-solicitudes/${a._id}`} className="flex-shrink-0">
                  <Button variant="outline" size="sm">Ver detalle</Button>
                </Link> */}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
