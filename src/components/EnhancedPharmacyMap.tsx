'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Route, Clock, Phone, Star } from 'lucide-react';
import { formatCfa } from '@/utils/currency';

interface Location {
  lat: number;
  lng: number;
}

interface Medication {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  quantity?: number;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  isOpenNow?: boolean;
  location: Location;
  medications: Medication[];
  distance?: number; // in kilometers
  estimatedTime?: string; // travel time
}

interface EnhancedPharmacyMapProps {
  pharmacies: Pharmacy[];
  selectedDrug?: string;
  userLocation?: Location;
  onPharmacySelect?: (pharmacy: Pharmacy) => void;
  onDirectionsRequest?: (pharmacy: Pharmacy) => void;
  className?: string;
}

const CAMEROON_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'PHARMACIE FRANCAISE',
    address: '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
    phone: '+237 2 22 22 14 76',
    rating: 4.7,
    isOpenNow: true,
    location: { lat: 3.8480, lng: 11.5021 },
    medications: [
      { id: '1', name: 'Paracetamol', price: 500, inStock: true, quantity: 50 },
      { id: '2', name: 'Amoxicillin', price: 2500, inStock: true, quantity: 30 },
      { id: '3', name: 'Ibuprofen', price: 750, inStock: true, quantity: 25 },
      { id: '4', name: 'Omeprazole', price: 2200, inStock: true, quantity: 20 }
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
  }
];

