import React, { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Calendar, Shield, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAnimalById, type Animal } from "@/lib/api";

// Badge mínimo. Si ya tienes uno en components/ui/Badge, úsalo en vez de este.
function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md";
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary: "bg-green-100 text-green-800",
    secondary: "bg-orange-100 text-orange-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-rose-100 text-rose-800",
    neutral: "bg-stone-100 text-stone-800",
  };
  const sizes: Record<string, string> = {
    sm: "text-xs px-2 py-0.5 rounded-md",
    md: "text-sm px-3 py-1 rounded-lg",
  };
  return (
    <span className={`${variants[variant]} ${sizes[size]} inline-flex items-center ${className}`}>
      {children}
    </span>
  );
}

export default function AnimalDetailPage() {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"description" | "health" | "related">("description");

  const pet: Animal | undefined = useMemo(() => {
    if (!animalId) return undefined;
    return getAnimalById(animalId);
  }, [animalId]);

  if (!pet) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Button variant="outline" onClick={() => navigate("/adoptar")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al catálogo
        </Button>
        <Card className="p-8">
          <div className="text-lg font-semibold">Perro no encontrado</div>
          <p className="text-stone-600 mt-2">El perfil solicitado no existe o fue removido.</p>
        </Card>
      </div>
    );
  }

  const statusColor =
    pet.status === "available"
      ? "text-emerald-700"
      : pet.status === "reserved"
      ? "text-amber-700"
      : "text-stone-500";

  const statusText =
    pet.status === "available" ? "Disponible para adopción" : pet.status === "reserved" ? "Reservado" : "Ya adoptado";

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
                src={pet.photos[0]}
                alt={pet.name}
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  variant={pet.status === "available" ? "success" : pet.status === "reserved" ? "warning" : "neutral"}
                  size="md"
                >
                  {statusText}
                </Badge>
              </div>
              <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-stone-600 hover:text-[#FB8C00]" />
              </button>
            </div>

            {/* Encabezado */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-2">{pet.name}</h1>
              <div className="flex items-center gap-4 text-stone-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {pet.age} {pet.age === 1 ? "año" : "años"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {pet.foundation.name}
                </span>
              </div>

              {/* Chips de atributos */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="primary">
                  {pet.size === "small" ? "Pequeño" : pet.size === "medium" ? "Mediano" : "Grande"}
                </Badge>
                <Badge variant="secondary">
                  {pet.energy === "low" ? "Tranquilo" : pet.energy === "medium" ? "Activo" : "Muy activo"}
                </Badge>
                <Badge variant="neutral">{pet.breed}</Badge>
                {pet.health.vaccinated && <Badge variant="success">Vacunado</Badge>}
                {pet.health.sterilized && <Badge variant="success">Esterilizado</Badge>}
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
                <p className="text-stone-700 leading-relaxed mb-6">{pet.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Convivencia</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Con niños</span>
                        <Badge variant={pet.goodWith.children ? "success" : "error"} size="sm">
                          {pet.goodWith.children ? "Sí" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Con otros perros</span>
                        <Badge variant={pet.goodWith.dogs ? "success" : "error"} size="sm">
                          {pet.goodWith.dogs ? "Sí" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">Con gatos</span>
                        <Badge variant={pet.goodWith.cats ? "success" : "error"} size="sm">
                          {pet.goodWith.cats ? "Sí" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Nivel de energía</h4>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map(level => {
                        const active =
                          (pet.energy === "low" && level <= 1) ||
                          (pet.energy === "medium" && level <= 2) ||
                          (pet.energy === "high" && level <= 3);
                        return <div key={level} className={`w-3 h-3 rounded-full ${active ? "bg-[#FB8C00]" : "bg-stone-300"}`} />;
                      })}
                      <span className="text-sm text-stone-600">
                        {pet.energy === "low" ? "Tranquilo" : pet.energy === "medium" ? "Activo" : "Muy activo"}
                      </span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <span className="text-sm font-medium text-stone-700">Vacunado</span>
                    <Badge variant={pet.health.vaccinated ? "success" : "error"} size="sm">
                      {pet.health.vaccinated ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <span className="text-sm font-medium text-stone-700">Esterilizado</span>
                    <Badge variant={pet.health.sterilized ? "success" : "error"} size="sm">
                      {pet.health.sterilized ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <span className="text-sm font-medium text-stone-700">Desparasitado</span>
                    <Badge variant={pet.health.dewormed ? "success" : "error"} size="sm">
                      {pet.health.dewormed ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <span className="text-sm font-medium text-stone-700">Última revisión</span>
                    <span className="text-sm text-stone-600">
                      {new Date(pet.health.lastCheckup).toLocaleDateString()}
                    </span>
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
                    Este perro ha sido evaluado y cuenta con el aval veterinario necesario para la adopción.
                  </p>
                </div>
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
              <h3 className="text-lg font-semibold text-stone-900 mb-4">¿Te interesa {pet.name}?</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Estado</span>
                  <span className={`font-medium ${statusColor}`}>{statusText}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Fundación</span>
                  <span className="font-medium text-stone-900">{pet.foundation.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Publicado</span>
                  <span className="text-sm text-stone-600">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Por ahora, siempre enviamos a login; luego conecta con tu auth/roles */}
              {pet.status === "available" ? (
                <Link to={`/solicitud/nueva/${pet.id}`}>
                  <Button className="w-full mb-3">
                    <Heart className="w-4 h-4 mr-2" />
                    Solicitar adopción
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  {statusText}
                </Button>
              )}

              <div className="mt-6 pt-6 border-t border-stone-200">
                <h4 className="font-medium text-stone-900 mb-2">Información de contacto</h4>
                <p className="text-sm text-stone-600">
                  Una vez iniciado el proceso, te pondremos en contacto con {pet.foundation.name} para coordinar
                  los siguientes pasos.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}