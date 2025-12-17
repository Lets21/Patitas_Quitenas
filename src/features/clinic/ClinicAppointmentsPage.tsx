// frontend/src/features/clinic/ClinicAppointmentsPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Loader2, Calendar, User, Clock, CheckCircle2, XCircle, RefreshCw, Search, FileText, Eye, PawPrint, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ClinicHeader from "@/components/admin/ClinicHeader";
import { apiClient, urlFromBackend } from "@/lib/api";
import type { Appointment } from "@/types";
import toast from "react-hot-toast";

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Solicitada",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  RESCHEDULE_PROPOSED: "Reagendamiento propuesto",
  RESCHEDULED: "Reagendada",
  CANCELLED: "Cancelada",
};

const STATUS_VARIANTS: Record<string, "info" | "warning" | "success" | "danger" | "default"> = {
  REQUESTED: "info",
  ACCEPTED: "success",
  REJECTED: "danger",
  RESCHEDULE_PROPOSED: "warning",
  RESCHEDULED: "success",
  CANCELLED: "default",
};

export default function ClinicAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<Appointment | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{ appointment: Appointment | null; newDate: string; newTime: string; message: string }>({
    appointment: null,
    newDate: "",
    newTime: "",
    message: "",
  });

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    loadAppointments();
    // Refrescar cada 30 segundos para ver actualizaciones
    const interval = setInterval(() => {
      loadAppointments();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadAppointments() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getClinicAppointments();
      setAppointments(data.appointments || []);
    } catch (e: any) {
      setError(e);
      toast.error("Error al cargar las citas");
    } finally {
      setIsLoading(false);
    }
  }

  // Filtrar citas por término de búsqueda
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (!searchTerm.trim()) return appointments;

    const term = searchTerm.toLowerCase();
    return appointments.filter((apt) => {
      const animalName = apt.animal?.name || "";
      const adopterName = apt.adopter?.name || "";
      return (
        animalName.toLowerCase().includes(term) ||
        adopterName.toLowerCase().includes(term)
      );
    });
  }, [appointments, searchTerm]);

  // Ordenar: REQUESTED primero, luego propuestas del adoptante pendientes, luego por fecha
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      // Prioridad 1: REQUESTED
      if (a.status === "REQUESTED" && b.status !== "REQUESTED") return -1;
      if (a.status !== "REQUESTED" && b.status === "REQUESTED") return 1;
      
      // Prioridad 2: Propuestas del adoptante pendientes
      const aHasProposal = a.adopterProposedDateTime && a.adopterResponseToReschedule === "PROPOSED_NEW";
      const bHasProposal = b.adopterProposedDateTime && b.adopterResponseToReschedule === "PROPOSED_NEW";
      if (aHasProposal && !bHasProposal) return -1;
      if (!aHasProposal && bHasProposal) return 1;
      
      // Prioridad 3: Por fecha
      return new Date(a.requestedDateTime).getTime() - new Date(b.requestedDateTime).getTime();
    });
  }, [filteredAppointments]);

  async function handleAccept(appointmentId: string) {
    try {
      setActionLoading(appointmentId);
      await apiClient.acceptAppointment(appointmentId);
      toast.success("Cita aceptada exitosamente");
      await loadAppointments();
    } catch (e: any) {
      toast.error(e?.message || "Error al aceptar la cita");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(appointmentId: string) {
    const message = prompt("¿Deseas agregar un mensaje explicando el rechazo? (opcional)");
    try {
      setActionLoading(appointmentId);
      await apiClient.rejectAppointment(appointmentId, { message: message || undefined });
      toast.success("Cita rechazada");
      await loadAppointments();
    } catch (e: any) {
      toast.error(e?.message || "Error al rechazar la cita");
    } finally {
      setActionLoading(null);
    }
  }

  function openRescheduleModal(appointment: Appointment) {
    setRescheduleModal({
      appointment,
      newDate: "",
      newTime: "",
      message: "",
    });
  }

  async function handleReschedule() {
    if (!rescheduleModal.appointment) return;
    if (!rescheduleModal.newDate || !rescheduleModal.newTime) {
      toast.error("Por favor completa la fecha y hora");
      return;
    }

    try {
      setActionLoading(rescheduleModal.appointment.id);
      const proposedNewDateTime = new Date(
        `${rescheduleModal.newDate}T${rescheduleModal.newTime}`
      ).toISOString();

      await apiClient.rescheduleAppointment(rescheduleModal.appointment.id, {
        proposedNewDateTime,
        message: rescheduleModal.message || undefined,
      });

      toast.success("Cita reagendada exitosamente");
      setRescheduleModal({ appointment: null, newDate: "", newTime: "", message: "" });
      await loadAppointments();
    } catch (e: any) {
      toast.error(e?.message || "Error al reagendar la cita");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAcceptAdopterProposal(appointmentId: string) {
    try {
      setActionLoading(appointmentId);
      await apiClient.acceptAdopterProposal(appointmentId);
      toast.success("Propuesta del adoptante aceptada exitosamente");
      await loadAppointments();
      // Cerrar modal si está abierto
      if (detailModal?.id === appointmentId) {
        setDetailModal(null);
      }
    } catch (e: any) {
      toast.error(e?.message || "Error al aceptar la propuesta");
    } finally {
      setActionLoading(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <ClinicHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Cargando citas...</span>
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
            <p className="text-red-600">Error al cargar citas: {(error as Error).message}</p>
            <Button onClick={loadAppointments} className="mt-4">
              Reintentar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Obtener fecha mínima (hoy) y máxima (30 días desde hoy)
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ClinicHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Citas Solicitadas
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Gestiona las citas solicitadas por los adoptantes para sus animales adoptados
          </p>

          {/* Búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre de animal o adoptante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de citas */}
          {sortedAppointments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                {searchTerm ? "No se encontraron citas con ese criterio" : "No hay citas disponibles"}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((apt) => {
                const animal = apt.animal || { name: "Sin nombre", photos: [], attributes: {} };
                const adopter = apt.adopter || { name: "Sin nombre", email: "" };
                const animalPhoto = animal.photos?.[0] ? urlFromBackend(animal.photos[0]) : null;

                const status = apt.status || "REQUESTED";
                const statusLabel = STATUS_LABELS[status] || status;
                const statusVariant = STATUS_VARIANTS[status] || "default";

                const requestedDate = new Date(apt.requestedDateTime).toLocaleString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const isRequested = status === "REQUESTED";
                const hasAdopterProposal = apt.adopterProposedDateTime && apt.adopterResponseToReschedule === "PROPOSED_NEW";
                const isLoading = actionLoading === apt.id;

                return (
                  <Card key={apt.id} className="p-6 hover:shadow-lg transition-shadow">
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
                            <Calendar className="h-8 w-8 text-gray-400" />
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
                                <span>{adopter.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{requestedDate}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={statusVariant} size="sm">
                            {statusLabel}
                          </Badge>
                        </div>

                        {/* Notas del adoptante */}
                        {apt.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{apt.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Mensaje de la clínica */}
                        {apt.clinicResponseMessage && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">{apt.clinicResponseMessage}</p>
                          </div>
                        )}

                        {/* Nueva fecha propuesta por clínica */}
                        {apt.proposedNewDateTime && apt.adopterResponseToReschedule !== "PROPOSED_NEW" && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                            <p className="text-sm text-amber-800">
                              <strong>Nueva fecha propuesta por la clínica:</strong>{" "}
                              {new Date(apt.proposedNewDateTime).toLocaleString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {apt.clinicResponseMessage && (
                              <p className="text-sm text-amber-700 mt-1 italic">{apt.clinicResponseMessage}</p>
                            )}
                          </div>
                        )}

                        {/* Nueva fecha propuesta por el adoptante */}
                        {apt.adopterProposedDateTime && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900 mb-1">
                                  Nueva fecha propuesta por el adoptante:
                                </p>
                                <p className="text-blue-900">
                                  {new Date(apt.adopterProposedDateTime).toLocaleString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {apt.adopterResponseMessage && (
                                  <p className="text-sm text-blue-800 mt-2 italic">{apt.adopterResponseMessage}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDetailModal(apt)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Ver detalles
                          </Button>
                          {isRequested && (
                            <>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleAccept(apt.id)}
                                disabled={isLoading}
                                loading={isLoading}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Aceptar
                              </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleReject(apt.id)}
                              disabled={isLoading}
                              loading={isLoading}
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Rechazar
                            </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRescheduleModal(apt)}
                                disabled={isLoading}
                                className="flex items-center gap-2"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Reagendar
                              </Button>
                            </>
                          )}
                          {/* Acciones cuando el adoptante propuso nueva fecha */}
                          {hasAdopterProposal && (
                            <>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleAcceptAdopterProposal(apt.id)}
                                disabled={isLoading}
                                loading={isLoading}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Aceptar propuesta del adoptante
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRescheduleModal(apt)}
                                disabled={isLoading}
                                className="flex items-center gap-2"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Proponer otra fecha
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle de cita */}
      {detailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Detalle de la cita</h3>
              <Button variant="ghost" size="sm" onClick={() => setDetailModal(null)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Animal</h4>
                  <div className="flex items-center gap-3">
                    {detailModal.animal?.photos?.[0] && (
                      <img
                        src={urlFromBackend(detailModal.animal.photos[0])}
                        alt={detailModal.animal.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{detailModal.animal?.name || "Sin nombre"}</p>
                      <p className="text-sm text-gray-600">{detailModal.animal?.attributes?.breed || ""}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Adoptante</h4>
                  <p className="font-semibold text-gray-900">{detailModal.adopter?.name || "Sin nombre"}</p>
                  <p className="text-sm text-gray-600">{detailModal.adopter?.email || ""}</p>
                </div>
              </div>

              {/* Estado */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Estado</h4>
                <Badge variant={STATUS_VARIANTS[detailModal.status]} size="sm">
                  {STATUS_LABELS[detailModal.status]}
                </Badge>
              </div>

              {/* Fecha solicitada original */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fecha solicitada originalmente</h4>
                <p className="text-gray-900">{formatDateTime(detailModal.requestedDateTime)}</p>
              </div>

              {/* Nueva fecha propuesta por clínica */}
              {detailModal.proposedNewDateTime && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-amber-900 mb-1">
                        Nueva fecha propuesta por la clínica
                      </h4>
                      <p className="text-amber-900">{formatDateTime(detailModal.proposedNewDateTime)}</p>
                      {detailModal.clinicResponseMessage && (
                        <p className="text-sm text-amber-800 mt-2">{detailModal.clinicResponseMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Propuesta del adoptante */}
              {detailModal.adopterProposedDateTime && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Nueva fecha propuesta por el adoptante</h4>
                  <p className="text-blue-900">{formatDateTime(detailModal.adopterProposedDateTime)}</p>
                  {detailModal.adopterResponseMessage && (
                    <p className="text-sm text-blue-800 mt-2">{detailModal.adopterResponseMessage}</p>
                  )}
                </div>
              )}

              {/* Respuesta del adoptante */}
              {detailModal.adopterResponseToReschedule && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <h4 className="text-sm font-medium text-emerald-900 mb-1">Respuesta del adoptante</h4>
                  <Badge
                    variant={
                      detailModal.adopterResponseToReschedule === "ACCEPTED"
                        ? "success"
                        : detailModal.adopterResponseToReschedule === "REJECTED"
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                  >
                    {detailModal.adopterResponseToReschedule === "ACCEPTED"
                      ? "Aceptó el reagendamiento"
                      : detailModal.adopterResponseToReschedule === "REJECTED"
                      ? "Rechazó el reagendamiento"
                      : "Propuso nueva fecha"}
                  </Badge>
                </div>
              )}

              {/* Notas */}
              {detailModal.notes && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notas del adoptante</h4>
                  <p className="text-gray-900">{detailModal.notes}</p>
                </div>
              )}

              {/* Historial de reagendamientos */}
              {detailModal.rescheduleHistory && detailModal.rescheduleHistory.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Historial completo de reagendamientos</h4>
                  <div className="space-y-3">
                    {detailModal.rescheduleHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex-shrink-0">
                          {item.proposedBy === "CLINIC" ? (
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <PawPrint className="h-5 w-5 text-primary-600" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {item.proposedBy === "CLINIC" ? "Clínica propuso:" : "Adoptante propuso:"}
                            </span>
                            <Badge
                              variant={
                                item.status === "ACCEPTED"
                                  ? "success"
                                  : item.status === "REJECTED"
                                  ? "danger"
                                  : "warning"
                              }
                              size="sm"
                            >
                              {item.status === "ACCEPTED"
                                ? "Aceptado"
                                : item.status === "REJECTED"
                                ? "Rechazado"
                                : "Pendiente"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mb-1">
                            {formatDateTime(item.proposedDateTime)}
                          </p>
                          {item.message && (
                            <p className="text-sm text-gray-600 mt-1 italic">{item.message}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Propuesto: {formatDate(item.createdAt)}</span>
                            {item.respondedAt && <span>Respondido: {formatDate(item.respondedAt)}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones si hay propuesta del adoptante pendiente */}
              {detailModal.adopterProposedDateTime &&
                detailModal.status === "RESCHEDULE_PROPOSED" &&
                detailModal.adopterResponseToReschedule === "PROPOSED_NEW" && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-3">
                      El adoptante propuso una nueva fecha. ¿Deseas aceptarla?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptAdopterProposal(detailModal.id)}
                        disabled={actionLoading === detailModal.id}
                        loading={actionLoading === detailModal.id}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aceptar propuesta del adoptante
                      </Button>
                    </div>
                  </div>
                )}

              {/* Botón cerrar */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setDetailModal(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de reagendamiento */}
      {rescheduleModal.appointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Reagendar cita</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva fecha *
                </label>
                <Input
                  type="date"
                  value={rescheduleModal.newDate}
                  onChange={(e) =>
                    setRescheduleModal({ ...rescheduleModal, newDate: e.target.value })
                  }
                  min={today}
                  max={maxDateStr}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva hora *
                </label>
                <Input
                  type="time"
                  value={rescheduleModal.newTime}
                  onChange={(e) =>
                    setRescheduleModal({ ...rescheduleModal, newTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={rescheduleModal.message}
                  onChange={(e) =>
                    setRescheduleModal({ ...rescheduleModal, message: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border px-3 py-2 outline-none border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  placeholder="Mensaje para el adoptante..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setRescheduleModal({ appointment: null, newDate: "", newTime: "", message: "" })
                  }
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReschedule}
                  loading={actionLoading === rescheduleModal.appointment.id}
                  disabled={!rescheduleModal.newDate || !rescheduleModal.newTime}
                >
                  Reagendar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

