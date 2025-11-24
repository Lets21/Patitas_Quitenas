import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'EC', dialCode: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'CO', dialCode: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', dialCode: '+51', name: 'Perú', flag: '🇵🇪' },
  { code: 'AR', dialCode: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', dialCode: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: 'MX', dialCode: '+52', name: 'México', flag: '🇲🇽' },
  { code: 'ES', dialCode: '+34', name: 'España', flag: '🇪🇸' },
  { code: 'US', dialCode: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
];

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (fullNumber: string, dialCode: string, localNumber: string) => void;
  value?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, onChange, value = '', className = '', ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState<Country>(COUNTRIES[0]);
    const [localNumber, setLocalNumber] = React.useState('');

    // Extraer el código de país y número local del value inicial
    React.useEffect(() => {
      if (value) {
        const country = COUNTRIES.find(c => value.startsWith(c.dialCode));
        if (country) {
          setSelectedCountry(country);
          setLocalNumber(value.replace(country.dialCode, '').trim());
        } else {
          setLocalNumber(value);
        }
      }
    }, []);

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      const fullNumber = localNumber ? `${country.dialCode} ${localNumber}` : country.dialCode;
      onChange?.(fullNumber, country.dialCode, localNumber);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      // Solo permitir números, espacios y guiones
      const cleaned = input.replace(/[^\d\s-]/g, '');
      setLocalNumber(cleaned);
      const fullNumber = cleaned ? `${selectedCountry.dialCode} ${cleaned}` : selectedCountry.dialCode;
      onChange?.(fullNumber, selectedCountry.dialCode, cleaned);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative flex">
          {/* Selector de país */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`h-[42px] px-3 border border-r-0 rounded-l-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedCountry.dialCode}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute z-20 top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-4 py-2 text-left hover:bg-primary-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {country.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.dialCode}
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <span className="text-primary-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Input del número */}
          <input
            ref={ref}
            type="tel"
            value={localNumber}
            onChange={handleNumberChange}
            className={`flex-1 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            } ${className}`}
            {...props}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && (
          <p className="mt-1 text-xs text-gray-500">
            Formato sugerido: {selectedCountry.code === 'EC' ? '999-999-999' : 'XXX-XXX-XXX'}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
