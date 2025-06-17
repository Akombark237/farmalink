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
      // Get coordinates from pharmacy data
      const location = getCoordinatesFromPharmacy(pharmacy);

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
      const location = getCoordinatesFromPharmacy(pharmacy);
      if (!location) return true;

      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        location.lat,
        location.lng
      );

      return distance <= selectedDistance;
    }).map(pharmacy => {
      const location = getCoordinatesFromPharmacy(pharmacy);
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
  }, [selectedDistance, userLocation, pharmacies]);

  // Get coordinates from pharmacy data
  const getCoordinatesFromPharmacy = (pharmacy: Pharmacy): Location | null => {
    // If pharmacy already has location data, use it
    if (pharmacy.location) {
      return pharmacy.location;
    }

    // Fallback: generate coordinates near Yaoundé center
    const baseLocation = { lat: 3.8480, lng: 11.5021 }; // Yaoundé center
    return {
      lat: baseLocation.lat + (Math.random() - 0.5) * 0.05,
      lng: baseLocation.lng + (Math.random() - 0.5) * 0.05
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
    if (onDistanceChange) {
      onDistanceChange(distance);
    }
  };

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-3 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-sm font-medium">
            {filteredPharmacies.length} pharmacies in Yaoundé
          </span>
        </div>

        {userLocation && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Navigation size={14} className="text-green-600" />
            <span>Your location detected</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Click on pharmacy markers for details
        </div>
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
                    onChange={(e) => {
                      const newDistance = Number(e.target.value);
                      setSelectedDistance(newDistance);
                      if (onDistanceChange) {
                        onDistanceChange(newDistance);
                      }
                    }}
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
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 border-t-4 border-blue-600">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-blue-900">{selectedPharmacy.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedPharmacy.address}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedPharmacy.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1 font-medium">{selectedPharmacy.rating}/5</span>
                  </div>
                )}

                {selectedPharmacy.distance && (
                  <div className="flex items-center">
                    <MapPin size={14} className="text-purple-600 mr-1" />
                    <span className="text-purple-600 font-medium">{selectedPharmacy.distance}</span>
                  </div>
                )}

                {selectedPharmacy.isOpenNow !== undefined && (
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${selectedPharmacy.isOpenNow ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`font-medium ${selectedPharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedPharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                )}

                {selectedPharmacy.phone && (
                  <div className="flex items-center">
                    <span className="text-blue-600 font-medium">{selectedPharmacy.phone}</span>
                  </div>
                )}

                {selectedPharmacy.medicationCount && (
                  <div className="flex items-center col-span-2">
                    <span className="text-green-600 text-sm">
                      {selectedPharmacy.medicationCount}+ medications available
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md transition-colors">
                  Get Directions
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedPharmacy(null)}
              className="text-gray-400 hover:text-gray-600 ml-4"
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
        selectedDistance={selectedDistance}
        className={className}
      />
    </div>
  );
}
