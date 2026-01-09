import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requerido')
    .email('Email inválido')
    .toLowerCase(),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const emailValue = watch('email');

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await apiClient.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Revisa tu correo electrónico');
    } catch (error: any) {
      toast.error(error?.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-green-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Correo Enviado!
              </h1>
              <p className="text-gray-600 mt-2">
                Revisa tu bandeja de entrada
              </p>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Hemos enviado instrucciones de recuperación a:
                </p>
                <p className="font-semibold text-green-900 mt-1">
                  {emailValue}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📧 ¿No ves el correo?
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Revisa tu carpeta de spam o correo no deseado</li>
                  <li>Verifica que el email sea correcto</li>
                  <li>El enlace expira en 1 hora</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio de sesión
                </Button>
              </Link>
              
              <button
                onClick={() => setEmailSent(false)}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Enviar de nuevo
              </button>
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
            <div className="bg-amber-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-gray-600 mt-2">
              No te preocupes, te ayudaremos a recuperarla
            </p>
          </div>

          {/* Info */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <Input
                {...register('email')}
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                error={errors.email?.message}
                autoComplete="email"
                autoFocus
                aria-invalid={!!errors.email}
                enterKeyHint="send"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
              disabled={loading}
            >
              Enviar enlace de recuperación
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al inicio de sesión
            </Link>

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
        </Card>

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Tienes problemas? Contacta a{' '}
            <a
              href="mailto:soporte@huellitasquitenas.com"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              soporte@huellitasquitenas.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
