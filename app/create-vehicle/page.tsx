'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Settings, Database, ArrowRight, Plus, List } from 'lucide-react';
import { QuickVehicleForm } from '@/components/quick-vehicle-form';
import { useVehicles } from '@/hooks/useVehicles';
import { useCharacteristics } from '@/hooks/useCharacteristics';

export default function CreateVehiclePage() {
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: characteristics, isLoading: characteristicsLoading } =
    useCharacteristics();
  const [showQuickForm, setShowQuickForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Car className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            Gestionar Vehículos
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Administra el catálogo completo de vehículos. Crea nuevos vehículos,
          asigna características técnicas y gestiona todo desde un solo lugar.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {vehiclesLoading ? '...' : vehicles?.length || 0}
            </CardTitle>
            <CardDescription>Vehículos en el catálogo</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              {characteristicsLoading ? '...' : characteristics?.length || 0}
            </CardTitle>
            <CardDescription>Características disponibles</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">
              {(characteristics?.length || 0) > 0 ? (
                <Badge className="bg-green-100 text-green-800">Listo</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  Configurar
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Estado del sistema</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Quick Create */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Creación Rápida
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickForm(!showQuickForm)}
            >
              {showQuickForm ? 'Ocultar' : 'Mostrar'} Formulario
            </Button>
          </div>

          {showQuickForm ? (
            <QuickVehicleForm onSuccess={() => setShowQuickForm(false)} />
          ) : (
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setShowQuickForm(true)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Crear Vehículo Rápido</CardTitle>
                    <CardDescription>
                      Agrega un vehículo con información básica en segundos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Perfecto para agregar vehículos rápidamente. Podrás agregar
                  características técnicas más tarde.
                </p>
                <Button className="w-full">
                  Crear Vehículo Rápido
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Advanced Management */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Administración Completa
          </h2>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Panel de Administración</CardTitle>
                  <CardDescription>
                    Gestión completa con características técnicas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Accede al panel completo para crear vehículos, asignar
                características técnicas, editar información y gestionar todo el
                catálogo.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Crear y editar vehículos
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Asignar características técnicas
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Vista completa del catálogo
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Gestión de características
                </div>
              </div>

              <Link href="/admin/vehicles">
                <Button className="w-full">
                  Ir al Panel Completo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Vehículos Recientes
          </h2>
          <Link href="/admin/vehicles">
            <Button variant="outline" size="sm">
              <List className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </Link>
        </div>

        {vehiclesLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando vehículos...</p>
          </div>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.slice(0, 6).map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{vehicle.year}</Badge>
                    <Badge variant="outline">
                      ${vehicle.price.toLocaleString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay vehículos aún
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza creando tu primer vehículo en el catálogo.
              </p>
              <Button onClick={() => setShowQuickForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Vehículo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
