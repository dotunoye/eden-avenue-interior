/**
 * APEX AUTO - Car Database (CMS)
 * Edit this array to add, remove, or modify cars.
 * Each car object contains all necessary information for display.
 */

const carsDatabase = [
  {
    id: 1,
    name: 'Mercedes S-Class',
    category: 'Sedan',
    price: '$120,000',
    priceValue: 120000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8',
    image: 'assets/images/mercedes-benz-s-class.avif',
    description: 'Experience unparalleled luxury with the Mercedes-Benz S-Class. Engineering excellence meets timeless elegance.',
    specs: {
      horsepower: '503 HP',
      acceleration: '4.6s (0-60)',
      topSpeed: '155 mph',
      fuelEconomy: '22 MPG',
      seating: '5',
      warranty: '3 Years'
    },
    featured: true,
    discount: false
  },
  {
    id: 2,
    name: 'BMW M5',
    category: 'Sports Sedan',
    price: '$110,500',
    priceValue: 110500,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8 Twin-Turbo',
    image: 'assets/images/BMW-S5.jpeg',
    description: 'The ultimate driving machine. BMW M5 delivers premium performance with uncompromising comfort.',
    specs: {
      horsepower: '625 HP',
      acceleration: '3.1s (0-60)',
      topSpeed: '155+ mph',
      fuelEconomy: '20 MPG',
      seating: '5',
      warranty: '3 Years'
    },
    featured: true,
    discount: false
  },
  {
    id: 3,
    name: 'Porsche 911 Turbo',
    category: 'Sports Car',
    price: '$180,000',
    priceValue: 180000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'Flat-6 Twin-Turbo',
    image: 'assets/images/porsche-911-turbo.png',
    description: 'Pure adrenaline. The Porsche 911 Turbo is an icon of performance and luxury combined.',
    specs: {
      horsepower: '640 HP',
      acceleration: '2.6s (0-60)',
      topSpeed: '198 mph',
      fuelEconomy: '18 MPG',
      seating: '4',
      warranty: '3 Years'
    },
    featured: true,
    discount: false
  },
  {
    id: 4,
    name: 'Rolls-Royce Phantom',
    category: 'Luxury Sedan',
    price: '$375,000',
    priceValue: 375000,
    year: 2023,
    transmission: 'Automatic',
    engine: 'V12',
    image: 'assets/images/rolls-royce-phantom.png',
    description: 'The pinnacle of automotive luxury. Rolls-Royce Phantom - where silence meets sophistication.',
    specs: {
      horsepower: '563 HP',
      acceleration: '5.1s (0-60)',
      topSpeed: '155 mph',
      fuelEconomy: '18 MPG',
      seating: '5',
      warranty: '3 Years'
    },
    featured: true,
    discount: false
  },
  {
    id: 5,
    name: 'Lamborghini Revuelto',
    category: 'Supercar',
    price: '$605,000',
    priceValue: 605000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V12 Hybrid',
    image: 'assets/images/lamborghini-revuelto.webp',
    description: 'Hybrid hypercar. The Lamborghini Revuelto combines V12 power with electric efficiency for ultimate performance.',
    specs: {
      horsepower: '1001 HP',
      acceleration: '2.5s (0-60)',
      topSpeed: '221 mph',
      fuelEconomy: '15 MPG',
      seating: '2',
      warranty: '3 Years'
    },
    featured: true,
    discount: false
  },
  {
    id: 6,
    name: 'Tesla Model S Plaid',
    category: 'Electric Sedan',
    price: '$105,000',
    priceValue: 105000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'Electric Tri-Motor',
    image: 'assets/images/tesla-model-s-plaid.webp',
    description: 'The future of luxury. Tesla Model S Plaid offers insane acceleration with zero emissions.',
    specs: {
      horsepower: '1020 HP',
      acceleration: '1.99s (0-60)',
      topSpeed: '155+ mph',
      fuelEconomy: '100+ MPGe',
      seating: '5',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 7,
    name: 'Audi RS6 Avant',
    category: 'Wagon',
    price: '$125,000',
    priceValue: 125000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8 Twin-Turbo',
    image: 'assets/images/audi-rs6-avant.jpeg',
    description: 'Perfect balance of speed and practicality. Audi RS6 Avant is luxury redefined.',
    specs: {
      horsepower: '621 HP',
      acceleration: '3.2s (0-60)',
      topSpeed: '155+ mph',
      fuelEconomy: '20 MPG',
      seating: '5',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 8,
    name: 'Range Rover Sport',
    category: 'SUV',
    price: '$85,000',
    priceValue: 85000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8 Supercharged',
    image: 'assets/images/range-rover-sport.avif',
    description: 'Adventure meets luxury. Range Rover Sport delivers performance on any terrain.',
    specs: {
      horsepower: '518 HP',
      acceleration: '4.6s (0-60)',
      topSpeed: '155 mph',
      fuelEconomy: '20 MPG',
      seating: '7',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 9,
    name: 'Bentley Continental',
    category: 'Coupe',
    price: '$230,000',
    priceValue: 230000,
    year: 2023,
    transmission: 'Automatic',
    engine: 'W12',
    image: 'assets/images/bentley-continental.webp',
    description: 'Handcrafted excellence. Bentley Continental represents the height of automotive craftsmanship.',
    specs: {
      horsepower: '635 HP',
      acceleration: '3.6s (0-60)',
      topSpeed: '208 mph',
      fuelEconomy: '18 MPG',
      seating: '4',
      warranty: '3 Years'
    },
    featured: false,
    discount: false
  },
  {
    id: 10,
    name: 'Ferrari F8 Tributo',
    category: 'Sports Car',
    price: '$280,000',
    priceValue: 280000,
    year: 2023,
    transmission: 'Automatic',
    engine: 'V12',
    image: 'assets/images/ferrari-f8-tributo.jpg',
    description: 'Prancing horse performance. Ferrari F8 Tributo - a masterpiece of Italian engineering.',
    specs: {
      horsepower: '710 HP',
      acceleration: '2.9s (0-60)',
      topSpeed: '211 mph',
      fuelEconomy: '16 MPG',
      seating: '2',
      warranty: '3 Years'
    },
    featured: false,
    discount: false
  },
  {
    id: 11,
    name: 'Jaguar F-TYPE',
    category: 'Sports Car',
    price: '$95,000',
    priceValue: 95000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8 Supercharged',
    image: 'assets/images/jaguar-f-type.jpg',
    description: 'Born to perform. Jaguar F-TYPE combines raw power with elegant British design.',
    specs: {
      horsepower: '575 HP',
      acceleration: '3.5s (0-60)',
      topSpeed: '186 mph',
      fuelEconomy: '19 MPG',
      seating: '2',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 12,
    name: 'Lexus LS500',
    category: 'Sedan',
    price: '$78,000',
    priceValue: 78000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V6 Twin-Turbo',
    image: 'assets/images/lexus-ls-500.jpg',
    description: 'Transcendent luxury. Lexus LS500 defines refined elegance and reliability.',
    specs: {
      horsepower: '435 HP',
      acceleration: '5.2s (0-60)',
      topSpeed: '146 mph',
      fuelEconomy: '24 MPG',
      seating: '5',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 13,
    name: 'Range Rover Sport',
    category: 'SUV',
    price: '$85,000',
    priceValue: 85000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8 Supercharged',
    image: 'assets/images/range-rover-sport.avif',
    description: 'Adventure meets luxury. Range Rover Sport delivers performance on any terrain.',
    specs: {
      horsepower: '518 HP',
      acceleration: '4.6s (0-60)',
      topSpeed: '155 mph',
      fuelEconomy: '20 MPG',
      seating: '7',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 14,
    name: 'Bentley Continental',
    category: 'Coupe',
    price: '$230,000',
    priceValue: 230000,
    year: 2023,
    transmission: 'Automatic',
    engine: 'W12',
    image: 'assets/images/bentley-continental.webp',
    description: 'Handcrafted excellence. Bentley Continental represents the height of automotive craftsmanship.',
    specs: {
      horsepower: '635 HP',
      acceleration: '3.6s (0-60)',
      topSpeed: '208 mph',
      fuelEconomy: '18 MPG',
      seating: '4',
      warranty: '3 Years'
    },
    featured: false,
    discount: false
  },
  {
    id: 15,
    name: 'Ferrari F8 Tributo',
    category: 'Sports Car',
    price: '$280,000',
    priceValue: 280000,
    year: 2023,
    transmission: 'Automatic',
    engine: 'V12',
    image: 'assets/images/ferrari-f8-tributo.jpg',
    description: 'Prancing horse performance. Ferrari F8 Tributo - a masterpiece of Italian engineering.',
    specs: {
      horsepower: '710 HP',
      acceleration: '2.9s (0-60)',
      topSpeed: '211 mph',
      fuelEconomy: '16 MPG',
      seating: '2',
      warranty: '3 Years'
    },
    featured: false,
    discount: false
  },
  {
    id: 16,
    name: 'Jaguar F-TYPE',
    category: 'Sports Car',
    price: '$95,000',
    priceValue: 95000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V8 Supercharged',
    image: 'assets/images/jaguar-f-type.jpg',
    description: 'Born to perform. Jaguar F-TYPE combines raw power with elegant British design.',
    specs: {
      horsepower: '575 HP',
      acceleration: '3.5s (0-60)',
      topSpeed: '186 mph',
      fuelEconomy: '19 MPG',
      seating: '2',
      warranty: '3 Years'
    },
    featured: false,
    discount: true
  },
  {
    id: 17,
    name: 'Lexus LS500',
    category: 'Sedan',
    price: '$78,000',
    priceValue: 78000,
    year: 2024,
    transmission: 'Automatic',
    engine: 'V6 Twin-Turbo',
    image: 'assets/images/lexus-ls-500.jpg',
    description: 'Transcendent luxury. Lexus LS500 defines refined elegance and reliability.',
    specs: {
      horsepower: '435 HP',
      acceleration: '5.2s (0-60)',
      topSpeed: '146 mph',
      fuelEconomy: '24 MPG',
      seating: '5',
      warranty: '3 Years'
    },
    featured: true,
    discount: true
  }
];

/**
 * Helper function to get featured cars (for homepage)
 * @returns {Array} Array of featured cars
 */
function getFeaturedCars() {
  return carsDatabase.filter(car => car.featured === true).slice(0, 6);
}

/**
 * Helper function to get discount cars (for homepage)
 * @returns {Array} Array of discount cars
 */
function getDiscountCars() {
  return carsDatabase.filter(car => car.discount === true).slice(0, 6);
}

/**
 * Helper function to get all cars (for showroom)
 * @returns {Array} Full array of all cars
 */
function getAllCars() {
  return carsDatabase;
}

/**
 * Helper function to get a car by ID
 * @param {Number} id - Car ID
 * @returns {Object} Car object or null
 */
function getCarById(id) {
  return carsDatabase.find(car => car.id === parseInt(id)) || null;
}
