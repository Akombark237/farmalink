'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

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
}

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Popup })), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Circle })), { ssr: false });

interface OpenStreetMapProps {
  pharmacies: Pharmacy[];
  center?: Location;
  zoom?: number;
  onPharmacySelect?: (pharmacy: Pharmacy) => void;
  className?: string;
  selectedDistance?: number;
}

const DEFAULT_CENTER: Location = {
  lat: 3.8480, // Yaoundé, Cameroon
  lng: 11.5021
};

export default function OpenStreetMap({
  pharmacies,
  center = DEFAULT_CENTER,
  zoom = 12,
  onPharmacySelect,
  className = "w-full h-96",
  selectedDistance = 5
}: OpenStreetMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [leafletIcon, setLeafletIcon] = useState<any>(null);

  // Initialize Leaflet icons
  useEffect(() => {
    const initLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create custom pharmacy icon
        const pharmacyIcon = L.divIcon({
          html: `
            <div style="
              background-color: #DC2626;
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                color: white;
                font-size: 16px;
                font-weight: bold;
                transform: rotate(45deg);
              ">+</span>
            </div>
          `,
          className: 'custom-pharmacy-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });

        setLeafletIcon(pharmacyIcon);
        setIsLoaded(true);
      }
    };

    initLeaflet();
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
        },
        (error) => {
          console.warn('Error getting user location:', error);
        }
      );
    }
  }, []);

  // Handle distance filter changes (removed useEffect to prevent infinite loop)

  // Helper function to get location from pharmacy data
  const getLocationFromPharmacy = (pharmacy: Pharmacy): Location | null => {
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

  if (!isLoaded) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapCenter = userLocation || center;

  return (
    <div className="relative">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        className={className}
        style={{ height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
            
            {/* Distance Circle */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={selectedDistance * 1000} // Convert km to meters
              pathOptions={{
                color: '#4285F4',
                fillColor: '#4285F4',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </>
        )}

        {/* Pharmacy Markers */}
        {pharmacies.map((pharmacy) => {
          const location = getLocationFromPharmacy(pharmacy);
          if (!location) return null;

          return (
            <Marker
              key={pharmacy.id}
              position={[location.lat, location.lng]}
              icon={leafletIcon}
              eventHandlers={{
                click: () => {
                  if (onPharmacySelect) {
                    onPharmacySelect(pharmacy);
                  }
                }
              }}
            >
              <Popup>
                <div className="p-3 max-w-sm">
                  <h3 className="font-semibold text-lg mb-2 text-blue-900">{pharmacy.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{pharmacy.address}</p>

                  <div className="space-y-2">
                    {pharmacy.phone && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">Phone:</span>
                        <span className="text-blue-600">{pharmacy.phone}</span>
                      </div>
                    )}

                    {pharmacy.rating && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">Rating:</span>
                        <span className="text-yellow-600">{pharmacy.rating}/5 ⭐</span>
                      </div>
                    )}

                    {pharmacy.isOpenNow !== undefined && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">Status:</span>
                        <span className={pharmacy.isOpenNow ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {pharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    )}

                    {pharmacy.distance && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">Distance:</span>
                        <span className="text-purple-600 font-medium">{pharmacy.distance}</span>
                      </div>
                    )}

                    {(pharmacy as any).medicationCount && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">Meds:</span>
                        <span className="text-green-600">{(pharmacy as any).medicationCount}+ available</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
                      onClick={() => {
                        if (onPharmacySelect) {
                          onPharmacySelect(pharmacy);
                        }
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>


    </div>
  );
}
