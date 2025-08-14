import type { FilterState } from "./filters"

export interface SavedFilter {
  id: string
  name: string
  description?: string
  filters: FilterState
  createdAt: Date
  updatedAt: Date
}

export interface AppliedFilter {
  id: string
  name: string
  active: boolean
}
