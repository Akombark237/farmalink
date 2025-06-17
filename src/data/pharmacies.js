// JavaScript version of pharmacy data for migration script
// Comprehensive database of real pharmacies in Yaoundé, Cameroon
// All prices are in CFA Franc (Central African CFA franc)

export const YAUNDE_PHARMACIES = [
  {
    id: '1',
    name: 'PHARMACIE FRANCAISE',
    address: '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
    phone: '+237 2 22 22 14 76',
    rating: 4.7,
    isOpenNow: true,
    location: { lat: 3.8480, lng: 11.5021 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 500, inStock: true, quantity: 50 }, // 500 CFA
      { id: '2', name: 'Amoxicillin', price: 2500, inStock: true, quantity: 30 }, // 2,500 CFA
      { id: '3', name: 'Ibuprofen', price: 750, inStock: true, quantity: 25 }, // 750 CFA
      { id: '4', name: 'Omeprazole', price: 2200, inStock: true, quantity: 20 } // 2,200 CFA
    ]
  },
  {
    id: '2',
    name: 'PHARMACIE DU SOLEIL',
    address: '642 AV Ahmadou Ahidjo, BP 67, Yaoundé',
    phone: '+237 2 22 22 14 23',
    rating: 4.5,
    isOpenNow: true,
    location: { lat: 3.8485, lng: 11.5025 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 600, inStock: true, quantity: 40 },
      { id: '4', name: 'Omeprazole', price: 2200, inStock: true, quantity: 15 },
      { id: '5', name: 'Metformin', price: 1800, inStock: true, quantity: 25 },
      { id: '6', name: 'Lisinopril', price: 3500, inStock: true, quantity: 12 }
    ]
  },
  {
    id: '3',
    name: 'PHARMACIE MINDILI',
    address: 'Carrefour Obili, BP 11168, Yaoundé',
    phone: '+237 22 31 51 83',
    rating: 4.3,
    isOpenNow: true,
    location: { lat: 3.8520, lng: 11.5080 },
    medications: [
      { id: '2', name: 'Amoxicillin', price: 2800, inStock: true, quantity: 20 },
      { id: '3', name: 'Ibuprofen', price: 800, inStock: true, quantity: 35 },
      { id: '7', name: 'Aspirin', price: 400, inStock: true, quantity: 45 },
      { id: '8', name: 'Ciprofloxacin', price: 3000, inStock: false, quantity: 0 }
    ]
  },
  {
    id: '4',
    name: 'PHARMACIE ST MARTIN',
    address: 'Centre Ville, BP 12404, Yaoundé',
    phone: '+237 22 23 18 69',
    rating: 4.4,
    isOpenNow: true,
    location: { lat: 3.8470, lng: 11.5015 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 550, inStock: true, quantity: 30 },
      { id: '5', name: 'Metformin', price: 1900, inStock: true, quantity: 18 },
      { id: '9', name: 'Vitamin C', price: 1200, inStock: true, quantity: 40 },
      { id: '10', name: 'Zinc Sulfate', price: 800, inStock: true, quantity: 25 }
    ]
  },
  {
    id: '5',
    name: 'PHARMACIE MOLIVA',
    address: 'Madagascar, BP 19, Yaoundé',
    phone: '+237 22 23 00 82',
    rating: 4.2,
    isOpenNow: false,
    location: { lat: 3.8460, lng: 11.5000 },
    medications: [
      { id: '2', name: 'Amoxicillin', price: 2600, inStock: true, quantity: 15 },
      { id: '4', name: 'Omeprazole', price: 2300, inStock: true, quantity: 10 },
      { id: '11', name: 'Metronidazole', price: 1800, inStock: true, quantity: 22 },
      { id: '12', name: 'Doxycycline', price: 2100, inStock: false, quantity: 0 }
    ]
  },
  {
    id: '6',
    name: 'PHARMACIE DES CAPUCINES',
    address: 'Yaoundé, BP 6034',
    phone: '+237 22 30 53 20',
    rating: 4.6,
    isOpenNow: true,
    location: { lat: 3.8490, lng: 11.5030 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 520, inStock: true, quantity: 60 },
      { id: '3', name: 'Ibuprofen', price: 780, inStock: true, quantity: 30 },
      { id: '13', name: 'Loratadine', price: 1500, inStock: true, quantity: 20 },
      { id: '14', name: 'Cetirizine', price: 1200, inStock: true, quantity: 25 }
    ]
  },
  {
    id: '7',
    name: 'PHARMACIE LES PETALES',
    address: 'Warda, BP 5116, Yaoundé',
    phone: '+237 22 23 15 97',
    rating: 4.3,
    isOpenNow: true,
    location: { lat: 3.8500, lng: 11.5040 },
    medications: [
      { id: '5', name: 'Metformin', price: 1850, inStock: true, quantity: 28 },
      { id: '6', name: 'Lisinopril', price: 3400, inStock: true, quantity: 15 },
      { id: '15', name: 'Atorvastatin', price: 4200, inStock: true, quantity: 12 },
      { id: '16', name: 'Amlodipine', price: 2800, inStock: false, quantity: 0 }
    ]
  },
  {
    id: '8',
    name: 'PHARMACIE DU CENTRE',
    address: 'Immeuble T Bella, BP 7061, Yaoundé',
    phone: '+237 22 22 11 80',
    rating: 4.5,
    isOpenNow: true,
    location: { lat: 3.8475, lng: 11.5020 },
    medications: [
      { id: '2', name: 'Amoxicillin', price: 2700, inStock: true, quantity: 25 },
      { id: '17', name: 'Azithromycin', price: 3800, inStock: true, quantity: 18 },
      { id: '18', name: 'Ceftriaxone', price: 4500, inStock: true, quantity: 10 },
      { id: '19', name: 'Prednisolone', price: 2200, inStock: true, quantity: 20 }
    ]
  },
  {
    id: '9',
    name: 'PHARMACIE BLEUE NGOUSSO',
    address: 'Face Hôpital Général, BP 5024, Yaoundé',
    phone: '+237 22 21 42 10',
    rating: 4.4,
    isOpenNow: true,
    location: { lat: 3.8510, lng: 11.5060 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 480, inStock: true, quantity: 80 },
      { id: '20', name: 'Tramadol', price: 3200, inStock: true, quantity: 15 },
      { id: '21', name: 'Morphine', price: 5500, inStock: true, quantity: 8 },
      { id: '22', name: 'Diclofenac', price: 1800, inStock: true, quantity: 35 }
    ]
  },
  {
    id: '10',
    name: 'GRANDE PHARMACIE LYONNAISE',
    address: 'Bata Mokolo, BP 4642, Yaoundé',
    phone: '+237 22 22 47 27',
    rating: 4.7,
    isOpenNow: true,
    location: { lat: 3.8530, lng: 11.5100 },
    medications: [
      { id: '4', name: 'Omeprazole', price: 2100, inStock: true, quantity: 30 },
      { id: '23', name: 'Lansoprazole', price: 2400, inStock: true, quantity: 20 },
      { id: '24', name: 'Ranitidine', price: 1600, inStock: false, quantity: 0 },
      { id: '25', name: 'Simvastatin', price: 3600, inStock: true, quantity: 14 }
    ]
  },
  {
    id: '11',
    name: 'PHARMACIE D\'EMANA',
    address: 'Emana, BP 1317, Yaoundé',
    phone: '+237 22 21 42 94',
    rating: 4.1,
    isOpenNow: true,
    location: { lat: 3.8400, lng: 11.4950 },
    medications: [
      { id: '2', name: 'Amoxicillin', price: 2550, inStock: true, quantity: 22 },
      { id: '26', name: 'Clarithromycin', price: 4100, inStock: true, quantity: 12 },
      { id: '27', name: 'Erythromycin', price: 3200, inStock: true, quantity: 18 },
      { id: '28', name: 'Tetracycline', price: 2800, inStock: false, quantity: 0 }
    ]
  },
  {
    id: '12',
    name: 'PHARMACIE DE LA VIE',
    address: 'Mokolo face Fokou, BP 103, Yaoundé',
    phone: '+237 22 22 67 87',
    rating: 4.3,
    isOpenNow: true,
    location: { lat: 3.8540, lng: 11.5110 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 490, inStock: true, quantity: 70 },
      { id: '3', name: 'Ibuprofen', price: 760, inStock: true, quantity: 40 },
      { id: '29', name: 'Naproxen', price: 1800, inStock: true, quantity: 25 },
      { id: '30', name: 'Meloxicam', price: 2200, inStock: true, quantity: 15 }
    ]
  },
  {
    id: '13',
    name: 'PHARMACIE ST LUC',
    address: 'Mvog-Ada, BP 14346, Yaoundé',
    phone: '+237 22 22 97 55',
    rating: 4.2,
    isOpenNow: false,
    location: { lat: 3.8420, lng: 11.4980 },
    medications: [
      { id: '5', name: 'Metformin', price: 1750, inStock: true, quantity: 35 },
      { id: '31', name: 'Glibenclamide', price: 2100, inStock: true, quantity: 20 },
      { id: '32', name: 'Insulin', price: 8500, inStock: true, quantity: 8 },
      { id: '33', name: 'Gliclazide', price: 2800, inStock: true, quantity: 12 }
    ]
  },
  {
    id: '14',
    name: 'PHARMACIE DU STADE',
    address: 'Omnisport, BP 6182, Yaoundé',
    phone: '+237 22 20 67 10',
    rating: 4.4,
    isOpenNow: true,
    location: { lat: 3.8550, lng: 11.5120 },
    medications: [
      { id: '34', name: 'Salbutamol', price: 2500, inStock: true, quantity: 25 },
      { id: '35', name: 'Beclomethasone', price: 3800, inStock: true, quantity: 15 },
      { id: '36', name: 'Theophylline', price: 2200, inStock: false, quantity: 0 },
      { id: '37', name: 'Montelukast', price: 4500, inStock: true, quantity: 10 }
    ]
  },
  {
    id: '15',
    name: 'PHARMACIE PROVIDENCE',
    address: 'Messa, BP 3351, Yaoundé',
    phone: '+237 22 23 11 54',
    rating: 4.5,
    isOpenNow: true,
    location: { lat: 3.8450, lng: 11.5010 },
    medications: [
      { id: '6', name: 'Lisinopril', price: 3300, inStock: true, quantity: 18 },
      { id: '38', name: 'Enalapril', price: 2900, inStock: true, quantity: 22 },
      { id: '39', name: 'Losartan', price: 3700, inStock: true, quantity: 16 },
      { id: '40', name: 'Valsartan', price: 4100, inStock: true, quantity: 12 }
    ]
  },
  {
    id: '16',
    name: 'PHARMACIE DE MELEN 8',
    address: 'Nvelle route Omnis (Av. Foé), BP 14775, Yaoundé',
    phone: '+237 22 31 68 63',
    rating: 4.3,
    isOpenNow: true,
    location: { lat: 3.8560, lng: 11.5130 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 510, inStock: true, quantity: 55 },
      { id: '41', name: 'Codeine', price: 3500, inStock: true, quantity: 12 },
      { id: '42', name: 'Morphine Sulfate', price: 6200, inStock: true, quantity: 6 },
      { id: '43', name: 'Fentanyl', price: 12000, inStock: false, quantity: 0 }
    ]
  },
  {
    id: '17',
    name: 'PHARMACIE DE LA MOISSON',
    address: 'Poste Centrale, BP 1897, Yaoundé',
    phone: '+237 22 23 16 19',
    rating: 4.6,
    isOpenNow: true,
    location: { lat: 3.8465, lng: 11.5018 },
    medications: [
      { id: '2', name: 'Amoxicillin', price: 2650, inStock: true, quantity: 28 },
      { id: '44', name: 'Penicillin', price: 1800, inStock: true, quantity: 35 },
      { id: '45', name: 'Ampicillin', price: 2200, inStock: true, quantity: 20 },
      { id: '46', name: 'Cephalexin', price: 3100, inStock: true, quantity: 15 }
    ]
  },
  {
    id: '18',
    name: 'PHARMACIE ADER',
    address: 'Yaoundé Centre, BP 1234',
    phone: '+237 22 23 59 04',
    rating: 4.0,
    isOpenNow: false,
    location: { lat: 3.8440, lng: 11.4990 },
    medications: [
      { id: '47', name: 'Chloroquine', price: 1500, inStock: true, quantity: 30 },
      { id: '48', name: 'Artemether', price: 4200, inStock: true, quantity: 18 },
      { id: '49', name: 'Quinine', price: 2800, inStock: false, quantity: 0 },
      { id: '50', name: 'Doxycycline', price: 2100, inStock: true, quantity: 25 }
    ]
  }
];

export default YAUNDE_PHARMACIES;
