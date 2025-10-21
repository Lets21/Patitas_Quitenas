import React from 'react';
import { Heart, Shield, Home, Stethoscope, Users, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const AboutPage: React.FC = () => {
  const principios = [
    {
      icon: <Heart className="w-6 h-6 text-green-600" />,
      title: "Libertad de hambre, sed y malnutrición"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Libertad de miedo, ansiedad y angustia"
    },
    {
      icon: <Home className="w-6 h-6 text-green-600" />,
      title: "Libertad de incomodidad física o térmica"
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-green-600" />,
      title: "Libertad de dolor, lesiones y enfermedades"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Libertad para expresar comportamientos naturales"
    }
  ];

  const servicios = [
    {
      title: "Rescate y Rehabilitación",
      description: "Programas especializados de rescate y rehabilitación de animales en situación de vulnerabilidad."
    },
    {
      title: "Control Humanitario",
      description: "Control humanitario de poblaciones mediante esterilización y programas de salud preventiva."
    },
    {
      title: "Educación y Sensibilización",
      description: "Programas educativos para promover la tenencia responsable y el respeto hacia los animales."
    },
    {
      title: "Políticas Públicas",
      description: "Incidencia en políticas públicas para mejorar la legislación de protección animal."
    },
    {
      title: "Voluntariado",
      description: "Programas de voluntariado que permiten a la comunidad participar activamente en nuestra misión."
    },
    {
      title: "Clínicas Veterinarias",
      description: "Atención veterinaria de bajo costo para facilitar el acceso a servicios de salud animal."
    }
  ];

  const ubicaciones = [
    {
      nombre: "Clínica Quito",
      direccion: "Antonio de Ulloa N34–85 y Rumipamba",
      icon: <Stethoscope className="w-5 h-5 text-green-600" />
    },
    {
      nombre: "Clínica Tumbaco",
      direccion: "Parque de Tolagasí, Vía Cununyacu",
      icon: <Stethoscope className="w-5 h-5 text-green-600" />
    },
    {
      nombre: "Centro de Adopciones Alangasí",
      direccion: "Guayacundo e Ilaló, Vía El Tingo–La Merced",
      icon: <Home className="w-5 h-5 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre PAE</h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto">
            Protección Animal Ecuador, más de 40 años promoviendo el bienestar animal en el país.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid principal con Historia/Misión/Visión y Principios */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Columna izquierda: Historia, Misión, Visión */}
          <div className="space-y-8">
            {/* Historia */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Historia</h2>
              <p className="text-gray-700 leading-relaxed">
                La Fundación Protección Animal Ecuador (PAE) nació en Quito el 3 de agosto de 1984 como asociación y el 2 de marzo de 2005 se transformó en fundación mediante el Acuerdo Ministerial #4883. Es una organización apolítica, arreligiosa, sin fines de lucro y actualmente está regulada por el Ministerio de Salud Pública del Ecuador.
              </p>
            </Card>

            {/* Misión */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misión</h2>
              <p className="text-gray-700 leading-relaxed">
                Promovemos la protección y el bienestar de los animales mediante acciones directas y la concienciación de la comunidad en el respeto que merecen todas las especies.
              </p>
            </Card>

            {/* Visión */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Visión</h2>
              <p className="text-gray-700 leading-relaxed">
                Ser una organización autosustentable, reconocida como referente nacional en bienestar animal, responsable del cambio en la relación humano–animal en Ecuador.
              </p>
            </Card>
          </div>

          {/* Columna derecha: Principios */}
          <div>
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Principios – Cinco Libertades</h2>
              <div className="space-y-6">
                {principios.map((principio, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {principio.icon}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {principio.title}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Qué hacemos */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Qué Hacemos</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              PAE trabaja en programas de rescate, rehabilitación y adopciones; control humanitario de poblaciones; educación y sensibilización; incidencia en políticas públicas; voluntariado; y atención en clínicas veterinarias de bajo costo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {servicio.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {servicio.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Presencia */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Presencia</h2>
            <p className="text-xl text-gray-600">
              Encuentra nuestras instalaciones en diferentes ubicaciones estratégicas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ubicaciones.map((ubicacion, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {ubicacion.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {ubicacion.nombre}
                </h3>
                <div className="flex items-center justify-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <p className="text-sm">
                    {ubicacion.direccion}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Súmate al Cambio</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Adopta, dona, apadrina o participa como voluntario/a. Cada acción cuenta para transformar vidas y promover la convivencia responsable.
          </p>
          <div className="flex justify-center">
            <Button
  size="lg"
  className="rounded-full border-2 border-white text-white bg-transparent
             px-10 py-3 font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.25)]
             hover:bg-orange-500 hover:border-orange-500 hover:text-white
             transition-colors duration-200
             focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/60"
>
  Adoptar Ahora
</Button>




          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;