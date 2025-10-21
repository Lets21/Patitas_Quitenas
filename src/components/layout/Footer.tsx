import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y misión */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
  <img
    src="/images/logo.png"           // tu PNG transparente
    alt="Huellitas Quiteñas"
    className="h-24 w-24 object-contain"  // nada de ring, nada de bg
    loading="lazy"
  />
  <span className="text-xl font-bold">Huellitas Quiteñas</span>
</div>


            <p className="text-primary-100 mb-4">
              Conectamos corazones para crear hogares llenos de amor.
              Facilitamos adopciones responsables de caninos en Quito
              a través de un proceso transparente y seguro.
            </p>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-primary-200">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Quito, Ecuador</span>
              </div>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces útiles</h3>
            <ul className="space-y-2 text-primary-200">
              <li><a href="/catalog" className="hover:text-white transition-colors">Adoptar</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="/process" className="hover:text-white transition-colors">Proceso</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-primary-200">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">contacto@huellitasquito.ec</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+593 2 XXX-XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-500 mt-8 pt-8 text-center text-primary-200">
          <p>&copy; 2025 Huellitas Quiteñas. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="/terms" className="hover:text-white transition-colors">Términos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
