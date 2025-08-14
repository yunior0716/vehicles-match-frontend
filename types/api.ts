// Tipos para la API basados en la documentación
export interface ApiVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiCharacteristic {
  id: number;
  name: string;
  data_type: 'number' | 'text' | 'boolean' | 'select';
  unit?: string;
  description?: string;
}

export interface ApiVehicleCharacteristic {
  id: string;
  vehicle_id: string;
  characteristic_id: number;
  value: string;
  characteristic?: ApiCharacteristic;
}

export interface ApiFilter {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiFilterCharacteristic {
  id: string;
  filter_id: string;
  characteristic_id: number;
  min_value?: string;
  max_value?: string;
  exact_value?: string;
  characteristic?: ApiCharacteristic;
}

// DTOs para crear/actualizar
export interface CreateVehicleDto {
  brand: string;
  model: string;
  year: number;
  price: number;
}

export interface CreateCharacteristicDto {
  name: string;
  data_type: 'number' | 'text' | 'boolean' | 'select';
  unit?: string;
  description?: string;
}

export interface CreateFilterDto {
  name: string;
  description?: string;
}

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
