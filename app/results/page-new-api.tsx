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
  const { data: filteredVehicles, isLoading: filteredLoading } =
    useVehiclesByFilters(selectedFilterIds);
  const { data: availableFilters, isLoading: filtersLoading } = useFilters();

  // Usar vehículos filtrados si hay filtros seleccionados, sino todos los vehículos
  const apiVehicles =
    selectedFilterIds.length > 0 ? filteredVehicles : allVehicles;
  const isLoading =
    selectedFilterIds.length > 0 ? filteredLoading : allVehiclesLoading;

  // Convertir vehículos de la API al formato de la aplicación
  const vehicles = useMemo(() => {
    if (!apiVehicles) return [];
    return apiVehicles.map((apiVehicle) =>
      adaptApiVehicleToVehicle(
        apiVehicle,
        apiVehicle.vehicleCharacteristics || []
      )
    );
  }, [apiVehicles]);

  // Aplicar filtros de búsqueda y ordenamiento
  const filteredAndSortedVehicles = useMemo(() => {
    let result = vehicles;

    // Filtro de búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term) ||
          vehicle.description?.toLowerCase().includes(term)
      );
    }

    // Ordenamiento
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    return result;
  }, [vehicles, searchTerm, sortBy]);

  // Funciones para manejar filtros
  const handleFilterToggle = (filterId: string) => {
    setSelectedFilterIds((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedFilterIds([]);
  };

  // Obtener nombres de filtros seleccionados
  const selectedFilterNames = useMemo(() => {
    if (!availableFilters) return [];
    return availableFilters
      .filter((filter) => selectedFilterIds.includes(filter.id))
      .map((filter) => filter.name);
  }, [availableFilters, selectedFilterIds]);

  useEffect(() => {
    // Leer filtros de la URL al cargar
    const filtersParam = searchParams.get('filters');
    if (filtersParam) {
      setSelectedFilterIds(filtersParam.split(','));
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  if (isLoading || filtersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header con búsqueda y filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Resultados de Búsqueda
          </h1>

          {/* Barra de búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar por marca, modelo o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevancia</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">
                  Precio: Mayor a Menor
                </SelectItem>
                <SelectItem value="year-new">Año: Más Nuevo</SelectItem>
                <SelectItem value="year-old">Año: Más Antiguo</SelectItem>
                <SelectItem value="brand">Marca A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {selectedFilterIds.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedFilterIds.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filtros seleccionados */}
          {selectedFilterIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-medium text-gray-600">
                Filtros activos:
              </span>
              {selectedFilterNames.map((name, index) => (
                <Badge
                  key={selectedFilterIds[index]}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {name}
                  <button
                    onClick={() => handleFilterToggle(selectedFilterIds[index])}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                Limpiar todos
              </Button>
            </div>
          )}

          {/* Panel de filtros */}
          {showFilters && (
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Filtros Disponibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableFilters?.map((filter) => (
                  <div
                    key={filter.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedFilterIds.includes(filter.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{filter.name}</h4>
                      <input
                        type="checkbox"
                        checked={selectedFilterIds.includes(filter.id)}
                        onChange={() => handleFilterToggle(filter.id)}
                        className="rounded"
                      />
                    </div>
                    {filter.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {filter.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {(!availableFilters || availableFilters.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay filtros disponibles</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Ve a la sección de administración para crear filtros
                    personalizados
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredAndSortedVehicles.length} vehículo(s) encontrado(s)
            {selectedFilterIds.length > 0 &&
              ` con ${selectedFilterIds.length} filtro(s) aplicado(s)`}
          </p>
        </div>

        {/* Grid de vehículos */}
        {filteredAndSortedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron vehículos
            </p>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            {selectedFilterIds.length > 0 && (
              <Button onClick={handleClearFilters}>Limpiar filtros</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
