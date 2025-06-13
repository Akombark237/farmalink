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
  onDistanceFilter?: (distance: number) => void;
  className?: string;
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
  onDistanceFilter,
  className = "w-full h-96"
}: OpenStreetMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number>(5); // km
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

  // Handle distance filter changes
  useEffect(() => {
    if (onDistanceFilter) {
      onDistanceFilter(selectedDistance);
    }
  }, [selectedDistance, onDistanceFilter]);

  // Helper function to get location from address (mock implementation)
  const getLocationFromAddress = (address: string): Location | null => {
    // Mock coordinates for Yaoundé pharmacies
    const mockCoordinates: { [key: string]: Location } = {
      'Carrefour GOLF': { lat: 3.8520, lng: 11.5080 },
      'FACE TOTAL TERMINAL 10 ODZA': { lat: 3.8650, lng: 11.5200 },
      'facing NIKI': { lat: 3.8380, lng: 11.4950 },
      'ELIG-EFFA': { lat: 3.8530, lng: 11.5070 },
      'AHALA 1, PHARMACAM entrance': { lat: 3.8350, lng: 11.4900 },
      'MESSASSI Crossroads': { lat: 3.8400, lng: 11.4920 },
      'Opposite Essomba Bakery': { lat: 3.8420, lng: 11.4970 },
      'MENDONG - PEACE Hardware Store': { lat: 3.8320, lng: 11.4880 },
      'HAPPY EKOUMDOUM': { lat: 3.8485, lng: 11.5025 },
      'NEW OMNISPORTS ROAD FOE street': { lat: 3.8450, lng: 11.4980 },
      'NGOUSSO CHAPEL': { lat: 3.8600, lng: 11.5150 },
      'BEHIND CINEMA REX': { lat: 3.8470, lng: 11.5010 },
      'NEW MIMBOMAN ROAD MVOG ENYEGUE CROSSROAD': { lat: 3.8550, lng: 11.5100 },
      'OFFICERS\' MESS': { lat: 3.8500, lng: 11.5050 },
      'MARKET SQUARE': { lat: 3.8460, lng: 11.5000 },
      'OBILI CHAPEL': { lat: 3.8580, lng: 11.5120 },
      'Carrefour CLUB YANNICK': { lat: 3.8440, lng: 11.4990 }
    };

    // Try to find a match in our mock data
    for (const [key, location] of Object.entries(mockCoordinates)) {
      if (address.includes(key)) {
        return location;
      }
    }

    // Generate random coordinates near Yaoundé for demo
    const baseLocation = { lat: 3.8480, lng: 11.5021 }; // Yaoundé center
    return {
      lat: baseLocation.lat + (Math.random() - 0.5) * 0.05, // Smaller radius for city
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
          const location = pharmacy.location || getLocationFromAddress(pharmacy.address);
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
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-lg mb-2">{pharmacy.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pharmacy.address}</p>
                  {pharmacy.phone && (
                    <p className="text-sm mb-1">
                      <strong>Phone:</strong> {pharmacy.phone}
                    </p>
                  )}
                  {pharmacy.rating && (
                    <p className="text-sm mb-1">
                      <strong>Rating:</strong> {pharmacy.rating}/5 ⭐
                    </p>
                  )}
                  {pharmacy.isOpenNow !== undefined && (
                    <p className="text-sm mb-1">
                      <strong>Status:</strong>{' '}
                      <span className={pharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'}>
                        {pharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                      </span>
                    </p>
                  )}
                  {pharmacy.distance && (
                    <p className="text-sm">
                      <strong>Distance:</strong> {pharmacy.distance}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Distance Filter Control */}
      {userLocation && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius
          </label>
          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(Number(e.target.value))}
            className="block w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 km</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>
      )}
    </div>
  );
}
