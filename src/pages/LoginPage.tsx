import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore, getRedirectPath } from '../lib/auth';
import toast from 'react-hot-toast';
import { apiClient } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginForm) => {
  setLoading(true);
  try {
    const res = await apiClient.login(data.email, data.password);
    if ((res as any).error) throw new Error((res as any).error);

    // la API devuelve { user, token }
    const { user, token } = res as any;
    login(user, token);
    toast.success(`¡Bienvenido ${user?.profile?.firstName || "Usuario"}!`);
    navigate(getRedirectPath(user.role));
  } catch (error: any) {
    toast.error(error?.message || "Error al iniciar sesión.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenido de vuelta a Huellitas Quiteñas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="••••••••"
                error={errors.password?.message}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Recordarme
                </span>
              </label>

              <Link
                to="/olvide"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Registrarse
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Credenciales de demostración:
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Adoptante:</strong> adoptante@demo.com / demo123456</p>
              <p><strong>Fundación:</strong> fundacion@demo.com / demo123456</p>
              <p><strong>Clínica:</strong> clinica@demo.com / demo123456</p>
              <p><strong>Admin:</strong> admin@demo.com / demo123456</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              💡 Cada usuario será redirigido a su dashboard correspondiente
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default LoginPage;
