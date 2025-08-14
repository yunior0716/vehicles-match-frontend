import apiClient from '@/lib/api';

export const seedService = {
  // Ejecutar seed de características
  async seedCharacteristics(): Promise<void> {
    await apiClient.post('/seed/characteristics');
  },
};
