'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Car,
  Filter,
  Settings,
  BarChart3,
  Users,
  Database,
} from 'lucide-react';

export default function AdminDashboard() {
  const adminSections = [
    {
      title: 'Gestión de Vehículos',
      description: 'Agregar, editar y eliminar vehículos del catálogo',
      icon: Car,
      href: '/admin/vehicles',
      color: 'bg-blue-500',
    },
    {
      title: 'Gestión de Filtros',
      description: 'Crear y configurar filtros personalizados',
      icon: Filter,
      href: '/admin/filters',
      color: 'bg-green-500',
    },
    {
      title: 'Características',
      description: 'Administrar características de los vehículos',
      icon: Settings,
      href: '/admin/characteristics',
      color: 'bg-purple-500',
    },
    {
      title: 'Estadísticas',
      description: 'Ver reportes y análisis del sistema',
      icon: BarChart3,
      href: '/admin/statistics',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona todos los aspectos de tu sistema de vehículos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${section.color} text-white`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Resumen del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehículos Totales:</span>
                <span className="font-semibold">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Filtros Activos:</span>
                <span className="font-semibold">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Características:</span>
                <span className="font-semibold">-</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/vehicles/create">
              <Button className="w-full" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Agregar Vehículo
              </Button>
            </Link>
            <Link href="/admin/filters">
              <Button className="w-full" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Crear Filtro
              </Button>
            </Link>
            <Link href="/admin/characteristics">
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Nueva Característica
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">API Backend: Conectado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Base de Datos: Activa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Filtros: Funcionando</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
