import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Car,
  Filter,
  Heart,
  Search,
  Star,
  Zap,
  Settings,
  Database,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Encuentra tu vehículo ideal
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Descubre el vehículo perfecto para ti con nuestro sistema
              inteligente de recomendaciones. Filtra por características
              técnicas y encuentra exactamente lo que necesitas.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/create-vehicle">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Car className="mr-2 h-4 w-4" />
                  Crear Vehículo
                </Button>
              </Link>
              <Link href="/filters">
                <Button variant="outline" size="lg">
                  <Filter className="mr-2 h-4 w-4" />
                  Buscar Vehículos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestra plataforma?
            </h2>
            <p className="text-lg text-gray-600">
              Tecnología avanzada para encontrar el vehículo perfecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Filtros Avanzados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  7 categorías técnicas con múltiples parámetros para una
                  búsqueda precisa
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Recomendaciones IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Algoritmos inteligentes que aprenden de tus preferencias
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Lista de Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Guarda y compara tus vehículos favoritos fácilmente
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">
                  Base de Datos Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Miles de vehículos con especificaciones técnicas detalladas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Panel de Administración
            </h2>
            <p className="text-lg text-gray-600">
              Gestiona el catálogo de vehículos y características técnicas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Gestionar Vehículos</CardTitle>
                <CardDescription>
                  Crear, editar y eliminar vehículos del catálogo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/vehicles">
                  <Button className="w-full">Administrar Vehículos</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Características</CardTitle>
                <CardDescription>
                  Gestionar características técnicas de los vehículos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/characteristics">
                  <Button variant="outline" className="w-full">
                    Administrar Características
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Estado de la API</CardTitle>
                <CardDescription>
                  Verificar conexión y configuración del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button variant="outline" className="w-full">
                    Ver Estado
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para encontrar tu vehículo ideal?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya han encontrado su vehículo perfecto
          </p>
          <Link href="/filters">
            <Button size="lg" variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Comenzar ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
