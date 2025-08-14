import { Vehicle } from "@/types/vehicle"

export const vehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Camry",
    type: "Sedán",
    description: "Sedán familiar confiable con excelente eficiencia de combustible y tecnología avanzada.",
    images: [
      "/silver-toyota-camry-sedan.png",
      "/toyota-camry-dashboard.png",
      "/toyota-camry-rear.png"
    ],
    rating: 4,
    specs: {
      performance: {
        power: 203,
        acceleration: 8.4,
        topSpeed: 200,
        transmission: "Automática CVT"
      },
      consumption: {
        fuelConsumption: 7.8,
        range: 650,
        fuelType: "Gasolina",
        tankCapacity: 60
      },
      dimensions: {
        length: 4885,
        width: 1840,
        height: 1445,
        weight: 1590,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: false,
        sunroof: true,
        heatedSeats: false
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 5
      },
      utility: {
        trunkCapacity: 524,
        towingCapacity: false,
        roofRails: false,
        foldingSeats: true
      },
      ownership: {
        price: 32000,
        maintenanceCost: 800,
        depreciation: 12.5
      }
    }
  },
  {
    id: "2",
    brand: "Honda",
    model: "CR-V",
    type: "SUV",
    description: "SUV compacto versátil, perfecto para familias que buscan espacio y eficiencia.",
    images: [
      "/white-honda-crv-suv.png",
      "/honda-crv-interior-spacious.png",
      "/honda-cr-v-cargo.png"
    ],
    rating: 4,
    specs: {
      performance: {
        power: 190,
        acceleration: 9.2,
        topSpeed: 185,
        transmission: "Automática CVT"
      },
      consumption: {
        fuelConsumption: 8.5,
        range: 580,
        fuelType: "Gasolina",
        tankCapacity: 57
      },
      dimensions: {
        length: 4621,
        width: 1855,
        height: 1679,
        weight: 1620,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: true,
        sunroof: true,
        heatedSeats: true
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 5
      },
      utility: {
        trunkCapacity: 589,
        towingCapacity: true,
        roofRails: true,
        foldingSeats: true
      },
      ownership: {
        price: 35000,
        maintenanceCost: 900,
        depreciation: 13.2
      }
    }
  },
  {
    id: "3",
    brand: "BMW",
    model: "X3",
    type: "SUV Premium",
    description: "SUV premium con rendimiento deportivo y lujo alemán en cada detalle.",
    images: [
      "/black-luxury-bmw-x3.png",
      "/placeholder-ikxcx.png",
      "/bmw-x3-dashboard.png"
    ],
    rating: 5,
    specs: {
      performance: {
        power: 248,
        acceleration: 6.3,
        topSpeed: 230,
        transmission: "Automática 8 velocidades"
      },
      consumption: {
        fuelConsumption: 9.2,
        range: 520,
        fuelType: "Gasolina",
        tankCapacity: 65
      },
      dimensions: {
        length: 4708,
        width: 1891,
        height: 1676,
        weight: 1790,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: true,
        sunroof: true,
        heatedSeats: true
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 5
      },
      utility: {
        trunkCapacity: 550,
        towingCapacity: true,
        roofRails: true,
        foldingSeats: true
      },
      ownership: {
        price: 55000,
        maintenanceCost: 1500,
        depreciation: 18.5
      }
    }
  },
  {
    id: "4",
    brand: "Tesla",
    model: "Model 3",
    type: "Sedán Eléctrico",
    description: "Sedán eléctrico revolucionario con tecnología autónoma y cero emisiones.",
    images: [
      "/red-tesla-model-3.png",
      "/placeholder-pspgy.png",
      "/tesla-model-3-charging-port.png"
    ],
    rating: 5,
    specs: {
      performance: {
        power: 283,
        acceleration: 5.3,
        topSpeed: 225,
        transmission: "Automática de una velocidad"
      },
      consumption: {
        fuelConsumption: 0, // Eléctrico
        range: 448,
        fuelType: "Eléctrico",
        tankCapacity: 75 // kWh battery
      },
      dimensions: {
        length: 4694,
        width: 1849,
        height: 1443,
        weight: 1847,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: false,
        sunroof: true,
        heatedSeats: true
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 5
      },
      utility: {
        trunkCapacity: 425,
        towingCapacity: false,
        roofRails: false,
        foldingSeats: true
      },
      ownership: {
        price: 48000,
        maintenanceCost: 400,
        depreciation: 15.8
      }
    }
  },
  {
    id: "5",
    brand: "Ford",
    model: "F-150",
    type: "Pickup",
    description: "Pickup resistente y versátil, ideal para trabajo y aventuras familiares.",
    images: [
      "/blue-ford-f150.png",
      "/ford-f150-cargo.png",
      "/placeholder.svg?height=300&width=400"
    ],
    rating: 4,
    specs: {
      performance: {
        power: 325,
        acceleration: 7.1,
        topSpeed: 180,
        transmission: "Automática 10 velocidades"
      },
      consumption: {
        fuelConsumption: 12.4,
        range: 480,
        fuelType: "Gasolina",
        tankCapacity: 98
      },
      dimensions: {
        length: 5915,
        width: 2029,
        height: 1967,
        weight: 2267,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: true,
        sunroof: false,
        heatedSeats: true
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 4
      },
      utility: {
        trunkCapacity: 1704, // Bed capacity
        towingCapacity: true,
        roofRails: false,
        foldingSeats: true
      },
      ownership: {
        price: 42000,
        maintenanceCost: 1200,
        depreciation: 16.2
      }
    }
  },
  {
    id: "6",
    brand: "Audi",
    model: "A4",
    type: "Sedán Premium",
    description: "Sedán premium con diseño elegante y tecnología de vanguardia.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400"
    ],
    rating: 5,
    specs: {
      performance: {
        power: 261,
        acceleration: 5.7,
        topSpeed: 250,
        transmission: "Automática 7 velocidades"
      },
      consumption: {
        fuelConsumption: 8.1,
        range: 580,
        fuelType: "Gasolina",
        tankCapacity: 58
      },
      dimensions: {
        length: 4762,
        width: 1847,
        height: 1428,
        weight: 1650,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: true,
        sunroof: true,
        heatedSeats: true
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 5
      },
      utility: {
        trunkCapacity: 460,
        towingCapacity: true,
        roofRails: false,
        foldingSeats: true
      },
      ownership: {
        price: 52000,
        maintenanceCost: 1400,
        depreciation: 19.1
      }
    }
  },
  {
    id: "7",
    brand: "Mazda",
    model: "CX-5",
    type: "SUV",
    description: "SUV compacto con diseño KODO y tecnología SKYACTIV para máxima eficiencia.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400"
    ],
    rating: 4,
    specs: {
      performance: {
        power: 187,
        acceleration: 9.1,
        topSpeed: 190,
        transmission: "Automática 6 velocidades"
      },
      consumption: {
        fuelConsumption: 7.9,
        range: 620,
        fuelType: "Gasolina",
        tankCapacity: 58
      },
      dimensions: {
        length: 4575,
        width: 1842,
        height: 1685,
        weight: 1620,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: false,
        sunroof: true,
        heatedSeats: false
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: true,
        safetyRating: 5
      },
      utility: {
        trunkCapacity: 442,
        towingCapacity: true,
        roofRails: true,
        foldingSeats: true
      },
      ownership: {
        price: 33000,
        maintenanceCost: 750,
        depreciation: 14.3
      }
    }
  },
  {
    id: "8",
    brand: "Volkswagen",
    model: "Golf",
    type: "Hatchback",
    description: "Hatchback compacto con ingeniería alemana y excelente manejo urbano.",
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400"
    ],
    rating: 4,
    specs: {
      performance: {
        power: 147,
        acceleration: 8.5,
        topSpeed: 200,
        transmission: "Manual 6 velocidades"
      },
      consumption: {
        fuelConsumption: 6.8,
        range: 680,
        fuelType: "Gasolina",
        tankCapacity: 50
      },
      dimensions: {
        length: 4284,
        width: 1789,
        height: 1456,
        weight: 1320,
        seats: 5
      },
      comfort: {
        airConditioning: true,
        leatherSeats: false,
        sunroof: false,
        heatedSeats: false
      },
      safety: {
        airbags: true,
        abs: true,
        stabilityControl: true,
        blindSpotMonitoring: false,
        safetyRating: 4
      },
      utility: {
        trunkCapacity: 380,
        towingCapacity: false,
        roofRails: false,
        foldingSeats: true
      },
      ownership: {
        price: 28000,
        maintenanceCost: 900,
        depreciation: 13.8
      }
    }
  }
]
