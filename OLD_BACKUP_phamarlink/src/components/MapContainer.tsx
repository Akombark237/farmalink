'use client';

import { useState, useEffect } from 'react';
import OpenStreetMap from './OpenStreetMap';
import { MapPin, Navigation, Filter } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  isOpenNow?: boolean;
  location?: Location;
  distance?: string;
  medicationCount?: number;
}

interface MapContainerProps {
  pharmacies: Pharmacy[];
  onPharmacySelect?: (pharmacy: Pharmacy) => void;
  onDistanceChange?: (distance: number) => void;
  className?: string;
}

export default function MapContainer({
  pharmacies,
  onPharmacySelect,
  onDistanceChange,
  className = "h-96"
}: MapContainerProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>(pharmacies);
  const [selectedDistance, setSelectedDistance] = useState<number>(5);
  const [showFilters, setShowFilters] = useState(false);

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
        (error) => {
          console.warn('Error getting location:', error);
          // Default to a central location if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
        }
      );
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Add coordinates to pharmacies and calculate distances
  useEffect(() => {
    const pharmaciesWithCoordinates = pharmacies.map(pharmacy => {
      // Add mock coordinates based on address (in real app, use geocoding API)
      const location = getCoordinatesFromAddress(pharmacy.address);
      
      let distance = pharmacy.distance;
      if (userLocation && location) {
        const calculatedDistance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          location.lat,
          location.lng
        );
        distance = `${calculatedDistance.toFixed(1)} km`;
      }

      return {
        ...pharmacy,
        location,
        distance
      };
    });

    setFilteredPharmacies(pharmaciesWithCoordinates);
  }, [pharmacies, userLocation]);

  // Filter pharmacies by distance
  useEffect(() => {
    if (!userLocation) {
      setFilteredPharmacies(pharmacies);
      return;
    }

    const filtered = pharmacies.filter(pharmacy => {
      const location = getCoordinatesFromAddress(pharmacy.address);
      if (!location) return true;

      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        location.lat,
        location.lng
      );

      return distance <= selectedDistance;
    }).map(pharmacy => {
      const location = getCoordinatesFromAddress(pharmacy.address);
      let distance = pharmacy.distance;
      
      if (userLocation && location) {
        const calculatedDistance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          location.lat,
          location.lng
        );
        distance = `${calculatedDistance.toFixed(1)} km`;
      }

      return {
        ...pharmacy,
        location,
        distance
      };
    });

    setFilteredPharmacies(filtered);
    
    if (onDistanceChange) {
      onDistanceChange(selectedDistance);
    }
  }, [selectedDistance, userLocation, pharmacies, onDistanceChange]);

  // Mock function to get coordinates from address
  const getCoordinatesFromAddress = (address: string): Location | null => {
    // In a real application, you would use Google's Geocoding API
    // For demo purposes, we'll use some mock coordinates
    const mockCoordinates: { [key: string]: Location } = {
      '123 Main St': { lat: 40.7589, lng: -73.9851 },
      '456 Oak Ave': { lat: 40.7505, lng: -73.9934 },
      '789 Pine Rd': { lat: 40.7614, lng: -73.9776 },
      '321 Elm St': { lat: 40.7549, lng: -73.9840 },
      '654 Birch Ln': { lat: 40.7580, lng: -73.9855 },
    };

    // Try to find a match in our mock data
    for (const [key, location] of Object.entries(mockCoordinates)) {
      if (address.includes(key)) {
        return location;
      }
    }

    // Generate random coordinates near NYC for demo
    const baseLocation = { lat: 40.7128, lng: -74.0060 };
    return {
      lat: baseLocation.lat + (Math.random() - 0.5) * 0.1,
      lng: baseLocation.lng + (Math.random() - 0.5) * 0.1
    };
  };

  const handlePharmacySelect = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    if (onPharmacySelect) {
      onPharmacySelect(pharmacy);
    }
  };

  const handleDistanceFilter = (distance: number) => {
    setSelectedDistance(distance);
  };

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-sm font-medium">
            {filteredPharmacies.length} pharmacies found
          </span>
        </div>
        
        {userLocation && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Navigation size={14} />
            <span>Location detected</span>
          </div>
        )}
      </div>

      {/* Distance Filter Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors"
        >
          <Filter size={20} className="text-gray-600" />
        </button>
        
        {showFilters && (
          <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-4 w-48">
            <h3 className="font-medium text-gray-900 mb-3">Distance Filter</h3>
            <div className="space-y-2">
              {[1, 2, 5, 10, 20, 50].map(distance => (
                <label key={distance} className="flex items-center">
                  <input
                    type="radio"
                    name="distance"
                    value={distance}
                    checked={selectedDistance === distance}
                    onChange={(e) => setSelectedDistance(Number(e.target.value))}
                    className="mr-2"
                  />
                  <span className="text-sm">{distance} km</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Pharmacy Info */}
      {selectedPharmacy && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedPharmacy.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedPharmacy.address}</p>
              <div className="flex items-center space-x-4 text-sm">
                {selectedPharmacy.rating && (
                  <span className="flex items-center">
                    ⭐ {selectedPharmacy.rating}/5
                  </span>
                )}
                {selectedPharmacy.distance && (
                  <span className="text-blue-600">{selectedPharmacy.distance}</span>
                )}
                {selectedPharmacy.isOpenNow !== undefined && (
                  <span className={selectedPharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'}>
                    {selectedPharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* OpenStreetMap */}
      <OpenStreetMap
        pharmacies={filteredPharmacies}
        center={userLocation || undefined}
        onPharmacySelect={handlePharmacySelect}
        onDistanceFilter={handleDistanceFilter}
        className={className}
      />
    </div>
  );
}
