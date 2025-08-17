'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save, X, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useAssignCharacteristicToVehicle,
} from '@/hooks/useVehicles';
import { useCharacteristics } from '@/hooks/useCharacteristics';
import { toast } from '@/hooks/use-toast';
import { CURRENT_YEAR, MAX_YEAR } from '@/lib/constants';

export default function VehiclesAdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: CURRENT_YEAR,
    fuel: 'gasoline',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    carrocery: '',
    price: 0,
    image: '',
    description: '',
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: characteristics } = useCharacteristics();
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const handleCreateVehicle = async () => {
    if (!formData.brand.trim() || !formData.model.trim()) {
      toast({
        title: 'Error',
        description: 'Marca y modelo son requeridos',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingId) {
        await updateVehicleMutation.mutateAsync({
          id: editingId,
          vehicle: formData,
        });
        setEditingId(null);
        toast({
          title: 'Éxito',
          description: 'Vehículo actualizado correctamente',
        });
      } else {
        await createVehicleMutation.mutateAsync(formData);
        setIsCreating(false);
        toast({
          title: 'Éxito',
          description: 'Vehículo creado correctamente',
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo procesar el vehículo',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await deleteVehicleMutation.mutateAsync(id);
        toast({
          title: 'Éxito',
          description: 'Vehículo eliminado correctamente',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el vehículo',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setFormData({
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || CURRENT_YEAR,
      fuel: vehicle.fuel || 'gasoline',
      transmission: vehicle.transmission || 'automatic',
      seats: vehicle.seats || 5,
      doors: vehicle.doors || 4,
      carrocery: vehicle.carrocery || '',
      price: vehicle.price || 0,
      image: vehicle.image || '',
      description: vehicle.description || '',
    });
    setEditingId(vehicle.id);
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: CURRENT_YEAR,
      fuel: 'gasoline',
      transmission: 'automatic',
      seats: 5,
      doors: 4,
      carrocery: '',
      price: 0,
      image: '',
      description: '',
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (vehiclesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administración de Vehículos</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Vehículo
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="Ej: Toyota, BMW, Honda"
                />
              </div>
              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="Ej: Corolla, X5, Civic"
                />
              </div>
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  min="1886"
                  max={MAX_YEAR}
                />
              </div>
              <div>
                <Label htmlFor="price">Precio (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseInt(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="fuel">Combustible</Label>
                <Select
                  value={formData.fuel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fuel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diésel</SelectItem>
                    <SelectItem value="hybrid">Híbrido</SelectItem>
                    <SelectItem value="electric">Eléctrico</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmisión</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) =>
                    setFormData({ ...formData, transmission: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automática</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="seats">Asientos</Label>
                <Input
                  id="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seats: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <Label htmlFor="doors">Puertas</Label>
                <Input
                  id="doors"
                  type="number"
                  value={formData.doors}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doors: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="carrocery">Carrocería</Label>
                <Input
                  id="carrocery"
                  value={formData.carrocery}
                  onChange={(e) =>
                    setFormData({ ...formData, carrocery: e.target.value })
                  }
                  placeholder="Ej: sedán, SUV, hatchback"
                />
              </div>
              <div>
                <Label htmlFor="image">URL de Imagen</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe las características principales del vehículo"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateVehicle}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Actualizar' : 'Crear'} Vehículo
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {vehicles?.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{vehicle.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Precio: ${vehicle.price.toLocaleString()}</span>
                    <span>Combustible: {vehicle.fuel}</span>
                    <span>Transmisión: {vehicle.transmission}</span>
                    <span>{vehicle.seats} asientos</span>
                    <span>{vehicle.doors} puertas</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VehicleCharacteristics vehicleId={vehicle.id} />
            </CardContent>
          </Card>
        ))}

        {(!vehicles || vehicles.length === 0) && !isCreating && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay vehículos creados aún</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear tu primer vehículo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function VehicleCharacteristics({ vehicleId }: { vehicleId: number }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('');
  const [characteristicValue, setCharacteristicValue] = useState('');

  const { data: characteristics } = useCharacteristics();
  const assignCharacteristicMutation = useAssignCharacteristicToVehicle();

  const handleAssignCharacteristic = async () => {
    if (!selectedCharacteristic || !characteristicValue) {
      toast({
        title: 'Error',
        description: 'Selecciona una característica y proporciona un valor',
        variant: 'destructive',
      });
      return;
    }

    try {
      await assignCharacteristicMutation.mutateAsync({
        vehicleId,
        characteristicId: parseInt(selectedCharacteristic),
        value: characteristicValue,
      });
      setSelectedCharacteristic('');
      setCharacteristicValue('');
      setShowForm(false);
      toast({
        title: 'Éxito',
        description: 'Característica asignada al vehículo',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo asignar la característica',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Características</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Asignar Característica
        </Button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Select
              value={selectedCharacteristic}
              onValueChange={setSelectedCharacteristic}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar característica" />
              </SelectTrigger>
              <SelectContent>
                {characteristics?.map((char) => (
                  <SelectItem key={char.id} value={char.id.toString()}>
                    {char.name} ({char.unit || char.data_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Valor"
              value={characteristicValue}
              onChange={(e) => setCharacteristicValue(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAssignCharacteristic}>
                Asignar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
