import { AlertCircle } from 'lucide-react';
import type { ValidationError } from '@/lib/validations';

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
  show: boolean;
}

export const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  show,
}) => {
  if (!show || errors.length === 0) return null;

  return (
    <div className="relative w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
        <div>
          <h5 className="font-medium mb-1">Errores de validación</h5>
          {errors.length === 1 ? (
            <p>{errors[0].message}</p>
          ) : (
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
