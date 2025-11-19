import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Building,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { http } from "@/lib/http";
import toast from "react-hot-toast";

// Interface específica para el admin (viene del backend con _id)
interface AdminUser {
  _id: string;
  email: string;
  role: "ADMIN" | "FUNDACION" | "CLINICA" | "ADOPTANTE";
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  organization?: {
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  email: string;
  password?: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  organization: {
    name: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // Diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user?: AdminUser;
  }>({ isOpen: false });

  // Form data
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    role: "ADOPTANTE",
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
    },
    organization: {
      name: "",
    },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (roleFilter) params.append("role", roleFilter);
      if (statusFilter) params.append("status", statusFilter);

      const response = await http.get(`/admin/users?${params.toString()}`);

      if (response.data.ok) {
        setUsers(response.data.users || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotal(response.data.pagination.total);
        }
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El email no es válido";
    }

    if (modalMode === "create" && !formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (modalMode === "create" && formData.password && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.profile.firstName) {
      errors.firstName = "El nombre es requerido";
    }

    if (!formData.profile.lastName) {
      errors.lastName = "El apellido es requerido";
    }

    if ((formData.role === "FUNDACION" || formData.role === "CLINICA") && !formData.organization.name) {
      errors.organization = "El nombre de la organización es requerido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (modalMode === "create") {
        await http.post("/admin/users", formData);
        toast.success("Usuario creado exitosamente");
      } else if (modalMode === "edit" && selectedUser) {
        const { password, ...updateData } = formData;
        await http.put(`/admin/users/${selectedUser._id}`, updateData);
        toast.success("Usuario actualizado exitosamente");
      }
      
      closeModal();
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Error al ${modalMode === "create" ? "crear" : "actualizar"} usuario`);
    }
  };

  const handleDelete = (user: AdminUser) => {
    setConfirmDialog({ isOpen: true, user });
  };
  
  const handleConfirmDelete = async () => {
    const user = confirmDialog.user;
    if (!user) return;
    
    try {
      await http.delete(`/admin/users/${user._id}`);
      toast.success(`Usuario ${user.email} eliminado exitosamente`);
      setConfirmDialog({ isOpen: false });
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al eliminar usuario");
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await http.patch(`/admin/users/${user._id}/toggle-status`, {
        isActive: !user.isActive
      });
      toast.success(`Usuario ${user.isActive ? 'desactivado' : 'activado'} correctamente`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al cambiar estado");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (user: AdminUser) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      role: user.role,
      profile: {
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        phone: user.profile?.phone || "",
      },
      organization: {
        name: user.organization?.name || "",
      },
    });
    setShowModal(true);
  };

  const openViewModal = (user: AdminUser) => {
    setModalMode("view");
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    resetForm();
    setFormErrors({});
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "ADOPTANTE",
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
      },
      organization: {
        name: "",
      },
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "danger";
      case "FUNDACION":
        return "info";
      case "CLINICA":
        return "warning";
      case "ADOPTANTE":
        return "success";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: "Administrador",
      FUNDACION: "Fundación",
      CLINICA: "Clínica",
      ADOPTANTE: "Adoptante",
    };
    return labels[role] || role;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-2">
              {total} usuarios registrados en el sistema
            </p>
          </div>
          <Button onClick={openCreateModal} className="bg-primary-600 hover:bg-primary-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="FUNDACION">Fundación</option>
              <option value="CLINICA">Clínica</option>
              <option value="ADOPTANTE">Adoptante</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </Card>

        {/* Table */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Cargando usuarios...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Organización</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Fecha de registro</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.profile?.phone && (
                            <p className="text-sm text-gray-500">{user.profile.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {user.organization?.name ? (
                          <div className="flex items-center text-sm text-gray-700">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            {user.organization.name}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {user.isActive ? (
                          <Badge variant="success" size="sm">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="danger" size="sm">
                            <UserX className="w-3 h-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("es-EC", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openViewModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 ${
                              user.isActive
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            } rounded-lg transition-colors`}
                            title={user.isActive ? "Desactivar" : "Activar"}
                          >
                            {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Mostrando {(currentPage - 1) * limit + 1} a {Math.min(currentPage * limit, total)} de {total} usuarios
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create" && "Crear Nuevo Usuario"}
                {modalMode === "edit" && "Editar Usuario"}
                {modalMode === "view" && "Detalles del Usuario"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {modalMode === "view" && selectedUser ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                    <p className="mt-1 text-gray-900">
                      {selectedUser.profile?.firstName} {selectedUser.profile?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1 text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rol</label>
                    <div className="mt-1">
                      <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                        {getRoleLabel(selectedUser.role)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <div className="mt-1">
                      {selectedUser.isActive ? (
                        <Badge variant="success">Activo</Badge>
                      ) : (
                        <Badge variant="danger">Inactivo</Badge>
                      )}
                    </div>
                  </div>
                  {selectedUser.profile?.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono</label>
                      <p className="mt-1 text-gray-900">{selectedUser.profile.phone}</p>
                    </div>
                  )}
                  {selectedUser.organization?.name && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Organización</label>
                      <p className="mt-1 text-gray-900">{selectedUser.organization.name}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`pl-10 ${formErrors.email ? "border-red-500" : ""}`}
                      placeholder="usuario@ejemplo.com"
                      disabled={modalMode === "edit"}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                {modalMode === "create" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={formErrors.password ? "border-red-500" : ""}
                      placeholder="Mínimo 6 caracteres"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ADOPTANTE">Adoptante</option>
                    <option value="FUNDACION">Fundación</option>
                    <option value="CLINICA">Clínica</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.profile.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, firstName: e.target.value },
                        })
                      }
                      className={formErrors.firstName ? "border-red-500" : ""}
                      placeholder="Juan"
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.profile.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, lastName: e.target.value },
                        })
                      }
                      className={formErrors.lastName ? "border-red-500" : ""}
                      placeholder="Pérez"
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      value={formData.profile.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, phone: e.target.value },
                        })
                      }
                      className="pl-10"
                      placeholder="0999999999"
                    />
                  </div>
                </div>

                {/* Organization (solo para FUNDACION y CLINICA) */}
                {(formData.role === "FUNDACION" || formData.role === "CLINICA") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Organización <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        value={formData.organization.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: { ...formData.organization, name: e.target.value },
                          })
                        }
                        className={`pl-10 ${formErrors.organization ? "border-red-500" : ""}`}
                        placeholder="Nombre de la fundación o clínica"
                      />
                    </div>
                    {formErrors.organization && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.organization}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {modalMode === "create" ? "Crear Usuario" : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de que deseas eliminar al usuario ${confirmDialog.user?.email || ''}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
