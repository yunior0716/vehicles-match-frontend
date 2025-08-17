'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (vehicleId: string) => void;
  removeFromFavorites: (vehicleId: string) => void;
  clearFavorites: () => void;
  isFavorite: (vehicleId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar favoritos del localStorage al inicializar
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('vehicle-favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      // En caso de error, limpiar localStorage
      localStorage.removeItem('vehicle-favorites');
    }
    setIsInitialized(true);
  }, []);

  // Guardar favoritos en localStorage cuando cambien (solo después de la inicialización)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('vehicle-favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isInitialized]);

  const addToFavorites = (vehicleId: string) => {
    setFavorites((prev) => {
      if (!prev.includes(vehicleId)) {
        return [...prev, vehicleId];
      }
      return prev;
    });
  };

  const removeFromFavorites = (vehicleId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== vehicleId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (vehicleId: string) => {
    return favorites.includes(vehicleId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
