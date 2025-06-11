'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ChevronLeft,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Share
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Sample medical records
const medicalRecords = [
  {
    id: 1,
    type: "Lab Results",
    title: "Complete Blood Count (CBC)",
    date: "2024-01-10",
    doctor: "Dr. Sarah Johnson",
    facility: "Yaoundé Central Hospital",
    status: "available",
    description: "Routine blood work including hemoglobin, white blood cells, and platelet count",
    fileSize: "2.3 MB",
    category: "laboratory"
  },
  {
    id: 2,
    type: "Prescription",
    title: "Hypertension Medication",
    date: "2024-01-08",
    doctor: "Dr. Michel Kamga",
    facility: "Yaoundé University Hospital",
    status: "available",
    description: "Prescription for blood pressure medication - Amlodipine 5mg",
    fileSize: "1.1 MB",
    category: "prescription"
  },
  {
    id: 3,
    type: "Imaging",
    title: "Chest X-Ray",
    date: "2024-01-05",
    doctor: "Dr. Paul Nkomo",
    facility: "Radiology Center Yaoundé",
    status: "processing",
    description: "Chest X-ray for respiratory symptoms evaluation",
    fileSize: "5.7 MB",
    category: "imaging"
  },
  {
    id: 4,
    type: "Consultation",
    title: "General Check-up Report",
    date: "2024-01-03",
    doctor: "Dr. Sarah Johnson",
    facility: "Yaoundé Central Hospital",
    status: "available",
    description: "Annual physical examination and health assessment",
    fileSize: "3.2 MB",
    category: "consultation"
  },
  {
    id: 5,
    type: "Vaccination",
    title: "COVID-19 Vaccination Record",
    date: "2023-12-15",
    doctor: "Dr. Fatima Mballa",
    facility: "Vaccination Center",
    status: "available",
    description: "COVID-19 booster vaccination certificate",
    fileSize: "0.8 MB",
    category: "vaccination"
  },
  {
    id: 6,
    type: "Lab Results",
    title: "Lipid Profile",
    date: "2023-12-10",
    doctor: "Dr. Michel Kamga",
    facility: "Yaoundé University Hospital",
    status: "requested",
    description: "Cholesterol and triglyceride levels assessment",
    fileSize: "1.9 MB",
    category: "laboratory"
  }
];

const recordCategories = [
  { id: 'all', name: 'All Records', count: medicalRecords.length },
  { id: 'laboratory', name: 'Lab Results', count: medicalRecords.filter(r => r.category === 'laboratory').length },
  { id: 'prescription', name: 'Prescriptions', count: medicalRecords.filter(r => r.category === 'prescription').length },
  { id: 'imaging', name: 'Imaging', count: medicalRecords.filter(r => r.category === 'imaging').length },
  { id: 'consultation', name: 'Consultations', count: medicalRecords.filter(r => r.category === 'consultation').length },
  { id: 'vaccination', name: 'Vaccinations', count: medicalRecords.filter(r => r.category === 'vaccination').length }
];

export default function RequestRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.facility.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleRecordSelect = (recordId) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleRequestRecords = () => {
    if (selectedRecords.length > 0) {
      setRequestSubmitted(true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'requested':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      available: 'default',
      processing: 'secondary',
      requested: 'outline'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (requestSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Records Request Submitted Successfully!
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Request Details</h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Records Requested:</span>
                  <span className="font-medium">{selectedRecords.length} files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Processing:</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Method:</span>
                  <span className="font-medium">Secure Digital Download</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">What happens next:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your request will be reviewed by our medical records team</li>
                      <li>You'll receive an email confirmation within 24 hours</li>
                      <li>Records will be available for download in your patient portal</li>
                      <li>You'll be notified via SMS when ready</li>
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
                  Track Request Status
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
            <h1 className="text-3xl font-bold text-gray-900">Request Medical Records</h1>
            <p className="text-gray-600 mt-2">Access and download your medical history and documents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {recordCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                        selectedCategory === category.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline">{category.count}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Request Summary */}
            {selectedRecords.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Request Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Records:</span>
                      <span className="font-medium">{selectedRecords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">2-3 days</span>
                    </div>
                    <Button 
                      onClick={handleRequestRecords}
                      className="w-full mt-4"
                    >
                      Request Selected Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Records List */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search records by title, doctor, or facility..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="h-12">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Records Grid */}
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card 
                  key={record.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedRecords.includes(record.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleRecordSelect(record.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{record.title}</h3>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(record.status)}
                              {getStatusBadge(record.status)}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{record.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{record.doctor}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{record.facility}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-500">Size: {record.fileSize}</span>
                            <div className="flex space-x-2">
                              {record.status === 'available' && (
                                <>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Share className="h-4 w-4 mr-1" />
                                    Share
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <input
                          type="checkbox"
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => handleRecordSelect(record.id)}
                          className="h-5 w-5 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No records found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
