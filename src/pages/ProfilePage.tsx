
import React from "react";

// Simulación de datos del adoptante (reemplaza por datos reales del contexto de usuario)
const adoptante = {
  nombre: "Mario Simarro",
  email: "leito.t210403@outlook.es",
  fechaRegistro: "2024-03-15",
  verificado: true,
  telefono: "+593 999999999",
  solicitudes: 3,
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Perfil del Adoptante</h1>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <span className="font-semibold text-gray-700">Nombre:</span> {adoptante.nombre}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span> {adoptante.email}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Teléfono:</span> {adoptante.telefono}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Fecha de registro:</span> {new Date(adoptante.fechaRegistro).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Estado de cuenta:</span> {adoptante.verificado ? (
            <span className="text-green-600 font-bold">Verificada</span>
          ) : (
            <span className="text-red-600 font-bold">No verificada</span>
          )}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Solicitudes de adopción:</span> {adoptante.solicitudes}
        </div>
      </div>
      {/* Botón de editar datos removido */}
    </div>
  );
}
