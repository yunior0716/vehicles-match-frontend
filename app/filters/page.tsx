"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FilterCategory } from "@/components/filter-category"
import { Search, RotateCcw } from 'lucide-react'
import { FilterState, initialFilters } from "@/types/filters"

export default function FiltersPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const router = useRouter()

  const handleFilterChange = (category: keyof FilterState, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSearch = () => {
    // Convertir filtros a query params y navegar a resultados
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([category, fields]) => {
      Object.entries(fields).forEach(([field, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(`${category}.${field}`, value.toString())
        }
      })
    })

    router.push(`/results?${queryParams.toString()}`)
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  const filterCategories = [
    {
      key: 'performance' as keyof FilterState,
      title: 'Desempeño',
      description: 'Potencia, aceleración y velocidad máxima',
      icon: '🏎️'
    },
    {
      key: 'consumption' as keyof FilterState,
      title: 'Consumo',
      description: 'Eficiencia de combustible y autonomía',
      icon: '⛽'
    },
    {
      key: 'dimensions' as keyof FilterState,
      title: 'Dimensiones',
      description: 'Tamaño, peso y capacidad',
      icon: '📏'
    },
    {
      key: 'comfort' as keyof FilterState,
      title: 'Comodidad',
      description: 'Características de confort interior',
      icon: '🛋️'
    },
    {
      key: 'safety' as keyof FilterState,
      title: 'Seguridad',
      description: 'Sistemas de seguridad y protección',
      icon: '🛡️'
    },
    {
      key: 'utility' as keyof FilterState,
      title: 'Utilidad',
      description: 'Capacidad de carga y versatilidad',
      icon: '🎒'
    },
    {
      key: 'ownership' as keyof FilterState,
      title: 'Costo de Propiedad',
      description: 'Precio, mantenimiento y depreciación',
      icon: '💰'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Filtros de Búsqueda
          </h1>
          <p className="text-lg text-gray-600">
            Personaliza tu búsqueda con nuestros filtros avanzados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filterCategories.map((category) => (
            <Card key={category.key} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.title}</span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <FilterCategory
                  category={category.key}
                  filters={filters[category.key]}
                  onChange={(field, value) => handleFilterChange(category.key, field, value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-4 bg-white rounded-lg shadow-lg border p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Limpiar filtros</span>
            </Button>
            <Button
              onClick={handleSearch}
              size="lg"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              <span>Buscar vehículos</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
