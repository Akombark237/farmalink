'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Star } from 'lucide-react';
import { formatCfa } from '@/utils/currency';
import { YAUNDE_PHARMACIES, type Pharmacy, type Location, type Medication } from '@/data/pharmacies';

interface SimplePharmacyMapProps {
  selectedDrug?: string;
  onPharmacySelect?: (pharmacy: Pharmacy) => void;
  className?: string;
}

export default function SimplePharmacyMap({
  selectedDrug,
  onPharmacySelect,
  className = "w-full"
}: SimplePharmacyMapProps) {
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>(YAUNDE_PHARMACIES);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Yaoundé, Cameroon
          setUserLocation({ lat: 3.8480, lng: 11.5021 });
        }
      );
    } else {
      setUserLocation({ lat: 3.8480, lng: 11.5021 });
    }
  }, []);

  // Filter pharmacies based on selected drug
  useEffect(() => {
    if (selectedDrug) {
      const filtered = YAUNDE_PHARMACIES.filter(pharmacy => 
        pharmacy.medications.some(med => 
          med.name.toLowerCase().includes(selectedDrug.toLowerCase()) && med.inStock
        )
      );
      
      // Calculate distances if user location is available
      if (userLocation) {
        const withDistances = filtered.map(pharmacy => ({
          ...pharmacy,
          distance: calculateDistance(
            userLocation.lat, userLocation.lng,
            pharmacy.location.lat, pharmacy.location.lng
          ),
          estimatedTime: `${Math.round(calculateDistance(
            userLocation.lat, userLocation.lng,
            pharmacy.location.lat, pharmacy.location.lng
          ) * 2)} min`
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
        
        setFilteredPharmacies(withDistances);
      } else {
        setFilteredPharmacies(filtered);
      }
    } else {
      setFilteredPharmacies(YAUNDE_PHARMACIES);
    }
  }, [selectedDrug, userLocation]);

  const handlePharmacySelect = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    onPharmacySelect?.(pharmacy);
  };

  const getDirections = (pharmacy: Pharmacy) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pharmacy.location.lat},${pharmacy.location.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(pharmacy.address)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedDrug 
            ? `Pharmacies with "${selectedDrug}"` 
            : 'Available Pharmacies'
          }
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {filteredPharmacies.length} pharmacy(ies) found
          {userLocation && ' • Sorted by distance'}
        </p>
      </div>

      {/* Pharmacy List */}
      <div className="bg-white rounded-b-lg max-h-96 overflow-y-auto">
        {filteredPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedPharmacy?.id === pharmacy.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => handlePharmacySelect(pharmacy)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold text-gray-800">{pharmacy.name}</h4>
                  {pharmacy.isOpenNow ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Open
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Closed
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{pharmacy.address}</p>
                
                {pharmacy.phone && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                    <Phone className="h-3 w-3" />
                    <span>{pharmacy.phone}</span>
                  </div>
                )}
                
                {pharmacy.rating && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{pharmacy.rating}/5</span>
                  </div>
                )}

                {pharmacy.distance && (
                  <div className="flex items-center space-x-4 text-sm text-blue-600 mb-2">
                    <span>📍 {pharmacy.distance.toFixed(1)} km away</span>
                    <span>🕒 ~{pharmacy.estimatedTime}</span>
                  </div>
                )}

                {/* Available medications */}
                {selectedDrug && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Available:</h5>
                    <div className="space-y-1">
                      {pharmacy.medications
                        .filter(med => 
                          med.name.toLowerCase().includes(selectedDrug.toLowerCase()) && med.inStock
                        )
                        .map(med => (
                          <div key={med.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{med.name}</span>
                            <span className="font-semibold text-green-600">
                              {formatCfa(med.price)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    getDirections(pharmacy);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex items-center space-x-1"
                >
                  <Navigation className="h-3 w-3" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPharmacies.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-2">No pharmacies found</p>
            <p className="text-sm">
              {selectedDrug 
                ? `No pharmacies have "${selectedDrug}" in stock.`
                : 'No pharmacies available in this area.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
