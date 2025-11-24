import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Dog,
  Heart,
  FileCheck,
  Home,
  DollarSign,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface FAQItem {
  question: string;
  answer: string | string[];
  category: string;
}

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todas', icon: <HelpCircle className="h-5 w-5" /> },
    { id: 'proceso', name: 'Proceso de Adopción', icon: <FileCheck className="h-5 w-5" /> },
    { id: 'animales', name: 'Sobre los Animales', icon: <Dog className="h-5 w-5" /> },
    { id: 'requisitos', name: 'Requisitos', icon: <Home className="h-5 w-5" /> },
    { id: 'costos', name: 'Costos', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'postadopcion', name: 'Post-Adopción', icon: <Heart className="h-5 w-5" /> }
  ];

  const faqs: FAQItem[] = [
    // Proceso de Adopción
    {
      category: 'proceso',
      question: '¿Cuánto tiempo toma el proceso de adopción?',
      answer: 'El proceso completo toma aproximadamente 1-2 semanas desde la solicitud inicial hasta la adopción final. Esto incluye la evaluación de tu solicitud, visita domiciliaria (si es necesaria), y coordinación para conocer al animal. Trabajamos para que sea lo más ágil posible sin comprometer el bienestar del animal.'
    },
    {
      category: 'proceso',
      question: '¿Puedo adoptar si vivo en un departamento?',
      answer: [
        'Sí, puedes adoptar viviendo en un departamento. Sin embargo, consideramos varios factores:',
        '• El tamaño del departamento y el espacio disponible',
        '• El tamaño y nivel de energía del animal',
        '• Si el edificio permite mascotas',
        '• Tu compromiso con paseos regulares y ejercicio',
        'Muchos de nuestros animales se adaptan perfectamente a la vida en departamento.'
      ]
    },
    {
      category: 'proceso',
      question: '¿Qué pasa si mi solicitud es rechazada?',
      answer: 'Si tu solicitud es rechazada, te explicaremos los motivos. Esto no significa que no puedas adoptar en el futuro. Puedes trabajar en los aspectos señalados y volver a aplicar. También podríamos recomendarte un animal diferente que se ajuste mejor a tu situación.'
    },
    {
      category: 'proceso',
      question: '¿Realizan visitas domiciliarias?',
      answer: 'Sí, en algunos casos realizamos visitas domiciliarias para verificar que el entorno sea seguro y adecuado para el animal. No todas las adopciones requieren visita, depende de la evaluación inicial. La visita es una oportunidad para conocerte mejor y asesorarte sobre preparar tu hogar.'
    },
    {
      category: 'proceso',
      question: '¿Puedo conocer al animal antes de decidir?',
      answer: 'Por supuesto. Antes de finalizar la adopción, coordinamos una o varias visitas para que conozcas al animal, interactúes con él y veas si hay conexión. Si tienes otros animales, también podemos coordinar un encuentro supervisado para verificar compatibilidad.'
    },

    // Sobre los Animales
    {
      category: 'animales',
      question: '¿Todos los animales están vacunados y esterilizados?',
      answer: 'Sí, todos nuestros animales salen con vacunas completas, desparasitación, esterilización (castración o esterilización según corresponda) y microchip de identificación. Te entregamos su cartilla de salud con todo el historial veterinario.'
    },
    {
      category: 'animales',
      question: '¿Tienen animales de raza pura?',
      answer: 'Nuestra fundación se enfoca principalmente en perros mestizos rescatados de situaciones de abandono o maltrato. Ocasionalmente recibimos animales de raza, pero la mayoría son mestizos maravillosos que merecen una segunda oportunidad. Los mestizos suelen ser más saludables y únicos.'
    },
    {
      category: 'animales',
      question: '¿Puedo adoptar un cachorro?',
      answer: 'La disponibilidad de cachorros varía. Los cachorros requieren mucho tiempo, dedicación y entrenamiento. Si solicitas adoptar un cachorro, evaluaremos cuidadosamente tu disponibilidad y experiencia. A menudo recomendamos adoptar perros adultos, que ya tienen personalidad definida y suelen ser más tranquilos.'
    },
    {
      category: 'animales',
      question: '¿Los animales tienen problemas de comportamiento?',
      answer: 'Cada animal es evaluado por nuestro equipo. Si un animal tiene necesidades especiales o comportamientos que requieren atención, te lo informaremos claramente. Muchos de nuestros animales provienen de situaciones difíciles pero con amor, paciencia y entrenamiento adecuado se adaptan perfectamente. Te proporcionamos información completa sobre cada animal.'
    },
    {
      category: 'animales',
      question: '¿Puedo ver el historial médico del animal?',
      answer: 'Sí, te proporcionamos el historial médico completo, incluyendo vacunas, desparasitaciones, esterilización, tratamientos recibidos y cualquier condición de salud. La transparencia es fundamental para nosotros.'
    },

    // Requisitos
    {
      category: 'requisitos',
      question: '¿Cuál es la edad mínima para adoptar?',
      answer: 'Debes ser mayor de 18 años para adoptar. La adopción es un compromiso legal que requiere mayoría de edad. Si eres menor, tus padres o tutores pueden adoptar a su nombre.'
    },
    {
      category: 'requisitos',
      question: '¿Necesito tener experiencia previa con animales?',
      answer: 'No es obligatorio, pero sí valoramos la experiencia previa. Si es tu primera vez, te proporcionaremos orientación adicional y podríamos recomendarte un animal más tranquilo y fácil de manejar. Lo importante es tu compromiso y disposición a aprender.'
    },
    {
      category: 'requisitos',
      question: '¿Puedo adoptar si tengo otros animales?',
      answer: 'Sí, puedes adoptar si tienes otros animales. Evaluaremos la compatibilidad y, si es necesario, coordinaremos un encuentro supervisado entre los animales. Es importante que tus mascotas actuales estén esterilizadas y al día con vacunas.'
    },
    {
      category: 'requisitos',
      question: '¿Puedo adoptar si tengo niños pequeños?',
      answer: 'Sí, muchas familias con niños adoptan exitosamente. Consideramos la edad de los niños y te recomendaremos animales con temperamento adecuado para convivir con ellos. También brindamos orientación sobre cómo supervisar las interacciones entre niños y mascotas.'
    },
    {
      category: 'requisitos',
      question: '¿Qué documentos necesito para adoptar?',
      answer: [
        'Los documentos básicos son:',
        '• Cédula de identidad o documento de identificación',
        '• Comprobante de domicilio reciente',
        '• Fotografías de tu hogar',
        '• Autorización del propietario si rentas',
        '• Referencias personales (opcional)',
        'Todos los documentos pueden ser digitales.'
      ]
    },

    // Costos
    {
      category: 'costos',
      question: '¿Cuánto cuesta adoptar?',
      answer: 'La adopción tiene un costo simbólico que varía según el tamaño y edad del animal (generalmente entre $50-$150). Este monto ayuda a cubrir vacunas, esterilización, microchip, desparasitación y atención veterinaria. Es mucho menor que el costo real de estos servicios en clínicas privadas.'
    },
    {
      category: 'costos',
      question: '¿Qué incluye el costo de adopción?',
      answer: [
        'El costo de adopción incluye:',
        '• Vacunas completas (múltiples, rabia, etc.)',
        '• Esterilización quirúrgica',
        '• Microchip de identificación',
        '• Desparasitación interna y externa',
        '• Exámenes veterinarios básicos',
        '• Cartilla de salud',
        'El animal sale 100% listo para comenzar su nueva vida contigo.'
      ]
    },
    {
      category: 'costos',
      question: '¿Cuánto gastaré mensualmente en mi mascota?',
      answer: 'El costo mensual varía según el tamaño del animal, pero estima: alimentación ($20-$60), productos de higiene ($10-$20), y un fondo para emergencias veterinarias. Anualmente debes considerar vacunas de refuerzo ($30-$50) y consultas preventivas. Es importante estar preparado económicamente.'
    },
    {
      category: 'costos',
      question: '¿Ofrecen planes de pago para la adopción?',
      answer: 'Normalmente el pago se realiza en una sola exhibición al momento de la adopción. Sin embargo, si tienes dificultades económicas pero somos la mejor opción para el animal, podríamos considerar facilidades. Contáctanos para discutir tu situación.'
    },

    // Post-Adopción
    {
      category: 'postadopcion',
      question: '¿Qué pasa después de adoptar?',
      answer: 'Después de la adopción, iniciamos un período de seguimiento. Te contactaremos para saber cómo va la adaptación y responder dudas. Realizamos visitas de seguimiento periódicas durante el primer año. Siempre estamos disponibles si necesitas asesoría sobre cuidados o comportamiento.'
    },
    {
      category: 'postadopcion',
      question: '¿Puedo devolver al animal si no funciona?',
      answer: 'Durante el período de adaptación de 30 días, si surgen problemas insuperables de compatibilidad, puedes devolver al animal sin penalización. Después de este período, si hay circunstancias extremas, contáctanos. Nunca debes abandonar al animal; siempre podemos ayudarte a encontrar una solución.'
    },
    {
      category: 'postadopcion',
      question: '¿Ofrecen apoyo veterinario después de adoptar?',
      answer: 'Ofrecemos asesoría gratuita y descuentos en nuestras clínicas veterinarias asociadas para adoptantes. También puedes consultarnos sobre cualquier duda de salud o comportamiento. Tenemos convenios con veterinarios que pueden ofrecerte tarifas preferenciales.'
    },
    {
      category: 'postadopcion',
      question: '¿Puedo contactarlos si tengo problemas de comportamiento?',
      answer: 'Por supuesto. Contamos con especialistas en comportamiento animal que pueden asesorarte. Muchos "problemas" son normales durante la adaptación y tienen solución con las técnicas correctas. No dudes en contactarnos, preferimos ayudarte a que consideres devolver al animal.'
    },
    {
      category: 'postadopcion',
      question: '¿Debo informarles si me mudo?',
      answer: 'Sí, es importante que nos informes si cambias de domicilio. Esto nos permite mantener actualizado tu registro y saber dónde está el animal. Si el nuevo lugar no permite mascotas, contáctanos antes de mudarte para buscar soluciones juntos.'
    },
    {
      category: 'postadopcion',
      question: '¿Puedo adoptar más animales después?',
      answer: '¡Por supuesto! Si tu primera adopción fue exitosa y tienes espacio y recursos, puedes adoptar más animales. De hecho, muchos adoptantes regresan por un segundo o tercer compañero. Tu experiencia previa será un punto a favor en futuras solicitudes.'
    },

    // Generales
    {
      category: 'proceso',
      question: '¿Cómo funciona el sistema de puntuación?',
      answer: 'Utilizamos un algoritmo que evalúa la compatibilidad entre adoptantes y animales considerando: espacio en tu hogar, experiencia, disponibilidad de tiempo, composición familiar, otros animales y recursos económicos. El puntaje es orientativo; la decisión final siempre la toma un evaluador humano considerando aspectos cualitativos adicionales.'
    },
    {
      category: 'proceso',
      question: '¿Puedo cambiarme de animal durante el proceso?',
      answer: 'Sí, durante el proceso de evaluación puedes cambiar tu preferencia si encuentras otro animal que se ajuste mejor a ti. Sin embargo, una vez iniciado el proceso específico con un animal (visitas, coordinaciones), pedimos compromiso. Es mejor estar seguro antes de avanzar.'
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <HelpCircle className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Encuentra respuestas a las dudas más comunes sobre el proceso de adopción
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categorías */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Selecciona una categoría
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold text-primary-600">{filteredFAQs.length}</span> preguntas
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <div className="pl-12 text-gray-700 leading-relaxed">
                    {Array.isArray(faq.answer) ? (
                      <div>
                        <p className="mb-2">{faq.answer[0]}</p>
                        <ul className="space-y-1 ml-4">
                          {faq.answer.slice(1).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contacto */}
        <Card className="p-8 bg-primary-50 border-primary-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="text-gray-700">
              Nuestro equipo está disponible para ayudarte con cualquier duda adicional
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Phone className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Llámanos</div>
                <div className="font-semibold text-lg">+593 960152853</div>
                <div className="text-xs text-gray-500">Lun - Vie: 9:00 - 18:00</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Escríbenos</div>
                <div className="font-semibold text-lg">contacto@huellitasquito.ec</div>
                <div className="text-xs text-gray-500">Respuesta en 24-48 horas</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Clock className="inline h-4 w-4 mr-1" />
              También puedes agendar una cita presencial en nuestras oficinas
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
