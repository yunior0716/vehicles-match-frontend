'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, RotateCcw } from 'lucide-react';
import { useCharacteristics } from '@/hooks/useCharacteristics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FiltersPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const router = useRouter();
  const { data: characteristics, isLoading } = useCharacteristics();

  const handleFilterChange = (characteristicId: number, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [characteristicId]: value,
    }));
  };

  const handleSearch = () => {
    // Convertir filtros a query params y navegar a resultados
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([characteristicId, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(`char_${characteristicId}`, value.toString());
      }
    });

    router.push(`/results?${queryParams.toString()}`);
  };

  const handleReset = () => {
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando características...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Filtros de Búsqueda
          </h1>
          <p className="text-lg text-gray-600">
            Personaliza tu búsqueda usando las características disponibles
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-8">
          {characteristics?.map((characteristic) => (
            <Card key={characteristic.id} className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">{characteristic.name}</CardTitle>
                {characteristic.description && (
                  <p className="text-sm text-gray-600">
                    {characteristic.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <CharacteristicFilter
                  characteristic={characteristic}
                  value={filters[characteristic.id] || ''}
                  onChange={(value) =>
                    handleFilterChange(characteristic.id, value)
                  }
                />
              </CardContent>
            </Card>
          ))}

          {(!characteristics || characteristics.length === 0) && (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No hay características disponibles para filtrar
                </p>
                <p className="text-sm text-gray-400">
                  Ve a la página de administración para crear características
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={handleSearch} size="lg" className="px-8">
            <Search className="h-5 w-5 mr-2" />
            Buscar Vehículos
          </Button>
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="px-8"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}

function CharacteristicFilter({
  characteristic,
  value,
  onChange,
}: {
  characteristic: any;
  value: string;
  onChange: (value: string) => void;
}) {
  const renderFilter = () => {
    switch (characteristic.data_type) {
      case 'number':
      case 'decimal':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor={`min_${characteristic.id}`}>
                Valor mínimo
                {characteristic.unit && ` (${characteristic.unit})`}
              </Label>
              <Input
                id={`min_${characteristic.id}`}
                type="number"
                placeholder={`Ej: 100${
                  characteristic.unit ? ` ${characteristic.unit}` : ''
                }`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>
          </div>
        );

      case 'boolean':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Cualquiera</SelectItem>
              <SelectItem value="true">Sí</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'text':
        return (
          <Input
            placeholder={`Buscar por ${characteristic.name.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      default:
        return (
          <Input
            placeholder={`Valor de ${characteristic.name.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {renderFilter()}
      {characteristic.unit && characteristic.data_type !== 'boolean' && (
        <p className="text-xs text-gray-500">Unidad: {characteristic.unit}</p>
      )}
    </div>
  );
}
