'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  Settings,
  Car,
} from 'lucide-react';
import { useCharacteristics } from '@/hooks/useCharacteristics';
import { useVehicles } from '@/hooks/useVehicles';
import { seedService } from '@/services/seedService';
import { toast } from 'sonner';

export default function APIStatusPage() {
  const [apiStatus, setApiStatus] = useState<
    'checking' | 'connected' | 'error'
  >('checking');
  const [seedingCharacteristics, setSeedingCharacteristics] = useState(false);

  const {
    data: characteristics,
    isLoading: characteristicsLoading,
    error: characteristicsError,
  } = useCharacteristics();
  const {
    data: vehicles,
    isLoading: vehiclesLoading,
    error: vehiclesError,
  } = useVehicles();

  useEffect(() => {
    // Verificar el estado de la API
    const checkApiStatus = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        );
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (error) {
        setApiStatus('error');
      }
    };

    checkApiStatus();
  }, []);

  const handleSeedCharacteristics = async () => {
    setSeedingCharacteristics(true);
    try {
      await seedService.seedCharacteristics();
      toast.success('Características iniciales creadas correctamente');
      window.location.reload();
    } catch (error) {
      toast.error('Error al crear las características iniciales');
    } finally {
      setSeedingCharacteristics(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800';
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'checking':
        return 'Verificando...';
      case 'connected':
        return 'Conectado';
      case 'error':
        return 'Error de conexión';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Estado de la API
          </h1>
          <p className="text-gray-600">
            Verifica la conexión y configuración de tu API de vehículos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => (window.location.href = '/admin/vehicles')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Car className="h-4 w-4" />
            Gestionar Vehículos
          </Button>
          <Button
            onClick={() => (window.location.href = '/admin/characteristics')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Gestionar Características
          </Button>
        </div>
      </div>

      {/* Estado de la API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Conexión API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(apiStatus)}
              <Badge className={getStatusColor(apiStatus)}>
                {getStatusText(apiStatus)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Características
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {characteristicsLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando...</span>
                </div>
              ) : characteristicsError ? (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <Badge className="bg-red-100 text-red-800">Error</Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge className="bg-green-100 text-green-800">
                    {characteristics?.length || 0} características
                  </Badge>
                </div>
              )}

              {characteristics?.length === 0 && (
                <Button
                  onClick={handleSeedCharacteristics}
                  disabled={seedingCharacteristics}
                  size="sm"
                  className="w-full mt-2"
                >
                  {seedingCharacteristics ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creando...
                    </>
                  ) : (
                    'Crear características iniciales'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Vehículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehiclesLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : vehiclesError ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <Badge className="bg-red-100 text-red-800">Error</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge className="bg-green-100 text-green-800">
                  {vehicles?.length || 0} vehículos
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de la API</CardTitle>
          <CardDescription>
            Sigue estos pasos para configurar correctamente tu API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Inicia tu servidor de API</h4>
                <p className="text-sm text-gray-600">
                  Ejecuta tu API NestJS en el puerto 3000:
                </p>
                <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                  npm run start:dev
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Configura la base de datos</h4>
                <p className="text-sm text-gray-600">
                  Asegúrate de que PostgreSQL esté corriendo:
                </p>
                <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                  docker-compose up -d
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Inicializa las características</h4>
                <p className="text-sm text-gray-600">
                  Si no tienes características, haz clic en el botón de arriba
                  para crearlas automáticamente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium">Verifica la conexión</h4>
                <p className="text-sm text-gray-600">
                  Todos los indicadores arriba deberían estar en verde.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variables de entorno */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Variables de entorno</CardTitle>
          <CardDescription>
            Configuración actual de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">NEXT_PUBLIC_API_URL:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
