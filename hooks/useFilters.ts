import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filterService } from '@/services/filterService';
import type {
  ApiFilter,
  ApiFilterCharacteristic,
  CreateFilterDto,
  UpdateFilterDto,
  AssignCharacteristicToFilterDto,
} from '@/types/api';

// Query keys para filtros
export const filterKeys = {
  all: ['filters'] as const,
  lists: () => [...filterKeys.all, 'list'] as const,
  list: (filters: string) => [...filterKeys.lists(), { filters }] as const,
  details: () => [...filterKeys.all, 'detail'] as const,
  detail: (id: number) => [...filterKeys.details(), id] as const,
  characteristics: (id: number) =>
    [...filterKeys.detail(id), 'characteristics'] as const,
};

// Hook para obtener todos los filtros
export const useFilters = () => {
  return useQuery({
    queryKey: filterKeys.lists(),
    queryFn: filterService.getFilters,
  });
};

// Hook para obtener un filtro por ID
export const useFilter = (id: number) => {
  return useQuery({
    queryKey: filterKeys.detail(id),
    queryFn: () => filterService.getFilterById(id),
    enabled: !!id,
  });
};

// Hook para obtener características de un filtro
export const useFilterCharacteristics = (filterId: number) => {
  return useQuery({
    queryKey: filterKeys.characteristics(filterId),
    queryFn: () => filterService.getFilterCharacteristics(filterId),
    enabled: !!filterId,
  });
};

// Hook para crear un filtro
export const useCreateFilter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filter: CreateFilterDto) => filterService.createFilter(filter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filterKeys.lists() });
    },
  });
};

// Hook para actualizar un filtro
export const useUpdateFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiFilter,
    Error,
    { id: number; filter: Partial<CreateFilterDto> }
  >({
    mutationFn: ({ id, filter }) => filterService.updateFilter(id, filter),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: filterKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: filterKeys.lists() });
    },
  });
};

// Hook para eliminar un filtro
export const useDeleteFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => filterService.deleteFilter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filterKeys.lists() });
    },
  });
};

// Hook para agregar característica a filtro
export const useAddCharacteristicToFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiFilterCharacteristic,
    Error,
    { filterId: number; data: AssignCharacteristicToFilterDto }
  >({
    mutationFn: ({ filterId, data }) =>
      filterService.addCharacteristicToFilter(filterId, data),
    onSuccess: (_, { filterId }) => {
      queryClient.invalidateQueries({
        queryKey: filterKeys.characteristics(filterId),
      });
    },
  });
};

// Hook para remover característica de filtro
export const useRemoveCharacteristicFromFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (characteristicId) =>
      filterService.removeCharacteristicFromFilter(characteristicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filterKeys.all });
    },
  });
};
