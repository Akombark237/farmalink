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
  Truck,
  CheckCircle,
  Navigation,
  MessageCircle,
  Calendar,
  Pill
} from 'lucide-react';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  isOpenNow: boolean;
  hasDelivery: boolean;
  distance: string;
  description: string;
  openingHours: {
    [key: string]: string;
  };
  services: string[];
  medicationCount: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface Medication {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

export default function PharmacyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'medications' | 'reviews'>('overview');

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
    const mockPharmacy: Pharmacy = {
      id: params.id as string,
      name: 'Pharmacie Centrale',
      address: 'Avenue Kennedy, Yaoundé Centre ville',
      phone: '+237 222 123 456',
      rating: 4.5,
      totalReviews: 127,
      isOpenNow: true,
      hasDelivery: true,
      distance: '0.5 km',
      description: 'Pharmacie Centrale is a leading pharmacy in Yaoundé, providing quality medications and healthcare services to the community for over 20 years.',
      openingHours: {
        'Monday': '8:00 AM - 8:00 PM',
        'Tuesday': '8:00 AM - 8:00 PM',
        'Wednesday': '8:00 AM - 8:00 PM',
        'Thursday': '8:00 AM - 8:00 PM',
        'Friday': '8:00 AM - 8:00 PM',
        'Saturday': '8:00 AM - 6:00 PM',
        'Sunday': '9:00 AM - 5:00 PM'
      },
      services: [
        'Prescription Filling',
        'Health Consultations',
        'Blood Pressure Monitoring',
        'Diabetes Testing',
        'Home Delivery',
        'Insurance Claims'
      ],
      medicationCount: 450,
      location: {
        lat: 3.8480,
        lng: 11.5021
      }
    };

    const mockMedications: Medication[] = [
      { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 2500, inStock: true },
      { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 15000, inStock: true },
      { id: '3', name: 'Lisinopril 10mg', category: 'Blood Pressure', price: 22000, inStock: false },
      { id: '4', name: 'Metformin 500mg', category: 'Diabetes', price: 12000, inStock: true },
      { id: '5', name: 'Atorvastatin 20mg', category: 'Cholesterol', price: 25000, inStock: true }
    ];

    // Simulate API loading
    setTimeout(() => {
      setPharmacy(mockPharmacy);
      setMedications(mockMedications);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pharmacy details...</p>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pharmacy Not Found</h1>
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
                <Phone className="h-4 w-4 mr-2" />
                Call
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
            {/* Pharmacy Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{pharmacy.name}</h1>
                    <p className="text-lg text-gray-600 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {pharmacy.address}
                    </p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-medium ml-1">{pharmacy.rating}</span>
                        <span className="text-gray-500 ml-1">({pharmacy.totalReviews} reviews)</span>
                      </div>
                      <Badge variant={pharmacy.isOpenNow ? "default" : "secondary"}>
                        {pharmacy.isOpenNow ? "Open Now" : "Closed"}
                      </Badge>
                      <Badge variant={pharmacy.hasDelivery ? "default" : "secondary"}>
                        {pharmacy.hasDelivery ? "Delivery Available" : "No Delivery"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{pharmacy.distance}</p>
                    <p className="text-sm text-gray-600">from your location</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{pharmacy.description}</p>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: MapPin },
                  { id: 'medications', label: 'Available Medications', icon: Pill },
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
                {/* Opening Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Opening Hours</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(pharmacy.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{day}:</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Services Offered</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pharmacy.services.map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'medications' && (
              <div className="space-y-4">
                {medications.map((medication) => (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                          <p className="text-sm text-blue-600">{medication.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{formatCfa(medication.price)}</p>
                          <p className={`text-sm font-medium ${
                            medication.inStock ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {medication.inStock ? 'In Stock' : 'Out of Stock'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          className="flex-1" 
                          disabled={!medication.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {medication.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button variant="outline">
                          View Details
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
                  <p className="text-gray-600 mb-4">Be the first to review this pharmacy</p>
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
                  onClick={() => window.location.href = `tel:${pharmacy.phone}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Pharmacy
                </Button>
                <Button variant="outline" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/use-pages/contact-pharmacy/${pharmacy.id}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/use-pages/contact-pharmacy/${pharmacy.id}`)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{pharmacy.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      {pharmacy.hasDelivery ? 'Delivery Available' : 'No Delivery Service'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pharmacy Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Medications:</span>
                    <span className="font-semibold">{pharmacy.medicationCount}+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold ml-1">{pharmacy.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="font-semibold text-blue-600">{pharmacy.distance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      pharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
