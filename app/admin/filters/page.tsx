"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Filter, Save } from "lucide-react"
import { useSavedFilters } from "@/contexts/saved-filters-context"
import { FilterCategory } from "@/components/filter-category"
import { type FilterState, initialFilters } from "@/types/filters"
import type { SavedFilter } from "@/types/saved-filters"

export default function FiltersAdminPage() {
  const { savedFilters, saveFilter, updateFilter, deleteFilter } = useSavedFilters()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState<SavedFilter | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialFilters)

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setCurrentFilters(initialFilters)
    setEditingFilter(null)
  }

  const handleFilterChange = (category: keyof FilterState, field: string, value: any) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingFilter) {
      updateFilter(editingFilter.id, {
        name: formData.name,
        description: formData.description,
        filters: currentFilters,
      })
    } else {
      saveFilter(formData.name, formData.description, currentFilters)
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (filter: SavedFilter) => {
    setEditingFilter(filter)
    setFormData({
      name: filter.name,
      description: filter.description || "",
    })
    setCurrentFilters(filter.filters)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este filtro?")) {
      deleteFilter(id)
    }
  }

  const getActiveFiltersCount = (filters: FilterState): number => {
    let count = 0
    Object.values(filters).forEach((category) => {
      Object.values(category).forEach((value) => {
        if (value !== null && value !== undefined && value !== "") {
          count++
        }
      })
    })
    return count
  }

  const filterCategories = [
    {
      key: "performance" as keyof FilterState,
      title: "Desempeño",
      description: "Potencia, aceleración y velocidad máxima",
      icon: "🏎️",
    },
    {
      key: "consumption" as keyof FilterState,
      title: "Consumo",
      description: "Eficiencia de combustible y autonomía",
      icon: "⛽",
    },
    {
      key: "dimensions" as keyof FilterState,
      title: "Dimensiones",
      description: "Tamaño, peso y capacidad",
      icon: "📏",
    },
    {
      key: "comfort" as keyof FilterState,
      title: "Comodidad",
      description: "Características de confort interior",
      icon: "🛋️",
    },
    {
      key: "safety" as keyof FilterState,
      title: "Seguridad",
      description: "Sistemas de seguridad y protección",
      icon: "🛡️",
    },
    {
      key: "utility" as keyof FilterState,
      title: "Utilidad",
      description: "Capacidad de carga y versatilidad",
      icon: "🎒",
    },
    {
      key: "ownership" as keyof FilterState,
      title: "Costo de Propiedad",
      description: "Precio, mantenimiento y depreciación",
      icon: "💰",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Filtros Guardados</h1>
            <p className="text-lg text-gray-600">Crea y administra filtros personalizados para búsquedas rápidas</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Filtro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingFilter ? "Editar" : "Nuevo"} Filtro Personalizado</DialogTitle>
                <DialogDescription>
                  {editingFilter ? "Modifica" : "Crea"} un filtro con criterios específicos
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre del filtro</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="ej. Económico, Para carretera, Familiar"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe para qué tipo de búsqueda es útil este filtro"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Configuración de filtros */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Configurar Criterios</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filterCategories.map((category) => (
                        <Card key={category.key} className="h-fit">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-base">
                              <span className="text-lg">{category.icon}</span>
                              <span>{category.title}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <FilterCategory
                              category={category.key}
                              filters={currentFilters[category.key]}
                              onChange={(field, value) => handleFilterChange(category.key, field, value)}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {editingFilter ? "Actualizar" : "Guardar"} Filtro
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedFilters.map((filter) => (
            <Card key={filter.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{filter.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(filter)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(filter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{getActiveFiltersCount(filter.filters)} criterios</Badge>
                  <Badge variant="outline">{filter.createdAt.toLocaleDateString()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filter.description && <p className="text-sm text-gray-600">{filter.description}</p>}
                  <div className="text-xs text-gray-500">Actualizado: {filter.updatedAt.toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {savedFilters.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay filtros guardados</h3>
            <p className="text-gray-600 mb-4">Crea tu primer filtro personalizado para búsquedas más eficientes</p>
          </div>
        )}
      </div>
    </div>
  )
}
