import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient, urlFromBackend } from "@/lib/api";
import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

export default function ScheduleAppointmentPage() {
  const nav = useNavigate();
  const { applicationId = "" } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [application, setApplication] = useState<any>(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [existingAppointment, setExistingAppointment] = useState<any>(null);

  const [form, setForm] = useState({
    requestedDate: "",
    requestedTime: "",
    notes: "",
  });

  // Cargar información de la aplicación y verificar si ya existe una cita
  useEffect(() => {
    if (!applicationId) return;
    (async () => {
      try {
        setLoadingApp(true);
        // Cargar aplicación
        const appData = await apiClient.getApplication(applicationId);
        setApplication(appData);

        // Verificar si ya existe una cita activa
        try {
          const myAppointments = await apiClient.getMyAppointments();
          const activeAppointment = myAppointments.appointments.find(
            (apt: any) =>
              apt.applicationId === applicationId &&
              ["REQUESTED", "ACCEPTED", "RESCHEDULE_PROPOSED", "RESCHEDULED"].includes(
                apt.status
              )
          );
          if (activeAppointment) {
            setExistingAppointment(activeAppointment);
          }
        } catch (e) {
          // Si no hay citas, continuar
          console.log("No hay citas existentes");
        }
      } catch (e: any) {
        const errorMsg = e?.message || "Error cargando información de la solicitud";
        setErr(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoadingApp(false);
      }
    })();
  }, [applicationId]);

  if (!user || user.role !== "ADOPTANTE") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef]">
        <Card className="p-8 text-center">
          <p className="mb-4">Debes iniciar sesión como Adoptante para continuar.</p>
          <Link to={`/login?next=/mis-solicitudes/${applicationId}/agendar-cita`}>
            <Button>Ir al login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");

      if (!form.requestedDate || !form.requestedTime) {
        setErr("Por favor completa la fecha y hora solicitadas");
        return;
      }

      // Combinar fecha y hora en un ISO string
      const requestedDateTime = new Date(
        `${form.requestedDate}T${form.requestedTime}`
      ).toISOString();

      await apiClient.createAppointment({
        applicationId,
        requestedDateTime,
        notes: form.notes || undefined,
      });

      toast.success("¡Cita solicitada exitosamente! La clínica revisará tu solicitud.", {
        duration: 5000,
      });
      nav("/mis-solicitudes", { replace: true });
    } catch (e: any) {
      const errorMsg =
        e?.message || "Error al solicitar la cita. Por favor, intenta nuevamente.";
      setErr(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  if (loadingApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef]">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Cargando información...</p>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef]">
        <Card className="p-8 text-center">
          <p className="mb-4 text-red-600">No se encontró la solicitud</p>
          <Link to="/mis-solicitudes">
            <Button variant="outline">Volver a mis solicitudes</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (application.status !== "APPROVED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f3ef]">
        <Card className="p-8 text-center">
          <p className="mb-4 text-amber-600">
            Solo puedes agendar citas para solicitudes aprobadas.
          </p>
          <p className="mb-4 text-gray-600">
            El estado actual de tu solicitud es: <strong>{application.status}</strong>
          </p>
          <Link to="/mis-solicitudes">
            <Button variant="outline">Volver a mis solicitudes</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (existingAppointment) {
    const statusLabels: Record<string, string> = {
      REQUESTED: "Solicitada",
      ACCEPTED: "Aceptada",
      REJECTED: "Rechazada",
      RESCHEDULE_PROPOSED: "Propuesta de reagendamiento",
      RESCHEDULED: "Reagendada",
      CANCELLED: "Cancelada",
    };

    return (
      <div className="min-h-screen bg-[#f8f3ef] py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/mis-solicitudes" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver a mis solicitudes
          </Link>

          <Card className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ya existe una cita para esta solicitud
              </h1>
              <p className="text-gray-600">
                Estado: <strong>{statusLabels[existingAppointment.status] || existingAppointment.status}</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Fecha y hora solicitada:</p>
                <p className="text-gray-900">
                  {new Date(existingAppointment.requestedDateTime).toLocaleString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {existingAppointment.proposedNewDateTime && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Nueva fecha propuesta:</p>
                  <p className="text-gray-900">
                    {new Date(existingAppointment.proposedNewDateTime).toLocaleString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {existingAppointment.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Notas:</p>
                  <p className="text-gray-900">{existingAppointment.notes}</p>
                </div>
              )}

              {existingAppointment.clinicResponseMessage && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Mensaje de la clínica:</p>
                  <p className="text-gray-900">{existingAppointment.clinicResponseMessage}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Link to="/mis-solicitudes">
                <Button variant="outline">Volver a mis solicitudes</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const animal = application.animalId || {};
  const photo = animal?.photos?.[0] ? urlFromBackend(animal.photos[0]) : undefined;

  // Obtener fecha mínima (hoy) y máxima (30 días desde hoy)
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#f8f3ef] py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          to="/mis-solicitudes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis solicitudes
        </Link>

        <div className="mb-8 rounded-3xl bg-white shadow-sm p-6 flex flex-col gap-3 border border-amber-50">
          <div className="inline-flex items-center gap-3 text-primary-600">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Agendar cita
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Agendar cita en Clínica UDLA
          </h1>
          <p className="text-gray-600 text-lg">
            Solicita una cita para el animal que estás adoptando. La clínica revisará tu solicitud y te notificará.
          </p>
        </div>

        {/* Información del animal */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-5">
            {photo && (
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-[22px] bg-gradient-to-br from-primary-200/60 via-white to-primary-50 p-[3px] shadow-inner">
                  <div className="w-full h-full rounded-[18px] overflow-hidden bg-gray-100 ring-1 ring-white shadow">
                    <img
                      src={photo}
                      alt={animal?.name || "Perro"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {animal?.name || "Perro"}
              </h2>
              {animal?.attributes?.breed && (
                <p className="text-gray-600">{animal.attributes.breed}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Formulario */}
        <Card className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {err && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{err}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Fecha preferida *
                </label>
                <Input
                  type="date"
                  value={form.requestedDate}
                  onChange={(e) =>
                    setForm({ ...form, requestedDate: e.target.value })
                  }
                  min={today}
                  max={maxDateStr}
                  required
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Selecciona una fecha dentro de los próximos 30 días
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Hora preferida *
                </label>
                <Input
                  type="time"
                  value={form.requestedTime}
                  onChange={(e) =>
                    setForm({ ...form, requestedTime: e.target.value })
                  }
                  required
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Horario de atención: 8:00 - 18:00
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Notas adicionales (opcional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                className="w-full rounded-xl border px-3 py-2 outline-none border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                placeholder="Información adicional que pueda ser útil para la clínica..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link to="/mis-solicitudes">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" loading={loading} disabled={loading}>
                Solicitar cita
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

