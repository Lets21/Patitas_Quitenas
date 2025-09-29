import React, { useState } from 'react';
import { ArrowLeft, Heart, MapPin, Calendar, Shield, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Pet } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PetProfilePageProps {
  pet: Pet;
  onBack: () => void;
  onAdopt: () => void;
}

export const PetProfilePage: React.FC<PetProfilePageProps> = ({ pet, onBack, onAdopt }) => {
  const [activeTab, setActiveTab] = useState('description');
  const { user } = useAuth();

  const tabs = [
    { id: 'description', label: 'Descripción' },
    { id: 'health', label: 'Ficha clínica' },
    { id: 'related', label: 'Similares' },
  ];

  const getStatusColor = () => {
    switch (pet.status) {
      case 'available': return 'text-success-500';
      case 'reserved': return 'text-warning-500';
      case 'adopted': return 'text-neutral-500';
      default: return 'text-neutral-500';
    }
  };

  const getStatusText = () => {
    switch (pet.status) {
      case 'available': return 'Disponible para adopción';
      case 'reserved': return 'Reservado';
      case 'adopted': return 'Ya adoptado';
      default: return pet.status;
    }
  };

  const canAdopt = pet.status === 'available' && user?.role === 'adoptant';

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              {/* Image */}
              <div className="relative mb-6">
                <img
                  src={pet.photos[0]}
                  alt={pet.name}
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={pet.status === 'available' ? 'success' : 'warning'}
                    size="md"
                  >
                    {getStatusText()}
                  </Badge>
                </div>
                <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-neutral-600 hover:text-accent" />
                </button>
              </div>

              {/* Title */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-2">
                    {pet.name}
                  </h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {pet.age} {pet.age === 1 ? 'año' : 'años'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pet.foundation.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="primary">
                  {pet.size === 'small' ? 'Pequeño' : pet.size === 'medium' ? 'Mediano' : 'Grande'}
                </Badge>
                <Badge variant="secondary">
                  {pet.energy === 'low' ? 'Tranquilo' : pet.energy === 'medium' ? 'Activo' : 'Muy activo'}
                </Badge>
                <Badge variant="primary">{pet.breed}</Badge>
                {pet.health.vaccinated && <Badge variant="success">Vacunado</Badge>}
                {pet.health.sterilized && <Badge variant="success">Esterilizado</Badge>}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-neutral-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      Personalidad
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      {pet.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">Convivencia</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Con niños</span>
                            <Badge variant={pet.goodWith.children ? 'success' : 'error'} size="sm">
                              {pet.goodWith.children ? 'Sí' : 'No'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Con otros perros</span>
                            <Badge variant={pet.goodWith.dogs ? 'success' : 'error'} size="sm">
                              {pet.goodWith.dogs ? 'Sí' : 'No'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">Con gatos</span>
                            <Badge variant={pet.goodWith.cats ? 'success' : 'error'} size="sm">
                              {pet.goodWith.cats ? 'Sí' : 'No'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-2">Nivel de energía</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((level) => (
                              <div
                                key={level}
                                className={`w-3 h-3 rounded-full ${
                                  (pet.energy === 'low' && level <= 1) ||
                                  (pet.energy === 'medium' && level <= 2) ||
                                  (pet.energy === 'high' && level <= 3)
                                    ? 'bg-accent'
                                    : 'bg-neutral-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-neutral-600">
                            {pet.energy === 'low' ? 'Tranquilo' : pet.energy === 'medium' ? 'Activo' : 'Muy activo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'health' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Información de salud
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <span className="text-sm font-medium text-neutral-700">Vacunado</span>
                        <Badge variant={pet.health.vaccinated ? 'success' : 'error'} size="sm">
                          {pet.health.vaccinated ? 'Sí' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <span className="text-sm font-medium text-neutral-700">Esterilizado</span>
                        <Badge variant={pet.health.sterilized ? 'success' : 'error'} size="sm">
                          {pet.health.sterilized ? 'Sí' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <span className="text-sm font-medium text-neutral-700">Desparasitado</span>
                        <Badge variant={pet.health.dewormed ? 'success' : 'error'} size="sm">
                          {pet.health.dewormed ? 'Sí' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <span className="text-sm font-medium text-neutral-700">Última revisión</span>
                        <span className="text-sm text-neutral-600">
                          {new Date(pet.health.lastCheckup).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-success-50 border border-success-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-success-600" />
                        <span className="font-medium text-success-800">
                          Validado por Clínica Veterinaria UDLA
                        </span>
                      </div>
                      <p className="text-sm text-success-700 mt-1">
                        Este perro ha sido evaluado y cuenta con el aval veterinario necesario para la adopción.
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'related' && (
                <div>
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Perros similares
                    </h3>
                    <p className="text-neutral-600">
                      Pronto encontrarás aquí otros perros que podrían interesarte.
                    </p>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                ¿Te interesa {pet.name}?
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Estado</span>
                  <span className={`font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Fundación</span>
                  <span className="font-medium text-neutral-900">{pet.foundation.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Publicado</span>
                  <span className="text-sm text-neutral-600">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {user ? (
                <>
                  {canAdopt ? (
                    <Button className="w-full mb-3" onClick={onAdopt}>
                      <Heart className="w-4 h-4" />
                      Solicitar adopción
                    </Button>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-neutral-600 mb-2">
                        {pet.status === 'reserved' 
                          ? 'Este perro está reservado' 
                          : pet.status === 'adopted'
                          ? 'Este perro ya fue adoptado'
                          : 'No disponible para tu rol'
                        }
                      </p>
                      {pet.status !== 'adopted' && (
                        <Button variant="outline" className="w-full" disabled>
                          {pet.status === 'reserved' ? 'Reservado' : 'No disponible'}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-4">
                    Inicia sesión para solicitar la adopción de {pet.name}
                  </p>
                  <Button className="w-full">
                    Iniciar sesión
                  </Button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h4 className="font-medium text-neutral-900 mb-2">Información de contacto</h4>
                <p className="text-sm text-neutral-600">
                  Una vez iniciado el proceso de adopción, te pondremos en contacto 
                  con {pet.foundation.name} para coordinar los siguientes pasos.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};