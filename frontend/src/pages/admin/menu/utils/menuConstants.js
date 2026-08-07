export const CATEGORIES = [
  "Coffee",
  "Tea",
  "Smoothie",
  "Juice",
  "Soda",
  "Dessert Drink",
  "Sweet",
  "Bakery"
];


export const subcategoryMap = {

  Coffee: [
    "Espresso Based",
    "Vietnamese Coffee",
    "Traditional Coffee"
  ],

  Tea: [
    "Matcha",
    "Milk Tea",
    "Fruit Tea",
    "Vietnamese Tea"
  ],

  Smoothie: [
    "Fruit Smoothie",
    "Vietnamese Smoothie"
  ],

  Juice: [
    "Fresh Juice"
  ],

  Soda: [
    "Sparkling Soda",
    "Italian Soda"
  ],

  "Dessert Drink": [
    "Milkshake",
    "Frappé",
    "Chocolate"
  ],

  Sweet: [
    "Cake",
    "Pastry"
  ],

  Bakery: [
    "Bread",
    "Vietnamese Bread"
  ]

};


// what the customer menu groups under each heading
export const DRINK_CATEGORIES = [
  "Coffee",
  "Tea",
  "Smoothie",
  "Juice",
  "Soda",
  "Dessert Drink"
];

export const FOOD_CATEGORIES = [
  "Sweet",
  "Bakery"
];


// =====================================
// AI RECOMMENDATION FIELDS
//
// The customer-side recommendation engine
// scores products on exactly these, so the
// admin form has to be able to set them.
// =====================================

export const TASTE_OPTIONS = [
  "Sweet",
  "Bitter",
  "Fruity",
  "Chocolate",
  "Creamy",
  "Refreshing",
  "Savory"
];

export const TEMPERATURE_OPTIONS = [
  { value: "Hot", label: "🔥 Hot" },
  { value: "Warm", label: "☕ Warm" },
  { value: "Cold", label: "🧊 Cold" }
];

// 0 = none, 5 = very strong
export const CAFFEINE_LABELS = [
  "0 — none",
  "1 — very light",
  "2 — light",
  "3 — medium",
  "4 — strong",
  "5 — very strong"
];

export const INTENSITY_LABELS = [
  "1 — delicate",
  "2 — mild",
  "3 — balanced",
  "4 — rich",
  "5 — intense"
];
