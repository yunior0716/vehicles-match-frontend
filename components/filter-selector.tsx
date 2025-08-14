"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter, X, Check } from "lucide-react"
import { useSavedFilters } from "@/contexts/saved-filters-context"

interface FilterSelectorProps {
  onFiltersChange?: (hasActiveFilters: boolean) => void
}

export function FilterSelector({ onFiltersChange }: FilterSelectorProps) {
  const { savedFilters, appliedFilters, applyFilter, removeAppliedFilter, clearAppliedFilters } = useSavedFilters()
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterToggle = (filterId: string, isApplied: boolean) => {
    if (isApplied) {
      removeAppliedFilter(filterId)
    } else {
      applyFilter(filterId)
    }
    onFiltersChange?.(appliedFilters.length > 0)
  }

  const getActiveFiltersCount = (filters: any): number => {
    let count = 0
    Object.values(filters).forEach((category) => {
      Object.values(category as any).forEach((value) => {
        if (value !== null && value !== undefined && value !== "") {
          count++
        }
      })
    })
    return count
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Applied Filters Display */}
      {appliedFilters.length > 0 && (
        <div className="flex items-center space-x-2">
          {appliedFilters.map((appliedFilter) => (
            <Badge key={appliedFilter.id} variant="default" className="flex items-center space-x-1">
              <span>{appliedFilter.name}</span>
              <button
                onClick={() => removeAppliedFilter(appliedFilter.id)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAppliedFilters} className="text-red-600 hover:text-red-700">
            Limpiar todos
          </Button>
        </div>
      )}

      {/* Filter Selector Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Filter className="h-4 w-4" />
            <span>Filtros guardados</span>
            {appliedFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {appliedFilters.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Seleccionar Filtros</DialogTitle>
            <DialogDescription>Elige uno o más filtros guardados para aplicar a tu búsqueda</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {savedFilters.length > 0 ? (
              savedFilters.map((filter) => {
                const isApplied = appliedFilters.some((af) => af.id === filter.id)
                return (
                  <Card
                    key={filter.id}
                    className={`cursor-pointer transition-colors ${
                      isApplied ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isApplied}
                          onCheckedChange={() => handleFilterToggle(filter.id, isApplied)}
                        />
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <span>{filter.name}</span>
                            {isApplied && <Check className="h-4 w-4 text-blue-600" />}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {getActiveFiltersCount(filter.filters)} criterios
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {filter.createdAt.toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {filter.description && (
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm">{filter.description}</CardDescription>
                      </CardContent>
                    )}
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Filter className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay filtros guardados</h3>
                <p className="text-gray-600">Crea filtros personalizados desde la página de administración</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
