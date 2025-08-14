import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import type {
  CreateVehicleDto,
  AssignCharacteristicToVehicleDto,
} from '@/types/api';

// Query keys para vehículos
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: string) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  characteristics: (id: string) =>
    [...vehicleKeys.detail(id), 'characteristics'] as const,
};

// Hook para obtener todos los vehículos
export const useVehicles = () => {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: vehicleService.getVehicles,
  });
};

// Hook para obtener un vehículo por ID
export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehicleService.getVehicleById(id),
    enabled: !!id,
  });
};

// Hook para obtener características de un vehículo
export const useVehicleCharacteristics = (vehicleId: string) => {
  return useQuery({
    queryKey: vehicleKeys.characteristics(vehicleId),
    queryFn: () => vehicleService.getVehicleCharacteristics(vehicleId),
    enabled: !!vehicleId,
  });
};

// Hook para crear un vehículo
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicle: CreateVehicleDto) =>
      vehicleService.createVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

// Hook para actualizar un vehículo
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      vehicle,
    }: {
      id: string;
      vehicle: Partial<CreateVehicleDto>;
    }) => vehicleService.updateVehicle(id, vehicle),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

// Hook para eliminar un vehículo
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
};

// Hook para asignar característica a vehículo
export const useAssignCharacteristicToVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicleId,
      data,
    }: {
      vehicleId: string;
      data: AssignCharacteristicToVehicleDto;
    }) => vehicleService.assignCharacteristicToVehicle(vehicleId, data),
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.characteristics(vehicleId),
      });
    },
  });
};

// Hook para remover característica de vehículo
export const useRemoveCharacteristicFromVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (characteristicId: string) =>
      vehicleService.removeCharacteristicFromVehicle(characteristicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
};
