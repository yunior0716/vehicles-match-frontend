# Vehicle Recommendation App - Frontend

Esta es la aplicación frontend que consume la API de Vehicle Match desarrollada con Next.js, React y TypeScript.

## 🚀 Configuración Rápida

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Iniciar la aplicación

```bash
pnpm dev
```

La aplicación estará disponible en: `http://localhost:3001`

## 📋 Requisitos Previos

### API Backend

Asegúrate de tener tu API de NestJS corriendo:

1. **Clona y configura la API** según la documentación del backend
2. **Inicia PostgreSQL** con Docker:
   ```bash
   docker-compose up -d
   ```
3. **Inicia la API**:
   ```bash
   npm run start:dev
   ```
4. **Inicializa las características** (primera vez):
   ```bash
   curl -X POST http://localhost:3000/seed/characteristics
   ```

## 🛠️ Funcionalidades Implementadas

### ✅ Conexión completa con la API

- **Configuración de Axios** para llamadas HTTP
- **React Query** para manejo de estado del servidor
- **Manejo de errores** y estados de carga
- **Adaptadores** para convertir datos de la API al formato de la app

### ✅ Páginas principales

- **Inicio**: Landing page con información de la plataforma
- **Resultados**: Lista de vehículos con filtros y búsqueda
- **Detalles de vehículo**: Información completa de un vehículo específico
- **Favoritos**: Gestión de vehículos favoritos (local)

### ✅ Administración

- **Estado de la API**: Página para verificar conexión y configuración
- **Gestión de características**: CRUD completo de características técnicas
- **Inicialización de datos**: Botón para crear características iniciales

### ✅ Características técnicas

- **Servicios**: Separados por entidad (vehicles, characteristics, filters)
- **Hooks personalizados**: Para cada operación CRUD
- **Tipos TypeScript**: Completos para la API y la aplicación
- **Adaptadores**: Para mapear datos entre API y frontend

## 📁 Estructura del Proyecto

```
├── app/                          # Páginas de Next.js 13+
│   ├── admin/                    # Páginas de administración
│   │   ├── characteristics/      # Gestión de características
│   │   └── page.tsx             # Estado de la API
│   ├── results/                  # Lista de vehículos
│   ├── vehicle/[id]/            # Detalles de vehículo
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base (shadcn/ui)
│   ├── navigation.tsx           # Navegación principal
│   ├── vehicle-card.tsx         # Tarjeta de vehículo
│   └── filter-selector.tsx      # Selector de filtros
├── contexts/                     # Context de React
│   ├── favorites-context.tsx    # Gestión de favoritos
│   └── characteristics-context.tsx
├── hooks/                        # Hooks personalizados
│   ├── useVehicles.ts           # Hooks para vehículos
│   ├── useCharacteristics.ts    # Hooks para características
│   └── useFilters.ts            # Hooks para filtros
├── services/                     # Servicios de API
│   ├── vehicleService.ts        # Servicio de vehículos
│   ├── characteristicService.ts # Servicio de características
│   ├── filterService.ts         # Servicio de filtros
│   └── seedService.ts           # Servicio de inicialización
├── types/                        # Tipos TypeScript
│   ├── api.ts                   # Tipos de la API
│   ├── vehicle.ts               # Tipos de vehículos
│   └── characteristics.ts       # Tipos de características
├── lib/                          # Utilidades
│   ├── api.ts                   # Configuración de Axios
│   ├── adapters.ts              # Adaptadores de datos
│   └── utils.ts                 # Utilidades generales
└── providers/                    # Providers de React
    └── QueryProvider.tsx        # Provider de React Query
```

## 🔌 Integración con la API

### Servicios implementados

#### VehicleService

- ✅ `getVehicles()` - Obtener todos los vehículos
- ✅ `getVehicleById(id)` - Obtener vehículo por ID
- ✅ `createVehicle(data)` - Crear nuevo vehículo
- ✅ `updateVehicle(id, data)` - Actualizar vehículo
- ✅ `deleteVehicle(id)` - Eliminar vehículo
- ✅ `getVehicleCharacteristics(id)` - Obtener características de vehículo
- ✅ `assignCharacteristicToVehicle(id, data)` - Asignar característica
- ✅ `removeCharacteristicFromVehicle(id)` - Remover característica

