"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SavedFilter, AppliedFilter } from "@/types/saved-filters"
import type { FilterState } from "@/types/filters"

interface SavedFiltersContextType {
  savedFilters: SavedFilter[]
  appliedFilters: AppliedFilter[]
  saveFilter: (name: string, description: string, filters: FilterState) => void
  updateFilter: (id: string, updates: Partial<SavedFilter>) => void
  deleteFilter: (id: string) => void
  applyFilter: (filterId: string) => void
  removeAppliedFilter: (filterId: string) => void
  clearAppliedFilters: () => void
  getCombinedFilters: () => FilterState
}

const SavedFiltersContext = createContext<SavedFiltersContextType | undefined>(undefined)

export function SavedFiltersProvider({ children }: { children: ReactNode }) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedFiltersData = localStorage.getItem("vehicle-saved-filters")
    const appliedFiltersData = localStorage.getItem("vehicle-applied-filters")

    if (savedFiltersData) {
      try {
        const parsed = JSON.parse(savedFiltersData)
        setSavedFilters(
          parsed.map((filter: any) => ({
            ...filter,
            createdAt: new Date(filter.createdAt),
            updatedAt: new Date(filter.updatedAt),
          })),
        )
      } catch (error) {
        console.error("Error loading saved filters:", error)
      }
    }

    if (appliedFiltersData) {
      try {
        setAppliedFilters(JSON.parse(appliedFiltersData))
      } catch (error) {
        console.error("Error loading applied filters:", error)
      }
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("vehicle-saved-filters", JSON.stringify(savedFilters))
    }
  }, [savedFilters, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("vehicle-applied-filters", JSON.stringify(appliedFilters))
    }
  }, [appliedFilters, isInitialized])

  const saveFilter = (name: string, description: string, filters: FilterState) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      description,
      filters,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSavedFilters((prev) => [...prev, newFilter])
  }

  const updateFilter = (id: string, updates: Partial<SavedFilter>) => {
    setSavedFilters((prev) =>
      prev.map((filter) => (filter.id === id ? { ...filter, ...updates, updatedAt: new Date() } : filter)),
    )
  }

  const deleteFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((filter) => filter.id !== id))
    setAppliedFilters((prev) => prev.filter((applied) => applied.id !== id))
  }

  const applyFilter = (filterId: string) => {
    const filter = savedFilters.find((f) => f.id === filterId)
    if (filter && !appliedFilters.find((af) => af.id === filterId)) {
      setAppliedFilters((prev) => [
        ...prev,
        {
          id: filterId,
          name: filter.name,
          active: true,
        },
      ])
    }
  }

  const removeAppliedFilter = (filterId: string) => {
    setAppliedFilters((prev) => prev.filter((applied) => applied.id !== filterId))
  }

  const clearAppliedFilters = () => {
    setAppliedFilters([])
  }

  const getCombinedFilters = (): FilterState => {
    const activeFilters = appliedFilters.filter((af) => af.active)
    const combinedFilters: FilterState = {
      performance: { minPower: null, maxPower: null, maxAcceleration: null, minTopSpeed: null },
      consumption: { maxFuelConsumption: null, minRange: null, fuelType: null },
      dimensions: { minLength: null, maxLength: null, minSeats: null, maxWeight: null },
      comfort: { airConditioning: null, leatherSeats: null, sunroof: null, heatedSeats: null },
      safety: { airbags: null, abs: null, stabilityControl: null, blindSpotMonitoring: null },
      utility: { minTrunkCapacity: null, towingCapacity: null, roofRails: null, foldingSeats: null },
      ownership: { minPrice: null, maxPrice: null, maxMaintenanceCost: null, maxDepreciation: null },
    }

    activeFilters.forEach((appliedFilter) => {
      const savedFilter = savedFilters.find((sf) => sf.id === appliedFilter.id)
      if (savedFilter) {
        // Combinar filtros (tomar el más restrictivo)
        Object.keys(combinedFilters).forEach((category) => {
          const categoryKey = category as keyof FilterState
          Object.keys(combinedFilters[categoryKey]).forEach((field) => {
            const currentValue = (combinedFilters[categoryKey] as any)[field]
            const filterValue = (savedFilter.filters[categoryKey] as any)[field]

            if (filterValue !== null && filterValue !== undefined) {
              if (currentValue === null || currentValue === undefined) {
                ;(combinedFilters[categoryKey] as any)[field] = filterValue
              } else {
                // Lógica para combinar valores (más restrictivo)
                if (typeof filterValue === "number" && typeof currentValue === "number") {
                  if (field.startsWith("min")) {
                    ;(combinedFilters[categoryKey] as any)[field] = Math.max(currentValue, filterValue)
                  } else if (field.startsWith("max")) {
                    ;(combinedFilters[categoryKey] as any)[field] = Math.min(currentValue, filterValue)
                  }
                } else if (typeof filterValue === "boolean") {
                  ;(combinedFilters[categoryKey] as any)[field] = filterValue
                } else {
                  ;(combinedFilters[categoryKey] as any)[field] = filterValue
                }
              }
            }
          })
        })
      }
    })

    return combinedFilters
  }

  return (
    <SavedFiltersContext.Provider
      value={{
        savedFilters,
        appliedFilters,
        saveFilter,
        updateFilter,
        deleteFilter,
        applyFilter,
        removeAppliedFilter,
        clearAppliedFilters,
        getCombinedFilters,
      }}
    >
      {children}
    </SavedFiltersContext.Provider>
  )
}

export function useSavedFilters() {
  const context = useContext(SavedFiltersContext)
  if (context === undefined) {
    throw new Error("useSavedFilters must be used within a SavedFiltersProvider")
  }
  return context
}
