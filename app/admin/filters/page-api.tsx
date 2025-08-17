'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save, X } from 'lucide-react';
import {
  useFilters,
  useCreateFilter,
  useDeleteFilter,
  useAddCharacteristicToFilter,
  useRemoveCharacteristicFromFilter,
  useFilterCharacteristics,
} from '@/hooks/useFilters';
import { useCharacteristics } from '@/hooks/useCharacteristics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function FiltersAdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newFilter, setNewFilter] = useState({
    name: '',
    description: '',
  });

  const { data: filters, isLoading: filtersLoading } = useFilters();
  const { data: characteristics } = useCharacteristics();
  const createFilterMutation = useCreateFilter();
  const deleteFilterMutation = useDeleteFilter();
  const addCharacteristicMutation = useAddCharacteristicToFilter();
  const removeCharacteristicMutation = useRemoveCharacteristicFromFilter();

  const handleCreateFilter = async () => {
    if (!newFilter.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del filtro es requerido',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createFilterMutation.mutateAsync(newFilter);
      setNewFilter({ name: '', description: '' });
      setIsCreating(false);
      toast({
        title: 'Éxito',
        description: 'Filtro creado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el filtro',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFilter = async (filterId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este filtro?')) {
      try {
        await deleteFilterMutation.mutateAsync(filterId);
        toast({
          title: 'Éxito',
          description: 'Filtro eliminado correctamente',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el filtro',
          variant: 'destructive',
        });
      }
    }
  };

  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando filtros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administración de Filtros</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Filtro
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Nuevo Filtro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Filtro</Label>
              <Input
                id="name"
                value={newFilter.name}
                onChange={(e) =>
                  setNewFilter({ ...newFilter, name: e.target.value })
                }
                placeholder="Ej: Vehículos Económicos"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newFilter.description}
                onChange={(e) =>
                  setNewFilter({ ...newFilter, description: e.target.value })
                }
                placeholder="Describe qué tipo de vehículos filtra este filtro"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateFilter}>
                <Save className="h-4 w-4 mr-2" />
                Crear Filtro
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewFilter({ name: '', description: '' });
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {filters?.map((filter) => (
          <FilterCard
            key={filter.id}
            filter={filter}
            characteristics={characteristics || []}
            onDelete={() => handleDeleteFilter(filter.id)}
            addCharacteristicMutation={addCharacteristicMutation}
            removeCharacteristicMutation={removeCharacteristicMutation}
          />
        ))}

        {(!filters || filters.length === 0) && !isCreating && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay filtros creados aún</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear tu primer filtro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function FilterCard({
  filter,
  characteristics,
  onDelete,
  addCharacteristicMutation,
  removeCharacteristicMutation,
}: any) {
  const [newCharacteristic, setNewCharacteristic] = useState({
    characteristicId: '',
    minValue: '',
    maxValue: '',
    exactValue: '',
  });

  const { data: filterCharacteristics } = useFilterCharacteristics(filter.id);

  const handleAddCharacteristic = async () => {
    if (!newCharacteristic.characteristicId) {
      toast({
        title: 'Error',
        description: 'Selecciona una característica',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addCharacteristicMutation.mutateAsync({
        filterId: filter.id,
        data: {
          characteristicId: parseInt(newCharacteristic.characteristicId),
          minValue: newCharacteristic.minValue || undefined,
          maxValue: newCharacteristic.maxValue || undefined,
          exactValue: newCharacteristic.exactValue || undefined,
        },
      });
      setNewCharacteristic({
        characteristicId: '',
        minValue: '',
        maxValue: '',
        exactValue: '',
      });
      toast({
        title: 'Éxito',
        description: 'Característica agregada al filtro',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar la característica',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveCharacteristic = async (characteristicId: string) => {
    try {
      await removeCharacteristicMutation.mutateAsync(characteristicId);
      toast({
        title: 'Éxito',
        description: 'Característica removida del filtro',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo remover la característica',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{filter.name}</CardTitle>
            <p className="text-gray-600 mt-1">{filter.description}</p>
          </div>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Características del Filtro:</h4>
            <div className="space-y-2">
              {filterCharacteristics?.map((fc: any) => (
                <div
                  key={fc.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">
                      {fc.characteristic?.name}
                    </span>
                    <div className="text-sm text-gray-600">
                      {fc.exactValue
                        ? `Valor exacto: ${fc.exactValue}`
                        : `${fc.minValue ? `Min: ${fc.minValue}` : ''} ${
                            fc.maxValue ? `Max: ${fc.maxValue}` : ''
                          }`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveCharacteristic(fc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {(!filterCharacteristics ||
                filterCharacteristics.length === 0) && (
                <p className="text-gray-500 text-sm">
                  No hay características asignadas a este filtro
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Agregar Característica:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <Select
                value={newCharacteristic.characteristicId}
                onValueChange={(value) =>
                  setNewCharacteristic({
                    ...newCharacteristic,
                    characteristicId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Característica" />
                </SelectTrigger>
                <SelectContent>
                  {characteristics?.map((char: any) => (
                    <SelectItem key={char.id} value={char.id.toString()}>
                      {char.name} ({char.unit || char.data_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Valor mínimo"
                value={newCharacteristic.minValue}
                onChange={(e) =>
                  setNewCharacteristic({
                    ...newCharacteristic,
                    minValue: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Valor máximo"
                value={newCharacteristic.maxValue}
                onChange={(e) =>
                  setNewCharacteristic({
                    ...newCharacteristic,
                    maxValue: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Valor exacto"
                value={newCharacteristic.exactValue}
                onChange={(e) =>
                  setNewCharacteristic({
                    ...newCharacteristic,
                    exactValue: e.target.value,
                  })
                }
              />
              <Button onClick={handleAddCharacteristic}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Puedes especificar un valor exacto O un rango con mínimo/máximo,
              pero no ambos.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
