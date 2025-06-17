// Map Service for location and routing functionality
// Handles geolocation, distance calculation, and routing

interface Location {
  lat: number;
  lng: number;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  isOpenNow: boolean;
  hasDelivery: boolean;
  location: Location;
  distance?: string;
  medicationCount?: number;
}

interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  instructions: string[];
  coordinates: [number, number][];
}

export class MapService {
  private static instance: MapService;

  private constructor() {}

  public static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  /**
   * Get user's current location
   */
  public async getCurrentLocation(): Promise<Location | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Error getting location:', error.message);
          // Return Yaoundé center as fallback
          resolve({
            lat: 3.8480,
            lng: 11.5021
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  public calculateDistance(point1: Location, point2: Location): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format distance for display
   */
  public formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }

  /**
   * Sort pharmacies by distance from user location
   */
  public sortPharmaciesByDistance(
    pharmacies: Pharmacy[], 
    userLocation: Location
  ): Pharmacy[] {
    return pharmacies
      .map(pharmacy => ({
        ...pharmacy,
        calculatedDistance: this.calculateDistance(userLocation, pharmacy.location),
        distance: this.formatDistance(
          this.calculateDistance(userLocation, pharmacy.location)
        )
      }))
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
  }

  /**
   * Find nearest pharmacy
   */
  public findNearestPharmacy(
    pharmacies: Pharmacy[], 
    userLocation: Location
  ): Pharmacy | null {
    if (pharmacies.length === 0) return null;
    
    const sortedPharmacies = this.sortPharmaciesByDistance(pharmacies, userLocation);
    return sortedPharmacies[0];
  }

  /**
   * Filter pharmacies within a certain radius
   */
  public filterPharmaciesWithinRadius(
    pharmacies: Pharmacy[], 
    userLocation: Location, 
    radiusKm: number
  ): Pharmacy[] {
    return pharmacies.filter(pharmacy => {
      const distance = this.calculateDistance(userLocation, pharmacy.location);
      return distance <= radiusKm;
    });
  }

  /**
   * Get route between two points using OSRM
   */
  public async getRoute(start: Location, end: Location): Promise<RouteInfo | null> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }
      
      const route = data.routes[0];
      const instructions = route.legs[0]?.steps?.map((step: any) => 
        step.maneuver.instruction || 'Continue'
      ) || [];
      
      return {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        instructions,
        coordinates: route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]) // Flip lng,lat to lat,lng
      };
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  /**
   * Get estimated travel time by different modes
   */
  public getEstimatedTravelTimes(distanceKm: number): {
    walking: string;
    driving: string;
    cycling: string;
  } {
    // Average speeds in km/h
    const walkingSpeed = 5;
    const drivingSpeed = 30; // City driving
    const cyclingSpeed = 15;
    
    const walkingTime = (distanceKm / walkingSpeed) * 60; // minutes
    const drivingTime = (distanceKm / drivingSpeed) * 60; // minutes
    const cyclingTime = (distanceKm / cyclingSpeed) * 60; // minutes
    
    return {
      walking: this.formatTime(walkingTime),
      driving: this.formatTime(drivingTime),
      cycling: this.formatTime(cyclingTime)
    };
  }

  /**
   * Format time in minutes to human readable format
   */
  private formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Check if location is within Yaoundé bounds
   */
  public isWithinYaounde(location: Location): boolean {
    // Approximate bounds for Yaoundé
    const bounds = {
      north: 3.95,
      south: 3.75,
      east: 11.65,
      west: 11.35
    };
    
    return (
      location.lat >= bounds.south &&
      location.lat <= bounds.north &&
      location.lng >= bounds.west &&
      location.lng <= bounds.east
    );
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  public async getAddressFromCoordinates(location: Location): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  /**
   * Get coordinates from address (geocoding)
   */
  public async getCoordinatesFromAddress(address: string): Promise<Location | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=cm`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return null;
    }
  }

  /**
   * Generate map URL for external navigation apps
   */
  public generateNavigationUrls(destination: Location, destinationName: string) {
    const lat = destination.lat;
    const lng = destination.lng;
    const name = encodeURIComponent(destinationName);
    
    return {
      googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`,
      appleMaps: `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
      waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      openStreetMap: `https://www.openstreetmap.org/directions?from=&to=${lat},${lng}#map=16/${lat}/${lng}`
    };
  }

  /**
   * Check if user is near a pharmacy (within 100m)
   */
  public isNearPharmacy(userLocation: Location, pharmacy: Pharmacy): boolean {
    const distance = this.calculateDistance(userLocation, pharmacy.location);
    return distance <= 0.1; // 100 meters
  }

  /**
   * Get pharmacy operating hours (mock data)
   */
  public getPharmacyHours(pharmacyId: string): {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    nextOpenTime?: string;
  } {
    // Mock operating hours - in production, this would come from the database
    const hours = {
      weekday: { open: '08:00', close: '20:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '09:00', close: '17:00' }
    };
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const dayOfWeek = now.getDay();
    
    let todayHours;
    if (dayOfWeek === 0) { // Sunday
      todayHours = hours.sunday;
    } else if (dayOfWeek === 6) { // Saturday
      todayHours = hours.saturday;
    } else { // Weekday
      todayHours = hours.weekday;
    }
    
    const openTime = parseInt(todayHours.open.split(':')[0]) * 60 + parseInt(todayHours.open.split(':')[1]);
    const closeTime = parseInt(todayHours.close.split(':')[0]) * 60 + parseInt(todayHours.close.split(':')[1]);
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return {
      isOpen,
      openTime: todayHours.open,
      closeTime: todayHours.close,
      nextOpenTime: !isOpen && currentTime > closeTime ? 
        (dayOfWeek === 6 ? hours.sunday.open : hours.weekday.open) : undefined
    };
  }
}

// Export singleton instance
export const mapService = MapService.getInstance();
