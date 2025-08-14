export interface Characteristic {
  id: string
  name: string
  category: "performance" | "consumption" | "dimensions" | "comfort" | "safety" | "utility" | "ownership"
  type: "number" | "boolean" | "string" | "select"
  unit?: string
  options?: string[] // Para tipo select
  description?: string
  createdAt: Date
}

export interface CharacteristicValue {
  characteristicId: string
  value: string | number | boolean
}
