'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Package,
  Filter,
  Grid,
  List,
  ChevronRight
} from "lucide-react";
import { YAUNDE_PHARMACIES, type Pharmacy } from "@/data/pharmacies";
import { formatCfa } from "@/utils/currency";

export default function PharmaciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and search pharmacies
  const filteredPharmacies = useMemo(() => {
    return YAUNDE_PHARMACIES.filter(pharmacy => {
      const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'open' && pharmacy.isOpenNow) ||
                           (statusFilter === 'closed' && !pharmacy.isOpenNow);
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const openPharmaciesCount = YAUNDE_PHARMACIES.filter(p => p.isOpenNow).length;
  const totalMedicationsCount = YAUNDE_PHARMACIES.reduce((total, pharmacy) => 
    total + pharmacy.medications.filter(med => med.inStock).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pharmacies in Yaoundé
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find and browse local pharmacies with real-time medication availability
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pharmacies</p>
                    <p className="text-2xl font-bold text-blue-600">{YAUNDE_PHARMACIES.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Currently Open</p>
                    <p className="text-2xl font-bold text-green-600">{openPharmaciesCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available Medications</p>
                    <p className="text-2xl font-bold text-purple-600">{totalMedicationsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search pharmacies by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className="h-12"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'open' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('open')}
                className="h-12"
              >
                Open Now
              </Button>
              <Button
                variant={statusFilter === 'closed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('closed')}
                className="h-12"
              >
                Closed
              </Button>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="h-12 rounded-none"
                size="sm"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="h-12 rounded-none"
                size="sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPharmacies.length} of {YAUNDE_PHARMACIES.length} pharmacies
          </p>
        </div>

        {/* Pharmacies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPharmacies.map((pharmacy) => (
              <PharmacyListItem key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredPharmacies.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pharmacies found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Pharmacy Card Component for Grid View
function PharmacyCard({ pharmacy }: { pharmacy: Pharmacy }) {
  const availableMeds = pharmacy.medications.filter(med => med.inStock).length;
  const avgPrice = pharmacy.medications.length > 0 
    ? pharmacy.medications.reduce((sum, med) => sum + med.price, 0) / pharmacy.medications.length 
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {pharmacy.name}
          </CardTitle>
          <Badge variant={pharmacy.isOpenNow ? "default" : "secondary"}>
            {pharmacy.isOpenNow ? "Open" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">{pharmacy.address}</p>
        </div>
        
        {/* Phone */}
        {pharmacy.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <p className="text-sm text-gray-600">{pharmacy.phone}</p>
          </div>
        )}
        
        {/* Rating */}
        {pharmacy.rating && (
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{pharmacy.rating}</span>
            <span className="text-sm text-gray-500">rating</span>
          </div>
        )}
        
        {/* Medications Info */}
        <div className="bg-blue-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Available Medications</span>
            <Badge variant="outline">{availableMeds}</Badge>
          </div>
          {avgPrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Price</span>
              <span className="text-sm font-medium text-blue-600">{formatCfa(avgPrice)}</span>
            </div>
          )}
        </div>
        
        {/* View Details Button */}
        <Link href={`/use-pages/pharmacy/${pharmacy.id}`}>
          <Button className="w-full mt-4 flex items-center justify-center space-x-2">
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Pharmacy List Item Component for List View
function PharmacyListItem({ pharmacy }: { pharmacy: Pharmacy }) {
  const availableMeds = pharmacy.medications.filter(med => med.inStock).length;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-900">{pharmacy.name}</h3>
              <Badge variant={pharmacy.isOpenNow ? "default" : "secondary"}>
                {pharmacy.isOpenNow ? "Open" : "Closed"}
              </Badge>
              {pharmacy.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{pharmacy.rating}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
              <p className="text-gray-600">{pharmacy.address}</p>
            </div>
            
            {pharmacy.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600">{pharmacy.phone}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{availableMeds} medications available</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/use-pages/pharmacy/${pharmacy.id}`}>
              <Button className="flex items-center space-x-2">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
