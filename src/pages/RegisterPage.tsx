import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, User, Mail, Lock, Eye, EyeOff, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  phone: z.string().min(1, 'Teléfono requerido'),
  address: z.string().min(1, 'Dirección requerida'),
  role: z.enum(['ADOPTANTE', 'FUNDACION', 'CLINICA']),
  terms: z.boolean().refine(val => val === true, 'Debes aceptar los términos y condiciones')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'ADOPTANTE'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    
    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Registro exitoso. Por favor verifica tu email.');
      navigate('/login');
    } catch (error) {
      toast.error('Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'ADOPTANTE':
        return 'Busco adoptar una mascota';
      case 'FUNDACION':
        return 'Represento una fundación de rescate';
      case 'CLINICA':
        return 'Soy un profesional veterinario';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-primary-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Crear Cuenta
            </h1>
            <p className="text-gray-600 mt-2">
              Únete a la comunidad AdoptaQuito
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'ADOPTANTE', label: 'Adoptante', icon: Heart },
                  { value: 'FUNDACION', label: 'Fundación', icon: User },
                  { value: 'CLINICA', label: 'Clínica', icon: User }
                ].map(({ value, label, icon: Icon }) => (
                  <label key={value} className="relative">
                    <input
                      {...register('role')}
                      type="radio"
                      value={value}
                      className="sr-only"
                    />
                    <div className={`
                      p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200
                      ${selectedRole === value 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${
                        selectedRole === value ? 'text-primary-500' : 'text-gray-400'
                      }`} />
                      <div className="text-center">
                        <div className={`font-medium ${
                          selectedRole === value ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getRoleDescription(value)}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('firstName')}
                label="Nombre"
                placeholder="Tu nombre"
                error={errors.firstName?.message}
                autoComplete="given-name"
              />
              <Input
                {...register('lastName')}
                label="Apellido"
                placeholder="Tu apellido"
                error={errors.lastName?.message}
                autoComplete="family-name"
              />
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              autoComplete="email"
            />

            <Input
              {...register('phone')}
              type="tel"
              label="Teléfono"
              placeholder="+593 XXX-XXX-XXXX"
              error={errors.phone?.message}
              autoComplete="tel"
            />

            <Input
              {...register('address')}
              label="Dirección"
              placeholder="Tu dirección completa"
              error={errors.address?.message}
              autoComplete="street-address"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  autoComplete="new-password"
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

              <div className="relative">
                <Input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirmar contraseña"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Acepto los{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    política de privacidad
                  </Link>
                </p>
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-1">{errors.terms.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Crear Cuenta
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};