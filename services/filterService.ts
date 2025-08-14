import apiClient from '@/lib/api';
import type {
  ApiFilter,
  ApiFilterCharacteristic,
  CreateFilterDto,
  AssignCharacteristicToFilterDto,
} from '@/types/api';

export const filterService = {
  // Obtener todos los filtros
  async getFilters(): Promise<ApiFilter[]> {
    const response = await apiClient.get('/filters');
    return response.data;
  },

  // Obtener filtro por ID
  async getFilterById(id: string): Promise<ApiFilter> {
    const response = await apiClient.get(`/filters/${id}`);
    return response.data;
  },

  // Crear nuevo filtro
  async createFilter(filter: CreateFilterDto): Promise<ApiFilter> {
    const response = await apiClient.post('/filters', filter);
    return response.data;
  },

  // Actualizar filtro
  async updateFilter(
    id: string,
    filter: Partial<CreateFilterDto>
  ): Promise<ApiFilter> {
    const response = await apiClient.patch(`/filters/${id}`, filter);
    return response.data;
  },

  // Eliminar filtro
  async deleteFilter(id: string): Promise<void> {
    await apiClient.delete(`/filters/${id}`);
  },

  // Obtener características de un filtro
  async getFilterCharacteristics(
    filterId: string
  ): Promise<ApiFilterCharacteristic[]> {
    const response = await apiClient.get(
      `/filters/${filterId}/characteristics`
    );
    return response.data;
  },

  // Agregar característica a filtro
  async addCharacteristicToFilter(
    filterId: string,
    data: AssignCharacteristicToFilterDto
  ): Promise<ApiFilterCharacteristic> {
    const response = await apiClient.post(
      `/filters/${filterId}/characteristics`,
      data
    );
    return response.data;
  },

  // Remover característica de filtro
  async removeCharacteristicFromFilter(
    characteristicId: string
  ): Promise<void> {
    await apiClient.delete(`/filters/characteristics/${characteristicId}`);
  },
};
