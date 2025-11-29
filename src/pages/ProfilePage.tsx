

import React, { useEffect, useState } from "react";
import { useAuthStore } from "../lib/auth";
import { apiClient } from "../lib/api";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [solicitudes, setSolicitudes] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProfile();
        setProfile(data);
      } catch (e) {
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const apps = await apiClient.getMyApplications();
        setSolicitudes(apps.length);
      } catch {
        setSolicitudes(null);
      }
    };
    fetchSolicitudes();
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">Cargando perfil...</div>;
  }
  if (error || !profile) {
    return <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-red-600">{error || "No se encontró el perfil"}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Perfil del Adoptante</h1>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <span className="font-semibold text-gray-700">Nombre:</span> {profile.profile?.firstName} {profile.profile?.lastName}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span> {profile.email}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Teléfono:</span> {profile.profile?.phone || "No registrado"}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Fecha de registro:</span> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Estado de cuenta:</span> {profile.status === "ACTIVE" ? (
            <span className="text-green-600 font-bold">Verificada</span>
          ) : (
            <span className="text-red-600 font-bold">No verificada</span>
          )}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Solicitudes de adopción:</span> {solicitudes !== null ? solicitudes : "-"}
        </div>
      </div>
    </div>
  );
}
