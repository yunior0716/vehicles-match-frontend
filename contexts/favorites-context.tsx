"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface FavoritesContextType {
  favorites: string[]
  addToFavorites: (vehicleId: string) => void
  removeFromFavorites: (vehicleId: string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar favoritos del localStorage al inicializar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('vehicle-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Guardar favoritos en localStorage cuando cambien (solo después de la inicialización)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('vehicle-favorites', JSON.stringify(favorites))
    }
  }, [favorites, isInitialized])

  const addToFavorites = (vehicleId: string) => {
    setFavorites(prev => {
      if (!prev.includes(vehicleId)) {
        return [...prev, vehicleId]
      }
      return prev
    })
  }

  const removeFromFavorites = (vehicleId: string) => {
    setFavorites(prev => prev.filter(id => id !== vehicleId))
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
