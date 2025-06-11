import { YAUNDE_PHARMACIES, type Medication, type Pharmacy } from '@/data/pharmacies';

export interface MedicationDetail {
  id: string;
  name: string;
  description: string;
  usage: string;
  sideEffects: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  availableAt: Array<{
    pharmacy: Pharmacy;
    medication: Medication;
  }>;
  alternatives: string[];
}

// Comprehensive medication information database
const MEDICATION_INFO: Record<string, Omit<MedicationDetail, 'id' | 'minPrice' | 'maxPrice' | 'averagePrice' | 'availableAt'>> = {
  '1': {
    name: 'Paracetamol',
    description: 'Paracetamol is a widely used over-the-counter pain reliever and fever reducer. It is effective for treating mild to moderate pain including headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.',
    usage: 'Adults: Take 500-1000mg every 4-6 hours as needed. Do not exceed 4000mg (4g) in 24 hours. Children: Dosage based on weight, consult healthcare provider.',
    sideEffects: 'Generally well tolerated. Rare side effects may include nausea, allergic reactions (rash, swelling), or liver damage with overdose.',
    category: 'Pain Relief & Fever Reducer',
    alternatives: ['Ibuprofen', 'Aspirin', 'Diclofenac']
  },
  '2': {
    name: 'Amoxicillin',
    description: 'Amoxicillin is a penicillin-type antibiotic used to treat bacterial infections including respiratory tract infections, urinary tract infections, skin infections, and ear infections.',
    usage: 'Adults: 250-500mg every 8 hours or 500-875mg every 12 hours. Children: Dosage based on weight. Complete the full course even if feeling better.',
    sideEffects: 'Common: Nausea, vomiting, diarrhea. Serious: Allergic reactions, severe diarrhea (C. diff), skin rash.',
    category: 'Antibiotic',
    alternatives: ['Azithromycin', 'Cephalexin', 'Clarithromycin']
  },
  '3': {
    name: 'Ibuprofen',
    description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever, pain, and inflammation. Effective for headaches, dental pain, menstrual cramps, muscle aches, and arthritis.',
    usage: 'Adults: 200-400mg every 4-6 hours as needed. Maximum 1200mg per day without medical supervision. Take with food to reduce stomach irritation.',
    sideEffects: 'Stomach upset, heartburn, dizziness. Serious: Stomach bleeding, kidney problems, increased blood pressure.',
    category: 'Anti-inflammatory & Pain Relief',
    alternatives: ['Paracetamol', 'Naproxen', 'Diclofenac']
  },
  '4': {
    name: 'Omeprazole',
    description: 'Omeprazole is a proton pump inhibitor (PPI) that reduces stomach acid production. Used to treat gastroesophageal reflux disease (GERD), stomach ulcers, and heartburn.',
    usage: 'Adults: 20-40mg once daily before breakfast. For ulcers: 20mg daily for 4-8 weeks. For GERD: 20mg daily for 4-8 weeks.',
    sideEffects: 'Headache, nausea, diarrhea, stomach pain. Long-term use may cause vitamin B12 deficiency, bone fractures.',
    category: 'Gastrointestinal',
    alternatives: ['Lansoprazole', 'Ranitidine', 'Esomeprazole']
  },
  '5': {
    name: 'Metformin',
    description: 'Metformin is an oral diabetes medication that helps control blood sugar levels in people with type 2 diabetes. It works by decreasing glucose production in the liver.',
    usage: 'Adults: Start with 500mg twice daily with meals. May increase gradually to maximum 2000mg daily. Take with food to reduce stomach upset.',
    sideEffects: 'Nausea, vomiting, diarrhea, stomach upset. Rare but serious: Lactic acidosis (especially in kidney/liver disease).',
    category: 'Diabetes Medication',
    alternatives: ['Glibenclamide', 'Gliclazide', 'Insulin']
  },
  '6': {
    name: 'Lisinopril',
    description: 'Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure. It helps relax blood vessels and reduce the workload on the heart.',
    usage: 'Adults: Start with 5-10mg once daily. May increase to 20-40mg daily as needed. Take at the same time each day.',
    sideEffects: 'Dry cough, dizziness, headache, fatigue. Serious: Angioedema (swelling), kidney problems, high potassium levels.',
    category: 'Cardiovascular',
    alternatives: ['Enalapril', 'Losartan', 'Amlodipine']
  },
  '7': {
    name: 'Aspirin',
    description: 'Aspirin is a salicylate used to reduce pain, fever, and inflammation. Low-dose aspirin is also used for cardiovascular protection.',
    usage: 'Pain/fever: 325-650mg every 4 hours. Cardiovascular protection: 75-100mg daily. Take with food to reduce stomach irritation.',
    sideEffects: 'Stomach upset, heartburn, bleeding risk. Serious: Stomach bleeding, allergic reactions, Reye\'s syndrome in children.',
    category: 'Pain Relief & Cardiovascular',
    alternatives: ['Paracetamol', 'Ibuprofen', 'Clopidogrel']
  },
  '8': {
    name: 'Ciprofloxacin',
    description: 'Ciprofloxacin is a fluoroquinolone antibiotic used to treat various bacterial infections including urinary tract infections, respiratory infections, and skin infections.',
    usage: 'Adults: 250-750mg every 12 hours depending on infection severity. Take 2 hours before or 6 hours after dairy products or antacids.',
    sideEffects: 'Nausea, diarrhea, dizziness, headache. Serious: Tendon rupture, nerve damage, irregular heartbeat.',
    category: 'Antibiotic',
    alternatives: ['Amoxicillin', 'Azithromycin', 'Levofloxacin']
  },
  '9': {
    name: 'Vitamin C',
    description: 'Vitamin C (Ascorbic acid) is an essential vitamin that supports immune function, collagen synthesis, and acts as an antioxidant.',
    usage: 'Adults: 65-90mg daily for maintenance. For immune support: 200-1000mg daily. Take with food to improve absorption.',
    sideEffects: 'Generally safe. High doses may cause stomach upset, diarrhea, kidney stones.',
    category: 'Vitamin & Supplement',
    alternatives: ['Multivitamin', 'Vitamin D', 'Zinc']
  },
  '10': {
    name: 'Zinc Sulfate',
    description: 'Zinc sulfate is a mineral supplement used to treat zinc deficiency and support immune function, wound healing, and growth.',
    usage: 'Adults: 8-11mg daily for maintenance. For deficiency: 15-30mg daily. Take on empty stomach or with food if stomach upset occurs.',
    sideEffects: 'Nausea, vomiting, stomach upset, metallic taste. High doses may cause copper deficiency.',
    category: 'Mineral Supplement',
    alternatives: ['Zinc Gluconate', 'Multivitamin', 'Vitamin C']
  }
};

