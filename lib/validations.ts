import type { CreateVehicleDto } from '@/types/api';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateVehicleData = (formData: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Verificar que formData existe
  if (!formData || typeof formData !== 'object') {
    errors.push({
      field: 'general',
      message: 'Datos del formulario inválidos',
    });
    return {
      isValid: false,
      errors,
    };
  }

  // Validaciones de campos requeridos
  if (
    !formData.brand ||
    typeof formData.brand !== 'string' ||
    !formData.brand.trim()
  ) {
    errors.push({
      field: 'brand',
      message: 'La marca es requerida',
    });
  }

  if (
    !formData.model ||
    typeof formData.model !== 'string' ||
    !formData.model.trim()
  ) {
    errors.push({
      field: 'model',
      message: 'El modelo es requerido',
    });
  }

  if (
    !formData.fuel ||
    typeof formData.fuel !== 'string' ||
    !formData.fuel.trim()
  ) {
    errors.push({
      field: 'fuel',
      message: 'El tipo de combustible es requerido',
    });
  }

  if (
    !formData.transmission ||
    typeof formData.transmission !== 'string' ||
    !formData.transmission.trim()
  ) {
    errors.push({
      field: 'transmission',
      message: 'El tipo de transmisión es requerido',
    });
  }

  if (
    !formData.carrocery ||
    typeof formData.carrocery !== 'string' ||
    !formData.carrocery.trim()
  ) {
    errors.push({
      field: 'carrocery',
      message: 'El tipo de carrocería es requerido',
    });
  }

  // Validaciones de campos numéricos
  const year = Number(formData.year);
  if (
    !formData.year ||
    isNaN(year) ||
    year <= 0 ||
    year < 1900 ||
    year > new Date().getFullYear() + 2
  ) {
    errors.push({
      field: 'year',
      message: `El año debe ser válido (entre 1900 y ${
        new Date().getFullYear() + 2
      })`,
    });
  }

  const price = Number(formData.price);
  if (!formData.price || isNaN(price) || price <= 0) {
    errors.push({
      field: 'price',
      message: 'El precio debe ser mayor a 0',
    });
  }

  const seats = Number(formData.seats);
  if (!formData.seats || isNaN(seats) || seats <= 0 || seats > 50) {
    errors.push({
      field: 'seats',
      message: 'El número de asientos debe ser válido (entre 1 y 50)',
    });
  }

  const doors = Number(formData.doors);
  if (!formData.doors || isNaN(doors) || doors <= 0 || doors > 10) {
    errors.push({
      field: 'doors',
      message: 'El número de puertas debe ser válido (entre 1 y 10)',
    });
  }

  // Validación de imagen (opcional pero si se proporciona debe ser válida)
  if (
    formData.image &&
    formData.image.trim() &&
    !isValidUrl(formData.image.trim())
  ) {
    errors.push({
      field: 'image',
      message: 'La URL de la imagen debe ser válida',
    });
  }

  // Validación de descripción (opcional pero con límite de caracteres)
  if (formData.description && formData.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'La descripción no puede exceder los 1000 caracteres',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeVehicleData = (formData: any): CreateVehicleDto => {
  return {
    brand: formData.brand?.trim() || '',
    model: formData.model?.trim() || '',
    year: parseInt(String(formData.year)) || 0,
    fuel: formData.fuel?.trim() || '',
    transmission: formData.transmission?.trim() || '',
    seats: parseInt(String(formData.seats)) || 0,
    doors: parseInt(String(formData.doors)) || 0,
    carrocery: formData.carrocery?.trim() || '',
    price: parseFloat(String(formData.price)) || 0,
    image: formData.image?.trim() || '',
    description: formData.description?.trim() || '',
  };
};

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const getValidationErrorMessage = (
  errors: ValidationError[]
): string => {
  if (errors.length === 0) return '';

  if (errors.length === 1) {
    return errors[0].message;
  }

  return `Se encontraron ${errors.length} errores:\n${errors
    .map((error) => `• ${error.message}`)
    .join('\n')}`;
};

// Interfaz para validaciones individuales por campo
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Validaciones individuales por campo
export const validateField = (
  fieldName: string,
  value: any
): FieldValidationResult => {
  switch (fieldName) {
    case 'brand':
      if (!value || !value.trim()) {
        return { isValid: false, error: 'La marca es requerida' };
      }
      return { isValid: true };

    case 'model':
      if (!value || !value.trim()) {
        return { isValid: false, error: 'El modelo es requerido' };
      }
      return { isValid: true };

    case 'year':
      const year = parseInt(value);
      if (
        !year ||
        year <= 0 ||
        year < 1900 ||
        year > new Date().getFullYear() + 2
      ) {
        return {
          isValid: false,
          error: `Año inválido (entre 1900 y ${new Date().getFullYear() + 2})`,
        };
      }
      return { isValid: true };

    case 'price':
      const price = parseFloat(value);
      if (!price || price <= 0) {
        return { isValid: false, error: 'El precio debe ser mayor a 0' };
      }
      return { isValid: true };

    case 'seats':
      const seats = parseInt(value);
      if (!seats || seats <= 0 || seats > 50) {
        return { isValid: false, error: 'Asientos inválidos (entre 1 y 50)' };
      }
      return { isValid: true };

    case 'doors':
      const doors = parseInt(value);
      if (!doors || doors <= 0 || doors > 10) {
        return { isValid: false, error: 'Puertas inválidas (entre 1 y 10)' };
      }
      return { isValid: true };

    case 'fuel':
      if (!value || !value.trim()) {
        return { isValid: false, error: 'El combustible es requerido' };
      }
      return { isValid: true };

    case 'transmission':
      if (!value || !value.trim()) {
        return { isValid: false, error: 'La transmisión es requerida' };
      }
      return { isValid: true };

    case 'carrocery':
      if (!value || !value.trim()) {
        return { isValid: false, error: 'La carrocería es requerida' };
      }
      return { isValid: true };

    case 'image':
      if (value && value.trim() && !isValidUrl(value.trim())) {
        return { isValid: false, error: 'URL de imagen inválida' };
      }
      return { isValid: true };

    case 'description':
      if (value && value.length > 1000) {
        return { isValid: false, error: 'Máximo 1000 caracteres' };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
};

// Función para limpiar valores antes de enviarlos para evitar NaN
export const cleanFormValue = (
  value: any,
  type: 'string' | 'number' = 'string'
): any => {
  if (type === 'number') {
    const num = parseFloat(String(value));
    return isNaN(num) ? 0 : num;
  }
  return value || '';
};
