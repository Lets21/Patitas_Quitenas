import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAuthStore } from "@/lib/auth";

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);

  // Mapea tu rol del backend a las keys del header
  const roleKey =
    user?.role === "CLINICA"
      ? "clinica"
      : user?.role === "FUNDACION"
      ? "fundacion"
      : "admin";

  // Puedes setear etiquetas dinámicas por rol
  const roleLabel = roleKey === "clinica" ? "Clínica Veterinaria"
                  : roleKey === "fundacion" ? "Fundación"
                  : "Panel de Administración";

  const orgName = roleKey === "clinica" ? "UDLA Clínica"
                : roleKey === "fundacion" ? "Fundación PAE"
                : "Organización";

  const orgInitials = roleKey === "clinica" ? "UDLA"
                   : roleKey === "fundacion" ? "PAE"
                   : "ORG";

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader
        roleKey={roleKey}
        roleLabel={roleLabel}
        orgName={orgName}
        orgInitials={orgInitials}
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
