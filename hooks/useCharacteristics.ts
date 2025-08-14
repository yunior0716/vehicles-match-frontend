import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { characteristicService } from '@/services/characteristicService';
import type { ApiCharacteristic, CreateCharacteristicDto } from '@/types/api';

// Query keys para características
export const characteristicKeys = {
  all: ['characteristics'] as const,
  lists: () => [...characteristicKeys.all, 'list'] as const,
  list: (filters: string) =>
    [...characteristicKeys.lists(), { filters }] as const,
  details: () => [...characteristicKeys.all, 'detail'] as const,
  detail: (id: number) => [...characteristicKeys.details(), id] as const,
};

// Hook para obtener todas las características
export const useCharacteristics = () => {
  return useQuery({
    queryKey: characteristicKeys.lists(),
    queryFn: characteristicService.getCharacteristics,
  });
};

// Hook para obtener una característica por ID
export const useCharacteristic = (id: number) => {
  return useQuery({
    queryKey: characteristicKeys.detail(id),
    queryFn: () => characteristicService.getCharacteristicById(id),
    enabled: !!id,
  });
};

// Hook para crear una característica
export const useCreateCharacteristic = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiCharacteristic, Error, CreateCharacteristicDto>({
    mutationFn: (characteristic) =>
      characteristicService.createCharacteristic(characteristic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characteristicKeys.lists() });
    },
  });
};

// Hook para actualizar una característica
export const useUpdateCharacteristic = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiCharacteristic,
    Error,
    { id: number; characteristic: Partial<CreateCharacteristicDto> }
  >({
    mutationFn: ({ id, characteristic }) =>
      characteristicService.updateCharacteristic(id, characteristic),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: characteristicKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: characteristicKeys.lists() });
    },
  });
};

// Hook para eliminar una característica
export const useDeleteCharacteristic = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => characteristicService.deleteCharacteristic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characteristicKeys.lists() });
    },
  });
};
