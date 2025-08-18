'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Fuel, Gauge, Users, Star } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { useFavorites } from '@/contexts/favorites-context';
import { toast } from '@/hooks/use-toast';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isInFavorites = isFavorite(vehicle.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <Image
            src={vehicle.images[0] || '/placeholder.svg'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            width={400}
            height={250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white ${
            isInFavorites ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={handleFavoriteToggle}
        >
          <Heart className={`h-4 w-4 ${isInFavorites ? 'fill-current' : ''}`} />
        </Button>
        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900">
          {vehicle.type}
        </Badge>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < vehicle.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({vehicle.rating})</span>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {vehicle.brand} {vehicle.model} {vehicle.year || ''}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {vehicle.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="flex items-center space-x-1 text-gray-500">
            <Gauge className="h-3 w-3" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Fuel className="h-3 w-3" />
            <span>{vehicle.fuel || 'No especificado'}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Users className="h-3 w-3" />
            <span>{vehicle.seats || 'N/A'} asientos</span>
          </div>
        </div>

        <div className="text-xl font-bold text-blue-600">
          $
          {vehicle.price
            ? vehicle.price.toLocaleString()
            : 'Precio no disponible'}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/vehicle/${vehicle.id}`} className="w-full">
          <Button className="w-full">Ver detalles</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
