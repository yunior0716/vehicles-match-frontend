import type { ApiVehicle, ApiCharacteristic, ApiFilter } from '@/types/api';

// Adaptador para convertir vehículo de la API al formato del frontend
export function adaptApiVehicleToFrontend(apiVehicle: ApiVehicle) {
  return {
    id: apiVehicle.id.toString(),
    brand: apiVehicle.brand,
    model: apiVehicle.model,
    year: apiVehicle.year,
    fuel: apiVehicle.fuel,
    transmission: apiVehicle.transmission,
    seats: apiVehicle.seats,
    doors: apiVehicle.doors,
    carrocery: apiVehicle.carrocery,
    price: apiVehicle.price,
    image: apiVehicle.image,
    description: apiVehicle.description,
    // Estructura simplificada para mantener compatibilidad
    type: apiVehicle.carrocery,
    images: [apiVehicle.image],
    rating: 0, // Valor por defecto
    specs: {
      performance: {
        power: 0,
        acceleration: 0,
        topSpeed: 0,
        transmission: apiVehicle.transmission,
      },
      consumption: {
        fuelConsumption: 0,
        range: 0,
        fuelType: apiVehicle.fuel,
        tankCapacity: 0,
      },
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        seats: apiVehicle.seats,
      },
      comfort: {
        airConditioning: false,
        leatherSeats: false,
        sunroof: false,
        heatedSeats: false,
      },
      safety: {
        airbags: false,
        abs: false,
        stabilityControl: false,
        blindSpotMonitoring: false,
        safetyRating: 0,
      },
      utility: {
        trunkCapacity: 0,
        towingCapacity: false,
        roofRails: false,
        foldingSeats: false,
      },
      ownership: {
        price: apiVehicle.price,
        maintenanceCost: 0,
        depreciation: 0,
      },
    },
  };
}

// Adaptador para convertir del formato frontend a la API
export function adaptFrontendVehicleToApi(frontendVehicle: any) {
  return {
    brand: frontendVehicle.brand,
    model: frontendVehicle.model,
    year: frontendVehicle.year,
    fuel:
      frontendVehicle.fuel ||
      frontendVehicle.specs?.consumption?.fuelType ||
      'gasoline',
    transmission:
      frontendVehicle.transmission ||
      frontendVehicle.specs?.performance?.transmission ||
      'manual',
    seats:
      frontendVehicle.seats || frontendVehicle.specs?.dimensions?.seats || 5,
    doors: frontendVehicle.doors || 4,
    carrocery: frontendVehicle.carrocery || frontendVehicle.type || 'sedan',
    price:
      frontendVehicle.price || frontendVehicle.specs?.ownership?.price || 0,
    image: frontendVehicle.image || frontendVehicle.images?.[0] || '',
    description: frontendVehicle.description || '',
  };
}

// Adaptador para características
export function adaptApiCharacteristicToFrontend(
  apiCharacteristic: ApiCharacteristic
) {
  return {
    id: apiCharacteristic.id.toString(),
    name: apiCharacteristic.name,
    category: 'utility' as const, // Valor por defecto
    type: mapDataTypeToFrontendType(apiCharacteristic.data_type),
    unit: apiCharacteristic.unit,
    description: apiCharacteristic.description,
    createdAt: new Date(),
  };
}

function mapDataTypeToFrontendType(
  dataType: string
): 'number' | 'boolean' | 'string' | 'select' {
  switch (dataType) {
    case 'number':
    case 'decimal':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'text':
    case 'date':
    default:
      return 'string';
  }
}

// Adaptador para filtros
export function adaptApiFilterToFrontend(apiFilter: ApiFilter) {
  return {
    id: apiFilter.id,
    name: apiFilter.name,
    description: apiFilter.description,
    createdAt: apiFilter.createdAt ? new Date(apiFilter.createdAt) : new Date(),
    characteristics: apiFilter.filterCharacteristics || [],
  };
}
