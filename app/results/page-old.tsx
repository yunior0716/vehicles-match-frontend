'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { VehicleCard } from '@/components/vehicle-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { useVehicles, useVehiclesByFilters } from '@/hooks/useVehicles';
import { useFilters } from '@/hooks/useFilters';
import { adaptApiVehicleToVehicle } from '@/lib/adapters';
import { toast } from '@/hooks/use-toast';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Cargar datos de la API
  const { data: allVehicles, isLoading: allVehiclesLoading } = useVehicles();
  const { data: filteredVehicles, isLoading: filteredLoading } = useVehiclesByFilters(selectedFilterIds);
  const { data: availableFilters, isLoading: filtersLoading } = useFilters();

  // Usar vehículos filtrados si hay filtros seleccionados, sino todos los vehículos
  const apiVehicles = selectedFilterIds.length > 0 ? filteredVehicles : allVehicles;
  const isLoading = selectedFilterIds.length > 0 ? filteredLoading : allVehiclesLoading;

  // Convertir vehículos de la API al formato de la aplicación
  const vehicles = useMemo(() => {
    if (!apiVehicles || !characteristics) return [];

    return apiVehicles.map((apiVehicle) =>
      adaptApiVehicleToVehicle(apiVehicle, [])
    );
  }, [apiVehicles, characteristics]);

  // Memoize the search params string to prevent unnecessary re-renders
  const searchParamsString = useMemo(() => {
    return searchParams.toString();
  }, [searchParams]);

  useEffect(() => {
    // Combinar filtros de URL con filtros guardados aplicados
    let urlFilters: FilterState | null = null;

    if (searchParamsString) {
      urlFilters = parseFiltersFromQuery(searchParams);
    }

    const savedFilters =
      savedAppliedFilters.length > 0 ? getCombinedFilters() : null;

    // Combinar ambos tipos de filtros
    if (urlFilters || savedFilters) {
      const combinedFilters: Partial<FilterState> = { ...urlFilters };

      if (savedFilters) {
        // Combinar filtros guardados con filtros de URL
        Object.keys(savedFilters).forEach((category) => {
          const categoryKey = category as keyof FilterState;
          if (savedFilters[categoryKey]) {
            Object.keys(savedFilters[categoryKey]).forEach((field) => {
              const savedValue = (savedFilters[categoryKey] as any)[field];
              const urlValue = urlFilters
                ? (urlFilters[categoryKey] as any)?.[field]
                : null;

              if (savedValue !== null && savedValue !== undefined) {
                if (!combinedFilters[categoryKey]) {
                  combinedFilters[categoryKey] = {} as any;
                }
                // Priorizar valores de URL sobre valores guardados si existen
                (combinedFilters[categoryKey] as any)[field] =
                  urlValue !== null ? urlValue : savedValue;
              }
            });
          }
        });
      }

      setAppliedFilters(combinedFilters as FilterState);
    } else {
      setAppliedFilters(null);
    }
  }, [
    searchParamsString,
    savedAppliedFilters,
    getCombinedFilters,
    searchParams,
  ]);

  // Loading state
  if (vehiclesLoading || characteristicsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando vehículos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (vehiclesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error al cargar vehículos
          </h1>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar los vehículos. Verifica que la API esté
            funcionando.
          </p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  // Aplicar filtros
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    let filtered = [...vehicles]; // Create a copy to avoid mutating original array

    // Aplicar búsqueda por texto
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(searchTermLower) ||
          vehicle.model.toLowerCase().includes(searchTermLower) ||
          vehicle.type.toLowerCase().includes(searchTermLower) ||
          vehicle.description.toLowerCase().includes(searchTermLower)
      );
    }

    // Aplicar filtros específicos
    if (appliedFilters) {
      filtered = filtered.filter((vehicle) => {
        // Performance filters
        if (appliedFilters.performance) {
          const performance = appliedFilters.performance;
          if (
            performance.minPower &&
            vehicle.specs.performance.power < performance.minPower
          )
            return false;
          if (
            performance.maxPower &&
            vehicle.specs.performance.power > performance.maxPower
          )
            return false;
          if (
            performance.maxAcceleration &&
            vehicle.specs.performance.acceleration > performance.maxAcceleration
          )
            return false;
          if (
            performance.minTopSpeed &&
            vehicle.specs.performance.topSpeed < performance.minTopSpeed
          )
            return false;
        }

        // Consumption filters
        if (appliedFilters.consumption) {
          const consumption = appliedFilters.consumption;
          if (
            consumption.maxFuelConsumption &&
            vehicle.specs.consumption.fuelConsumption >
              consumption.maxFuelConsumption
          )
            return false;
          if (
            consumption.minRange &&
            vehicle.specs.consumption.range < consumption.minRange
          )
            return false;
          if (
            consumption.fuelType &&
            vehicle.specs.consumption.fuelType !== consumption.fuelType
          )
            return false;
        }

        // Dimensions filters
        if (appliedFilters.dimensions) {
          const dimensions = appliedFilters.dimensions;
          if (
            dimensions.minSeats &&
            vehicle.specs.dimensions.seats < dimensions.minSeats
          )
            return false;
          // Nota: maxSeats no existe en el tipo, usando solo minSeats
        }

        // Comfort filters
        if (appliedFilters.comfort) {
          const comfort = appliedFilters.comfort;
          if (comfort.airConditioning && !vehicle.specs.comfort.airConditioning)
            return false;
          if (comfort.leatherSeats && !vehicle.specs.comfort.leatherSeats)
            return false;
          if (comfort.sunroof && !vehicle.specs.comfort.sunroof) return false;
          if (comfort.heatedSeats && !vehicle.specs.comfort.heatedSeats)
            return false;
        }

        // Safety filters
        if (appliedFilters.safety) {
          const safety = appliedFilters.safety;
          if (safety.airbags && !vehicle.specs.safety.airbags) return false;
          if (safety.abs && !vehicle.specs.safety.abs) return false;
          if (safety.stabilityControl && !vehicle.specs.safety.stabilityControl)
            return false;
          if (
            safety.blindSpotMonitoring &&
            !vehicle.specs.safety.blindSpotMonitoring
          )
            return false;
          // Nota: minSafetyRating no existe en el tipo safety, usando rating del vehículo directamente
        }

        // Utility filters
        if (appliedFilters.utility) {
          const utility = appliedFilters.utility;
          if (
            utility.minTrunkCapacity &&
            vehicle.specs.utility.trunkCapacity < utility.minTrunkCapacity
          )
            return false;
          if (utility.towingCapacity && !vehicle.specs.utility.towingCapacity)
            return false;
          if (utility.roofRails && !vehicle.specs.utility.roofRails)
            return false;
          if (utility.foldingSeats && !vehicle.specs.utility.foldingSeats)
            return false;
        }

        // Ownership filters
        if (appliedFilters.ownership) {
          const ownership = appliedFilters.ownership;
          if (
            ownership.minPrice &&
            vehicle.specs.ownership.price < ownership.minPrice
          )
            return false;
          if (
            ownership.maxPrice &&
            vehicle.specs.ownership.price > ownership.maxPrice
          )
            return false;
          if (
            ownership.maxMaintenanceCost &&
            vehicle.specs.ownership.maintenanceCost >
              ownership.maxMaintenanceCost
          )
            return false;
        }

        return true;
      });
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'price-low':
        filtered.sort(
          (a, b) => a.specs.ownership.price - b.specs.ownership.price
        );
        break;
      case 'price-high':
        filtered.sort(
          (a, b) => b.specs.ownership.price - a.specs.ownership.price
        );
        break;
      case 'efficiency':
        filtered.sort(
          (a, b) =>
            a.specs.consumption.fuelConsumption -
            b.specs.consumption.fuelConsumption
        );
        break;
      case 'power':
        filtered.sort(
          (a, b) => b.specs.performance.power - a.specs.performance.power
        );
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // "relevance" - no additional sorting
        break;
    }

    return filtered;
  }, [vehicles, searchTerm, appliedFilters, sortBy]);

  const clearFilters = () => {
    setAppliedFilters(null);
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Resultados de búsqueda
        </h1>
        <p className="text-gray-600">
          {filteredVehicles.length} vehículo
          {filteredVehicles.length !== 1 ? 's' : ''} encontrado
          {filteredVehicles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por marca, modelo o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price-low">Precio: Menor a mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a menor</SelectItem>
              <SelectItem value="efficiency">
                Eficiencia de combustible
              </SelectItem>
              <SelectItem value="power">Potencia</SelectItem>
              <SelectItem value="rating">Calificación</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filtros de búsqueda</h3>
            <Button variant="ghost" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
          <FilterSelector
            onFiltersChange={(hasActiveFilters) => {
              // Esta función solo indica si hay filtros activos
              // Los filtros reales se manejan a través del contexto
            }}
          />
        </div>
      )}

      {/* Active Filters Summary */}
      {appliedFilters && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Filtros activos:</h4>
          <div className="text-sm text-blue-700">
            {/* Show summary of active filters */}
            {Object.entries(appliedFilters).map(
              ([category, filters]) =>
                filters &&
                Object.keys(filters).length > 0 && (
                  <span key={category} className="mr-4">
                    {category}: {Object.keys(filters).length} filtros
                  </span>
                )
            )}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron vehículos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros de búsqueda o usar términos
              diferentes.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
