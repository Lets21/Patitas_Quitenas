import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore, getRedirectPath, type Role } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const ADMIN_ROLES = ["FUNDACION", "CLINICA", "ADMIN"] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requerido')
    .email('Email inválido')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Contraseña requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginAdminPage() {
  const nav = useNavigate();
  const doLogin = useAuthStore((s) => s.login);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setErr("");

      const { user, token } = await apiClient.login(data.email, data.password);

      // Solo Fundación/Clínica/Admin aquí
      if (!ADMIN_ROLES.includes(user.role as AdminRole)) {
        setErr("Este acceso es exclusivo para Fundación, Clínica o Admin.");
        return;
      }

      doLogin(user, token);
      nav(getRedirectPath(user.role as Role), { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading;

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Acceso de administración</h1>
            <p className="mt-2 text-sm text-gray-600">
              Área para Fundación, Clínica y Administradores
            </p>
          </div>

          {/* Error */}
          {err && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="admin@demo.com"
              autoComplete="email"
              error={errors.email?.message}
              aria-invalid={!!errors.email}
              enterKeyHint="next"
            />

            <div className="relative">
              <Input
                {...register('password')}
                label="Contraseña"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                aria-invalid={!!errors.password}
                enterKeyHint="done"
              />
              <button
                type="button"
                className="absolute right-3 top-[42px] rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                onClick={() => setShow((v) => !v)}
                aria-pressed={show}
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/olvide"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <span className="text-xs text-gray-500">Acceso interno</span>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={disabled} loading={loading}>
              Ingresar
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Vienes a adoptar?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Ir al login público
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
