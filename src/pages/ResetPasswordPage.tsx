import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string().min(1, 'Confirme su contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');

  // Validar que haya token en la URL
  useEffect(() => {
    if (!token) {
      toast.error('Token inválido o faltante');
      setTimeout(() => navigate('/olvide'), 2000);
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Token inválido');
      return;
    }

    setLoading(true);
    try {
      await apiClient.resetPassword(token, data.password);
      setSuccess(true);
      toast.success('¡Contraseña actualizada exitosamente!');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Validaciones en tiempo real para mostrar feedback visual
  const passwordRequirements = {
    minLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password || ''),
    hasLowerCase: /[a-z]/.test(password || ''),
    hasNumber: /[0-9]/.test(password || ''),
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            {/* Success State */}
            <div className="text-center mb-8">
              <div className="bg-green-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Contraseña Actualizada!
              </h1>
              <p className="text-gray-600 mt-2">
                Tu contraseña ha sido cambiada exitosamente
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 text-center">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>

            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                Iniciar sesión ahora
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <div className="text-center">
              <div className="bg-red-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Token Inválido
              </h1>
              <p className="text-gray-600">
                El enlace de recuperación no es válido o ha expirado.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nueva Contraseña
            </h1>
            <p className="text-gray-600 mt-2">
              Ingresa tu nueva contraseña segura
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Password */}
            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Nueva contraseña"
                placeholder="••••••••"
                error={errors.password?.message}
                autoComplete="new-password"
                autoFocus
                aria-invalid={!!errors.password}
                enterKeyHint="next"
              />
              <button
                type="button"
                className="absolute right-3 top-[42px] rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Requisitos de la contraseña:
                </p>
                <ul className="space-y-1">
                  <li className={`text-sm flex items-center ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordRequirements.minLength ? '✓' : '○'}</span>
                    Al menos 8 caracteres
                  </li>
                  <li className={`text-sm flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordRequirements.hasUpperCase ? '✓' : '○'}</span>
                    Una letra mayúscula
                  </li>
                  <li className={`text-sm flex items-center ${passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordRequirements.hasLowerCase ? '✓' : '○'}</span>
                    Una letra minúscula
                  </li>
                  <li className={`text-sm flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordRequirements.hasNumber ? '✓' : '○'}</span>
                    Un número
                  </li>
                </ul>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmar contraseña"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                enterKeyHint="done"
              />
              <button
                type="button"
                className="absolute right-3 top-[42px] rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-pressed={showConfirmPassword}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
              disabled={loading}
            >
              Restablecer contraseña
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </Card>

        {/* Security Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>🔒 Seguridad:</strong> Una vez que cambies tu contraseña, 
            úsala para iniciar sesión en tu cuenta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
