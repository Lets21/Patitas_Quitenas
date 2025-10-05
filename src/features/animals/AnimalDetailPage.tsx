// src/features/animals/AnimalDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Calendar, Shield, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api";
import type { Animal, ClinicalRecord } from "@/types";

const stateBadge = (state?: Animal["state"]) => {
  switch (state) {
    case "AVAILABLE":
      return { label: "Disponible", variant: "success" as const };
    case "RESERVED":
      return { label: "Reservado", variant: "warning" as const };
    case "ADOPTED":
      return { label: "Adoptado", variant: "neutral" as const };
    default:
      return { label: state ?? "—", variant: "neutral" as const };
  }
};

const sizeLabel = (s: Animal["attributes"]["size"]) =>
  s === "SMALL" ? "Pequeño" : s === "MEDIUM" ? "Mediano" : "Grande";

const energyLabel = (e: Animal["attributes"]["energy"]) =>
  e === "LOW" ? "Tranquilo" : e === "MEDIUM" ? "Moderado" : "Activo";

export default function AnimalDetailPage() {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [clinical, setClinical] = useState<ClinicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingClinical, setLoadingClinical] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"description" | "health" | "related">("description");

  // Cargar el animal
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!animalId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.getAnimal(animalId);
        if ((res as any).error) throw new Error((res as any).error);
        const a = res as unknown as Animal;
        if (mounted) setAnimal(a);
      } catch (e: any) {
        if (mounted) setError(e?.message || "No se pudo cargar el perfil.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [animalId]);

  // Cargar ficha clínica si existe endpoint y el animal está
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!animal?._id && !(animal as any)?.id) return;
      try {
        setLoadingClinical(true);
        const id = (animal as any)._id || (animal as any).id;
        const res = await apiClient.getClinicalRecord(id);
        if (!(res as any)?.error && mounted) {
          setClinical(res as unknown as ClinicalRecord);
        }
      } catch {
        /* no-op: clínica opcional */
      } finally {
        if (mounted) setLoadingClinical(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [animal]);

  const badge = useMemo(() => stateBadge(animal?.state), [animal?.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando perfil…</div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Button variant="outline" onClick={() => navigate("/adoptar")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al catálogo
        </Button>
        <Card className="p-8">
          <div className="text-lg font-semibold">Perro no encontrado</div>
          <p className="text-stone-600 mt-2">{error ?? "El perfil solicitado no existe o fue removido."}</p>
        </Card>
      </div>
    );
  }

  const { name, photos, clinicalSummary, createdAt } = animal;
  const { age, breed, size, energy, coexistence, gender } = animal.attributes;

  return (
    <div className="min-h-screen bg-[#F2E9E4]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Imagen + estado */}
            <div className="relative mb-6">
              <img
                src={photos?.[0]}
                alt={name}
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4">
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <button
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors"
                title="Guardar"
              >
                <Heart className="w-5 h-5 text-stone-600 hover:text-[#FB8C00]" />
              </button>
            </div>

            {/* Encabezado */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-2">{name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-stone-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {age} {age === 1 ? "año" : "años"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Fundación: {animal.foundationId ? `#${animal.foundationId}` : "N/D"}
                </span>
                <span className="flex items-center gap-1">
                  {gender === "MALE" ? "Macho" : "Hembra"}
                </span>
              </div>

              {/* Chips de atributos */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="primary">{sizeLabel(size)}</Badge>
                <Badge variant="secondary">{energyLabel(energy)}</Badge>
                <Badge variant="neutral">{breed}</Badge>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-4 border-b border-stone-200">
              <div className="flex gap-6">
                {[
                  { id: "description", label: "Descripción" },
                  { id: "health", label: "Ficha clínica" },
                  { id: "related", label: "Similares" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-2 py-3 text-sm font-medium border-b-2 ${
                      activeTab === t.id
                        ? "border-[#2E7D32] text-[#2E7D32]"
                        : "border-transparent text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido Tabs */}
            {activeTab === "description" && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-3">Personalidad</h3>
                <p className="text-stone-700 leading-relaxed mb-6">
                  {clinicalSummary || "Pronto agregaremos más información sobre su personalidad."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Convivencia</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Con niños</span>
                        <Badge variant={coexistence.children ? "success" : "error"} size="sm">
                          {coexistence.children ? "Sí" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Con otros perros</span>
                        <Badge variant={coexistence.dogs ? "success" : "error"} size="sm">
                          {coexistence.dogs ? "Sí" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Con gatos</span>
                        <Badge variant={coexistence.cats ? "success" : "error"} size="sm">
                          {coexistence.cats ? "Sí" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Nivel de energía</h4>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map(level => {
                        const active =
                          (energy === "LOW" && level <= 1) ||
                          (energy === "MEDIUM" && level <= 2) ||
                          (energy === "HIGH" && level <= 3);
                        return (
                          <div
                            key={level}
                            className={`w-3 h-3 rounded-full ${active ? "bg-[#FB8C00]" : "bg-stone-300"}`}
                          />
                        );
                      })}
                      <span className="text-sm text-stone-600">{energyLabel(energy)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "health" && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-[#2E7D32]" />
                  <h3 className="text-lg font-semibold text-stone-900">Información de salud</h3>
                </div>

                {loadingClinical ? (
                  <p className="text-stone-600">Cargando ficha clínica…</p>
                ) : clinical ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                        <span className="text-sm font-medium text-stone-700">Vacunas</span>
                        <span className="text-sm text-stone-700">
                          {clinical.vaccinations?.length ? `${clinical.vaccinations.length} registradas` : "N/D"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                        <span className="text-sm font-medium text-stone-700">Esterilizado</span>
                        <Badge variant={clinical.sterilized ? "success" : "error"} size="sm">
                          {clinical.sterilized ? "Sí" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                        <span className="text-sm font-medium text-stone-700">Desparasitaciones</span>
                        <span className="text-sm text-stone-700">
                          {clinical.dewormings?.length ? `${clinical.dewormings.length} registradas` : "N/D"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                        <span className="text-sm font-medium text-stone-700">Aprobado por clínica</span>
                        <Badge variant={clinical.approved ? "success" : "warning"} size="sm">
                          {clinical.approved ? "Aprobado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-700" />
                        <span className="font-medium text-emerald-800">
                          Validado por Clínica Veterinaria UDLA
                        </span>
                      </div>
                      <p className="text-sm text-emerald-700 mt-1">
                        {clinical.vetNotes || "Revisión general conforme."}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-stone-600">Aún no hay ficha clínica registrada.</p>
                )}
              </Card>
            )}

            {activeTab === "related" && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-2">Perros similares</h3>
                <p className="text-stone-600">Pronto encontrarás aquí otros perros que podrían interesarte.</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">¿Te interesa {name}?</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Estado</span>
                  <span className="font-medium">
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Fundación</span>
                  <span className="text-sm text-stone-800">
                    {animal.foundationId ? `#${animal.foundationId}` : "N/D"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Publicado</span>
                  <span className="text-sm text-stone-600">
                    {createdAt ? new Date(createdAt).toLocaleDateString() : "N/D"}
                  </span>
                </div>
              </div>

              {animal.state === "AVAILABLE" ? (
                <Link to={`/solicitud/nueva/${animal._id || (animal as any).id}`}>
                  <Button className="w-full mb-3">
                    <Heart className="w-4 h-4 mr-2" />
                    Solicitar adopción
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  {badge.label}
                </Button>
              )}

              <div className="mt-6 pt-6 border-t border-stone-200">
                <h4 className="font-medium text-stone-900 mb-2">Información de contacto</h4>
                <p className="text-sm text-stone-600">
                  Una vez iniciado el proceso, te pondremos en contacto con la fundación para coordinar los siguientes
                  pasos.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
