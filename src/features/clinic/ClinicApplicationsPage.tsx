// frontend/src/features/clinic/ClinicApplicationsPage.tsx
import { useState, useMemo } from "react";
import { Loader2, Calendar, User, Heart, FileText, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import ClinicHeader from "@/components/admin/ClinicHeader";
import { useClinicApplications } from "./hooks/useClinicApplications";
import { urlFromBackend } from "@/lib/api";
// No importar Application type ya que el formato puede variar del backend

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Recibida",
  IN_REVIEW: "En evaluación",
  HOME_VISIT: "Visita domiciliaria",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  PENDING: "Pendiente",
  PRE_APPROVED: "Pre-aprobada",
  DELIVERED: "Entregada",
};

const STATUS_VARIANTS: Record<string, "info" | "warning" | "success" | "danger" | "default"> = {
  RECEIVED: "info",
  PENDING: "info",
  IN_REVIEW: "warning",
  HOME_VISIT: "warning",
  PRE_APPROVED: "warning",
  APPROVED: "success",
  DELIVERED: "success",
  REJECTED: "danger",
};

export default function ClinicApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: applications, isLoading, error } = useClinicApplications();

  // Filtrar solicitudes por término de búsqueda
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    if (!searchTerm.trim()) return applications;

    const term = searchTerm.toLowerCase();
    return applications.filter((app: any) => {
      const animalName =
        typeof app.animalId === "object" && app.animalId?.name
          ? app.animalId.name
          : "";
      const adopterName =
        typeof app.adopterId === "object" && app.adopterId?.profile
          ? `${app.adopterId.profile.firstName || ""} ${app.adopterId.profile.lastName || ""}`.trim()
          : app.adopterId?.email || "";
      const animalIdStr =
        typeof app.animalId === "object" ? app.animalId?._id || app.animalId?.id : app.animalId || "";

      return (
        animalName.toLowerCase().includes(term) ||
        adopterName.toLowerCase().includes(term) ||
        animalIdStr.toString().toLowerCase().includes(term)
      );
    });
  }, [applications, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <ClinicHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Cargando solicitudes...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <ClinicHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Card className="p-6">
            <p className="text-red-600">Error al cargar solicitudes: {(error as Error).message}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ClinicHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Solicitudes de Adopción
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Vista de solo lectura de todas las solicitudes de adopción registradas en el sistema
          </p>

          {/* Búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre de animal, adoptante o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de solicitudes */}
          {filteredApplications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                {searchTerm ? "No se encontraron solicitudes con ese criterio" : "No hay solicitudes disponibles"}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app: any) => {
                const animal =
                  typeof app.animalId === "object" && app.animalId
                    ? app.animalId
                    : { _id: app.animalId, name: "Animal desconocido" };
                const adopter =
                  typeof app.adopterId === "object" && app.adopterId
                    ? app.adopterId
                    : { _id: app.adopterId, email: "Adoptante desconocido" };

                const adopterName =
                  adopter.profile?.firstName && adopter.profile?.lastName
                    ? `${adopter.profile.firstName} ${adopter.profile.lastName}`
                    : adopter.email || "Sin nombre";

                const animalPhoto =
                  animal.photos && animal.photos.length > 0 ? urlFromBackend(animal.photos[0]) : null;

                const status = app.status || "PENDING";
                const statusLabel = STATUS_LABELS[status] || status;
                const statusVariant = STATUS_VARIANTS[status] || "default";

                const createdAt = app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha no disponible";

                const comment = app.form?.motivation || app.foundationNotes || null;

                return (
                  <Card key={app.id || app._id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Foto del animal */}
                      <div className="flex-shrink-0">
                        {animalPhoto ? (
                          <img
                            src={animalPhoto}
                            alt={animal.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Heart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{animal.name}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{adopterName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={statusVariant} size="sm">
                            {statusLabel}
                          </Badge>
                        </div>

                        {/* Comentario opcional */}
                        {comment && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700 line-clamp-2">{comment}</p>
                            </div>
                          </div>
                        )}

                        {/* Score si existe */}
                        {app.scorePct !== undefined && app.scorePct !== null && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Compatibilidad:</span>
                              <span className="text-sm font-semibold text-primary-600">{app.scorePct}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

