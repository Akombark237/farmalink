'use client';

import { useEffect, useRef } from 'react';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  rating?: number;
  total_reviews?: number;
  lat?: number;
  lng?: number;
}

interface OpenStreetMapProps {
  locations: Location[];
  searchType: 'drugs' | 'pharmacies';
  onLocationClick?: (location: Location) => void;
}

export default function OpenStreetMapComponent({ locations, searchType, onLocationClick }: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([6.5244, 3.3792], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        if (locations && locations.length > 0) {
          locations.forEach((location) => {
            const lat = location.lat || (6.5244 + (Math.random() - 0.5) * 0.1);
            const lng = location.lng || (3.3792 + (Math.random() - 0.5) * 0.1);
            
            const iconColor = searchType === 'pharmacies' ? '#10B981' : '#EF4444';
            const iconSymbol = searchType === 'pharmacies' ? '🏥' : '💊';
            
            const customIcon = L.divIcon({
              html: `<div style="background-color: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${iconSymbol}</div>`,
              className: 'custom-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              popupAnchor: [0, -15]
            });

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            
            const popupContent = `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">${location.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${location.address}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${location.city}, ${location.state}</p>
                ${location.phone ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">📞 ${location.phone}</p>` : ''}
                ${location.rating ? `
                  <div style="margin: 0 0 8px 0; display: flex; align-items: center;">
                    <span style="color: #fbbf24;">★</span>
                    <span style="margin-left: 4px; font-size: 14px;">${location.rating} (${location.total_reviews || 0} reviews)</span>
                  </div>
                ` : ''}
                <button 
                  onclick="window.handleMapClick && window.handleMapClick('${location.id}')" 
                  style="width: 100%; background-color: #2563eb; color: white; padding: 8px 12px; border-radius: 6px; border: none; font-size: 14px; cursor: pointer; font-weight: 500;"
                >
                  View Details
                </button>
              </div>
            `;

            marker.bindPopup(popupContent);
          });

          if (locations.length === 1) {
            const lat = locations[0].lat || (6.5244 + (Math.random() - 0.5) * 0.1);
            const lng = locations[0].lng || (3.3792 + (Math.random() - 0.5) * 0.1);
            map.setView([lat, lng], 15);
          } else {
            const group = new L.featureGroup(locations.map(loc => {
              const lat = loc.lat || (6.5244 + (Math.random() - 0.5) * 0.1);
              const lng = loc.lng || (3.3792 + (Math.random() - 0.5) * 0.1);
              return L.marker([lat, lng]);
            }));
            map.fitBounds(group.getBounds().pad(0.1));
          }
        }

        window.handleMapClick = (id: string) => {
          const location = locations.find(l => l.id.toString() === id);
          if (location && onLocationClick) onLocationClick(location);
        };

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [locations, onLocationClick, searchType]);

  return (
    <div 
      ref={mapRef}
      className="w-full h-96 rounded-lg"
    />
  );
}