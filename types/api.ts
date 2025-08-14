// Tipos para la API basados en la documentación
export interface ApiVehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  seats: number;
  doors: number;
  carrocery: string;
  price: number;
  image: string;
  description: string;
  vehicleCharacteristics?: ApiVehicleCharacteristic[];
}

export interface ApiCharacteristic {
  id: number;
  name: string;
  data_type: 'text' | 'number' | 'decimal' | 'boolean' | 'date';
  unit?: string;
  description?: string;
}

export interface ApiVehicleCharacteristic {
  id: number;
  vehicleId: number;
  characteristicId: number;
  value: string;
  vehicle?: ApiVehicle;
  characteristic?: ApiCharacteristic;
}

export interface ApiFilter {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  filterCharacteristics?: ApiFilterCharacteristic[];
}

export interface ApiFilterCharacteristic {
  id: string;
  filterId: string;
  characteristicId: number;
  minValue?: string;
  maxValue?: string;
  exactValue?: string;
  filter?: ApiFilter;
  characteristic?: ApiCharacteristic;
}

// DTOs para crear/actualizar
export interface CreateVehicleDto {
  brand: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  seats: number;
  doors: number;
  carrocery: string;
  price: number;
  image: string;
  description: string;
}

export interface CreateCharacteristicDto {
  name: string;
  data_type: 'text' | 'number' | 'decimal' | 'boolean' | 'date';
  unit?: string;
  description?: string;
}

export interface CreateFilterDto {
  name: string;
  description?: string;
  characteristics?: CreateFilterCharacteristicDto[];
}

export interface CreateFilterCharacteristicDto {
  characteristicId: number;
  minValue?: string;
  maxValue?: string;
  exactValue?: string;
}

export interface CreateVehicleCharacteristicDto {
  vehicleId: number;
  characteristicId: number;
  value: string;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}
export interface UpdateCharacteristicDto
  extends Partial<CreateCharacteristicDto> {}
export interface UpdateFilterDto extends Partial<CreateFilterDto> {}
export interface UpdateVehicleCharacteristicDto
  extends Partial<CreateVehicleCharacteristicDto> {}
export interface UpdateFilterCharacteristicDto
  extends Partial<CreateFilterCharacteristicDto> {}

// Tipos para asignar características (compatibilidad)
export interface AssignCharacteristicToVehicleDto {
  characteristicId: number;
  value: string;
}

export interface AssignCharacteristicToFilterDto {
  characteristicId: number;
  minValue?: string;
  maxValue?: string;
  exactValue?: string;
}
