"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterState } from "@/types/filters"

interface FilterCategoryProps {
  category: keyof FilterState
  filters: any
  onChange: (field: string, value: any) => void
}

export function FilterCategory({ category, filters, onChange }: FilterCategoryProps) {
  const renderPerformanceFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="minPower">Potencia mínima (HP)</Label>
        <Input
          id="minPower"
          type="number"
          placeholder="ej. 150"
          value={filters.minPower || ''}
          onChange={(e) => onChange('minPower', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="maxPower">Potencia máxima (HP)</Label>
        <Input
          id="maxPower"
          type="number"
          placeholder="ej. 500"
          value={filters.maxPower || ''}
          onChange={(e) => onChange('maxPower', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="maxAcceleration">Aceleración máxima 0-100 (s)</Label>
        <Input
          id="maxAcceleration"
          type="number"
          step="0.1"
          placeholder="ej. 8.0"
          value={filters.maxAcceleration || ''}
          onChange={(e) => onChange('maxAcceleration', e.target.value ? parseFloat(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="minTopSpeed">Velocidad máxima mínima (km/h)</Label>
        <Input
          id="minTopSpeed"
          type="number"
          placeholder="ej. 180"
          value={filters.minTopSpeed || ''}
          onChange={(e) => onChange('minTopSpeed', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
    </div>
  )

  const renderConsumptionFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="maxFuelConsumption">Consumo máximo (L/100km)</Label>
        <Input
          id="maxFuelConsumption"
          type="number"
          step="0.1"
          placeholder="ej. 8.0"
          value={filters.maxFuelConsumption || ''}
          onChange={(e) => onChange('maxFuelConsumption', e.target.value ? parseFloat(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="minRange">Autonomía mínima (km)</Label>
        <Input
          id="minRange"
          type="number"
          placeholder="ej. 500"
          value={filters.minRange || ''}
          onChange={(e) => onChange('minRange', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="fuelType">Tipo de combustible</Label>
        <Select value={filters.fuelType || 'all'} onValueChange={(value) => onChange('fuelType', value === 'all' ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Gasolina">Gasolina</SelectItem>
            <SelectItem value="Diésel">Diésel</SelectItem>
            <SelectItem value="Híbrido">Híbrido</SelectItem>
            <SelectItem value="Eléctrico">Eléctrico</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderDimensionsFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="minLength">Longitud mínima (mm)</Label>
        <Input
          id="minLength"
          type="number"
          placeholder="ej. 4000"
          value={filters.minLength || ''}
          onChange={(e) => onChange('minLength', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="maxLength">Longitud máxima (mm)</Label>
        <Input
          id="maxLength"
          type="number"
          placeholder="ej. 5000"
          value={filters.maxLength || ''}
          onChange={(e) => onChange('maxLength', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="minSeats">Asientos mínimos</Label>
        <Select value={filters.minSeats?.toString() || 'all'} onValueChange={(value) => onChange('minSeats', value === 'all' ? null : parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
            <SelectItem value="7">7+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="maxWeight">Peso máximo (kg)</Label>
        <Input
          id="maxWeight"
          type="number"
          placeholder="ej. 2000"
          value={filters.maxWeight || ''}
          onChange={(e) => onChange('maxWeight', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
    </div>
  )

  const renderComfortFilters = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="airConditioning">Aire acondicionado</Label>
        <Switch
          id="airConditioning"
          checked={filters.airConditioning === true}
          onCheckedChange={(checked) => onChange('airConditioning', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="leatherSeats">Asientos de cuero</Label>
        <Switch
          id="leatherSeats"
          checked={filters.leatherSeats === true}
          onCheckedChange={(checked) => onChange('leatherSeats', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="sunroof">Techo solar</Label>
        <Switch
          id="sunroof"
          checked={filters.sunroof === true}
          onCheckedChange={(checked) => onChange('sunroof', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="heatedSeats">Asientos calefaccionados</Label>
        <Switch
          id="heatedSeats"
          checked={filters.heatedSeats === true}
          onCheckedChange={(checked) => onChange('heatedSeats', checked ? true : null)}
        />
      </div>
    </div>
  )

  const renderSafetyFilters = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="airbags">Airbags</Label>
        <Switch
          id="airbags"
          checked={filters.airbags === true}
          onCheckedChange={(checked) => onChange('airbags', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="abs">Sistema ABS</Label>
        <Switch
          id="abs"
          checked={filters.abs === true}
          onCheckedChange={(checked) => onChange('abs', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="stabilityControl">Control de estabilidad</Label>
        <Switch
          id="stabilityControl"
          checked={filters.stabilityControl === true}
          onCheckedChange={(checked) => onChange('stabilityControl', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="blindSpotMonitoring">Monitor punto ciego</Label>
        <Switch
          id="blindSpotMonitoring"
          checked={filters.blindSpotMonitoring === true}
          onCheckedChange={(checked) => onChange('blindSpotMonitoring', checked ? true : null)}
        />
      </div>
    </div>
  )

  const renderUtilityFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="minTrunkCapacity">Capacidad mínima maletero (L)</Label>
        <Input
          id="minTrunkCapacity"
          type="number"
          placeholder="ej. 300"
          value={filters.minTrunkCapacity || ''}
          onChange={(e) => onChange('minTrunkCapacity', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="towingCapacity">Capacidad de remolque</Label>
        <Switch
          id="towingCapacity"
          checked={filters.towingCapacity === true}
          onCheckedChange={(checked) => onChange('towingCapacity', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="roofRails">Rieles de techo</Label>
        <Switch
          id="roofRails"
          checked={filters.roofRails === true}
          onCheckedChange={(checked) => onChange('roofRails', checked ? true : null)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="foldingSeats">Asientos abatibles</Label>
        <Switch
          id="foldingSeats"
          checked={filters.foldingSeats === true}
          onCheckedChange={(checked) => onChange('foldingSeats', checked ? true : null)}
        />
      </div>
    </div>
  )

  const renderOwnershipFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="minPrice">Precio mínimo ($)</Label>
        <Input
          id="minPrice"
          type="number"
          placeholder="ej. 20000"
          value={filters.minPrice || ''}
          onChange={(e) => onChange('minPrice', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="maxPrice">Precio máximo ($)</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="ej. 80000"
          value={filters.maxPrice || ''}
          onChange={(e) => onChange('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="maxMaintenanceCost">Costo mantenimiento máximo ($/año)</Label>
        <Input
          id="maxMaintenanceCost"
          type="number"
          placeholder="ej. 2000"
          value={filters.maxMaintenanceCost || ''}
          onChange={(e) => onChange('maxMaintenanceCost', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>
      <div>
        <Label htmlFor="maxDepreciation">Depreciación máxima (%/año)</Label>
        <Input
          id="maxDepreciation"
          type="number"
          step="0.1"
          placeholder="ej. 15.0"
          value={filters.maxDepreciation || ''}
          onChange={(e) => onChange('maxDepreciation', e.target.value ? parseFloat(e.target.value) : null)}
        />
      </div>
    </div>
  )

  switch (category) {
    case 'performance':
      return renderPerformanceFilters()
    case 'consumption':
      return renderConsumptionFilters()
    case 'dimensions':
      return renderDimensionsFilters()
    case 'comfort':
      return renderComfortFilters()
    case 'safety':
      return renderSafetyFilters()
    case 'utility':
      return renderUtilityFilters()
    case 'ownership':
      return renderOwnershipFilters()
    default:
      return <div>Categoría no encontrada</div>
  }
}
