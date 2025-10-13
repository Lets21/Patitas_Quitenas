import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";

// Teléfono Ecuador (+593) tolerante con espacios/guiones
const phoneEC = z
  .string()
  .min(1, "Teléfono requerido")
  .regex(
    /^\+?593[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{3}$|^\+?593[\s-]?9\d{2}[\s-]?\d{3}[\s-]?\d{3}$|^\+?593\d{9}$/,
    "Formato recomendado: +593 XXX-XXX-XXX"
  );

const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "Nombre requerido"),
    lastName: z.string().min(1, "Apellido requerido"),
    phone: phoneEC,
    address: z.string().min(1, "Dirección requerida"),
    terms: z.boolean().refine((v) => v === true, "Debes aceptar los términos y condiciones"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const ROLE_ADOPTANTE = "ADOPTANTE" as const;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        role: ROLE_ADOPTANTE, // fijo
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
        },
      };

      const res = await apiClient.register(payload);
      if ((res as any).error) throw new Error((res as any).error);

      toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
            <p className="mt-2 text-gray-600">Únete a la comunidad AdoptaQuito</p>
          </div>

          {/* Formulario adoptante */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                {...register("firstName")}
                label="Nombre"
                placeholder="Tu nombre"
                error={errors.firstName?.message}
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
              />
              <Input
                {...register("lastName")}
                label="Apellido"
                placeholder="Tu apellido"
                error={errors.lastName?.message}
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
              />
            </div>

            <Input
              {...register("email")}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              autoComplete="email"
              aria-invalid={!!errors.email}
              enterKeyHint="next"
            />

            <Input
              {...register("phone")}
              type="tel"
              label="Teléfono"
              placeholder="+593 XXX-XXX-XXX"
              error={errors.phone?.message}
              autoComplete="tel"
              aria-invalid={!!errors.phone}
            />

            <Input
              {...register("address")}
              label="Dirección"
              placeholder="Tu dirección completa"
              error={errors.address?.message}
              autoComplete="street-address"
              aria-invalid={!!errors.address}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  enterKeyHint="next"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[42px] rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
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
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-pressed={showConfirmPassword}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-start">
              <input
                {...register("terms")}
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                aria-invalid={!!errors.terms}
              />
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Acepto los{" "}
                  <Link to="/terminos" className="text-primary-600 hover:text-primary-500">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link to="/privacidad" className="text-primary-600 hover:text-primary-500">
                    política de privacidad
                  </Link>
                </p>
                {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>}
              </div>
            </div>

            <Button type="submit" loading={disabled} disabled={disabled} className="w-full" size="lg">
              Crear cuenta
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