export default function EnhancedPharmacyMap({
  pharmacies = CAMEROON_PHARMACIES,
  selectedDrug,
  userLocation,
  onPharmacySelect,
  onDirectionsRequest,
  className = "w-full h-96"
}: EnhancedPharmacyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [map, setMap] = useState<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>(pharmacies);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(userLocation || null);

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
    return R * c;
  };

  // Get user's current location
  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Yaoundé, Cameroon
          setCurrentLocation({ lat: 3.8480, lng: 11.5021 });
        }
      );
    }
  }, [userLocation]);

  // Filter pharmacies based on selected drug
  useEffect(() => {
    if (selectedDrug) {
      const filtered = pharmacies.filter(pharmacy => 
        pharmacy.medications.some(med => 
          med.name.toLowerCase().includes(selectedDrug.toLowerCase()) && med.inStock
        )
      );
      
      // Calculate distances and sort by distance
      if (currentLocation) {
        const withDistances = filtered.map(pharmacy => ({
          ...pharmacy,
          distance: calculateDistance(
            currentLocation.lat, currentLocation.lng,
            pharmacy.location.lat, pharmacy.location.lng
          ),
          estimatedTime: `${Math.round(calculateDistance(
            currentLocation.lat, currentLocation.lng,
            pharmacy.location.lat, pharmacy.location.lng
          ) * 2)} min` // Rough estimate: 2 min per km
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
        
        setFilteredPharmacies(withDistances);
      } else {
        setFilteredPharmacies(filtered);
      }
    } else {
      setFilteredPharmacies(pharmacies);
    }
  }, [selectedDrug, pharmacies, currentLocation]);

  // Initialize Leaflet map
  useEffect(() => {
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        // CSS is imported in the component file

        if (!mapRef.current || mapInstanceRef.current) return;

        // Clear any existing map instance
        if ((mapRef.current as any)._leaflet_id) {
          (mapRef.current as any)._leaflet_id = null;
        }

        const mapCenter = currentLocation || { lat: 3.8480, lng: 11.5021 };
        const mapInstance = L.map(mapRef.current).setView([mapCenter.lat, mapCenter.lng], 10);
        mapInstanceRef.current = mapInstance;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Custom pharmacy icon
        const pharmacyIcon = L.divIcon({
          html: `<div style="background: #10B981; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                   <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                     <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 5v2h8v-2H4zm0 5v2h8v-2H4z"/>
                   </svg>
                 </div>`,
          className: 'custom-pharmacy-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        // Add user location marker if available
        if (currentLocation) {
          const userIcon = L.divIcon({
            html: `<div style="background: #3B82F6; border: 2px solid white; border-radius: 50%; width: 16px; height: 16px;"></div>`,
            className: 'user-location-icon',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          
          L.marker([currentLocation.lat, currentLocation.lng], { icon: userIcon })
            .addTo(mapInstance)
            .bindPopup('Your Location');
        }

        // Add pharmacy markers
        filteredPharmacies.forEach(pharmacy => {
          const marker = L.marker([pharmacy.location.lat, pharmacy.location.lng], { icon: pharmacyIcon })
            .addTo(mapInstance);

          // Create popup content
          const medicationInfo = selectedDrug 
            ? pharmacy.medications.filter(med => 
                med.name.toLowerCase().includes(selectedDrug.toLowerCase()) && med.inStock
              ).map(med => `<li>${med.name}: ${formatCfa(med.price)}</li>`).join('')
            : '';

          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${pharmacy.name}</h3>
              <p style="margin: 0 0 4px 0; color: #666;">${pharmacy.address}</p>
              ${pharmacy.phone ? `<p style="margin: 0 0 4px 0; color: #666;">📞 ${pharmacy.phone}</p>` : ''}
              ${pharmacy.rating ? `<p style="margin: 0 0 4px 0;">⭐ ${pharmacy.rating}/5</p>` : ''}
              <p style="margin: 0 0 8px 0; color: ${pharmacy.isOpenNow ? '#10B981' : '#EF4444'};">
                ${pharmacy.isOpenNow ? '🟢 Open Now' : '🔴 Closed'}
              </p>
              ${pharmacy.distance ? `<p style="margin: 0 0 4px 0;">📍 ${pharmacy.distance.toFixed(1)} km away</p>` : ''}
              ${pharmacy.estimatedTime ? `<p style="margin: 0 0 8px 0;">🕒 ~${pharmacy.estimatedTime}</p>` : ''}
              ${medicationInfo ? `<div><strong>Available:</strong><ul style="margin: 4px 0;">${medicationInfo}</ul></div>` : ''}
              <button onclick="window.selectPharmacy('${pharmacy.id}')" 
                      style="background: #3B82F6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                Select
              </button>
              <button onclick="window.getDirections('${pharmacy.id}')" 
                      style="background: #10B981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                Directions
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          
          marker.on('click', () => {
            setSelectedPharmacy(pharmacy);
            onPharmacySelect?.(pharmacy);
          });
        });

        setMap(mapInstance);
        setLeafletLoaded(true);

        // Global functions for popup buttons
        (window as any).selectPharmacy = (pharmacyId: string) => {
          const pharmacy = filteredPharmacies.find(p => p.id === pharmacyId);
          if (pharmacy) {
            setSelectedPharmacy(pharmacy);
            onPharmacySelect?.(pharmacy);
          }
        };

        (window as any).getDirections = (pharmacyId: string) => {
          const pharmacy = filteredPharmacies.find(p => p.id === pharmacyId);
          if (pharmacy) {
            onDirectionsRequest?.(pharmacy);
            // Open Google Maps directions
            const url = `https://www.google.com/maps/dir/${currentLocation?.lat},${currentLocation?.lng}/${pharmacy.location.lat},${pharmacy.location.lng}`;
            window.open(url, '_blank');
          }
        };

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMap(null);
        setLeafletLoaded(false);
      }
    };
  }, [filteredPharmacies, currentLocation, selectedDrug]);

  return (
    <div className="relative">
      <div ref={mapRef} className={className} style={{ height: '400px', width: '100%' }} />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 space-y-2">
        <button
          onClick={() => {
            if (map && currentLocation) {
              map.setView([currentLocation.lat, currentLocation.lng], 12);
            }
          }}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Navigation size={14} />
          <span>My Location</span>
        </button>
      </div>

      {/* Selected Pharmacy Info */}
      {selectedPharmacy && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{selectedPharmacy.name}</h3>
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-2">{selectedPharmacy.address}</p>
          {selectedPharmacy.distance && (
            <p className="text-blue-600 text-sm mb-2">
              📍 {selectedPharmacy.distance.toFixed(1)} km away • {selectedPharmacy.estimatedTime}
            </p>
          )}
          {selectedDrug && (
            <div className="mt-3">
              <h4 className="font-semibold text-sm mb-1">Available Medications:</h4>
              {selectedPharmacy.medications
                .filter(med => med.name.toLowerCase().includes(selectedDrug.toLowerCase()) && med.inStock)
                .map(med => (
                  <div key={med.id} className="flex justify-between text-sm">
                    <span>{med.name}</span>
                    <span className="font-semibold text-green-600">{formatCfa(med.price)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
