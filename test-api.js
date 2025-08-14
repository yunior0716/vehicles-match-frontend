// Test script to debug API issues
const testVehicleAPI = async () => {
  const testData = {
    brand: 'Test Brand',
    model: 'Test Model',
    year: 2023,
    price: 25000,
  };

  try {
    const response = await fetch('http://localhost:3000/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const result = await response.text();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ API call successful');
    } else {
      console.log('❌ API call failed');
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Add to console to test
console.log('To test API, run: testVehicleAPI()');
window.testVehicleAPI = testVehicleAPI;
