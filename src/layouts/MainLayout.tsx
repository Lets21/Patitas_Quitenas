import { Outlet } from "react-router-dom";
// Usa tus propios componentes
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F2E9E4] text-stone-900">
      {/* Tu header existente */}
      <Header />

      {/* Contenido de cada página */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Tu footer existente */}
      <Footer />
    </div>
  );
}
