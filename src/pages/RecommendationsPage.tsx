import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Eye,
  TrendingUp,
  Info,
  Calendar,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { apiClient, urlFromBackend } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

type MatchResult = {
  animalId: string;
  animalName: string;
  distance: number; // Distancia Manhattan del KNN
  score: number; // Score 0-100 convertido de distancia
  rank: number; // Posición en el ranking
  isTopK: boolean; // Si está en los K mejores vecinos
  animal: any;
  // Campos legacy (compatibilidad con versión anterior)
  matchScore?: number;
  matchReasons?: string[];
  compatibilityFactors?: {
    size: number;
    energy: number;
    coexistence: number;
    personality: number;
    lifestyle: number;
  };
};

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "ADOPTANTE") {
      navigate("/login");
      return;
    }

    loadRecommendations();
  }, [user, navigate]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getRecommendations(20);
      setMatches(data.matches);

      if (data.matches.length === 0) {
        toast("No encontramos matches aún. Revisa más tarde.", { icon: "🐕" });
      }
    } catch (err: any) {
      console.error("Error loading recommendations:", err);
      if (err.message?.includes("completar tu perfil")) {
        setNeedsOnboarding(true);
        setError("Primero debes completar tu perfil de preferencias");
      } else {
        setError(err.message || "Error al cargar recomendaciones");
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-gray-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excelente Match", variant: "success" as const };
    if (score >= 60) return { label: "Buen Match", variant: "info" as const };
    if (score >= 40) return { label: "Match Moderado", variant: "warning" as const };
    return { label: "Match Bajo", variant: "default" as const };
  };

  const sizeLabel = (s: string) => 
    s === "SMALL" ? "Pequeño" : s === "MEDIUM" ? "Mediano" : "Grande";
  const energyLabel = (e: string) => 
    e === "LOW" ? "Tranquilo" : e === "MEDIUM" ? "Moderado" : "Activo";
  const ageBucket = (years: number) =>
    years < 1 ? "Cachorro" : years < 3 ? "Joven" : years < 7 ? "Adulto" : "Senior";

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Calculando tus mejores matches...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <Info className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Completa tu perfil</h2>
          <p className="text-gray-600 mb-6">
            Para poder recomendarte los mejores compañeros, necesitamos saber más sobre ti y tu estilo de vida.
          </p>
          <Button onClick={() => navigate("/onboarding/preferences")} className="w-full">
            Completar perfil
          </Button>
        </Card>
      </div>
    );
  }

  if (error && !needsOnboarding) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <div className="text-red-600 mb-4">
            <Info className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error al cargar recomendaciones</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/catalog")} className="flex-1">
              Ver catálogo completo
            </Button>
            <Button onClick={loadRecommendations} className="flex-1">
              Reintentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Tus Matches Perfectos
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {matches.length} canino{matches.length !== 1 ? "s" : ""} seleccionado{matches.length !== 1 ? "s" : ""} especialmente para ti
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Basado en tu perfil usando K-Nearest Neighbors (K=15) entrenado con dataset real
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Matches excelentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {matches.filter((m) => (m.score || m.matchScore || 0) >= 80).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Score promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {matches.length > 0
                    ? Math.round(
                        matches.reduce((sum, m) => sum + (m.score || m.matchScore || 0), 0) / matches.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Heart className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de opciones</p>
                <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid de matches */}
        {matches.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay recomendaciones disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              No encontramos caninos disponibles en este momento.
            </p>
            <Button variant="outline" onClick={() => navigate("/catalog")}>
              Ver catálogo completo
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const { animal } = match;
              const finalScore = match.score || match.matchScore || 0;
              const scoreBadge = getScoreBadge(finalScore);
              const { age, breed, size, energy } = animal.attributes;

              return (
                <Card
                  key={match.animalId}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-primary-100"
                >
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white rounded-full px-3 py-1 shadow-lg flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-primary-600" />
                        <span className={`font-bold ${getScoreColor(finalScore)}`}>
                          {Math.round(finalScore)}%
                        </span>
                      </div>
                      {match.rank && (
                        <span className="text-[10px] text-gray-500">
                          #{match.rank}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Imagen */}
                  <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                    <img
                      src={urlFromBackend(animal.photos?.[0] || "")}
                      alt={`Foto de ${animal.name}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant={scoreBadge.variant}>
                        {scoreBadge.label}
                        {match.isTopK && " • Top K"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Nombre y datos básicos */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {animal.name}
                      </h3>
                      <p className="text-gray-600">{breed}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {age} {age === 1 ? "año" : "años"} • {ageBucket(age)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {sizeLabel(size)} • {energyLabel(energy)}
                      </div>
                    </div>

                    {/* Información del KNN */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
                      <p className="text-xs font-semibold text-primary-900 mb-1 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Match KNN
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Distancia:</span>
                          <span className="font-medium text-gray-900 ml-1">
                            {match.distance?.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ranking:</span>
                          <span className="font-medium text-gray-900 ml-1">
                            #{match.rank || '?'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Calculado con K-Nearest Neighbors (distancia Manhattan)
                      </p>
                    </div>

                    {/* Razones del match (si existen - legacy) */}
                    {match.matchReasons && match.matchReasons.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Razones del match:
                        </p>
                        <ul className="space-y-1">
                          {match.matchReasons.slice(0, 3).map((reason, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Factores de compatibilidad visuales (si existen - legacy) */}
                    {match.compatibilityFactors && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Factores de compatibilidad:
                        </p>
                        <div className="grid grid-cols-5 gap-1">
                          {Object.entries(match.compatibilityFactors).map(([key, value]) => {
                            const score = Math.max(0, 100 - value * 100);
                            const color =
                              score >= 80
                                ? "bg-green-500"
                                : score >= 60
                                ? "bg-blue-500"
                                : score >= 40
                                ? "bg-orange-500"
                                : "bg-gray-400";
                            return (
                              <div key={key} className="text-center">
                                <div
                                  className={`h-10 ${color} rounded`}
                                  style={{ opacity: score / 100 }}
                                  title={`${key}: ${Math.round(score)}%`}
                                />
                                <p className="text-[10px] text-gray-500 mt-1 capitalize">
                                  {key.substring(0, 4)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-2">
                      <Link to={`/adoptar/${animal.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-9 text-xs">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver perfil
                        </Button>
                      </Link>
                      <Link to={`/adoptar/${animal.id}/aplicar`} className="flex-1">
                        <Button size="sm" className="w-full h-9 text-xs">
                          <Heart className="h-4 w-4 mr-2" />
                          Adoptar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA para ver catálogo completo */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¿No encontraste lo que buscas?
            </h3>
            <p className="text-gray-600 mb-4">
              Explora todo nuestro catálogo de caninos disponibles
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate("/catalog")}>
                Ver catálogo completo
              </Button>
              <Button onClick={() => navigate("/onboarding/preferences")}>
                Actualizar preferencias
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
