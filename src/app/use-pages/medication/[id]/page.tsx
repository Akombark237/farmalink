'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ShoppingCart, 
  AlertTriangle,
  Info,
  Pill,
  Shield,
  Truck,
  CheckCircle
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  price: number;
  availability: 'High' | 'Medium' | 'Low';
  pharmacies: number;
  description: string;
  dosage: string;
  manufacturer: string;
  sideEffects: string[];
  contraindications: string[];
  activeIngredient: string;
  prescriptionRequired: boolean;
  inStock: boolean;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  price: number;
  inStock: boolean;
  rating: number;
  isOpenNow: boolean;
}

export default function MedicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [medication, setMedication] = useState<Medication | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'pharmacies' | 'reviews'>('overview');

  const formatCfa = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('XAF', 'CFA');
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMedication: Medication = {
      id: params.id as string,
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      price: 2500,
      availability: 'High',
      pharmacies: 15,
      description: 'Paracetamol is a common painkiller used to treat aches and pain. It can also be used to reduce a high temperature.',
      dosage: '500mg tablets - Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
      manufacturer: 'PharmaCorp Cameroon',
      sideEffects: ['Nausea', 'Stomach upset', 'Allergic reactions (rare)', 'Liver damage (with overdose)'],
      contraindications: ['Severe liver disease', 'Allergy to paracetamol', 'Chronic alcohol use'],
      activeIngredient: 'Paracetamol 500mg',
      prescriptionRequired: false,
      inStock: true
    };

    const mockPharmacies: Pharmacy[] = [
      {
        id: '1',
        name: 'Pharmacie Centrale',
        address: 'Avenue Kennedy, Yaoundé',
        phone: '+237 222 123 456',
        distance: '0.5 km',
        price: 2500,
        inStock: true,
        rating: 4.5,
        isOpenNow: true
      },
      {
        id: '2',
        name: 'Pharmacie du Marché',
        address: 'Marché Central, Yaoundé',
        phone: '+237 222 234 567',
        distance: '1.2 km',
        price: 2300,
        inStock: true,
        rating: 4.2,
        isOpenNow: true
      },
      {
        id: '3',
        name: 'Pharmacie Moderne',
        address: 'Quartier Bastos, Yaoundé',
        phone: '+237 222 345 678',
        distance: '2.1 km',
        price: 2700,
        inStock: false,
        rating: 4.7,
        isOpenNow: false
      }
    ];

    // Simulate API loading
    setTimeout(() => {
      setMedication(mockMedication);
      setPharmacies(mockPharmacies);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medication details...</p>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Medication Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Search</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medication Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{medication.name}</h1>
                    {medication.genericName && (
                      <p className="text-lg text-gray-600 mb-2">Generic: {medication.genericName}</p>
                    )}
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="secondary">{medication.category}</Badge>
                      <Badge variant={medication.prescriptionRequired ? "destructive" : "default"}>
                        {medication.prescriptionRequired ? "Prescription Required" : "Over the Counter"}
                      </Badge>
                      <Badge variant={medication.inStock ? "default" : "secondary"}>
                        {medication.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{formatCfa(medication.price)}</p>
                    <p className="text-sm text-gray-600">Starting from</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{medication.description}</p>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Info },
                  { id: 'pharmacies', label: 'Available Pharmacies', icon: MapPin },
                  { id: 'reviews', label: 'Reviews', icon: Star }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedTab(id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      selectedTab === id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Dosage Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Pill className="h-5 w-5" />
                      <span>Dosage & Usage</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{medication.dosage}</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Active Ingredient:</strong> {medication.activeIngredient}
                      </p>
                      <p className="text-sm text-blue-800 mt-1">
                        <strong>Manufacturer:</strong> {medication.manufacturer}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Side Effects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <span>Side Effects</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {medication.sideEffects.map((effect, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-gray-700">{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Contraindications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <span>Contraindications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {medication.contraindications.map((contraindication, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-700">{contraindication}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Important:</strong> Always consult with a healthcare professional before taking this medication, especially if you have any of the above conditions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'pharmacies' && (
              <div className="space-y-4">
                {pharmacies.map((pharmacy) => (
                  <Card key={pharmacy.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{pharmacy.name}</h3>
                          <p className="text-gray-600 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {pharmacy.address}
                          </p>
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">{pharmacy.rating}</span>
                            </div>
                            <span className="text-sm text-blue-600">{pharmacy.distance}</span>
                            <span className={`text-sm font-medium ${
                              pharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {pharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{formatCfa(pharmacy.price)}</p>
                          <p className={`text-sm font-medium ${
                            pharmacy.inStock ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {pharmacy.inStock ? 'In Stock' : 'Out of Stock'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button
                          className="flex-1"
                          disabled={!pharmacy.inStock}
                          onClick={() => router.push('/use-pages/cart')}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {pharmacy.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/use-pages/contact-pharmacy/${pharmacy.id}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to review this medication</p>
                  <Button>Write a Review</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push('/use-pages/cart')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Save to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  <Truck className="h-4 w-4 mr-2" />
                  Check Delivery
                </Button>
              </CardContent>
            </Card>

            {/* Availability Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Availability Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Pharmacies:</span>
                    <span className="font-semibold">{medication.pharmacies}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">In Stock:</span>
                    <span className="font-semibold text-green-600">
                      {pharmacies.filter(p => p.inStock).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price Range:</span>
                    <span className="font-semibold">
                      {formatCfa(Math.min(...pharmacies.map(p => p.price)))} - {formatCfa(Math.max(...pharmacies.map(p => p.price)))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Disclaimer */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Medical Disclaimer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700">
                  This information is for educational purposes only and should not replace professional medical advice. 
                  Always consult with a healthcare provider before starting any new medication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
