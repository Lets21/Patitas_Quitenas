import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PhoneInput } from "../components/ui/PhoneInput";
import { Card } from "../components/ui/Card";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { validateEmail } from "@/utils/validateEmail";

// Validación de teléfono más flexible para soportar múltiples países
const phoneValidation = z
  .string()
  .min(1, "Teléfono requerido")
  .regex(
    /^\+\d{1,4}\s?\d{6,14}$/,
    "Formato inválido. Use el selector de país y escriba solo números"
  );

// Validación de contraseña más robusta
const passwordValidation = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email requerido")
      .transform((val) => val.trim().toLowerCase())
      .superRefine((value, ctx) => {
        const result = validateEmail(value);
        if (!result.isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: result.error ?? "Email inválido",
          });
        }
      }),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Confirme su contraseña"),
    firstName: z
      .string()
      .min(1, "Nombre requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre es demasiado largo")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
    lastName: z
      .string()
      .min(1, "Apellido requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido es demasiado largo")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras"),
    phone: phoneValidation,
    address: z
      .string()
      .min(1, "Dirección requerida")
      .min(10, "La dirección debe ser más específica")
      .max(200, "La dirección es demasiado larga"),
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
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
    mode: "onChange",
  });

  const watchedEmail = watch("email", "");

  useEffect(() => {
    if (!watchedEmail) {
      setEmailSuggestion(null);
      return;
    }
    const result = validateEmail(watchedEmail);
    if (
      result.suggestion &&
      result.suggestion !== watchedEmail.trim().toLowerCase()
    ) {
      setEmailSuggestion(result.suggestion);
    } else {
      setEmailSuggestion(null);
    }
  }, [watchedEmail]);

  const applyEmailSuggestion = () => {
    if (!emailSuggestion) return;
    setValue("email", emailSuggestion, { shouldValidate: true, shouldDirty: true });
    setEmailSuggestion(null);
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const validation = validateEmail(data.email);
      if (!validation.isValid) {
        toast.error(validation.error || "Email inválido");
        setLoading(false);
        return;
      }

      const payload = {
        email: validation.normalized,
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
            <p className="mt-2 text-gray-600">Únete a la comunidad Huellitas Quiteñas</p>
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

            {emailSuggestion && (
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <span>¿Quizás quisiste escribir:</span>
                <button
                  type="button"
                  className="font-semibold text-primary-700 underline"
                  onClick={applyEmailSuggestion}
                >
                  {emailSuggestion}
                </button>
                <span>?</span>
              </div>
            )}

            <PhoneInput
              label="Teléfono"
              placeholder="999-999-999"
              error={errors.phone?.message}
              onChange={(fullNumber) => setValue("phone", fullNumber, { shouldValidate: true })}
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
