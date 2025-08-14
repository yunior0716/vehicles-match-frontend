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
import { Plus, Loader2, Check } from 'lucide-react';
import { useCreateVehicle } from '@/hooks/useVehicles';
import { toast } from 'sonner';
import type { CreateVehicleDto } from '@/types/api';

interface VehicleFormProps {
  onSuccess?: () => void;
}

export function VehicleForm({ onSuccess }: VehicleFormProps) {
  const createVehicle = useCreateVehicle();
  const [formData, setFormData] = useState<CreateVehicleDto>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuel: 'gasoline',
    transmission: 'manual',
    seats: 5,
    doors: 4,
    carrocery: 'sedan',
    price: 0,
    image: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.brand || !formData.model) {
      toast.error('Marca y modelo son requeridos');
      return;
    }

    if (formData.year < 1886 || formData.year > new Date().getFullYear() + 1) {
      toast.error('Año inválido');
      return;
    }

    if (formData.price <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    try {
      await createVehicle.mutateAsync(formData);
      toast.success('Vehículo creado exitosamente');

      // Reset form
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        fuel: 'gasoline',
        transmission: 'manual',
        seats: 5,
        doors: 4,
        carrocery: 'sedan',
        price: 0,
        image: '',
        description: '',
      });

      onSuccess?.();
    } catch (error) {
      toast.error('Error al crear el vehículo');
      console.error('Error:', error);
    }
  };

  const updateFormData = (field: keyof CreateVehicleDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Crear Nuevo Vehículo
        </CardTitle>
        <CardDescription>
          Completa todos los campos para crear un nuevo vehículo en el catálogo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                type="text"
                placeholder="Ej: Toyota, BMW, Honda"
                value={formData.brand}
                onChange={(e) => updateFormData('brand', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                type="text"
                placeholder="Ej: Corolla, X3, Civic"
                value={formData.model}
                onChange={(e) => updateFormData('model', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                min="1886"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) =>
                  updateFormData(
                    'year',
                    parseInt(e.target.value) || new Date().getFullYear()
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="price">Precio (USD) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 25000"
                value={formData.price}
                onChange={(e) =>
                  updateFormData('price', parseFloat(e.target.value) || 0)
                }
                required
              />
            </div>
          </div>

          {/* Especificaciones técnicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuel">Tipo de Combustible</Label>
              <Select
                value={formData.fuel}
                onValueChange={(value) => updateFormData('fuel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el combustible" />
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
                onValueChange={(value) => updateFormData('transmission', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la transmisión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automática</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seats">Número de Asientos</Label>
              <Select
                value={formData.seats.toString()}
                onValueChange={(value) =>
                  updateFormData('seats', parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona los asientos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 asientos</SelectItem>
                  <SelectItem value="4">4 asientos</SelectItem>
                  <SelectItem value="5">5 asientos</SelectItem>
                  <SelectItem value="7">7 asientos</SelectItem>
                  <SelectItem value="8">8 asientos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doors">Número de Puertas</Label>
              <Select
                value={formData.doors.toString()}
                onValueChange={(value) =>
                  updateFormData('doors', parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona las puertas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 puertas</SelectItem>
                  <SelectItem value="3">3 puertas</SelectItem>
                  <SelectItem value="4">4 puertas</SelectItem>
                  <SelectItem value="5">5 puertas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tipo de carrocería */}
          <div>
            <Label htmlFor="carrocery">Tipo de Carrocería</Label>
            <Select
              value={formData.carrocery}
              onValueChange={(value) => updateFormData('carrocery', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de carrocería" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedán</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="coupe">Coupé</SelectItem>
                <SelectItem value="convertible">Convertible</SelectItem>
                <SelectItem value="wagon">Station Wagon</SelectItem>
                <SelectItem value="pickup">Pick-up</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="minivan">Minivan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Imagen */}
          <div>
            <Label htmlFor="image">URL de la Imagen</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image}
              onChange={(e) => updateFormData('image', e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las características principales del vehículo..."
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full"
            disabled={createVehicle.isPending}
          >
            {createVehicle.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando vehículo...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Crear Vehículo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
