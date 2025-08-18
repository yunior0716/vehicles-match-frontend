'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Fuel,
  Gauge,
  Users,
  Shield,
  Package,
  DollarSign,
  Ruler,
  Loader2,
  Car,
  Cog,
} from 'lucide-react';
import { useVehicle, useVehicleCharacteristics } from '@/hooks/useVehicles';
import { adaptApiVehicleToVehicle } from '@/lib/adapters';
import { useFavorites } from '@/contexts/favorites-context';
import { toast } from '@/hooks/use-toast';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cargar vehículo y características desde la API
  const vehicleId = parseInt(params.id as string, 10);
  const {
    data: apiVehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(vehicleId);
  const { data: vehicleCharacteristics, isLoading: characteristicsLoading } =
    useVehicleCharacteristics(vehicleId);

  // Convertir datos de API al formato de la aplicación
  const vehicle =
    apiVehicle && vehicleCharacteristics
      ? adaptApiVehicleToVehicle(apiVehicle, vehicleCharacteristics)
      : null;

  // Loading state
  if (vehicleLoading || characteristicsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (vehicleError || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vehículo no encontrado
          </h1>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const isInFavorites = isFavorite(vehicle.id);

  const handleFavoriteToggle = () => {
    if (isInFavorites) {
      removeFromFavorites(vehicle.id);
      toast({
        title: 'Eliminado de favoritos',
        description: `${vehicle.brand} ${vehicle.model} eliminado de tus favoritos`,
      });
    } else {
      addToFavorites(vehicle.id);
      toast({
        title: 'Agregado a favoritos',
        description: `${vehicle.brand} ${vehicle.model} agregado a tus favoritos`,
      });
    }
  };

  // Formatear las características del vehículo directamente sin categorizar
  const getVehicleCharacteristics = () => {
    if (!vehicleCharacteristics || vehicleCharacteristics.length === 0) {
      return [];
    }

    return vehicleCharacteristics
      .filter((vc) => vc.characteristic) // Solo características válidas
      .map((vc) => {
        const characteristic = vc.characteristic!; // Sabemos que existe por el filter

        // Formatear el valor según el tipo de dato
        let formattedValue = vc.value;

        if (characteristic.data_type === 'boolean') {
          formattedValue = vc.value === 'true' ? 'Sí' : 'No';
        } else if (
          characteristic.data_type === 'number' ||
          characteristic.data_type === 'decimal'
        ) {
          formattedValue =
            vc.value + (characteristic.unit ? ` ${characteristic.unit}` : '');
        }

        return {
          label: characteristic.name,
          value: formattedValue,
          description: characteristic.description || '',
          dataType: characteristic.data_type,
        };
      });
  };

  const vehicleSpecs = getVehicleCharacteristics();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant={isInFavorites ? 'default' : 'outline'}
              size="sm"
              onClick={handleFavoriteToggle}
              className={isInFavorites ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <Heart
                className={`h-4 w-4 ${isInFavorites ? 'fill-current' : ''}`}
              />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={vehicle.images[currentImageIndex] || '/placeholder.svg'}
                alt={`${vehicle.brand} ${vehicle.model}`}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {vehicle.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index
                      ? 'border-blue-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`Vista ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{vehicle.type}</Badge>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < vehicle.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({vehicle.rating}/5)
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.brand} {vehicle.model} {vehicle.year || ''}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {vehicle.description}
              </p>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                $
                {vehicle.price
                  ? vehicle.price.toLocaleString()
                  : 'Precio no disponible'}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Combustible</span>
                </div>
                <span className="font-semibold">
                  {vehicle.fuel || 'No especificado'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Cog className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Transmisión</span>
                </div>
                <span className="font-semibold">
                  {vehicle.transmission || 'No especificado'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Asientos</span>
                </div>
                <span className="font-semibold">{vehicle.seats || 'N/A'}</span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Puertas</span>
                </div>
                <span className="font-semibold">{vehicle.doors || 'N/A'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                Contactar vendedor
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                Agendar prueba
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Specifications */}
        {vehicleSpecs.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Características Técnicas</CardTitle>
              <CardDescription>
                Características específicas asignadas a este vehículo (
                {vehicleSpecs.length} características)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicleSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-4 bg-gray-50 rounded-lg border hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {spec.label}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {spec.value}
                      </span>
                    </div>
                    {spec.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {spec.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Características Técnicas</CardTitle>
              <CardDescription>
                No hay características específicas asignadas a este vehículo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  Este vehículo no tiene características técnicas detalladas
                  asignadas.
                </p>
                <p className="text-sm mt-2">
                  Las características se pueden agregar desde el panel de
                  administración.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
