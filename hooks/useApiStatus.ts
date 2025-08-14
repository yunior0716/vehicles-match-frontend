import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ApiStatus {
  isConnected: boolean;
  isChecking: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export function useApiStatus() {
  const [status, setStatus] = useState<ApiStatus>({
    isConnected: false,
    isChecking: true,
    error: null,
    lastChecked: null,
  });

  const checkApiConnection = async () => {
    setStatus((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/characteristics`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setStatus({
          isConnected: true,
          isChecking: false,
          error: null,
          lastChecked: new Date(),
        });
      } else {
        throw new Error(`API respondió con status ${response.status}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setStatus({
        isConnected: false,
        isChecking: false,
        error: errorMessage,
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    checkApiConnection();

    // Verificar cada 5 minutos
    const interval = setInterval(checkApiConnection, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const showConnectionInstructions = () => {
    toast.error(
      'No se puede conectar con la API. Asegúrate de que esté corriendo en http://localhost:3000',
      {
        duration: 10000,
        action: {
          label: 'Ver instrucciones',
          onClick: () => {
            window.open('/admin', '_blank');
          },
        },
      }
    );
  };

  return {
    ...status,
    checkApiConnection,
    showConnectionInstructions,
  };
}
