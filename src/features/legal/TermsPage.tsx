import React from 'react';
import { FileText, Scale, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Scale className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-primary-100 text-center">
            Última actualización: 23 de noviembre de 2025
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introducción */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <FileText className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introducción</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bienvenido a la plataforma digital de <strong>Huellitas Quiteñas</strong>, 
                operada por Protección Animal Ecuador (PAE). Al acceder y utilizar nuestro 
                sistema de adopción de animales, usted acepta estar sujeto a estos términos 
                y condiciones.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Por favor, lea cuidadosamente estos términos antes de utilizar nuestros servicios. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra plataforma.
              </p>
            </div>
          </div>
        </Card>

        {/* 1. Definiciones */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Definiciones</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <strong className="text-gray-900">Plataforma:</strong> Refiere al sistema digital 
              "Huellitas Quiteñas" accesible a través de la URL correspondiente.
            </div>
            <div>
              <strong className="text-gray-900">Usuario:</strong> Toda persona que accede y 
              utiliza la plataforma, incluyendo adoptantes, fundaciones y clínicas veterinarias.
            </div>
            <div>
              <strong className="text-gray-900">Adoptante:</strong> Usuario registrado interesado 
              en adoptar un animal a través de la plataforma.
            </div>
            <div>
              <strong className="text-gray-900">Fundación:</strong> Organización sin fines de lucro 
              que gestiona animales disponibles para adopción.
            </div>
            <div>
              <strong className="text-gray-900">Clínica:</strong> Establecimiento veterinario 
              asociado que proporciona servicios de salud animal.
            </div>
            <div>
              <strong className="text-gray-900">Animal:</strong> Perro o canino disponible para 
              adopción a través de la plataforma.
            </div>
          </div>
        </Card>

        {/* 2. Aceptación de los Términos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Aceptación de los Términos</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Al registrarse en la plataforma y marcar la casilla de aceptación, usted reconoce 
              que ha leído, entendido y acepta estar vinculado por estos Términos y Condiciones, 
              así como por nuestra Política de Privacidad.
            </p>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán efectivos inmediatamente después de su publicación en la plataforma. 
              El uso continuado de nuestros servicios después de dichos cambios constituye 
              su aceptación de los nuevos términos.
            </p>
          </div>
        </Card>

        {/* 3. Registro y Cuenta de Usuario */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Registro y Cuenta de Usuario</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">3.1 Requisitos de Registro</h3>
            <p className="text-gray-700 leading-relaxed">
              Para utilizar ciertas funciones de la plataforma, debe crear una cuenta proporcionando 
              información precisa, completa y actualizada, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Nombre y apellido completos</li>
              <li>Dirección de correo electrónico válida</li>
              <li>Número de teléfono de contacto</li>
              <li>Dirección física completa</li>
              <li>Contraseña segura</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">3.2 Responsabilidad de la Cuenta</h3>
            <p className="text-gray-700 leading-relaxed">
              Usted es responsable de mantener la confidencialidad de su contraseña y de todas 
              las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente de 
              cualquier uso no autorizado de su cuenta.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">3.3 Veracidad de la Información</h3>
            <p className="text-gray-700 leading-relaxed">
              Toda la información proporcionada debe ser verdadera y verificable. Información 
              falsa o engañosa puede resultar en la suspensión o terminación de su cuenta.
            </p>
          </div>
        </Card>

        {/* 4. Proceso de Adopción */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Proceso de Adopción</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">4.1 Solicitud de Adopción</h3>
            <p className="text-gray-700 leading-relaxed">
              Los usuarios interesados en adoptar deben completar un formulario de solicitud 
              detallado que incluye:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Información personal y de contacto</li>
              <li>Características del hogar y situación de vivienda</li>
              <li>Experiencia previa con animales</li>
              <li>Motivación para la adopción</li>
              <li>Documentos de respaldo (identificación, comprobante de domicilio)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">4.2 Evaluación</h3>
            <p className="text-gray-700 leading-relaxed">
              La fundación se reserva el derecho de evaluar cada solicitud y realizar visitas 
              domiciliarias cuando sea necesario. La aprobación de una adopción está sujeta 
              a criterios de bienestar animal.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">4.3 Compromiso del Adoptante</h3>
            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-semibold mb-2">Al adoptar, usted se compromete a:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Proporcionar alimento, agua y refugio adecuados</li>
                    <li>Brindar atención veterinaria regular y de emergencia</li>
                    <li>Mantener al animal en condiciones higiénicas</li>
                    <li>No abandonar, maltratar o descuidar al animal</li>
                    <li>Notificar a la fundación en caso de cambio de domicilio</li>
                    <li>Permitir visitas de seguimiento post-adopción</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">4.4 Período de Adaptación</h3>
            <p className="text-gray-700 leading-relaxed">
              Se establece un período de adaptación de 30 días. Durante este tiempo, si surgen 
              problemas de compatibilidad insuperables, el adoptante puede devolver al animal 
              a la fundación sin penalización.
            </p>
          </div>
        </Card>

        {/* 5. Sistema de Puntuación */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Sistema de Evaluación Automatizado</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La plataforma utiliza un algoritmo de puntuación para evaluar la compatibilidad 
              entre adoptantes y animales. Este sistema considera factores como:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Características del hogar y espacio disponible</li>
              <li>Experiencia previa con animales</li>
              <li>Disponibilidad de tiempo</li>
              <li>Situación económica para cubrir gastos veterinarios</li>
              <li>Composición familiar (niños, otros animales)</li>
            </ul>
            <p className="mt-4">
              <strong>Importante:</strong> El puntaje es orientativo. La decisión final de 
              adopción la toma la fundación basándose en su criterio profesional y el bienestar 
              del animal.
            </p>
          </div>
        </Card>

        {/* 6. Uso Aceptable */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Uso Aceptable de la Plataforma</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">6.1 Conductas Prohibidas</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-semibold mb-2">Está estrictamente prohibido:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Proporcionar información falsa o engañosa</li>
                    <li>Utilizar la plataforma para fines comerciales no autorizados</li>
                    <li>Intentar acceder a cuentas de otros usuarios</li>
                    <li>Cargar contenido ofensivo, ilegal o inapropiado</li>
                    <li>Interferir con el funcionamiento de la plataforma</li>
                    <li>Solicitar adopciones con fines de maltrato animal</li>
                    <li>Realizar múltiples solicitudes fraudulentas</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">6.2 Consecuencias</h3>
            <p className="text-gray-700 leading-relaxed">
              El incumplimiento de estas normas puede resultar en:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Suspensión temporal de la cuenta</li>
              <li>Terminación permanente de la cuenta</li>
              <li>Prohibición de futuras adopciones</li>
              <li>Acciones legales cuando corresponda</li>
            </ul>
          </div>
        </Card>

        {/* 7. Propiedad Intelectual */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Propiedad Intelectual</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Todo el contenido de la plataforma, incluyendo texto, gráficos, logotipos, imágenes, 
              software y diseño, es propiedad de Protección Animal Ecuador o sus licenciantes y 
              está protegido por las leyes de propiedad intelectual ecuatorianas e internacionales.
            </p>
            <p>
              Los usuarios conservan los derechos sobre el contenido que suben (fotografías, 
              documentos), pero otorgan a PAE una licencia no exclusiva para usar dicho contenido 
              dentro de la plataforma y para fines promocionales relacionados con la adopción animal.
            </p>
          </div>
        </Card>

        {/* 8. Limitación de Responsabilidad */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitación de Responsabilidad</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos 
              que el servicio será ininterrumpido, seguro o libre de errores.
            </p>
            <p>
              <strong>Protección Animal Ecuador no será responsable por:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Daños directos, indirectos o consecuentes del uso de la plataforma</li>
              <li>Pérdida de datos o información</li>
              <li>Comportamiento de los animales adoptados después de la entrega</li>
              <li>Incompatibilidades entre adoptantes y animales fuera del período de adaptación</li>
              <li>Problemas de salud del animal no detectados durante el proceso</li>
            </ul>
            <p className="mt-4">
              Sin embargo, la fundación se compromete a realizar evaluaciones veterinarias previas 
              y proporcionar toda la información disponible sobre el estado de salud y comportamiento 
              del animal.
            </p>
          </div>
        </Card>

        {/* 9. Protección de Datos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Protección de Datos Personales</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              El tratamiento de sus datos personales está regulado por nuestra Política de Privacidad, 
              que forma parte integral de estos términos. Cumplimos con la Ley Orgánica de Protección 
              de Datos Personales del Ecuador.
            </p>
            <p>
              Al utilizar la plataforma, usted consiente el tratamiento de sus datos personales 
              conforme a nuestra Política de Privacidad.
            </p>
          </div>
        </Card>

        {/* 10. Resolución de Conflictos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Resolución de Conflictos</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              En caso de disputas relacionadas con el uso de la plataforma o el proceso de adopción, 
              las partes se comprometen a intentar resolver el conflicto mediante diálogo directo 
              y mediación.
            </p>
            <p>
              Si no se alcanza una solución, cualquier controversia se someterá a la jurisdicción 
              de los tribunales competentes de Quito, Ecuador, renunciando a cualquier otro fuero 
              que pudiera corresponder.
            </p>
          </div>
        </Card>

        {/* 11. Modificaciones del Servicio */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Modificaciones del Servicio</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto 
              de la plataforma en cualquier momento, con o sin previo aviso. No seremos responsables 
              ante usted ni ante terceros por cualquier modificación, suspensión o discontinuación 
              del servicio.
            </p>
          </div>
        </Card>

        {/* 12. Ley Aplicable */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Ley Aplicable</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la República del Ecuador, 
              incluyendo pero no limitándose a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Código Orgánico Integral Penal (artículos sobre maltrato animal)</li>
              <li>Ley Orgánica de Protección de Datos Personales</li>
              <li>Normativas municipales de tenencia responsable de animales</li>
            </ul>
          </div>
        </Card>

        {/* Contacto */}
        <Card className="p-8 bg-primary-50 border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacto</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> contacto@huellitasquito.ec</p>
            <p><strong>Teléfono:</strong> +593 960152853</p>
            <p><strong>Dirección:</strong> Quito, Ecuador</p>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            Al hacer clic en "Acepto los términos y condiciones" durante el registro, 
            usted reconoce que ha leído y comprendido estos términos y acepta estar vinculado por ellos.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
