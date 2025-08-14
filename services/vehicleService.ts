import apiClient from '@/lib/api';
import type {
  ApiVehicle,
  ApiVehicleCharacteristic,
  CreateVehicleDto,
  AssignCharacteristicToVehicleDto,
} from '@/types/api';

export const vehicleService = {
  // Obtener todos los vehículos
  async getVehicles(): Promise<ApiVehicle[]> {
    const response = await apiClient.get('/vehicles');
    return response.data;
  },

  // Obtener vehículo por ID
  async getVehicleById(id: string): Promise<ApiVehicle> {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  // Crear nuevo vehículo
  async createVehicle(vehicle: CreateVehicleDto): Promise<ApiVehicle> {
    const response = await apiClient.post('/vehicles', vehicle);
    return response.data;
  },

  // Actualizar vehículo
  async updateVehicle(
    id: string,
    vehicle: Partial<CreateVehicleDto>
  ): Promise<ApiVehicle> {
    const response = await apiClient.patch(`/vehicles/${id}`, vehicle);
    return response.data;
  },

  // Eliminar vehículo
  async deleteVehicle(id: string): Promise<void> {
    await apiClient.delete(`/vehicles/${id}`);
  },

  // Obtener características de un vehículo
  async getVehicleCharacteristics(
    vehicleId: string
  ): Promise<ApiVehicleCharacteristic[]> {
    const response = await apiClient.get(
      `/vehicles/${vehicleId}/characteristics`
    );
    return response.data;
  },

  // Asignar característica a vehículo
  async assignCharacteristicToVehicle(
    vehicleId: string,
    data: AssignCharacteristicToVehicleDto
  ): Promise<ApiVehicleCharacteristic> {
    const response = await apiClient.post(
      `/vehicles/${vehicleId}/characteristics`,
      data
    );
    return response.data;
  },

  // Remover característica de vehículo
  async removeCharacteristicFromVehicle(
    characteristicId: string
  ): Promise<void> {
    await apiClient.delete(`/vehicles/characteristics/${characteristicId}`);
  },
};
