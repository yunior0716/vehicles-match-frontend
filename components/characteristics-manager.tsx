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
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import {
  useCharacteristics,
  useCreateCharacteristic,
} from '@/hooks/useCharacteristics';
import { toast } from 'sonner';
import type { CreateCharacteristicDto } from '@/types/api';

export function CharacteristicsManager() {
  const { data: characteristics, isLoading } = useCharacteristics();
  const createCharacteristic = useCreateCharacteristic();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCharacteristicDto>({
    name: '',
    data_type: 'text',
    unit: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      await createCharacteristic.mutateAsync(formData);
      toast.success('Característica creada exitosamente');

      // Reset form
      setFormData({
        name: '',
        data_type: 'text',
        unit: '',
        description: '',
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Error al crear la característica');
      console.error('Error:', error);
    }
  };

  const updateFormData = (field: keyof CreateCharacteristicDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getDataTypeLabel = (dataType: string) => {
    const labels = {
      text: 'Texto',
      number: 'Número',
      decimal: 'Decimal',
      boolean: 'Booleano',
      date: 'Fecha',
    };
    return labels[dataType as keyof typeof labels] || dataType;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Características</CardTitle>
            <CardDescription>
              Administra las características que pueden asignarse a los
              vehículos
            </CardDescription>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Característica
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Característica</DialogTitle>
                <DialogDescription>
                  Define una nueva característica que puede ser asignada a los
                  vehículos
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej: Potencia del motor, Consumo urbano"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="data_type">Tipo de Dato</Label>
                  <Select
                    value={formData.data_type}
                    onValueChange={(value) =>
                      updateFormData('data_type', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de dato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="decimal">Decimal</SelectItem>
                      <SelectItem value="boolean">Booleano (Sí/No)</SelectItem>
                      <SelectItem value="date">Fecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit">Unidad (Opcional)</Label>
                  <Input
                    id="unit"
                    type="text"
                    placeholder="Ej: HP, L/100km, km/h"
                    value={formData.unit || ''}
                    onChange={(e) => updateFormData('unit', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe para qué sirve esta característica..."
                    value={formData.description || ''}
                    onChange={(e) =>
                      updateFormData('description', e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={createCharacteristic.isPending}
                    className="flex-1"
                  >
                    {createCharacteristic.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      'Crear Característica'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando características...</span>
          </div>
        ) : !characteristics || characteristics.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay características creadas aún.</p>
            <p className="text-sm mt-1">
              Crea la primera característica usando el botón superior.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characteristics.map((characteristic) => (
                <TableRow key={characteristic.id}>
                  <TableCell className="font-medium">
                    {characteristic.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getDataTypeLabel(characteristic.data_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {characteristic.unit || '-'}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {characteristic.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
