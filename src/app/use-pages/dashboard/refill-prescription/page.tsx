'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Pill, 
  ChevronLeft,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  ShoppingCart,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCfa } from "@/utils/currency";

// Sample prescriptions data
const prescriptions = [
  {
    id: 1,
    medication: "Amlodipine 5mg",
    dosage: "1 tablet daily",
    prescribedBy: "Dr. Michel Kamga",
    prescribedDate: "2024-01-08",
    lastRefill: "2024-01-08",
    nextRefillDue: "2024-02-08",
    refillsRemaining: 3,
    totalRefills: 5,
    status: "active",
    condition: "Hypertension",
    instructions: "Take with food, preferably in the morning",
    price: 15000,
    pharmacy: "Pharmacie Centrale",
    canRefill: true
  },
  {
    id: 2,
    medication: "Metformin 500mg",
    dosage: "2 tablets twice daily",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedDate: "2023-12-15",
    lastRefill: "2024-01-05",
    nextRefillDue: "2024-01-20",
    refillsRemaining: 2,
    totalRefills: 6,
    status: "due",
    condition: "Type 2 Diabetes",
    instructions: "Take with meals to reduce stomach upset",
    price: 8500,
    pharmacy: "Pharmacie du Centre",
    canRefill: true
  },
  {
    id: 3,
    medication: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    prescribedBy: "Dr. Michel Kamga",
    prescribedDate: "2023-11-20",
    lastRefill: "2024-01-10",
    nextRefillDue: "2024-02-10",
    refillsRemaining: 0,
    totalRefills: 4,
    status: "expired",
    condition: "Hypertension",
    instructions: "Take at the same time each day",
    price: 12000,
    pharmacy: "Pharmacie Moderne",
    canRefill: false
  },
  {
    id: 4,
    medication: "Vitamin D3 1000IU",
    dosage: "1 capsule daily",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedDate: "2024-01-03",
    lastRefill: "2024-01-03",
    nextRefillDue: "2024-03-03",
    refillsRemaining: 4,
    totalRefills: 4,
    status: "active",
    condition: "Vitamin D Deficiency",
    instructions: "Take with a meal containing fat for better absorption",
    price: 6500,
    pharmacy: "Pharmacie Centrale",
    canRefill: true
  }
];

export default function RefillPrescriptionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [refillSubmitted, setRefillSubmitted] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrescriptionSelect = (prescriptionId) => {
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (!prescription.canRefill) return;

    setSelectedPrescriptions(prev => 
      prev.includes(prescriptionId) 
        ? prev.filter(id => id !== prescriptionId)
        : [...prev, prescriptionId]
    );
  };

  const handleRefillRequest = () => {
    if (selectedPrescriptions.length > 0 && selectedPharmacy) {
      setRefillSubmitted(true);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { variant: 'default', text: 'Active' },
      due: { variant: 'secondary', text: 'Due for Refill' },
      expired: { variant: 'destructive', text: 'Expired' }
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'due':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Pill className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalCost = selectedPrescriptions.reduce((total, id) => {
    const prescription = prescriptions.find(p => p.id === id);
    return total + (prescription?.price || 0);
  }, 0);

  const pharmacies = [
    "Pharmacie Centrale",
    "Pharmacie du Centre", 
    "Pharmacie Moderne",
    "Pharmacie de l'Étoile",
    "Pharmacie Saint-Joseph"
  ];

  if (refillSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Prescription Refill Requested Successfully!
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Refill Details</h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Medications:</span>
                  <span className="font-medium">{selectedPrescriptions.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pharmacy:</span>
                  <span className="font-medium">{selectedPharmacy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium text-green-600">{formatCfa(totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Ready:</span>
                  <span className="font-medium">Within 2-4 hours</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">What happens next:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your prescription will be prepared by the pharmacy</li>
                      <li>You'll receive an SMS when ready for pickup</li>
                      <li>Bring your ID and insurance card</li>
                      <li>Payment can be made at pickup</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Link href="/use-pages/dashboard" className="flex-1">
                  <Button className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1">
                  Track Order Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/use-pages/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Refill Prescription</h1>
            <p className="text-gray-600 mt-2">Request refills for your current medications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prescriptions List */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search medications, doctors, or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Prescriptions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Prescriptions</h2>
              {filteredPrescriptions.map((prescription) => (
                <Card 
                  key={prescription.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    !prescription.canRefill 
                      ? 'opacity-60 cursor-not-allowed' 
                      : selectedPrescriptions.includes(prescription.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handlePrescriptionSelect(prescription.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Pill className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{prescription.medication}</h3>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(prescription.status)}
                              {getStatusBadge(prescription.status)}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-1">{prescription.dosage}</p>
                          <p className="text-sm text-gray-500 mb-3">For: {prescription.condition}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{prescription.prescribedBy}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{prescription.pharmacy}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Next refill: {prescription.nextRefillDue}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Pill className="h-4 w-4" />
                              <span>{prescription.refillsRemaining} refills left</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Instructions:</strong> {prescription.instructions}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-green-600">
                              {formatCfa(prescription.price)}
                            </span>
                            {!prescription.canRefill && (
                              <span className="text-sm text-red-600 font-medium">
                                {prescription.status === 'expired' ? 'Prescription Expired' : 'Cannot Refill'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {prescription.canRefill && (
                        <div className="ml-4">
                          <input
                            type="checkbox"
                            checked={selectedPrescriptions.includes(prescription.id)}
                            onChange={() => handlePrescriptionSelect(prescription.id)}
                            className="h-5 w-5 text-blue-600 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-12">
                <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No prescriptions found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Refill Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Refill Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPrescriptions.length > 0 ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Selected Medications ({selectedPrescriptions.length})
                      </label>
                      <div className="space-y-2">
                        {selectedPrescriptions.map(id => {
                          const prescription = prescriptions.find(p => p.id === id);
                          return (
                            <div key={id} className="flex justify-between items-center text-sm">
                              <span className="truncate">{prescription.medication}</span>
                              <span className="font-medium">{formatCfa(prescription.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">{formatCfa(totalCost)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Select Pharmacy *
                      </label>
                      <select
                        value={selectedPharmacy}
                        onChange={(e) => setSelectedPharmacy(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Choose a pharmacy...</option>
                        {pharmacies.map(pharmacy => (
                          <option key={pharmacy} value={pharmacy}>{pharmacy}</option>
                        ))}
                      </select>
                    </div>

                    <Button 
                      onClick={handleRefillRequest}
                      disabled={!selectedPharmacy}
                      className="w-full"
                    >
                      Request Refill
                    </Button>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select medications to refill</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