#### CharacteristicService

- ✅ `getCharacteristics()` - Obtener todas las características
- ✅ `getCharacteristicById(id)` - Obtener característica por ID
- ✅ `createCharacteristic(data)` - Crear nueva característica
- ✅ `updateCharacteristic(id, data)` - Actualizar característica
- ✅ `deleteCharacteristic(id)` - Eliminar característica

#### FilterService

- ✅ `getFilters()` - Obtener todos los filtros
- ✅ `createFilter(data)` - Crear nuevo filtro
- ✅ `addCharacteristicToFilter(id, data)` - Agregar característica a filtro

#### SeedService

- ✅ `seedCharacteristics()` - Crear características iniciales

### Adaptadores de datos

El sistema incluye adaptadores para convertir los datos de la API al formato utilizado por la aplicación frontend:

- **`adaptApiVehicleToVehicle()`**: Convierte vehículos de la API al formato de la app
- **`adaptVehicleToApiVehicle()`**: Convierte vehículos de la app al formato de la API
- **Mapeo automático de características**: Asigna características a las propiedades correctas del vehículo

## 🎯 Próximos pasos

### Para completar la integración:

1. **Gestión de vehículos completa**:

   - Página de administración de vehículos
   - Formulario de creación/edición de vehículos
   - Asignación de características a vehículos

2. **Sistema de filtros avanzado**:

   - Integración completa con filtros de la API
   - Guardado de filtros en la base de datos
   - Filtros por rangos y valores exactos

3. **Mejoras en la experiencia de usuario**:

   - Paginación de resultados
   - Búsqueda avanzada
   - Imágenes de vehículos reales

4. **Optimizaciones**:
   - Cache de datos con React Query
   - Lazy loading de imágenes
   - Optimización de performance

## 🔧 Configuración de desarrollo

### Variables de entorno

```env
# URL de la API (requerida)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Opcional: URL de producción
# NEXT_PUBLIC_API_URL=https://tu-api-production.com
```

### Scripts disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar en modo desarrollo
pnpm build            # Construir para producción
pnpm start            # Iniciar en modo producción
pnpm lint             # Verificar código con ESLint

# Instalación
pnpm install          # Instalar dependencias
```

## 📱 Páginas y funcionalidades

### Páginas públicas

- **`/`** - Página de inicio con información de la plataforma
- **`/results`** - Lista de vehículos con filtros y búsqueda
- **`/vehicle/[id]`** - Detalles completos de un vehículo
- **`/favorites`** - Gestión de vehículos favoritos
- **`/filters`** - Configuración de filtros de búsqueda

### Páginas de administración

- **`/admin`** - Dashboard con estado de la API y configuración
- **`/admin/characteristics`** - CRUD de características técnicas
- **`/admin/filters`** - Gestión de filtros guardados

## 🚀 Despliegue

### Desarrollo local

1. Asegúrate de que la API esté corriendo en `http://localhost:3000`
2. Ejecuta `pnpm dev`
3. Ve a `http://localhost:3001`

### Producción

1. Configura `NEXT_PUBLIC_API_URL` con la URL de tu API en producción
2. Ejecuta `pnpm build`
3. Ejecuta `pnpm start`

## 🔍 Solución de problemas

### Error de conexión con la API

1. Verifica que la API esté corriendo en el puerto correcto
2. Revisa la variable `NEXT_PUBLIC_API_URL` en `.env.local`
3. Ve a `/admin` para verificar el estado de la conexión

### No aparecen características

1. Ve a `/admin` y haz clic en "Crear características iniciales"
2. O ejecuta manualmente: `curl -X POST http://localhost:3000/seed/characteristics`

### Errores de CORS

- La aplicación incluye configuración de CORS en `next.config.mjs`
- Si tienes problemas, verifica la configuración de CORS en tu API NestJS

## 📞 Soporte

Si encuentras algún problema o necesitas ayuda:

1. Revisa los logs de la consola del navegador
2. Verifica que la API esté respondiendo correctamente
3. Ve a la página `/admin` para verificar el estado de la conexión
4. Revisa que todas las variables de entorno estén configuradas correctamente
