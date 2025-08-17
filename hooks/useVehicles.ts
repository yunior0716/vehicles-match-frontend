import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import type {
  ApiVehicle,
  ApiVehicleCharacteristic,
  CreateVehicleDto,
  CreateVehicleCharacteristicDto,
  AssignCharacteristicToVehicleDto,
} from '@/types/api';

// Query keys para vehículos
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: string) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
  characteristics: (id: number) =>
    [...vehicleKeys.detail(id), 'characteristics'] as const,
};

// Hook para obtener todos los vehículos
export const useVehicles = () => {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: vehicleService.getVehicles,
  });
};

// Hook para obtener vehículos filtrados
export const useVehiclesByFilters = (filterIds: string[]) => {
  return useQuery({
    queryKey: vehicleKeys.list(filterIds.join(',')),
    queryFn: () => vehicleService.getVehiclesByFilters(filterIds),
    enabled: filterIds.length > 0,
  });
};

// Hook para obtener un vehículo por ID
export const useVehicle = (id: number) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleService.getVehicleById(id),
    enabled: !!id,
  });
};

// Hook para obtener características de un vehículo
export const useVehicleCharacteristics = (vehicleId: number) => {
  return useQuery({
    queryKey: vehicleKeys.characteristics(vehicleId),
    queryFn: () => vehicleService.getVehicleCharacteristics(vehicleId),
    enabled: !!vehicleId,
  });
};

// Hook para crear un vehículo
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiVehicle, Error, CreateVehicleDto>({
    mutationFn: (vehicle) => vehicleService.createVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

// Hook para actualizar un vehículo
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiVehicle,
    Error,
    { id: number; vehicle: Partial<CreateVehicleDto> }
  >({
    mutationFn: ({ id, vehicle }) => vehicleService.updateVehicle(id, vehicle),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

// Hook para eliminar un vehículo
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

// Hook para asignar característica a vehículo
export const useAssignCharacteristicToVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiVehicleCharacteristic,
    Error,
    CreateVehicleCharacteristicDto
  >({
    mutationFn: (data) => vehicleService.assignCharacteristicToVehicle(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.characteristics(data.vehicleId),
      });
    },
  });
};

// Hook para actualizar característica de vehículo
export const useUpdateVehicleCharacteristic = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiVehicleCharacteristic,
    Error,
    { id: number; data: Partial<CreateVehicleCharacteristicDto> }
  >({
    mutationFn: ({ id, data }) =>
      vehicleService.updateVehicleCharacteristic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
};

// Hook para remover característica de vehículo
export const useRemoveCharacteristicFromVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (characteristicId) =>
      vehicleService.removeCharacteristicFromVehicle(characteristicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
};
