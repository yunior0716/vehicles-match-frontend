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
} from 'lucide-react';
import { useVehicle, useVehicleCharacteristics } from '@/hooks/useVehicles';
import { adaptApiVehicleToVehicle } from '@/lib/adapters';
import { useFavorites } from '@/contexts/favorites-context';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
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

  const isFavorite = favorites.includes(vehicle.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(vehicle.id);
    } else {
      addToFavorites(vehicle.id);
    }
  };

  const specCategories = [
    {
      key: 'performance',
      title: 'Desempeño',
      icon: Gauge,
      specs: [
        { label: 'Potencia', value: `${vehicle.specs.performance.power} HP` },
        {
          label: 'Aceleración 0-100',
          value: `${vehicle.specs.performance.acceleration}s`,
        },
        {
          label: 'Velocidad máxima',
          value: `${vehicle.specs.performance.topSpeed} km/h`,
        },
        { label: 'Transmisión', value: vehicle.specs.performance.transmission },
      ],
    },
    {
      key: 'consumption',
      title: 'Consumo',
      icon: Fuel,
      specs: [
        {
          label: 'Consumo',
          value: `${vehicle.specs.consumption.fuelConsumption} L/100km`,
        },
        { label: 'Autonomía', value: `${vehicle.specs.consumption.range} km` },
        {
          label: 'Tipo de combustible',
          value: vehicle.specs.consumption.fuelType,
        },
        {
          label: 'Tanque',
          value: `${vehicle.specs.consumption.tankCapacity}L`,
        },
      ],
    },
    {
      key: 'dimensions',
      title: 'Dimensiones',
      icon: Ruler,
      specs: [
        { label: 'Longitud', value: `${vehicle.specs.dimensions.length} mm` },
        { label: 'Ancho', value: `${vehicle.specs.dimensions.width} mm` },
        { label: 'Alto', value: `${vehicle.specs.dimensions.height} mm` },
        { label: 'Peso', value: `${vehicle.specs.dimensions.weight} kg` },
        { label: 'Asientos', value: vehicle.specs.dimensions.seats.toString() },
      ],
    },
    {
      key: 'safety',
      title: 'Seguridad',
      icon: Shield,
      specs: [
        { label: 'Airbags', value: vehicle.specs.safety.airbags ? 'Sí' : 'No' },
        { label: 'ABS', value: vehicle.specs.safety.abs ? 'Sí' : 'No' },
        {
          label: 'Control de estabilidad',
          value: vehicle.specs.safety.stabilityControl ? 'Sí' : 'No',
        },
        {
          label: 'Puntuación seguridad',
          value: `${vehicle.specs.safety.safetyRating}/5 estrellas`,
        },
      ],
    },
  ];

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
              variant={isFavorite ? 'default' : 'outline'}
              size="sm"
              onClick={handleFavoriteToggle}
              className={isFavorite ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
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
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {vehicle.description}
              </p>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${vehicle.specs.ownership.price.toLocaleString()}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Potencia</span>
                </div>
                <span className="font-semibold">
                  {vehicle.specs.performance.power} HP
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Consumo</span>
                </div>
                <span className="font-semibold">
                  {vehicle.specs.consumption.fuelConsumption} L/100km
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Asientos</span>
                </div>
                <span className="font-semibold">
                  {vehicle.specs.dimensions.seats}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Maletero</span>
                </div>
                <span className="font-semibold">
                  {vehicle.specs.utility.trunkCapacity}L
                </span>
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
        <Card>
          <CardHeader>
            <CardTitle>Especificaciones Técnicas</CardTitle>
            <CardDescription>
              Información detallada sobre las características del vehículo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {specCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.key}
                      value={category.key}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {specCategories.map((category) => (
                <TabsContent
                  key={category.key}
                  value={category.key}
                  className="mt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.specs.map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-600">{spec.label}</span>
                        <span className="font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
