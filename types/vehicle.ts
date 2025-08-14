export interface Vehicle {
  id: string
  brand: string
  model: string
  type: string
  description: string
  images: string[]
  rating: number
  specs: {
    performance: {
      power: number // HP
      acceleration: number // 0-100 km/h in seconds
      topSpeed: number // km/h
      transmission: string
    }
    consumption: {
      fuelConsumption: number // L/100km
      range: number // km
      fuelType: string
      tankCapacity: number // L
    }
    dimensions: {
      length: number // mm
      width: number // mm
      height: number // mm
      weight: number // kg
      seats: number
    }
    comfort: {
      airConditioning: boolean
      leatherSeats: boolean
      sunroof: boolean
      heatedSeats: boolean
    }
    safety: {
      airbags: boolean
      abs: boolean
      stabilityControl: boolean
      blindSpotMonitoring: boolean
      safetyRating: number // 1-5 stars
    }
    utility: {
      trunkCapacity: number // L
      towingCapacity: boolean
      roofRails: boolean
      foldingSeats: boolean
    }
    ownership: {
      price: number // USD
      maintenanceCost: number // USD per year
      depreciation: number // % per year
    }
  }
}
