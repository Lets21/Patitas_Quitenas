import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, MapPin, Calendar, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import type { Animal, FilterOptions } from '../types';

export const CatalogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - would come from API
  const animals: Animal[] = [
    {
      id: '1',
      name: 'Luna',
      photos: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'],
      attributes: {
        age: 2,
        size: 'MEDIUM',
        breed: 'Mestizo',
        gender: 'FEMALE',
        energy: 'MEDIUM',
        coexistence: { children: true, cats: false, dogs: true }
      },
      clinicalSummary: 'Saludable, vacunada y esterilizada',
      state: 'AVAILABLE',
      foundationId: '1',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      id: '2', 
      name: 'Max',
      photos: ['https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'],
      attributes: {
        age: 4,
        size: 'LARGE',
        breed: 'Labrador Mix',
        gender: 'MALE',
        energy: 'HIGH',
        coexistence: { children: true, cats: true, dogs: true }
      },
      clinicalSummary: 'Muy saludable, requiere ejercicio diario',
      state: 'AVAILABLE',
      foundationId: '1',
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02'
    },
    {
      id: '3',
      name: 'Bella',
      photos: ['https://images.pexels.com/photos/1938126/pexels-photo-1938126.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'],
      attributes: {
        age: 1,
        size: 'SMALL',
        breed: 'Chihuahua Mix',
        gender: 'FEMALE',
        energy: 'LOW',
        coexistence: { children: false, cats: true, dogs: false }
      },
      clinicalSummary: 'Muy tranquila, ideal para departamento',
      state: 'AVAILABLE',
      foundationId: '1',
      createdAt: '2025-01-03',
      updatedAt: '2025-01-03'
    }
  ];

  const getAgeLabel = (age: number) => {
    if (age < 1) return 'Cachorro';
    if (age < 3) return 'Joven';
    if (age < 7) return 'Adulto';
    return 'Senior';
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      SMALL: 'Pequeño',
      MEDIUM: 'Mediano', 
      LARGE: 'Grande'
    };
    return labels[size as keyof typeof labels] || size;
  };

  const getEnergyLabel = (energy: string) => {
    const labels = {
      LOW: 'Tranquilo',
      MEDIUM: 'Moderado',
      HIGH: 'Activo'
    };
    return labels[energy as keyof typeof labels] || energy;
  };

  const filteredAnimals = animals.filter(animal => {
    if (searchTerm && !animal.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !animal.attributes.breed.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.size?.length && !filters.size.includes(animal.attributes.size)) {
      return false;
    }
    
    if (filters.energy?.length && !filters.energy.includes(animal.attributes.energy)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Encuentra tu compañero perfecto
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {filteredAnimals.length} caninos esperando un hogar lleno de amor
          </p>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tamaño</h3>
                  <div className="space-y-2">
                    {['SMALL', 'MEDIUM', 'LARGE'].map(size => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={filters.size?.includes(size) || false}
                          onChange={(e) => {
                            const newSizes = filters.size || [];
                            if (e.target.checked) {
                              setFilters({ ...filters, size: [...newSizes, size] });
                            } else {
                              setFilters({ ...filters, size: newSizes.filter(s => s !== size) });
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {getSizeLabel(size)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Energía</h3>
                  <div className="space-y-2">
                    {['LOW', 'MEDIUM', 'HIGH'].map(energy => (
                      <label key={energy} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={filters.energy?.includes(energy) || false}
                          onChange={(e) => {
                            const newEnergy = filters.energy || [];
                            if (e.target.checked) {
                              setFilters({ ...filters, energy: [...newEnergy, energy] });
                            } else {
                              setFilters({ ...filters, energy: newEnergy.filter(e => e !== energy) });
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {getEnergyLabel(energy)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Convivencia</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Con niños</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Con gatos</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Con otros perros</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Animals Grid */}
        {filteredAnimals.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No encontramos resultados
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilters({});
              }}
            >
              Limpiar filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnimals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden rounded-t-2xl">
                  <img
                    src={animal.photos[0]}
                    alt={`Foto de ${animal.name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {animal.name}
                      </h3>
                      <p className="text-gray-600">{animal.attributes.breed}</p>
                    </div>
                    <Badge variant="success">
                      Disponible
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {animal.attributes.age} {animal.attributes.age === 1 ? 'año' : 'años'} • {getAgeLabel(animal.attributes.age)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {getSizeLabel(animal.attributes.size)} • {getEnergyLabel(animal.attributes.energy)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {animal.attributes.coexistence.children && (
                      <Badge size="sm">Con niños</Badge>
                    )}
                    {animal.attributes.coexistence.cats && (
                      <Badge size="sm">Con gatos</Badge>
                    )}
                    {animal.attributes.coexistence.dogs && (
                      <Badge size="sm">Con perros</Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {animal.clinicalSummary}
                  </p>

                  <div className="flex gap-2">
                    <Link to={`/animals/${animal.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver más
                      </Button>
                    </Link>
                    <Link to="/login" className="flex-1">
                      <Button size="sm" className="w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Adoptar
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CatalogPage;
