import apiClient from '@/lib/api';
import type { ApiCharacteristic, CreateCharacteristicDto } from '@/types/api';

export const characteristicService = {
  // Obtener todas las características
  async getCharacteristics(): Promise<ApiCharacteristic[]> {
    const response = await apiClient.get('/characteristics');
    return response.data;
  },

  // Obtener característica por ID
  async getCharacteristicById(id: number): Promise<ApiCharacteristic> {
    const response = await apiClient.get(`/characteristics/${id}`);
    return response.data;
  },

  // Crear nueva característica
  async createCharacteristic(
    characteristic: CreateCharacteristicDto
  ): Promise<ApiCharacteristic> {
    const response = await apiClient.post('/characteristics', characteristic);
    return response.data;
  },

  // Actualizar característica
  async updateCharacteristic(
    id: number,
    characteristic: Partial<CreateCharacteristicDto>
  ): Promise<ApiCharacteristic> {
    const response = await apiClient.patch(
      `/characteristics/${id}`,
      characteristic
    );
    return response.data;
  },

  // Eliminar característica
  async deleteCharacteristic(id: number): Promise<void> {
    await apiClient.delete(`/characteristics/${id}`);
  },
};
