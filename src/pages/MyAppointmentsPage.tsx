import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, urlFromBackend } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar, Clock, CheckCircle2, XCircle, RefreshCw, AlertCircle, PawPrint } from "lucide-react";
import type { Appointment } from "@/types";
import toast from "react-hot-toast";

const STATUS_META: Record<
  Appointment["status"],
  {
    label: string;
    variant: "info" | "warning" | "success" | "danger" | "default";
    icon: JSX.Element;
    color: string;
  }
> = {
  REQUESTED: {
    label: "Solicitada",
    variant: "info",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACCEPTED: {
    label: "Aceptada",
    variant: "success",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Rechazada",
    variant: "danger",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  RESCHEDULE_PROPOSED: {
    label: "Reagendamiento propuesto",
    variant: "warning",
    icon: <RefreshCw className="h-4 w-4" />,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  RESCHEDULED: {
    label: "Reagendada",
    variant: "success",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelada",
    variant: "default",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

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

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [respondModal, setRespondModal] = useState<{
    appointment: Appointment | null;
    action: "ACCEPT" | "REJECT" | "PROPOSE";
    newDate: string;
    newTime: string;
    message: string;
  }>({
    appointment: null,
    action: "ACCEPT",
    newDate: "",
    newTime: "",
    message: "",
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setErr(null);
      const data = await apiClient.getMyAppointments();
      // Asegurar que cada appointment tenga id y animal mapeado correctamente
      const mappedAppointments = (data.appointments || []).map((apt: any) => {
        const appointmentId = apt.id || apt._id || String(apt._id);
        let animal: any = { name: "Sin nombre", photos: [], attributes: {} };
        
        if (apt.animal) {
          animal = apt.animal;
        } else if (apt.animalId) {
          if (typeof apt.animalId === 'object' && apt.animalId !== null) {
            animal = apt.animalId;
          }
        }
        
        return {
          ...apt,
          id: appointmentId,
          _id: appointmentId,
          animal: {
            name: animal.name || "Animal en adopción",
            photos: animal.photos || [],
            attributes: animal.attributes || {},
          },
        };
      });
      
      setAppointments(mappedAppointments);
    } catch (e: any) {
      setErr(e?.message || "No se pudieron cargar tus citas");
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond() {
    if (!respondModal.appointment) return;

    if (respondModal.action === "PROPOSE" && (!respondModal.newDate || !respondModal.newTime)) {
      toast.error("Por favor completa la fecha y hora propuestas");
      return;
    }

    try {
      const appointmentId = respondModal.appointment.id || respondModal.appointment._id;
      if (!appointmentId) {
        toast.error("Error: No se pudo identificar la cita");
        return;
      }

      const proposedNewDateTime =
        respondModal.action === "PROPOSE"
          ? new Date(`${respondModal.newDate}T${respondModal.newTime}`).toISOString()
          : undefined;

      // Asegurar que el ID sea un string válido
      if (!appointmentId) {
        toast.error("Error: No se pudo identificar la cita. Por favor, recarga la página.");
        return;
      }

      console.log("Respondiendo a reagendamiento con ID:", appointmentId);
      await apiClient.respondToReschedule(String(appointmentId), {
        response:
          respondModal.action === "ACCEPT"
            ? "ACCEPTED"
            : respondModal.action === "REJECT"
            ? "REJECTED"
            : "PROPOSED_NEW",
        proposedNewDateTime,
        message: respondModal.message || undefined,
      });

      toast.success(
        respondModal.action === "ACCEPT"
          ? "Reagendamiento aceptado"
          : respondModal.action === "REJECT"
          ? "Reagendamiento rechazado"
          : "Nueva fecha propuesta"
      );
      setRespondModal({ appointment: null, action: "ACCEPT", newDate: "", newTime: "", message: "" });
      await loadAppointments();
    } catch (e: any) {
      toast.error(e?.message || "Error al responder");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3ef] py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center text-gray-500">Cargando tus citas…</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-[#f8f3ef] py-10">
        <div className="max-w-5xl mx-auto px-4">
          <Card className="p-6 text-center">
            <p className="text-red-600 font-medium mb-2">No se pudo cargar</p>
            <p className="text-gray-600">{err}</p>
            <Button className="mt-4" onClick={loadAppointments}>
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
    <div className="min-h-screen bg-[#f8f3ef] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10 rounded-3xl bg-white shadow-sm p-6 flex flex-col gap-3 border border-amber-50">
          <div className="inline-flex items-center gap-3 text-primary-600">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">Mis citas</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Mis citas en Clínica UDLA</h1>
          <p className="text-gray-600 text-lg">
            Revisa el estado de tus citas y responde a las propuestas de reagendamiento.
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600">Aún no tienes citas programadas.</p>
            <Link to="/mis-solicitudes">
              <Button className="mt-4">Ir a mis solicitudes</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((apt) => {
              // El animal ya viene mapeado desde loadAppointments
              const animal = apt.animal || { name: "Animal en adopción", photos: [], attributes: {} };
              const photo = animal.photos?.[0] ? urlFromBackend(animal.photos[0]) : undefined;
              const statusMeta = STATUS_META[apt.status] || STATUS_META.REQUESTED;
              const hasPendingReschedule = apt.status === "RESCHEDULE_PROPOSED";
              // Asegurar que siempre tengamos un ID válido
              const appointmentId = apt.id || apt._id || (apt as any)._id?.toString?.() || String((apt as any)._id);
              
              if (!appointmentId) {
                console.error("Appointment sin ID:", apt);
                return null;
              }

              // Crear un objeto appointment con ID garantizado
              const appointmentWithId = {
                ...apt,
                id: String(appointmentId),
                _id: String(appointmentId),
              };

              return (
                <Card
                  key={appointmentId}
                  className="p-6 flex flex-col gap-5 border border-white rounded-3xl shadow-md hover:shadow-lg transition"
                >
                  {/* Header con foto y estado */}
                  <div className="flex items-center gap-5">
                    {photo && (
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                          <img src={photo} alt={animal.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {animal.name || "Animal en adopción"}
                        </h2>
                        <Badge variant={statusMeta.variant} className={statusMeta.color}>
                          <span className="flex items-center gap-1">
                            {statusMeta.icon}
                            {statusMeta.label}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(apt.requestedDateTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(apt.requestedDateTime).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información de la cita */}
                  <div className="space-y-3">
                    {/* Fecha solicitada original */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-1">Fecha solicitada:</p>
                      <p className="text-gray-900">{formatDateTime(apt.requestedDateTime)}</p>
                    </div>

                    {/* Si hay reagendamiento propuesto */}
                    {apt.proposedNewDateTime && (
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-900 mb-1">
                              Nueva fecha propuesta por la clínica:
                            </p>
                            <p className="text-amber-900">{formatDateTime(apt.proposedNewDateTime)}</p>
                            {apt.clinicResponseMessage && (
                              <p className="text-sm text-amber-800 mt-2 italic">
                                {apt.clinicResponseMessage}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Si el adoptante propuso una nueva fecha */}
                    {apt.adopterProposedDateTime && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Tu propuesta de fecha:</p>
                        <p className="text-blue-900">{formatDateTime(apt.adopterProposedDateTime)}</p>
                        {apt.adopterResponseMessage && (
                          <p className="text-sm text-blue-800 mt-2 italic">{apt.adopterResponseMessage}</p>
                        )}
                      </div>
                    )}

                    {/* Notas del adoptante */}
                    {apt.notes && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">Tus notas:</p>
                        <p className="text-gray-900">{apt.notes}</p>
                      </div>
                    )}

                    {/* Mensaje de rechazo */}
                    {apt.status === "REJECTED" && apt.clinicResponseMessage && (
                      <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                        <p className="text-sm font-medium text-rose-900 mb-1">Motivo del rechazo:</p>
                        <p className="text-rose-900">{apt.clinicResponseMessage}</p>
                      </div>
                    )}

                    {/* Historial de reagendamientos */}
                    {apt.rescheduleHistory && apt.rescheduleHistory.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-3">Historial de reagendamientos:</p>
                        <div className="space-y-2">
                          {apt.rescheduleHistory.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="flex-shrink-0">
                                {item.proposedBy === "CLINIC" ? (
                                  <PawPrint className="h-4 w-4 text-primary-600 mt-0.5" />
                                ) : (
                                  <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-600">
                                    {item.proposedBy === "CLINIC" ? "Clínica propuso:" : "Tú propusiste:"}
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
                                <p className="text-sm text-gray-900">{formatDateTime(item.proposedDateTime)}</p>
                                {item.message && (
                                  <p className="text-xs text-gray-600 mt-1 italic">{item.message}</p>
                                )}
                                {item.respondedAt && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Respondido: {formatDate(item.respondedAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones para reagendamiento pendiente */}
                  {hasPendingReschedule && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          setRespondModal({
                            appointment: appointmentWithId,
                            action: "ACCEPT",
                            newDate: "",
                            newTime: "",
                            message: "",
                          })
                        }
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Aceptar reagendamiento
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRespondModal({
                            appointment: appointmentWithId,
                            action: "PROPOSE",
                            newDate: "",
                            newTime: "",
                            message: "",
                          })
                        }
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Proponer nueva fecha
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          setRespondModal({
                            appointment: appointmentWithId,
                            action: "REJECT",
                            newDate: "",
                            newTime: "",
                            message: "",
                          })
                        }
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de respuesta */}
      {respondModal.appointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {respondModal.action === "ACCEPT"
                ? "Aceptar reagendamiento"
                : respondModal.action === "REJECT"
                ? "Rechazar reagendamiento"
                : "Proponer nueva fecha"}
            </h3>
            <div className="space-y-4">
              {respondModal.action === "PROPOSE" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva fecha propuesta *
                    </label>
                    <Input
                      type="date"
                      value={respondModal.newDate}
                      onChange={(e) =>
                        setRespondModal({ ...respondModal, newDate: e.target.value })
                      }
                      min={today}
                      max={maxDateStr}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva hora propuesta *
                    </label>
                    <Input
                      type="time"
                      value={respondModal.newTime}
                      onChange={(e) =>
                        setRespondModal({ ...respondModal, newTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={respondModal.message}
                  onChange={(e) =>
                    setRespondModal({ ...respondModal, message: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border px-3 py-2 outline-none border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  placeholder="Mensaje para la clínica..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setRespondModal({
                      appointment: null,
                      action: "ACCEPT",
                      newDate: "",
                      newTime: "",
                      message: "",
                    })
                  }
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRespond}
                  disabled={
                    respondModal.action === "PROPOSE" &&
                    (!respondModal.newDate || !respondModal.newTime)
                  }
                >
                  {respondModal.action === "ACCEPT"
                    ? "Aceptar"
                    : respondModal.action === "REJECT"
                    ? "Rechazar"
                    : "Proponer"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

