'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save, X } from 'lucide-react';
import {
  useCharacteristics,
  useCreateCharacteristic,
  useDeleteCharacteristic,
} from '@/hooks/useCharacteristics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { HydrationBoundary } from '@/components/hydration-boundary';

export default function CharacteristicsAdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [newCharacteristic, setNewCharacteristic] = useState({
    name: '',
    data_type: 'number' as 'text' | 'number' | 'decimal' | 'boolean' | 'date',
    unit: '',
    description: '',
  });

  const { data: characteristics, isLoading } = useCharacteristics();
  const createCharacteristicMutation = useCreateCharacteristic();
  const deleteCharacteristicMutation = useDeleteCharacteristic();

  const handleCreateCharacteristic = async () => {
    if (!newCharacteristic.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la característica es requerido',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCharacteristicMutation.mutateAsync(newCharacteristic);
      setNewCharacteristic({
        name: '',
        data_type: 'number' as
          | 'text'
          | 'number'
          | 'decimal'
          | 'boolean'
          | 'date',
        unit: '',
        description: '',
      });
      setIsCreating(false);
      toast({
        title: 'Éxito',
        description: 'Característica creada correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la característica',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCharacteristic = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta característica?')) {
      try {
        await deleteCharacteristicMutation.mutateAsync(id);
        toast({
          title: 'Éxito',
          description: 'Característica eliminada correctamente',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la característica',
          variant: 'destructive',
        });
      }
    }
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
    <HydrationBoundary>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Administración de Características
          </h1>
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Crear Característica
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nueva Característica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newCharacteristic.name}
                  onChange={(e) =>
                    setNewCharacteristic({
                      ...newCharacteristic,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ej: Potencia, Consumo, Precio"
                />
              </div>
              <div>
                <Label htmlFor="data_type">Tipo de Dato</Label>
                <Select
                  value={newCharacteristic.data_type}
                  onValueChange={(value) =>
                    setNewCharacteristic({
                      ...newCharacteristic,
                      data_type: value as
                        | 'text'
                        | 'number'
                        | 'decimal'
                        | 'boolean'
                        | 'date',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                    <SelectItem value="boolean">Verdadero/Falso</SelectItem>
                    <SelectItem value="date">Fecha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unidad</Label>
                <Input
                  id="unit"
                  value={newCharacteristic.unit}
                  onChange={(e) =>
                    setNewCharacteristic({
                      ...newCharacteristic,
                      unit: e.target.value,
                    })
                  }
                  placeholder="Ej: HP, L/100km, USD, km/h"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newCharacteristic.description}
                  onChange={(e) =>
                    setNewCharacteristic({
                      ...newCharacteristic,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe qué representa esta característica"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCharacteristic}>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Característica
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCharacteristic({
                      name: '',
                      data_type: 'number' as
                        | 'text'
                        | 'number'
                        | 'decimal'
                        | 'boolean'
                        | 'date',
                      unit: '',
                      description: '',
                    });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {characteristics?.map((characteristic) => (
            <Card key={characteristic.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {characteristic.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {characteristic.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Tipo: {characteristic.data_type}</span>
                      {characteristic.unit && (
                        <span>Unidad: {characteristic.unit}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleDeleteCharacteristic(characteristic.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}

          {(!characteristics || characteristics.length === 0) &&
            !isCreating && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No hay características creadas aún
                  </p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear tu primera característica
                  </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </HydrationBoundary>
  );
}
