import React from 'react';
import { 
  ClipboardCheck, 
  FileSearch, 
  Home as HomeIcon, 
  UserCheck, 
  Heart, 
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ProcessPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Registro en la Plataforma",
      description: "Crea tu cuenta proporcionando información básica: nombre, email, teléfono y dirección.",
      duration: "5 minutos",
      color: "bg-blue-500",
      details: [
        "Completa el formulario de registro",
        "Verifica tu correo electrónico",
        "Completa tu perfil con información adicional"
      ]
    },
    {
      number: 2,
      icon: <FileSearch className="w-8 h-8" />,
      title: "Explora y Elige",
      description: "Navega por nuestro galeria de caninos disponibles y encuentra tu compañero ideal.",
      duration: "Variable",
      color: "bg-green-500",
      details: [
        "Filtra por tamaño, edad, nivel de energía",
        "Lee las historias y características de cada animal",
        "Guarda tus favoritos para compararlos"
      ]
    },
    {
      number: 3,
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Solicitud de Adopción",
      description: "Completa un formulario detallado sobre tu hogar, experiencia y motivación para adoptar.",
      duration: "15-20 minutos",
      color: "bg-yellow-500",
      details: [
        "Información sobre tu vivienda y espacio",
        "Experiencia previa con animales",
        "Composición familiar y estilo de vida",
        "Cargar documentos de respaldo"
      ]
    },
    {
      number: 4,
      icon: <UserCheck className="w-8 h-8" />,
      title: "Evaluación",
      description: "Nuestro sistema y equipo evalúan tu solicitud para asegurar la mejor compatibilidad.",
      duration: "2-3 días hábiles",
      color: "bg-purple-500",
      details: [
        "Sistema de puntuación automatizado",
        "Revisión por el equipo de la fundación",
        "Verificación de referencias si es necesario",
        "Posible visita domiciliaria"
      ]
    },
    {
      number: 5,
      icon: <HomeIcon className="w-8 h-8" />,
      title: "Conocer al Animal",
      description: "Si tu solicitud es aprobada, coordinaremos una visita para que conozcas a tu futuro compañero.",
      duration: "1-2 días",
      color: "bg-orange-500",
      details: [
        "Cita en nuestras instalaciones o lugar acordado",
        "Interacción supervisada con el animal",
        "Orientación sobre cuidados específicos",
        "Resolución de dudas con veterinarios"
      ]
    },
    {
      number: 6,
      icon: <Heart className="w-8 h-8" />,
      title: "Adopción y Seguimiento",
      description: "¡Felicidades! Firma el contrato de adopción y lleva a tu nuevo amigo a casa.",
      duration: "Continuo",
      color: "bg-red-500",
      details: [
        "Firma del contrato de adopción",
        "Entrega del historial médico y cartilla de vacunación",
        "Período de adaptación de 30 días",
        "Visitas de seguimiento periódicas"
      ]
    }
  ];

  const requirements = [
    {
      title: "Ser mayor de 18 años",
      description: "La adopción es una responsabilidad legal que requiere mayoría de edad."
    },
    {
      title: "Vivienda estable",
      description: "Contar con un lugar seguro y apropiado para el animal."
    },
    {
      title: "Compromiso a largo plazo",
      description: "Los perros pueden vivir 10-15 años. ¿Estás listo para ese compromiso?"
    },
    {
      title: "Recursos económicos",
      description: "Capacidad para cubrir alimentación, atención veterinaria y cuidados."
    },
    {
      title: "Tiempo disponible",
      description: "Los animales necesitan atención, ejercicio y compañía diaria."
    },
    {
      title: "Permiso del propietario",
      description: "Si rentas, debes tener autorización para tener mascotas."
    }
  ];

  const documents = [
    "Cédula de identidad o documento de identificación",
    "Comprobante de domicilio reciente",
    "Fotografías de tu hogar (espacio donde vivirá el animal)",
    "Autorización del propietario (si aplica)",
    "Referencias personales (opcional)"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Proceso de Adopción
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Tu camino hacia una adopción responsable y exitosa
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introducción */}
        <Card className="p-8 mb-12">
          <div className="flex items-start gap-4">
            <Heart className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Un Proceso Pensado para el Bienestar Animal
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En Huellitas Quiteñas, creemos que cada adopción debe ser cuidadosamente evaluada 
                para garantizar el bienestar tanto del animal como del adoptante. Nuestro proceso 
                está diseñado para encontrar el hogar perfecto para cada uno de nuestros rescatados.
              </p>
              <p className="text-gray-700 leading-relaxed">
                El proceso completo toma aproximadamente <strong>1-2 semanas</strong> desde la 
                solicitud hasta la adopción final. Sabemos que la espera puede ser ansiosa, pero 
                cada paso es crucial para asegurar una adopción exitosa y duradera.
              </p>
            </div>
          </div>
        </Card>

        {/* Pasos del Proceso */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Pasos del Proceso
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Número y Color */}
                  <div className={`${step.color} text-white p-8 md:w-48 flex-shrink-0 flex flex-col items-center justify-center`}>
                    <div className="mb-4">
                      {step.icon}
                    </div>
                    <div className="text-6xl font-bold mb-2">
                      {step.number}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {step.duration}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-8 flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Requisitos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Requisitos para Adoptar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {req.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {req.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Documentos Necesarios */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Documentos Necesarios
          </h2>
          <p className="text-gray-700 mb-6">
            Para agilizar tu solicitud, ten a mano los siguientes documentos:
          </p>
          <ul className="space-y-3">
            {documents.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary-600" />
                </div>
                <span className="text-gray-700 pt-1">{doc}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Sistema de Puntuación */}
        <Card className="p-8 mb-12 bg-primary-50 border-primary-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sistema de Evaluación Automatizado
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nuestra plataforma utiliza un <strong>algoritmo de compatibilidad</strong> que 
                evalúa múltiples factores para determinar qué animales son más adecuados para tu 
                situación. Este sistema considera:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    Espacio disponible en tu hogar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    Experiencia previa con animales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    Disponibilidad de tiempo
                  </li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    Composición familiar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    Otros animales en el hogar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary-600" />
                    Capacidad económica
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 bg-white p-4 rounded-lg">
                <strong>Nota importante:</strong> El puntaje del sistema es orientativo. 
                La decisión final siempre la toma un evaluador humano de nuestra fundación, 
                quien considera aspectos adicionales y el bienestar integral del animal.
              </p>
            </div>
          </div>
        </Card>

        {/* Período de Adaptación */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Período de Adaptación
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Entendemos que la adaptación es un proceso para ambas partes. Por eso, ofrecemos 
            un <strong>período de adaptación de 30 días</strong> en el cual:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Puedes contactarnos para resolver dudas sobre cuidados y comportamiento
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Realizaremos seguimiento telefónico y/o visitas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Si surgen problemas insuperables de compatibilidad, puedes devolver al animal sin penalización
              </span>
            </li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-gray-700">
              <strong>Compromiso post-adopción:</strong> Después del período de adaptación, 
              te pedimos que nos mantengas informados sobre el bienestar del animal y permitas 
              visitas de seguimiento ocasionales durante el primer año.
            </p>
          </div>
        </Card>

        {/* Costos */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Costos de Adopción
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            La adopción en Huellitas Quiteñas tiene un costo simbólico que ayuda a cubrir:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" />
                Vacunas completas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" />
                Desparasitación interna y externa
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" />
                Esterilización (castración o esterilización)
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" />
                Microchip de identificación
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" />
                Exámenes veterinarios básicos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary-600" />
                Atención y cuidados durante su estancia
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            El monto varía según el tamaño y edad del animal. Te informaremos el costo específico 
            durante el proceso de adopción. ¡Todos nuestros animales salen listos para comenzar 
            su nueva vida contigo!
          </p>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Inicia tu proceso de adopción hoy y encuentra a tu compañero perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="!bg-white !text-primary-700 hover:!bg-gray-100 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Crear Cuenta
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/catalog')}
              className="!bg-white !text-primary-700 hover:!bg-gray-100 font-semibold shadow-lg hover:shadow-xl transition-all border-2 border-white"
            >
              Ver Animales Disponibles
            </Button>
          </div>
        </div>

        {/* Contacto */}
        <Card className="p-8 mt-12 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            ¿Tienes Dudas sobre el Proceso?
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Nuestro equipo está aquí para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-primary-100 p-3 rounded-full">
                <Phone className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Llámanos</div>
                <div className="font-semibold">+593 960152853</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-primary-100 p-3 rounded-full">
                <Mail className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Escríbenos</div>
                <div className="font-semibold">contacto@huellitasquito.ec</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProcessPage;
