// Archivo temporal para probar las validaciones
import { validateVehicleData } from './lib/validations';

// Prueba con datos vacíos
console.log('=== Prueba con datos vacíos ===');
const emptyData = {
  brand: '',
  model: '',
  year: 0,
  fuel: '',
  transmission: '',
  seats: 0,
  doors: 0,
  carrocery: '',
  price: 0,
  image: '',
  description: '',
};

const validation1 = validateVehicleData(emptyData);
console.log('¿Es válido?', validation1.isValid);
console.log('Errores:', validation1.errors);

// Prueba con datos válidos
console.log('\n=== Prueba con datos válidos ===');
const validData = {
  brand: 'Toyota',
  model: 'Camry',
  year: 2023,
  fuel: 'gasoline',
  transmission: 'automatic',
  seats: 5,
  doors: 4,
  carrocery: 'sedan',
  price: 25000,
  image: 'https://example.com/image.jpg',
  description: 'Un excelente sedán',
};

const validation2 = validateVehicleData(validData);
console.log('¿Es válido?', validation2.isValid);
console.log('Errores:', validation2.errors);
