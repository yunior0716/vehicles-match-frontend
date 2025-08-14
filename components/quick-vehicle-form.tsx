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

interface QuickVehicleFormProps {
  onSuccess?: () => void;
}

export function QuickVehicleForm({ onSuccess }: QuickVehicleFormProps) {
  const createVehicle = useCreateVehicle();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createVehicle.mutateAsync(formData);
      toast.success('Vehículo creado exitosamente');
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
      });
      onSuccess?.();
    } catch (error) {
      toast.error('Error al crear el vehículo');
    }
  };

  const popularBrands = [
    'Toyota',
    'Honda',
    'Ford',
    'Chevrolet',
    'Nissan',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Volkswagen',
    'Hyundai',
    'Kia',
    'Mazda',
    'Subaru',
    'Lexus',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Crear Vehículo Rápido
        </CardTitle>
        <CardDescription>
          Agrega un nuevo vehículo al catálogo con información básica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quick-brand">Marca *</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) =>
                  setFormData({ ...formData, brand: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una marca" />
                </SelectTrigger>
                <SelectContent>
                  {popularBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2"
                placeholder="O escribe otra marca..."
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="quick-model">Modelo *</Label>
              <Input
                id="quick-model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="ej. Camry, Civic, F-150"
                required
              />
            </div>

            <div>
              <Label htmlFor="quick-year">Año *</Label>
              <Select
                value={formData.year.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, year: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quick-price">Precio (USD) *</Label>
              <Input
                id="quick-price"
                type="number"
                min="0"
                step="1000"
                value={formData.price || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="ej. 25000"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              createVehicle.isPending || !formData.brand || !formData.model
            }
            className="w-full"
          >
            {createVehicle.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creando vehículo...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Crear Vehículo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