// Get all unique medications from the pharmacy database
export function getAllMedications(): MedicationDetail[] {
  const medicationMap = new Map<string, MedicationDetail>();

  // Process each pharmacy's medications
  YAUNDE_PHARMACIES.forEach(pharmacy => {
    pharmacy.medications.forEach(medication => {
      const existing = medicationMap.get(medication.id);
      const info = MEDICATION_INFO[medication.id];

      if (!existing) {
        // Create new medication detail
        medicationMap.set(medication.id, {
          id: medication.id,
          name: medication.name,
          description: info?.description || `${medication.name} is a pharmaceutical medication available at various pharmacies in Yaoundé.`,
          usage: info?.usage || 'Consult your healthcare provider for proper dosage and usage instructions.',
          sideEffects: info?.sideEffects || 'Consult your healthcare provider about potential side effects.',
          category: info?.category || 'Medication',
          minPrice: medication.price,
          maxPrice: medication.price,
          averagePrice: medication.price,
          availableAt: [{ pharmacy, medication }],
          alternatives: info?.alternatives || []
        });
      } else {
        // Update existing medication with new pharmacy data
        existing.minPrice = Math.min(existing.minPrice, medication.price);
        existing.maxPrice = Math.max(existing.maxPrice, medication.price);
        existing.availableAt.push({ pharmacy, medication });
        
        // Recalculate average price
        const totalPrice = existing.availableAt.reduce((sum, item) => sum + item.medication.price, 0);
        existing.averagePrice = Math.round(totalPrice / existing.availableAt.length);
      }
    });
  });

  return Array.from(medicationMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Get medication by ID
export function getMedicationById(id: string): MedicationDetail | null {
  const allMedications = getAllMedications();
  return allMedications.find(med => med.id === id) || null;
}

// Get medications by category
export function getMedicationsByCategory(category: string): MedicationDetail[] {
  const allMedications = getAllMedications();
  return allMedications.filter(med => med.category === category);
}

// Search medications by name
export function searchMedications(query: string): MedicationDetail[] {
  const allMedications = getAllMedications();
  const lowerQuery = query.toLowerCase();
  return allMedications.filter(med => 
    med.name.toLowerCase().includes(lowerQuery) ||
    med.description.toLowerCase().includes(lowerQuery) ||
    med.category.toLowerCase().includes(lowerQuery)
  );
}
