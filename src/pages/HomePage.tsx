import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Award, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Proceso Seguro',
      description: 'Validación veterinaria y seguimiento post-adopción garantizan el bienestar animal.'
    },
    {
      icon: Users,
      title: 'Evaluación Responsable',
      description: 'Proceso de evaluación que asegura la compatibilidad entre adoptante y mascota.'
    },
    {
      icon: Award,
      title: 'Apoyo Continuo',
      description: 'Acompañamiento durante el proceso y seguimiento para asegurar el éxito de la adopción.'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      text: 'Gracias a AdoptaQuito encontré a Luna, mi compañera perfecta. El proceso fue muy profesional y me sentí apoyada en cada paso.',
      rating: 5
    },
    {
      name: 'Carlos Mendoza',
      text: 'La evaluación me ayudó a entender mejor las necesidades de Max. Ahora somos una familia feliz y completa.',
      rating: 5
    },
    {
      name: 'Ana Rodríguez',
      text: 'El seguimiento post-adopción es increíble. Me han ayudado con consejos y apoyo durante la adaptación de Toby.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-surface-100 via-base to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Adopta con
                <span className="text-primary-500 block font-serif">Responsabilidad</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Conectamos familias amorosas con caninos en busca de hogar en Quito. 
                Un proceso transparente, seguro y respaldado por profesionales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/adoptar">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Heart className="h-5 w-5 mr-2 fill-current" />
                    Ver Animales
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Conocer Más
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary-500 rounded-3xl p-8 shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Perro feliz con familia adoptiva" 
                  className="rounded-2xl shadow-lg w-full h-96 object-cover"
                />
                <div className="absolute -bottom-4 -left-4 bg-accent-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm">Adopciones exitosas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué adoptar con nosotros?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro proceso integral garantiza adopciones exitosas y duraderas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Proceso de Adopción
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparente y diseñado para el bienestar animal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Explora', description: 'Conoce a nuestros animales disponibles' },
              { step: '2', title: 'Solicita', description: 'Completa el formulario de adopción' },
              { step: '3', title: 'Evalúa', description: 'Proceso de evaluación y validación' },
              { step: '4', title: 'Adopta', description: 'Bienvenido a tu nuevo mejor amigo' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 -right-4 w-8 h-0.5 bg-primary-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Historias de éxito
            </h2>
            <p className="text-xl text-gray-600">
              Lo que dicen las familias que han adoptado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="text-sm font-semibold text-gray-900">
                  {testimonial.name}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para cambiar una vida?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Miles de caninos esperan una segunda oportunidad. 
            Comienza tu proceso de adopción hoy mismo.
          </p>
          <Link to="/catalog">
            <Button size="lg" variant="secondary">
              <Heart className="h-5 w-5 mr-2 fill-current" />
              Comenzar Adopción
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
export default HomePage;