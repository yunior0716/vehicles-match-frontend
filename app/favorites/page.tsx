"use client"

import { useMemo } from "react"
import { VehicleCard } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from 'lucide-react'
import { vehicles } from "@/data/vehicles"
import { useFavorites } from "@/contexts/favorites-context"

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()

  const favoriteVehicles = useMemo(() => {
    return vehicles.filter(vehicle => favorites.includes(vehicle.id))
  }, [favorites])

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Heart className="h-24 w-24 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No tienes favoritos aún
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Explora nuestro catálogo y marca los vehículos que más te interesen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/results'}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ver catálogo
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/filters'}>
                Buscar con filtros
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mis Favoritos
            </h1>
            <p className="text-lg text-gray-600">
              {favoriteVehicles.length} vehículo{favoriteVehicles.length !== 1 ? 's' : ''} guardado{favoriteVehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Limpiar favoritos
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¿Listo para dar el siguiente paso?
            </h3>
            <p className="text-gray-600 mb-4">
              Compara tus favoritos o busca más opciones
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Comparar favoritos
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/results'}>
                Seguir explorando
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
