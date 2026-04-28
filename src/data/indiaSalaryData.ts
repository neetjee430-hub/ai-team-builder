export const TIER_1_METRO = {
  cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
  multiplier: 1.0  // base salary
};

export const TIER_2_LARGE = {
  cities: ['Jaipur', 'Lucknow', 'Surat', 'Kanpur', 'Nagpur',
           'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara',
           'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
           'Faridabad', 'Meerut', 'Rajkot', 'Varanasi',
           'Aurangabad', 'Coimbatore', 'Jodhpur', 'Madurai',
           'Raipur', 'Kota', 'Guwahati', 'Chandigarh',
           'Amritsar', 'Ranchi', 'Mysore', 'Jabalpur'],
  multiplier: 0.75
};

export const TIER_3_MEDIUM = {
  cities: ['Shimla', 'Dehradun', 'Nainital', 'Rishikesh',
           'Haridwar', 'Jammu', 'Srinagar', 'Leh',
           'Dharamsala', 'Manali', 'Kullu'],
  multiplier: 0.60
};

export const TIER_4_SMALL = {
  multiplier: 0.50
};

export const LOW_COST_AREAS = {
  patterns: ['village', 'gram', 'nagar', 'tehsil'],
  multiplier: 0.40
};

export const BASE_SALARIES_2025: Record<string, {min: number, max: number, avg: number}> = {
  // Beauty & Personal Care
  'senior_hair_stylist': { min: 15000, max: 25000, avg: 18000 },
  'junior_hair_stylist': { min: 8000, max: 15000, avg: 10000 },
  'hair_salon_receptionist': { min: 8000, max: 14000, avg: 10000 },
  'nail_technician': { min: 10000, max: 18000, avg: 13000 },
  'beautician': { min: 8000, max: 18000, avg: 12000 },
  'bridal_makeup_artist': { min: 15000, max: 35000, avg: 22000 },
  'spa_therapist': { min: 12000, max: 22000, avg: 15000 },
  'salon_helper': { min: 5000, max: 9000, avg: 6500 },
  'salon_manager': { min: 20000, max: 40000, avg: 28000 },

  // Health & Fitness
  'gym_trainer': { min: 12000, max: 25000, avg: 16000 },
  'head_trainer': { min: 20000, max: 40000, avg: 28000 },
  'yoga_instructor': { min: 12000, max: 25000, avg: 16000 },
  'gym_receptionist': { min: 8000, max: 14000, avg: 10000 },
  'gym_helper': { min: 5000, max: 9000, avg: 6500 },
  'dance_instructor': { min: 12000, max: 22000, avg: 15000 },
  'swimming_coach': { min: 15000, max: 30000, avg: 20000 },

  // Education & Coaching
  'primary_teacher': { min: 10000, max: 22000, avg: 14000 },
  'secondary_teacher': { min: 15000, max: 35000, avg: 22000 },
  'coaching_faculty': { min: 12000, max: 40000, avg: 20000 },
  'computer_trainer': { min: 10000, max: 22000, avg: 14000 },
  'school_receptionist': { min: 8000, max: 14000, avg: 10000 },
  'school_helper': { min: 5000, max: 9000, avg: 6500 },
  'daycare_teacher': { min: 8000, max: 16000, avg: 11000 },
  'language_trainer': { min: 12000, max: 25000, avg: 16000 },

  // Food & Beverage
  'head_chef': { min: 18000, max: 45000, avg: 28000 },
  'cook': { min: 10000, max: 20000, avg: 14000 },
  'assistant_cook': { min: 7000, max: 13000, avg: 9000 },
  'waiter': { min: 8000, max: 15000, avg: 10000 },
  'restaurant_manager': { min: 20000, max: 45000, avg: 30000 },
  'cashier': { min: 8000, max: 14000, avg: 10000 },
  'delivery_person': { min: 8000, max: 15000, avg: 10000 },
  'kitchen_helper': { min: 6000, max: 10000, avg: 7500 },
  'cafe_barista': { min: 10000, max: 18000, avg: 13000 },

  // Retail
  'senior_salesperson': { min: 12000, max: 22000, avg: 15000 },
  'junior_salesperson': { min: 8000, max: 15000, avg: 10000 },
  'store_manager': { min: 18000, max: 40000, avg: 25000 },
  'cashier_retail': { min: 8000, max: 14000, avg: 10000 },
  'store_helper': { min: 5000, max: 9000, avg: 6500 },

  // Healthcare
  'clinic_receptionist': { min: 10000, max: 18000, avg: 13000 },
  'nursing_staff': { min: 12000, max: 25000, avg: 16000 },
  'lab_technician': { min: 12000, max: 22000, avg: 15000 },
  'compounder': { min: 8000, max: 16000, avg: 11000 },
  'ward_helper': { min: 6000, max: 11000, avg: 8000 },
  'pharmacy_assistant': { min: 8000, max: 16000, avg: 11000 },

  // Services
  'real_estate_agent': { min: 10000, max: 30000, avg: 18000 },
  'office_receptionist': { min: 10000, max: 18000, avg: 13000 },
  'accountant': { min: 12000, max: 28000, avg: 18000 },
  'security_guard': { min: 8000, max: 14000, avg: 10000 },
  'driver': { min: 10000, max: 18000, avg: 13000 },
  'cleaner': { min: 6000, max: 11000, avg: 8000 },
};

export function calculateSalaryRange(roleKey: string, city: string = 'Unknown', experience: string = '1-2 years') {
  const base = BASE_SALARIES_2025[roleKey] || {min: 8000, max: 20000, avg: 12000};
  
  // Find city tier
  let multiplier = 0.50; // default tier 4
  if (TIER_1_METRO.cities.some(c => city.toLowerCase().includes(c.toLowerCase()))) {
    multiplier = 1.0;
  } else if (TIER_2_LARGE.cities.some(c => city.toLowerCase().includes(c.toLowerCase()))) {
    multiplier = 0.75;
  } else if (TIER_3_MEDIUM.cities.some(c => city.toLowerCase().includes(c.toLowerCase()))) {
    multiplier = 0.60;
  }
  
  // Experience adjustment
  const expMultiplier: Record<string, number> = {
    'fresher': 0.85,
    '1-2 years': 1.0,
    '2-3 years': 1.15,
    '3-5 years': 1.30,
    '5+ years': 1.50
  };
  const expMult = expMultiplier[experience] || 1.0;
  
  return {
    min: Math.round((base.min * multiplier * expMult) / 500) * 500,
    max: Math.round((base.max * multiplier * expMult) / 500) * 500,
    avg: Math.round((base.avg * multiplier * expMult) / 500) * 500,
    city_tier: multiplier === 1.0 ? 'Metro' :
               multiplier === 0.75 ? 'Large City' :
               multiplier === 0.60 ? 'Medium City' : 'Small Town',
    note: `Based on ${city} market rates (${new Date().getFullYear()})`
  };
}
