export interface FilterState {
  performance: {
    minPower: number | null
    maxPower: number | null
    maxAcceleration: number | null
    minTopSpeed: number | null
  }
  consumption: {
    maxFuelConsumption: number | null
    minRange: number | null
    fuelType: string | null
  }
  dimensions: {
    minLength: number | null
    maxLength: number | null
    minSeats: number | null
    maxWeight: number | null
  }
  comfort: {
    airConditioning: boolean | null
    leatherSeats: boolean | null
    sunroof: boolean | null
    heatedSeats: boolean | null
  }
  safety: {
    airbags: boolean | null
    abs: boolean | null
    stabilityControl: boolean | null
    blindSpotMonitoring: boolean | null
  }
  utility: {
    minTrunkCapacity: number | null
    towingCapacity: boolean | null
    roofRails: boolean | null
    foldingSeats: boolean | null
  }
  ownership: {
    minPrice: number | null
    maxPrice: number | null
    maxMaintenanceCost: number | null
    maxDepreciation: number | null
  }
}

export const initialFilters: FilterState = {
  performance: {
    minPower: null,
    maxPower: null,
    maxAcceleration: null,
    minTopSpeed: null,
  },
  consumption: {
    maxFuelConsumption: null,
    minRange: null,
    fuelType: null,
  },
  dimensions: {
    minLength: null,
    maxLength: null,
    minSeats: null,
    maxWeight: null,
  },
  comfort: {
    airConditioning: null,
    leatherSeats: null,
    sunroof: null,
    heatedSeats: null,
  },
  safety: {
    airbags: null,
    abs: null,
    stabilityControl: null,
    blindSpotMonitoring: null,
  },
  utility: {
    minTrunkCapacity: null,
    towingCapacity: null,
    roofRails: null,
    foldingSeats: null,
  },
  ownership: {
    minPrice: null,
    maxPrice: null,
    maxMaintenanceCost: null,
    maxDepreciation: null,
  },
}

export function parseFiltersFromQuery(searchParams: URLSearchParams): FilterState {
  const filters: FilterState = {
    performance: {
      minPower: null,
      maxPower: null,
      maxAcceleration: null,
      minTopSpeed: null,
    },
    consumption: {
      maxFuelConsumption: null,
      minRange: null,
      fuelType: null,
    },
    dimensions: {
      minLength: null,
      maxLength: null,
      minSeats: null,
      maxWeight: null,
    },
    comfort: {
      airConditioning: null,
      leatherSeats: null,
      sunroof: null,
      heatedSeats: null,
    },
    safety: {
      airbags: null,
      abs: null,
      stabilityControl: null,
      blindSpotMonitoring: null,
    },
    utility: {
      minTrunkCapacity: null,
      towingCapacity: null,
      roofRails: null,
      foldingSeats: null,
    },
    ownership: {
      minPrice: null,
      maxPrice: null,
      maxMaintenanceCost: null,
      maxDepreciation: null,
    },
  }
  
  // Only process if there are search params
  if (searchParams.size === 0) {
    return filters
  }
  
  for (const [key, value] of searchParams.entries()) {
    const [category, field] = key.split('.')
    if (category && field && filters[category as keyof FilterState]) {
      const categoryFilters = filters[category as keyof FilterState] as any
      
      if (field in categoryFilters) {
        // Handle boolean values
        if (value === 'true') {
          categoryFilters[field] = true
        } else if (value === 'false') {
          categoryFilters[field] = false
        } else {
          // Handle numeric values
          const numValue = parseFloat(value)
          if (!isNaN(numValue)) {
            categoryFilters[field] = numValue
          } else if (value.trim() !== '') {
            // Handle string values
            categoryFilters[field] = value
          }
        }
      }
    }
  }
  
  return filters
}
