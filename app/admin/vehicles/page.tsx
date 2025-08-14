'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, Settings, Car } from 'lucide-react';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useVehicleCharacteristics,
  useAssignCharacteristicToVehicle,
} from '@/hooks/useVehicles';
import { useCharacteristics } from '@/hooks/useCharacteristics';
import { toast } from 'sonner';

export default function VehiclesAdminPage() {
  const { data: vehicles, isLoading, error } = useVehicles();
  const { data: characteristics } = useCharacteristics();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const assignCharacteristic = useAssignCharacteristicToVehicle();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [
    selectedVehicleForCharacteristics,
    setSelectedVehicleForCharacteristics,
  ] = useState<string | null>(null);
  const [characteristicDialog, setCharacteristicDialog] = useState(false);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<
    number | null
  >(null);
  const [characteristicValue, setCharacteristicValue] = useState('');

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateVehicle.mutateAsync({
          id: editingId,
          vehicle: formData,
        });
        setEditingId(null);
        toast.success('Vehículo actualizado');
      } else {
        await createVehicle.mutateAsync(formData);
        setIsCreating(false);
        toast.success('Vehículo creado');
      }

      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
      });
    } catch (error) {
      toast.error('Error al guardar el vehículo');
    }
  };

  const handleEdit = (vehicle: any) => {
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
    });
    setEditingId(vehicle.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await deleteVehicle.mutateAsync(id);
        toast.success('Vehículo eliminado');
      } catch (error) {
        toast.error('Error al eliminar el vehículo');
      }
    }
  };

  const handleAssignCharacteristic = async () => {
    if (
      !selectedVehicleForCharacteristics ||
      !selectedCharacteristic ||
      !characteristicValue
    ) {
      toast.error('Completa todos los campos');
      return;
    }

    try {
      await assignCharacteristic.mutateAsync({
        vehicleId: selectedVehicleForCharacteristics,
        data: {
          characteristicId: selectedCharacteristic,
          value: characteristicValue,
        },
      });
      toast.success('Característica asignada');
      setCharacteristicDialog(false);
      setSelectedCharacteristic(null);
      setCharacteristicValue('');
    } catch (error) {
      toast.error('Error al asignar la característica');
    }
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
    });
  };

  if (isLoading) {
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

  if (error) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Administrar Vehículos
          </h1>
          <p className="text-gray-600">
            Gestiona el catálogo de vehículos y sus características
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo vehículo
        </Button>
      </div>

      {/* Formulario de creación/edición */}
      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar vehículo' : 'Nuevo vehículo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    required
                    placeholder="ej. Toyota, BMW, Ford"
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
                    required
                    placeholder="ej. Camry, X3, F-150"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Año *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Precio (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                    placeholder="ej. 25000"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createVehicle.isPending || updateVehicle.isPending}
                >
                  {createVehicle.isPending || updateVehicle.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles?.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">
                    {vehicle.brand} {vehicle.model}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedVehicleForCharacteristics(vehicle.id);
                      setCharacteristicDialog(true);
                    }}
                    title="Asignar características"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(vehicle.id)}
                    disabled={deleteVehicle.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{vehicle.year}</Badge>
                  <Badge variant="outline">
                    ${vehicle.price.toLocaleString()}
                  </Badge>
                </div>
                <VehicleCharacteristics vehicleId={vehicle.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles?.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay vehículos
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primer vehículo para comenzar a gestionar el catálogo.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            Crear primer vehículo
          </Button>
        </div>
      )}

      {/* Dialog para asignar características */}
      <Dialog
        open={characteristicDialog}
        onOpenChange={setCharacteristicDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar característica</DialogTitle>
            <DialogDescription>
              Selecciona una característica y asigna su valor para este
              vehículo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="characteristic">Característica</Label>
              <Select
                value={selectedCharacteristic?.toString() || ''}
                onValueChange={(value) =>
                  setSelectedCharacteristic(parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una característica" />
                </SelectTrigger>
                <SelectContent>
                  {characteristics?.map((char) => (
                    <SelectItem key={char.id} value={char.id.toString()}>
                      {char.name} {char.unit && `(${char.unit})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                value={characteristicValue}
                onChange={(e) => setCharacteristicValue(e.target.value)}
                placeholder="Ingresa el valor para esta característica"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAssignCharacteristic}
                disabled={assignCharacteristic.isPending}
              >
                {assignCharacteristic.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Asignar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCharacteristicDialog(false);
                  setSelectedCharacteristic(null);
                  setCharacteristicValue('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para mostrar características de un vehículo
function VehicleCharacteristics({ vehicleId }: { vehicleId: string }) {
  const { data: characteristics, isLoading } =
    useVehicleCharacteristics(vehicleId);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">Cargando características...</div>
    );
  }

  if (!characteristics || characteristics.length === 0) {
    return (
      <div className="text-sm text-gray-500">Sin características asignadas</div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-700">Características:</p>
      <div className="flex flex-wrap gap-1">
        {characteristics.slice(0, 3).map((char) => (
          <Badge key={char.id} variant="outline" className="text-xs">
            {char.characteristic?.name}: {char.value}
          </Badge>
        ))}
        {characteristics.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{characteristics.length - 3} más
          </Badge>
        )}
      </div>
    </div>
  );
}
