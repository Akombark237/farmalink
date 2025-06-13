'use client';

import React, { useEffect, useRef } from 'react';

interface LeafletMapProps {
  locations: any[];
  onLocationClick: (location: any) => void;
}

const LeafletMap = ({ locations, onLocationClick }: LeafletMapProps) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        // CSS is imported in the component file

        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([6.5244, 3.3792], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        if (locations && locations.length > 0) {
          locations.forEach((location) => {
            const iconColor = location.type === 'pharmacies' ? '#10B981' : '#3B82F6';
            const iconSymbol = location.type === 'pharmacies' ? '+' : '💊';
            
            const customIcon = L.divIcon({
              html: '<div style="background-color: ' + iconColor + '; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">' + iconSymbol + '</div>',
              className: 'custom-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              popupAnchor: [0, -15]
            });

            const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
            
            const popupContent = '<div style="padding: 8px; min-width: 200px;"><h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">' + location.name + '</h3>' + (location.address ? '<p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">' + location.address + '</p>' : '') + (location.price ? '<p style="margin: 0 0 8px 0; font-weight: 600; color: #2563eb;">Price: $' + location.price + '</p>' : '') + '<button onclick="window.handleMapClick && window.handleMapClick(\'' + location.id + '\')" style="width: 100%; background-color: #2563eb; color: white; padding: 8px 12px; border-radius: 6px; border: none; font-size: 14px; cursor: pointer; font-weight: 500;">View Details</button></div>';

            marker.bindPopup(popupContent);
          });

          if (locations.length === 1) {
            map.setView([locations[0].lat, locations[0].lng], 15);
          } else {
            const group = new (L as any).featureGroup(locations.map((loc: any) => (L as any).marker([loc.lat, loc.lng])));
            map.fitBounds(group.getBounds().pad(0.1));
          }
        }

        (window as any).handleMapClick = (id: string) => {
          const location = locations.find(l => l.id.toString() === id);
          if (location && onLocationClick) onLocationClick(location);
        };

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [locations, onLocationClick]);

  return React.createElement('div', {
    ref: mapRef,
    style: { height: '400px', width: '100%' },
    className: 'rounded-lg overflow-hidden'
  });
};

export default LeafletMap;
