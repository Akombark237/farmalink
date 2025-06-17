'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Navigation, Phone, Clock, Star, Route, X } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  isOpenNow: boolean;
  hasDelivery: boolean;
  location: {
    lat: number;
    lng: number;
  };
  distance?: string;
  medicationCount?: number;
}

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  userLocation?: { lat: number; lng: number } | null;
  onPharmacySelect?: (pharmacy: Pharmacy) => void;
  onDirectionsRequest?: (pharmacy: Pharmacy) => void;
  height?: string;
  showDirections?: boolean;
}

// Custom icons
const createCustomIcon = (color: string, isUser: boolean = false) => {
  const svgIcon = isUser 
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
         <circle cx="12" cy="12" r="3" fill="white"/>
       </svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
       </svg>`;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Routing component
function RoutingMachine({ 
  start, 
  end, 
  onRouteFound 
}: { 
  start: L.LatLng; 
  end: L.LatLng; 
  onRouteFound?: (route: any) => void;
}) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    // Import routing machine dynamically to avoid SSR issues
    import('leaflet-routing-machine').then((L_Routing) => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L_Routing.default.control({
        waypoints: [start, end],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null, // Don't create default markers
        lineOptions: {
          styles: [{ color: '#3B82F6', weight: 4, opacity: 0.8 }]
        },
        router: L_Routing.default.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving'
        }),
        formatter: new L_Routing.default.Formatter({
          language: 'en',
          units: 'metric'
        })
      }).on('routesfound', function(e: any) {
        const routes = e.routes;
        if (routes.length > 0 && onRouteFound) {
          onRouteFound(routes[0]);
        }
      }).addTo(map);

      // Fit map to show the route
      const group = new L.FeatureGroup([
        L.marker(start),
        L.marker(end)
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    });

    return () => {
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end, onRouteFound]);

  return null;
}

export default function PharmacyMap({
  pharmacies,
  userLocation,
  onPharmacySelect,
  onDirectionsRequest,
  height = '400px',
  showDirections = false
}: PharmacyMapProps) {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.8480, 11.5021]); // Yaoundé center
  const [mapZoom, setMapZoom] = useState(13);



  // Update map center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(15);
    }
  }, [userLocation]);

  const handlePharmacyClick = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    onPharmacySelect?.(pharmacy);
  };

  const handleGetDirections = (pharmacy: Pharmacy) => {
    if (!userLocation) {
      alert('Please enable location access to get directions');
      return;
    }

    if (!pharmacy.location ||
        typeof pharmacy.location.lat !== 'number' ||
        typeof pharmacy.location.lng !== 'number' ||
        isNaN(pharmacy.location.lat) ||
        isNaN(pharmacy.location.lng)) {
      alert('Sorry, location data for this pharmacy is not available');
      return;
    }

    setSelectedPharmacy(pharmacy);
    setShowRoute(true);
    onDirectionsRequest?.(pharmacy);
  };

  const handleCloseRoute = () => {
    setShowRoute(false);
    setRouteInfo(null);
    setSelectedPharmacy(null);
  };

  const handleRouteFound = (route: any) => {
    setRouteInfo(route);
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="relative">
      {/* Route Information Panel */}
      {showRoute && routeInfo && (
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Route className="h-5 w-5 text-blue-600 mr-2" />
              Directions to {selectedPharmacy?.name}
            </h3>
            <button
              onClick={handleCloseRoute}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatDistance(routeInfo.summary.totalDistance)}
              </div>
              <div className="text-sm text-gray-600">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatDuration(routeInfo.summary.totalTime)}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-1">📍 From: Your Location</p>
            <p>🏥 To: {selectedPharmacy?.address}</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ height }} className="rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('#3B82F6', true)}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">Your Location</div>
                  <div className="text-sm text-gray-600">Current position</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Pharmacy Markers */}
          {pharmacies
            .filter(pharmacy => pharmacy.location &&
                               typeof pharmacy.location.lat === 'number' &&
                               typeof pharmacy.location.lng === 'number' &&
                               !isNaN(pharmacy.location.lat) &&
                               !isNaN(pharmacy.location.lng))
            .map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              position={[pharmacy.location.lat, pharmacy.location.lng]}
              icon={createCustomIcon(pharmacy.isOpenNow ? '#10B981' : '#EF4444')}
              eventHandlers={{
                click: () => handlePharmacyClick(pharmacy),
              }}
            >
              <Popup>
                <div className="min-w-[250px] p-2">
                  <h3 className="font-semibold text-gray-900 mb-2">{pharmacy.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Navigation className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{pharmacy.address}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{pharmacy.phone}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-gray-600">{pharmacy.rating}/5</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({Math.floor(Math.random() * 50) + 10} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className={`text-sm font-medium ${
                        pharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pharmacy.isOpenNow ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                    
                    {pharmacy.distance && (
                      <div className="text-blue-600 font-medium">
                        📍 {pharmacy.distance} away
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => handleGetDirections(pharmacy)}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      disabled={!userLocation}
                    >
                      <Route className="h-4 w-4 mr-1" />
                      Get Directions
                    </button>
                    
                    <button
                      onClick={() => window.open(`tel:${pharmacy.phone}`, '_self')}
                      className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call Pharmacy
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Routing */}
          {showRoute && userLocation && selectedPharmacy &&
           selectedPharmacy.location &&
           typeof selectedPharmacy.location.lat === 'number' &&
           typeof selectedPharmacy.location.lng === 'number' && (
            <RoutingMachine
              start={L.latLng(userLocation.lat, userLocation.lng)}
              end={L.latLng(selectedPharmacy.location.lat, selectedPharmacy.location.lng)}
              onRouteFound={handleRouteFound}
            />
          )}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Map Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Open Pharmacy</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Closed Pharmacy</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-500 mr-2"></div>
            <span className="text-gray-600">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
