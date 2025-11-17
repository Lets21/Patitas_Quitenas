import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
