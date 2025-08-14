import type { Vehicle } from '@/types/vehicle';
import type { ApiVehicle, ApiVehicleCharacteristic } from '@/types/api';

// Mapeo de características de la API a las propiedades del vehículo
const characteristicMapping: Record<string, string> = {
  'Potencia del motor': 'specs.performance.power',
  'Aceleración 0-100': 'specs.performance.acceleration',
  'Velocidad máxima': 'specs.performance.topSpeed',
  Transmisión: 'specs.performance.transmission',
  'Consumo urbano': 'specs.consumption.fuelConsumption',
  Autonomía: 'specs.consumption.range',
  'Tipo de combustible': 'specs.consumption.fuelType',
  'Capacidad del tanque': 'specs.consumption.tankCapacity',
  Largo: 'specs.dimensions.length',
  Ancho: 'specs.dimensions.width',
  Altura: 'specs.dimensions.height',
  Peso: 'specs.dimensions.weight',
  'Número de plazas': 'specs.dimensions.seats',
  'Aire acondicionado automático': 'specs.comfort.airConditioning',
  'Asientos de cuero': 'specs.comfort.leatherSeats',
  'Techo solar': 'specs.comfort.sunroof',
  'Asientos calefactables': 'specs.comfort.heatedSeats',
  Airbags: 'specs.safety.airbags',
  'Frenos ABS': 'specs.safety.abs',
  'Control de estabilidad': 'specs.safety.stabilityControl',
  'Monitoreo de punto ciego': 'specs.safety.blindSpotMonitoring',
  'Calificación de seguridad': 'specs.safety.safetyRating',
  'Capacidad de maletero': 'specs.utility.trunkCapacity',
  'Capacidad de remolque': 'specs.utility.towingCapacity',
  'Precio de compra': 'specs.ownership.price',
};

function setNestedProperty(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}

function parseValue(value: string, dataType: string): any {
  switch (dataType) {
    case 'number':
      return parseFloat(value) || 0;
    case 'boolean':
      return value.toLowerCase() === 'true' || value === '1';
    case 'text':
    case 'select':
    default:
      return value;
  }
}

export function adaptApiVehicleToVehicle(
  apiVehicle: ApiVehicle,
  characteristics: ApiVehicleCharacteristic[] = []
): Vehicle {
  // Estructura base del vehículo
  const vehicle: Vehicle = {
    id: apiVehicle.id,
    brand: apiVehicle.brand,
    model: apiVehicle.model,
    type: 'Sedán', // Valor por defecto, se puede determinar por características
    description: `${apiVehicle.brand} ${apiVehicle.model} ${apiVehicle.year}`,
    images: ['/placeholder.jpg'], // Imágenes placeholder por defecto
    rating: 4, // Rating por defecto
    specs: {
      performance: {
        power: 0,
        acceleration: 0,
        topSpeed: 0,
        transmission: 'Automática',
      },
      consumption: {
        fuelConsumption: 0,
        range: 0,
        fuelType: 'Gasolina',
        tankCapacity: 0,
      },
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        seats: 5,
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
        maintenanceCost: 1500,
        depreciation: 10,
      },
    },
  };

  // Aplicar características
  characteristics.forEach((char) => {
    if (char.characteristic) {
      const mappingKey = char.characteristic.name;
      const propertyPath = characteristicMapping[mappingKey];

      if (propertyPath) {
        const parsedValue = parseValue(
          char.value,
          char.characteristic.data_type
        );
        setNestedProperty(vehicle, propertyPath, parsedValue);
      }
    }
  });

  return vehicle;
}

export function adaptVehicleToApiVehicle(vehicle: Vehicle): ApiVehicle {
  return {
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: new Date().getFullYear(), // Año por defecto si no está disponible
    price: vehicle.specs.ownership.price,
  };
}

// Función para determinar el tipo de vehículo basado en características
export function determineVehicleType(
  characteristics: ApiVehicleCharacteristic[]
): string {
  // Lógica básica para determinar el tipo basado en características
  const seats = characteristics.find(
    (c) => c.characteristic?.name === 'Número de plazas'
  );
  const height = characteristics.find(
    (c) => c.characteristic?.name === 'Altura'
  );

  if (seats && parseInt(seats.value) > 5) {
    return 'SUV';
  }

  if (height && parseInt(height.value) > 1600) {
    return 'SUV';
  }

  return 'Sedán'; // Valor por defecto
}
