import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Mail, FileCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Política de Privacidad
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
            <Lock className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introducción</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                En <strong>Huellitas Quiteñas</strong>, operado por Protección Animal Ecuador (PAE), 
                nos comprometemos a proteger su privacidad y sus datos personales. Esta Política de 
                Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cumplimos con la Ley Orgánica de Protección de Datos Personales del Ecuador y 
                demás normativas aplicables en materia de protección de datos.
              </p>
            </div>
          </div>
        </Card>

        {/* 1. Responsable del Tratamiento */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Responsable del Tratamiento de Datos</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong className="text-gray-900">Organización:</strong> Protección Animal Ecuador (PAE)</p>
            <p><strong className="text-gray-900">Plataforma:</strong> Huellitas Quiteñas</p>
            <p><strong className="text-gray-900">Ubicación:</strong> Quito, Ecuador</p>
            <p><strong className="text-gray-900">Email de contacto:</strong> contacto@huellitasquito.ec</p>
            <p><strong className="text-gray-900">Teléfono:</strong> +593 960152853</p>
          </div>
        </Card>

        {/* 2. Datos que Recopilamos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Información que Recopilamos</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary-600" />
                2.1 Datos de Registro
              </h3>
              <p className="text-gray-700 mb-3">
                Cuando crea una cuenta en nuestra plataforma, recopilamos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Datos de identificación:</strong> Nombre completo, apellido</li>
                <li><strong>Datos de contacto:</strong> Dirección de correo electrónico, número de teléfono</li>
                <li><strong>Datos de ubicación:</strong> Dirección física completa</li>
                <li><strong>Credenciales:</strong> Contraseña cifrada (no almacenamos contraseñas en texto plano)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary-600" />
                2.2 Datos de Solicitudes de Adopción
              </h3>
              <p className="text-gray-700 mb-3">
                Cuando solicita adoptar un animal, recopilamos información adicional:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Información del hogar:</strong> Tipo de vivienda, espacio disponible</li>
                <li><strong>Situación familiar:</strong> Número de personas en el hogar, presencia de niños</li>
                <li><strong>Experiencia con animales:</strong> Historial de tenencia de mascotas</li>
                <li><strong>Motivación:</strong> Razones para adoptar</li>
                <li><strong>Documentos:</strong> Fotografías de identificación, comprobante de domicilio</li>
                <li><strong>Preferencias:</strong> Tamaño, nivel de energía, comportamiento del animal</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary-600" />
                2.3 Datos de Uso de la Plataforma
              </h3>
              <p className="text-gray-700 mb-3">
                Automáticamente recopilamos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Dirección IP</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Fecha y hora de acceso</li>
                <li>Sistema operativo</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2.4 Cookies y Tecnologías Similares</h3>
              <p className="text-gray-700 mb-3">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Mantener su sesión activa</li>
                <li>Recordar sus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
                <li>Mejorar la experiencia del usuario</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Puede gestionar las cookies a través de la configuración de su navegador.
              </p>
            </div>
          </div>
        </Card>

        {/* 3. Finalidad del Tratamiento */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. ¿Para qué Usamos sus Datos?</h2>
          <div className="space-y-4">
            <div className="bg-primary-50 border-l-4 border-primary-500 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Finalidades Principales:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Gestión de cuentas:</strong> Crear, administrar y autenticar su cuenta de usuario</li>
                <li><strong>Proceso de adopción:</strong> Evaluar solicitudes, facilitar comunicación entre adoptantes y fundaciones</li>
                <li><strong>Sistema de puntuación:</strong> Analizar compatibilidad entre adoptantes y animales mediante algoritmo automatizado</li>
                <li><strong>Comunicaciones:</strong> Enviar notificaciones sobre el estado de solicitudes, actualizaciones del sistema</li>
                <li><strong>Seguimiento post-adopción:</strong> Verificar el bienestar del animal adoptado</li>
                <li><strong>Mejora del servicio:</strong> Analizar tendencias y mejorar la plataforma</li>
                <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
                <li><strong>Seguridad:</strong> Detectar, prevenir y responder a fraudes, abusos o actividades ilegales</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 4. Base Legal */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Base Legal del Tratamiento</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              El tratamiento de sus datos personales se fundamenta en:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Consentimiento:</strong> Al registrarse y aceptar estos términos, usted consiente el tratamiento de sus datos</li>
              <li><strong>Ejecución de contrato:</strong> Necesario para proporcionar los servicios de la plataforma</li>
              <li><strong>Interés legítimo:</strong> Mejora de servicios, prevención de fraudes</li>
              <li><strong>Cumplimiento legal:</strong> Obligaciones derivadas de la legislación ecuatoriana</li>
            </ul>
          </div>
        </Card>

        {/* 5. Compartir Información */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Compartir y Divulgar Información</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">5.1 Con Quién Compartimos sus Datos</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Podemos compartir su información con:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Fundaciones asociadas:</strong> Para procesar su solicitud de adopción</li>
              <li><strong>Clínicas veterinarias:</strong> Para coordinar servicios de salud animal</li>
              <li><strong>Proveedores de servicios:</strong> Hosting, servicios en la nube (bajo acuerdos de confidencialidad)</li>
              <li><strong>Autoridades competentes:</strong> Cuando sea requerido por ley</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">5.2 Lo que NO hacemos</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>NO vendemos sus datos personales a terceros</li>
                <li>NO compartimos sus datos con fines publicitarios</li>
                <li>NO transferimos datos fuera de Ecuador sin su consentimiento explícito</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 6. Seguridad de Datos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Seguridad de la Información</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Cifrado:</strong> Contraseñas cifradas con bcrypt, transmisiones seguras HTTPS</li>
                  <li><strong>Control de acceso:</strong> Autenticación mediante JWT (JSON Web Tokens)</li>
                  <li><strong>Validación:</strong> Validaciones robustas en frontend y backend</li>
                  <li><strong>Almacenamiento seguro:</strong> Bases de datos con controles de acceso</li>
                  <li><strong>Monitoreo:</strong> Registro de actividades sospechosas</li>
                  <li><strong>Actualizaciones:</strong> Mantenimiento regular de seguridad</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Sin embargo, ningún método de transmisión por Internet es 100% seguro. 
                  Le recomendamos usar contraseñas fuertes y no compartir sus credenciales.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 7. Retención de Datos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. ¿Cuánto Tiempo Conservamos sus Datos?</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Conservamos sus datos personales durante el tiempo necesario para cumplir con las 
              finalidades descritas, a menos que la ley requiera o permita un período de retención más largo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Cuentas activas:</strong> Mientras su cuenta permanezca activa</li>
              <li><strong>Solicitudes de adopción:</strong> 5 años desde la fecha de solicitud</li>
              <li><strong>Adopciones completadas:</strong> 10 años para seguimiento y registros</li>
              <li><strong>Datos de comunicación:</strong> 2 años</li>
              <li><strong>Logs del sistema:</strong> 1 año</li>
            </ul>
            <p className="mt-4">
              Después de estos períodos, los datos se eliminan de forma segura o se anonimizan 
              para análisis estadísticos.
            </p>
          </div>
        </Card>

        {/* 8. Sus Derechos */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Sus Derechos como Titular de Datos</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  De acuerdo con la legislación ecuatoriana, usted tiene derecho a:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Acceso</h3>
                <p className="text-sm text-gray-700">Conocer qué datos personales tenemos sobre usted</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Rectificación</h3>
                <p className="text-sm text-gray-700">Corregir datos inexactos o incompletos</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Eliminación</h3>
                <p className="text-sm text-gray-700">Solicitar la eliminación de sus datos</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Oposición</h3>
                <p className="text-sm text-gray-700">Oponerse al tratamiento de sus datos</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Portabilidad</h3>
                <p className="text-sm text-gray-700">Recibir sus datos en formato estructurado</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Revocación</h3>
                <p className="text-sm text-gray-700">Retirar el consentimiento en cualquier momento</p>
              </div>
            </div>

            <div className="mt-6 bg-primary-50 border-l-4 border-primary-500 p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary-600" />
                ¿Cómo ejercer sus derechos?
              </h3>
              <p className="text-gray-700 mb-2">
                Para ejercer cualquiera de estos derechos, puede contactarnos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Por correo electrónico: contacto@huellitasquito.ec</li>
                <li>Por teléfono: +593 960152853</li>
                <li>A través de su perfil en la plataforma (sección "Mi Cuenta")</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Responderemos a su solicitud en un plazo máximo de 15 días hábiles.
              </p>
            </div>
          </div>
        </Card>

        {/* 9. Menores de Edad */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Menores de Edad</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Nuestra plataforma está dirigida a personas mayores de 18 años. No recopilamos 
              intencionalmente datos personales de menores de edad sin el consentimiento de 
              sus padres o tutores legales.
            </p>
            <p>
              Si un padre o tutor descubre que su hijo ha proporcionado información personal 
              sin su consentimiento, debe contactarnos inmediatamente para que podamos eliminar 
              dicha información.
            </p>
          </div>
        </Card>

        {/* 10. Decisiones Automatizadas */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Decisiones Automatizadas y Perfilado</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La plataforma utiliza un <strong>sistema de puntuación automatizado</strong> para 
              evaluar la compatibilidad entre adoptantes y animales. Este algoritmo analiza:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Características del hogar</li>
              <li>Experiencia previa con animales</li>
              <li>Disponibilidad de tiempo y recursos</li>
              <li>Composición familiar</li>
            </ul>
            <p className="mt-4">
              <strong>Importante:</strong> Este puntaje es orientativo y no constituye una decisión 
              automatizada final. La decisión de aprobación la toma siempre un evaluador humano 
              de la fundación, considerando el bienestar del animal y otros factores cualitativos.
            </p>
            <p className="mt-4">
              Usted tiene derecho a solicitar revisión humana de cualquier decisión automatizada 
              y a expresar su punto de vista.
            </p>
          </div>
        </Card>

        {/* 11. Transferencias Internacionales */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Transferencias Internacionales de Datos</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Actualmente, todos sus datos se almacenan y procesan en servidores ubicados en 
              Ecuador o en la región de Sudamérica.
            </p>
            <p>
              Si en el futuro necesitáramos transferir datos fuera de Ecuador, implementaremos 
              las salvaguardas apropiadas (cláusulas contractuales estándar, certificaciones de 
              privacidad) y solicitaremos su consentimiento explícito cuando sea requerido por ley.
            </p>
          </div>
        </Card>

        {/* 12. Cambios en la Política */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Cambios en esta Política</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios 
              en nuestras prácticas, servicios o requisitos legales.
            </p>
            <p>
              Le notificaremos sobre cambios significativos mediante:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Aviso destacado en la plataforma</li>
              <li>Correo electrónico a su dirección registrada</li>
              <li>Actualización de la fecha de "Última actualización" al inicio de este documento</li>
            </ul>
            <p className="mt-4">
              Le recomendamos revisar esta política periódicamente. El uso continuado de la 
              plataforma después de los cambios constituye su aceptación de la política actualizada.
            </p>
          </div>
        </Card>

        {/* Contacto y Quejas */}
        <Card className="p-8 bg-primary-50 border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacto y Presentación de Quejas</h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Si tiene preguntas, inquietudes o desea presentar una queja sobre el tratamiento 
              de sus datos personales:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Responsable de Protección de Datos:</strong></p>
              <p><strong>Email:</strong> contacto@huellitasquito.ec</p>
              <p><strong>Teléfono:</strong> +593 960152853</p>
              <p><strong>Dirección:</strong> Quito, Ecuador</p>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border border-primary-200">
              <p className="text-sm text-gray-700">
                <strong>Autoridad de Control:</strong> También tiene derecho a presentar una 
                queja ante la autoridad de protección de datos competente en Ecuador si considera 
                que el tratamiento de sus datos personales infringe la legislación aplicable.
              </p>
            </div>
          </div>
        </Card>

        {/* Consentimiento */}
        <Card className="p-8 bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Su Consentimiento</h2>
              <p className="text-gray-700 leading-relaxed">
                Al utilizar nuestra plataforma y marcar la casilla correspondiente durante el 
                registro, usted confirma que ha leído, entendido y aceptado esta Política de 
                Privacidad y consiente el tratamiento de sus datos personales conforme a lo 
                descrito en este documento.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
