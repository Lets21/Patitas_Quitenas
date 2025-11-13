// src/pages/LoginPublic.tsx
import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Heart, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore, getRedirectPath, type Role } from "@/lib/auth"; // <- OJO: lib/auth
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPublicPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const doLogin = useAuthStore((s) => s.login); // <- método correcto del store

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");

      const { user, token } = await apiClient.login(email, password);

      // Este login es exclusivo para ADOPTANTE
      if (user.role !== "ADOPTANTE") {
        setErr("Este acceso es solo para adoptantes. Usa el login de administración.");
        return;
      }

      // Guarda en el store y redirige
      doLogin(user, token);
      
      // Si hay un parámetro 'next' en la URL, redirigir allí, sino usar getRedirectPath
      const nextPath = searchParams.get("next");
      if (nextPath) {
        nav(nextPath, { replace: true });
      } else {
        nav(getRedirectPath(user.role as Role), { replace: true });
      }
    } catch (e: any) {
      setErr(e?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !email || !password;

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="mt-2 text-sm text-gray-600">
              Acceso para adoptantes de Huellitas Quiteñas
            </p>
          </div>

          {/* Error banner */}
          {err && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="adoptante@demo.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              enterKeyHint="next"
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <span className="text-xs text-gray-500">Solo adoptantes</span>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={disabled} loading={loading}>
              Ingresar
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes cuenta?{" "}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Crear cuenta
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              ¿Eres Fundación, Clínica o Admin?{" "}
              <Link to="/admin/login" className="font-medium text-primary-600 hover:text-primary-500">
                Accede aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
