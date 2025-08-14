"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Characteristic } from "@/types/characteristics"
import { defaultCharacteristics } from "@/data/characteristics"

interface CharacteristicsContextType {
  characteristics: Characteristic[]
  addCharacteristic: (characteristic: Omit<Characteristic, "id" | "createdAt">) => void
  updateCharacteristic: (id: string, characteristic: Partial<Characteristic>) => void
  deleteCharacteristic: (id: string) => void
  getCharacteristicsByCategory: (category: string) => Characteristic[]
}

const CharacteristicsContext = createContext<CharacteristicsContextType | undefined>(undefined)

export function CharacteristicsProvider({ children }: { children: ReactNode }) {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedCharacteristics = localStorage.getItem("vehicle-characteristics")
    if (savedCharacteristics) {
      try {
        const parsed = JSON.parse(savedCharacteristics)
        setCharacteristics(
          parsed.map((char: any) => ({
            ...char,
            createdAt: new Date(char.createdAt),
          })),
        )
      } catch (error) {
        console.error("Error loading characteristics:", error)
        setCharacteristics(defaultCharacteristics)
      }
    } else {
      setCharacteristics(defaultCharacteristics)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("vehicle-characteristics", JSON.stringify(characteristics))
    }
  }, [characteristics, isInitialized])

  const addCharacteristic = (characteristic: Omit<Characteristic, "id" | "createdAt">) => {
    const newCharacteristic: Characteristic = {
      ...characteristic,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setCharacteristics((prev) => [...prev, newCharacteristic])
  }

  const updateCharacteristic = (id: string, updates: Partial<Characteristic>) => {
    setCharacteristics((prev) => prev.map((char) => (char.id === id ? { ...char, ...updates } : char)))
  }

  const deleteCharacteristic = (id: string) => {
    setCharacteristics((prev) => prev.filter((char) => char.id !== id))
  }

  const getCharacteristicsByCategory = (category: string) => {
    return characteristics.filter((char) => char.category === category)
  }

  return (
    <CharacteristicsContext.Provider
      value={{
        characteristics,
        addCharacteristic,
        updateCharacteristic,
        deleteCharacteristic,
        getCharacteristicsByCategory,
      }}
    >
      {children}
    </CharacteristicsContext.Provider>
  )
}

export function useCharacteristics() {
  const context = useContext(CharacteristicsContext)
  if (context === undefined) {
    throw new Error("useCharacteristics must be used within a CharacteristicsProvider")
  }
  return context
}
