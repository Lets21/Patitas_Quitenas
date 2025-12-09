import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Eye, EyeOff, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PhoneInput } from "../components/ui/PhoneInput";
import { Card } from "../components/ui/Card";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { validateEmail } from "@/utils/validateEmail";
import { useAuthStore } from "@/lib/auth";

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
    // Preferencias para matching con KNN
    preferredSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    preferredEnergy: z.enum(["LOW", "MEDIUM", "HIGH"]),
    hasChildren: z.boolean(),
    otherPets: z.enum(["none", "dog", "cat", "both"]),
    dwelling: z.string().min(1, "Selecciona tu tipo de vivienda"),
    experienceLevel: z.enum(["NONE", "BEGINNER", "INTERMEDIATE", "EXPERT"]),
    activityLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
    spaceSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    timeAvailable: z.enum(["LOW", "MEDIUM", "HIGH"]),
    groomingCommitment: z.enum(["LOW", "MEDIUM", "HIGH"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const TOTAL_STEPS = 2;

const ROLE_ADOPTANTE = "ADOPTANTE" as const;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      terms: false,
      hasChildren: false,
      otherPets: "none",
      dwelling: "",
      preferredSize: "MEDIUM",
      preferredEnergy: "MEDIUM",
      experienceLevel: "BEGINNER",
      activityLevel: "MEDIUM",
      spaceSize: "MEDIUM",
      timeAvailable: "MEDIUM",
      groomingCommitment: "MEDIUM"
    },
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

  const login = useAuthStore((state) => state.login);
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
        preferences: {
          preferredSize: data.preferredSize,
          preferredEnergy: data.preferredEnergy,
          hasChildren: data.hasChildren,
          otherPets: data.otherPets,
          dwelling: data.dwelling,
          experienceLevel: data.experienceLevel,
          activityLevel: data.activityLevel,
          spaceSize: data.spaceSize,
          timeAvailable: data.timeAvailable,
          groomingCommitment: data.groomingCommitment,
          completed: true, // Marca las preferencias como completadas
        },
      };

      const res = await apiClient.register(payload);
      if ((res as any).error) throw new Error((res as any).error);

      // Login automático después de registro
      try {
        console.log("🔐 Intentando login automático...");
        const loginRes = await apiClient.login(payload.email, payload.password);
        console.log("✅ Login exitoso. Usuario:", loginRes.user);
        console.log("📋 Preferencias guardadas:", loginRes.user?.profile?.preferences);
        
        login(loginRes.user, loginRes.token);
        toast.success("¡Registro exitoso! Conoce a tus mejores matches 🐾");
        
        // Esperar un momento para que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        navigate("/recommendations");
      } catch (loginError: any) {
        console.error("❌ Error en login automático:", loginError);
        toast.error("La cuenta se creó pero no se pudo iniciar sesión automáticamente. Inicia sesión manualmente.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || isSubmitting;

  // Navegación entre pasos
  const handleNextStep = async () => {
    // Validar campos del paso actual antes de avanzar
    const step1Fields: (keyof RegisterForm)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "password",
      "confirmPassword",
      "terms",
    ];

    const isValid = await trigger(step1Fields);
    if (isValid) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500">
              {currentStep === 1 ? (
                <Heart className="h-8 w-8 text-white" />
              ) : (
                <Sparkles className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentStep === 1 ? "Crear cuenta" : "Cuéntanos sobre ti"}
            </h1>
            <p className="mt-2 text-gray-600">
              {currentStep === 1
                ? "Únete a la comunidad Huellitas Quiteñas"
                : "Ayúdanos a encontrar tu compañero ideal"}
            </p>
            
            {/* Progress indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    currentStep === 1
                      ? "bg-primary-500 text-white"
                      : "bg-primary-100 text-primary-700"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm ${
                    currentStep === 1 ? "font-semibold text-gray-900" : "text-gray-500"
                  }`}
                >
                  Datos de cuenta
                </span>
              </div>
              <div className="h-px w-12 bg-gray-300" />
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    currentStep === 2
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm ${
                    currentStep === 2 ? "font-semibold text-gray-900" : "text-gray-500"
                  }`}
                >
                  Preferencias
                </span>
              </div>
            </div>
          </div>

          {/* Formulario adoptante */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* PASO 1: Datos de cuenta */}
            {currentStep === 1 && (
              <>
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

                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={disabled}
                  className="w-full"
                  size="lg"
                >
                  Continuar
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}

            {/* PASO 2: Preferencias para matching */}
            {currentStep === 2 && (
              <>
                {/* Mensaje motivacional con IA */}
                <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 flex-shrink-0 text-primary-600" />
                    <div>
                      <h3 className="font-semibold text-primary-900">¡Casi listo! 🐾</h3>
                      <p className="mt-1 text-sm text-primary-800">
                        Nuestro sistema de inteligencia artificial usa el <strong>Modelo KNN</strong> para
                        analizar tus respuestas y encontrar el perrito que mejor se adapte a tu estilo de
                        vida. ¡Solo faltan unas preguntas!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tamaño preferido */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ¿Qué tamaño de perro prefieres?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "SMALL", label: "Pequeño" },
                      { value: "MEDIUM", label: "Mediano" },
                      { value: "LARGE", label: "Grande" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("preferredSize") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("preferredSize")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.preferredSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredSize.message}</p>
                  )}
                </div>

                {/* Nivel de energía */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ¿Qué nivel de energía buscas?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "LOW", label: "Tranquilo" },
                      { value: "MEDIUM", label: "Moderado" },
                      { value: "HIGH", label: "Muy activo" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("preferredEnergy") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("preferredEnergy")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.preferredEnergy && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredEnergy.message}</p>
                  )}
                </div>

                {/* Niños en casa */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ¿Tienes niños en casa?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: true, label: "Sí" },
                      { value: false, label: "No" },
                    ].map((option) => (
                      <label
                        key={String(option.value)}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("hasChildren") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={watch("hasChildren") === option.value}
                          onChange={() =>
                            setValue("hasChildren", option.value, {
                              shouldValidate: true,
                            })
                          }
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.hasChildren && (
                    <p className="mt-1 text-sm text-red-600">{errors.hasChildren.message}</p>
                  )}
                </div>

                {/* Otras mascotas */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ¿Tienes otras mascotas?
                  </label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { value: "none", label: "Ninguna" },
                      { value: "dog", label: "Perros" },
                      { value: "cat", label: "Gatos" },
                      { value: "both", label: "Ambos" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("otherPets") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("otherPets")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.otherPets && (
                    <p className="mt-1 text-sm text-red-600">{errors.otherPets.message}</p>
                  )}
                </div>

                {/* Tipo de vivienda */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tipo de vivienda
                  </label>
                  <select
                    {...register("dwelling")}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Selecciona...</option>
                    <option value="apartment">Departamento</option>
                    <option value="house">Casa</option>
                    <option value="house_with_yard">Casa con jardín</option>
                    <option value="farm">Finca/Granja</option>
                  </select>
                  {errors.dwelling && (
                    <p className="mt-1 text-sm text-red-600">{errors.dwelling.message}</p>
                  )}
                </div>

                {/* Experiencia */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ¿Cuál es tu experiencia con perros?
                  </label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { value: "NONE", label: "Ninguna" },
                      { value: "BEGINNER", label: "Principiante" },
                      { value: "INTERMEDIATE", label: "Intermedio" },
                      { value: "EXPERT", label: "Experto" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("experienceLevel") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("experienceLevel")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.experienceLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
                  )}
                </div>

                {/* Nivel de actividad */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ¿Qué tan activo eres?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "LOW", label: "Poco activo" },
                      { value: "MEDIUM", label: "Moderado" },
                      { value: "HIGH", label: "Muy activo" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("activityLevel") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("activityLevel")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.activityLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.activityLevel.message}</p>
                  )}
                </div>

                {/* Tamaño del espacio */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tamaño de tu espacio
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "SMALL", label: "Pequeño" },
                      { value: "MEDIUM", label: "Mediano" },
                      { value: "LARGE", label: "Grande" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("spaceSize") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("spaceSize")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.spaceSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.spaceSize.message}</p>
                  )}
                </div>

                {/* Tiempo disponible */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tiempo disponible para tu perro
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "LOW", label: "Poco" },
                      { value: "MEDIUM", label: "Moderado" },
                      { value: "HIGH", label: "Mucho" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("timeAvailable") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("timeAvailable")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.timeAvailable && (
                    <p className="mt-1 text-sm text-red-600">{errors.timeAvailable.message}</p>
                  )}
                </div>

                {/* Compromiso de aseo */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Compromiso con el aseo/mantenimiento
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "LOW", label: "Bajo" },
                      { value: "MEDIUM", label: "Moderado" },
                      { value: "HIGH", label: "Alto" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                          watch("groomingCommitment") === option.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <input
                          {...register("groomingCommitment")}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  {errors.groomingCommitment && (
                    <p className="mt-1 text-sm text-red-600">{errors.groomingCommitment.message}</p>
                  )}
                </div>

                {/* Botones de navegación */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="secondary"
                    disabled={disabled}
                    className="flex-1"
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    loading={disabled}
                    disabled={disabled}
                    className="flex-1"
                    size="lg"
                  >
                    Crear cuenta
                  </Button>
                </div>
              </>
            )}
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
