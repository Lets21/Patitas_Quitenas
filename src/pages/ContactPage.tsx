import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PhoneInput } from '@/components/ui/PhoneInput';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z.string()
    .email('Email inválido'),
  phone: z.string()
    .min(10, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(3, 'El asunto debe tener al menos 3 caracteres')
    .max(200, 'El asunto es demasiado largo'),
  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje es demasiado largo'),
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }

      setIsSuccess(true);
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
      reset();
      
      // Resetear el éxito después de 5 segundos
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes preguntas sobre adopción o necesitas ayuda? Estamos aquí para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href="mailto:lets.crp@outlook.com"
                      className="text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      lets.crp@outlook.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <a 
                      href="tel:+593960152853"
                      className="text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      +593 960152853
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="text-gray-900">Quito, Ecuador</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary-50 border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Horario de Atención
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes - Viernes:</span>
                  <span className="text-gray-900 font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado:</span>
                  <span className="text-gray-900 font-medium">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo:</span>
                  <span className="text-gray-900 font-medium">Cerrado</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h3 className="font-semibold mb-2">
                💡 ¿Sabías que...?
              </h3>
              <p className="text-sm text-primary-100">
                Responderemos tu mensaje en un plazo máximo de 24-48 horas.
                ¡Gracias por tu paciencia!
              </p>
            </Card>
          </div>

          {/* Formulario de contacto */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hemos recibido tu mensaje y te responderemos pronto.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Envíanos un Mensaje
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        {...register('name')}
                        label="Nombre completo"
                        placeholder="Tu nombre"
                        error={errors.name?.message}
                        disabled={isSubmitting}
                      />

                      <Input
                        {...register('email')}
                        type="email"
                        label="Email"
                        placeholder="tu@email.com"
                        error={errors.email?.message}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <PhoneInput
                        label="Teléfono (opcional)"
                        placeholder="999-999-999"
                        error={errors.phone?.message}
                        onChange={(value) => setValue('phone', value)}
                        disabled={isSubmitting}
                      />

                      <Input
                        {...register('subject')}
                        label="Asunto"
                        placeholder="¿En qué podemos ayudarte?"
                        error={errors.subject?.message}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje
                      </label>
                      <textarea
                        {...register('message')}
                        rows={6}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                          errors.message
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Escribe tu mensaje aquí..."
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-gray-500">
                        * Todos los campos son requeridos excepto el teléfono
                      </p>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Mensaje
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </Card>

            {/* FAQ rápida */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Preguntas frecuentes?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Visita nuestra sección de preguntas frecuentes para respuestas rápidas.
                </p>
                <a
                  href="/faq"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver FAQ →
                </a>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Listo para adoptar?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Explora nuestro catálogo de animales disponibles para adopción.
                </p>
                <a
                  href="/catalog"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver Catálogo →
                </a>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
