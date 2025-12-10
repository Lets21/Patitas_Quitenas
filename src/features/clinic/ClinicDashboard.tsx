import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Loader2, Calendar, Heart, Users, MapPin, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import ClinicHeader from '@/components/admin/ClinicHeader';
import { useClinicAnimals } from './hooks/useMedicalHistory';
import { urlFromBackend } from '@/lib/api';

function ClinicDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: animals, isLoading, error } = useClinicAnimals();

  // Filtrar animales por término de búsqueda
  const filteredAnimals = useMemo(() => {
    if (!animals) return [];
    if (!searchTerm.trim()) return animals;
    
    const term = searchTerm.toLowerCase();
    return animals.filter((animal: any) => 
      animal.name?.toLowerCase().includes(term) ||
      animal.foundation?.name?.toLowerCase().includes(term) ||
      animal.attributes?.breed?.toLowerCase().includes(term)
    );
  }, [animals, searchTerm]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <ClinicHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Cargando animales...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <ClinicHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Card className="p-6">
            <p className="text-red-600">Error al cargar animales: {(error as Error).message}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header de Clínica */}
      <ClinicHeader />

      {/* Contenido Principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Main Content */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Gestión de historiales médicos
          </h2>
          
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, raza o fundación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Animals Grid */}
          {filteredAnimals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron animales con ese criterio' : 'No hay animales disponibles'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal: any) => {
                const photo = animal.photos?.[0] ? urlFromBackend(animal.photos[0]) : null;
                const age = animal.attributes?.age || 0;
                const breed = animal.attributes?.breed || 'Mestizo';
                const size = animal.attributes?.size || 'MEDIUM';
                const gender = animal.attributes?.gender || 'FEMALE';
                const energy = animal.attributes?.energy || 'MEDIUM';
                const foundationName = animal.foundation?.name || 'Sin fundación';
                
                const sizeLabels: Record<string, string> = {
                  SMALL: 'Pequeño',
                  MEDIUM: 'Mediano',
                  LARGE: 'Grande'
                };
                
                const genderLabels: Record<string, string> = {
                  MALE: 'Macho',
                  FEMALE: 'Hembra'
                };
                
                const energyLabels: Record<string, string> = {
                  LOW: 'Tranquilo',
                  MEDIUM: 'Moderado',
                  HIGH: 'Activo'
                };
                
                return (
                  <Card 
                    key={animal.id || animal._id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200 bg-white"
                  >
                    {/* Imagen destacada */}
                    <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt={animal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">🐕</span>
                    </div>
                      )}
                      {/* Badge de estado */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="success" size="sm" className="bg-green-600 text-white font-semibold shadow-lg">
                          <Heart className="h-3 w-3 mr-1" />
                          ADÓPTAME
                    </Badge>
                  </div>
                </div>
                
                    {/* Contenido */}
                    <div className="p-5">
                      {/* Nombre y edad */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                          {animal.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{age} {age === 1 ? 'año' : 'años'}</span>
                          <span>•</span>
                          <span>{breed}</span>
                        </div>
                </div>

                      {/* Información detallada */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Tamaño:</span>
                          <span>{sizeLabels[size]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Heart className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Sexo:</span>
                          <span>{genderLabels[gender]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Stethoscope className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Energía:</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {energyLabels[energy]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 pt-2 border-t border-gray-100">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">Fundación:</span>
                          <span className="text-gray-900 font-semibold truncate">{foundationName}</span>
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <Button
                        onClick={() => navigate(`/clinica/animals/${animal.id || animal._id}/medical-history`)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Editar historia clínica</span>
                </Button>
                    </div>
              </Card>
                );
              })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClinicDashboard;