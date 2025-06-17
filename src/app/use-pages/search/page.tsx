'use client';

import {
  ChevronDown,
  ChevronUp,
  Filter,
  Heart,
  Layout,
  Map as MapIcon,
  MapPin,
  Pill,
  Search,
  Star,
  X
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Location, SearchFilters, SearchResult } from '@/types';
import { formatCfa, convertUsdToCfa } from '@/utils/currency';
import { searchService } from '@/services/SearchService';
import { mapService } from '@/services/MapService';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const PharmacyMap = dynamic(() => import('@/components/PharmacyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function SearchPage() {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'drugs' | 'pharmacies'>('drugs');
  const [filters, setFilters] = useState<SearchFilters>({
    availability: false,
    distance: 5,
    rating: 0,
    price: { min: 0, max: 500 },
    openNow: false,
    hasDelivery: false,
  });
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [_showMobileFilter, _setShowMobileFilter] = useState(false);

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
        }
      );
    }
  }, []);

  // Sample data - would come from API in real implementation
  const mockDrugs = [
    { id: 'paracetamol-500mg', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Pain Relief', price: convertUsdToCfa(12.99), availability: 'High', image: '/api/placeholder/80/80', pharmacies: 32 },
    { id: 'amoxicillin-250mg', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotics', price: convertUsdToCfa(25.50), availability: 'Medium', image: '/api/placeholder/80/80', pharmacies: 18 },
    { id: 'lisinopril-10mg', name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'Blood Pressure', price: convertUsdToCfa(38.75), availability: 'Low', image: '/api/placeholder/80/80', pharmacies: 9 },
    { id: 'metformin-500mg', name: 'Metformin 500mg', genericName: 'Metformin HCl', category: 'Diabetes', price: convertUsdToCfa(22.30), availability: 'High', image: '/api/placeholder/80/80', pharmacies: 26 },
    { id: 'atorvastatin-20mg', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin Calcium', category: 'Cholesterol', price: convertUsdToCfa(45.20), availability: 'Medium', image: '/api/placeholder/80/80', pharmacies: 14 },
  ];

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

  // Real pharmacy data for Yaoundé, Cameroon
  const realPharmaciesData = [
    {
      id: '1',
      name: 'PHARMACIE FRANCAISE',
      address: '178, avenue Ahmadou AHIDJO, Yaoundé Centre ville',
      phone: '+237 2 22 22 14 76',
      rating: 4.7,
      isOpenNow: true,
      location: { lat: 3.8480, lng: 11.5021 },
      medicationCount: 50
    },
    {
      id: '2',
      name: 'PHARMACIE DU SOLEIL',
      address: '642 AV Ahmadou Ahidjo, BP 67, Yaoundé',
      phone: '+237 2 22 22 14 23',
      rating: 4.5,
      isOpenNow: true,
      location: { lat: 3.8485, lng: 11.5025 },
      medicationCount: 45
    },
    {
      id: '3',
      name: 'PHARMACIE MINDILI',
      address: 'Carrefour Obili, BP 11168, Yaoundé',
      phone: '+237 22 31 51 83',
      rating: 4.3,
      isOpenNow: true,
      location: { lat: 3.8520, lng: 11.5080 },
      medicationCount: 38
    },
    {
      id: '4',
      name: 'PHARMACIE ST MARTIN',
      address: 'Centre Ville, BP 12404, Yaoundé',
      phone: '+237 22 23 18 69',
      rating: 4.4,
      isOpenNow: true,
      location: { lat: 3.8470, lng: 11.5015 },
      medicationCount: 42
    },
    {
      id: '5',
      name: 'PHARMACIE MOLIVA',
      address: 'Madagascar, BP 19, Yaoundé',
      phone: '+237 22 23 00 82',
      rating: 4.2,
      isOpenNow: false,
      location: { lat: 3.8460, lng: 11.5000 },
      medicationCount: 35
    }
  ];

  // Transform real pharmacy data with calculated distances
  const transformedPharmacies = realPharmaciesData.map(pharmacy => {
    let distance = '0 km';
    if (userLocation) {
      const calculatedDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        pharmacy.location.lat,
        pharmacy.location.lng
      );
      distance = `${calculatedDistance.toFixed(1)} km`;
    }

    return {
      id: pharmacy.id,
      name: pharmacy.name,
      address: pharmacy.address,
      distance: distance,
      rating: pharmacy.rating || 4.0,
      isOpenNow: pharmacy.isOpenNow,
      hasDelivery: true, // Assume all pharmacies have delivery
      image: '/api/placeholder/80/80',
      phone: pharmacy.phone,
      medicationCount: pharmacy.medicationCount || 0,
      location: pharmacy.location,
      totalReviews: Math.floor(Math.random() * 100) + 10
    };
  });

  // Rate limiting state
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const [searchAttempts, setSearchAttempts] = useState(0);
  const [rateLimitError, setRateLimitError] = useState(false);
  const RATE_LIMIT_DELAY = 1000; // 1 second between searches
  const MAX_ATTEMPTS_PER_MINUTE = 10;

  // Cache for search results
  const [searchCache, setSearchCache] = useState<Map<string, { data: any[], timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Location error state
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize user location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const location = await mapService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          setLocationError(null);
        } else {
          setLocationError('Unable to get your location');
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError('Location access denied');
      }
    };

    initializeLocation();
  }, []);

  // Handlers for map interactions
  const handlePharmacySelect = (pharmacy: any) => {
    console.log('Selected pharmacy:', pharmacy);
    // You can add additional logic here, like showing pharmacy details
  };

  const handleDirectionsRequest = (pharmacy: any) => {
    console.log('Directions requested to:', pharmacy.name);
    // You can add analytics tracking here
  };

  // Effect to handle search and initial load
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const searchAPI = async () => {
      if (!isMounted) return;

      // Rate limiting check
      const now = Date.now();
      if (now - lastSearchTime < RATE_LIMIT_DELAY) {
        console.warn('Rate limit: Please wait before searching again');
        setRateLimitError(true);
        setTimeout(() => setRateLimitError(false), 2000);
        return;
      }

      // Check attempts per minute
      if (searchAttempts >= MAX_ATTEMPTS_PER_MINUTE) {
        console.warn('Rate limit: Too many search attempts. Please wait a minute.');
        setRateLimitError(true);
        setTimeout(() => {
          setSearchAttempts(0);
          setRateLimitError(false);
        }, 60000);
        return;
      }

      // Generate cache key
      const cacheKey = `${searchType}-${searchQuery.trim()}`;

      // Check cache first
      const cached = searchCache.get(cacheKey);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('Using cached search results');
        setSearchResults(cached.data);
        return;
      }

      setLoading(true);
      setLastSearchTime(now);
      setSearchAttempts(prev => prev + 1);

      try {
        // Use SearchService with rate limiting and caching
        const searchResult = await searchService.search({
          type: searchType,
          query: searchQuery.trim(),
          limit: 20,
          filters: filters
        }, 'search-page');

        if (!isMounted) return; // Don't update state if component unmounted

        if (searchResult.success) {
          setSearchResults(searchResult.data);
          setRateLimitError(false);

          // Update cache manually for consistency
          setSearchCache(prev => new Map(prev.set(cacheKey, {
            data: searchResult.data,
            timestamp: now
          })));
        } else {
          console.error('Search failed:', searchResult.error);
          setSearchResults([]);

          if (searchResult.rateLimited) {
            setRateLimitError(true);
            setTimeout(() => setRateLimitError(false), 5000);
          }
        }

      } catch (error) {
        console.error('Search error:', error);
        if (isMounted) {
          setSearchResults([]);
          // Show user-friendly error message
          setRateLimitError(true);
          setTimeout(() => setRateLimitError(false), 3000);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce search only when there's a query
    let timer: NodeJS.Timeout;
    if (searchQuery.trim() === '') {
      searchAPI();
    } else {
      timer = setTimeout(searchAPI, 800); // Increased debounce time
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchQuery, searchType, lastSearchTime, searchAttempts, searchCache, mockDrugs, transformedPharmacies]);

  // Filter toggle handler
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Handle filter changes
  const handleFilterChange = (filterName: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle distance filter change from map
  const handleDistanceChange = useCallback((distance: number) => {
    setFilters(prev => ({
      ...prev,
      distance: distance
    }));
  }, []);

  // Filter search results based on current filters
  const filteredResults = searchResults.filter(result => {
    if (searchType === 'pharmacies') {
      // Apply pharmacy filters
      if (filters.openNow && !result.isOpenNow) return false;
      if (filters.hasDelivery && !result.hasDelivery) return false;
      if (filters.rating > 0 && result.rating && result.rating < filters.rating) return false;

      // Distance filter (simplified - in real app, calculate actual distance)
      if (result.distance) {
        const distanceValue = parseFloat(result.distance.replace(' km', ''));
        if (distanceValue > filters.distance) return false;
      }
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Find What You Need</h1>
          <p className="text-blue-100 max-w-2xl">
            Search for medications or pharmacies near you. Compare prices, check availability, and find the best options for your healthcare needs.
          </p>
        </div>
      </div>

      {/* Search Controls */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
            {/* Type Selector */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                className={`px-4 py-2 font-medium text-sm flex-1 ${
                  searchType === 'drugs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSearchType('drugs')}
              >
                <Pill size={16} className="inline mr-1" /> Drugs
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex-1 ${
                  searchType === 'pharmacies'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSearchType('pharmacies')}
              >
                <Layout size={16} className="inline mr-1" /> Pharmacies
              </button>
            </div>

            {/* Search Input */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search for ${searchType === 'drugs' ? 'medications, treatments...' : 'pharmacy names, locations...'}`}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* View Toggle (List/Map) - Desktop */}
            <div className="hidden md:block">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
                onClick={() => setMapView(!mapView)}
              >
                {mapView ? (
                  <>
                    <Layout size={16} className="mr-1" /> List View
                  </>
                ) : (
                  <>
                    <MapIcon size={16} className="mr-1" /> Map View
                  </>
                )}
              </button>
            </div>

            {/* Filter Toggle - Desktop */}
            <div className="hidden md:block">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
                onClick={toggleFilters}
              >
                <Filter size={16} className="mr-1" />
                Filters
                {filtersVisible ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersVisible && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <select
                  value={filters.distance}
                  onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Open Now Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Open Now</span>
                </label>
              </div>

              {/* Delivery Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasDelivery}
                    onChange={(e) => handleFilterChange('hasDelivery', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Delivery</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {searchType === 'drugs' ? 'Medications' : 'Pharmacies'}
              {searchQuery && ` for "${searchQuery}"`}
            </h2>
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${filteredResults.length} results found`}
              {userLocation && ' near your location'}
            </p>
          </div>

          {/* Mobile View Toggle */}
          <div className="md:hidden">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
              onClick={() => setMapView(!mapView)}
            >
              {mapView ? (
                <>
                  <Layout size={16} className="mr-1" /> List
                </>
              ) : (
                <>
                  <MapIcon size={16} className="mr-1" /> Map
                </>
              )}
            </button>
          </div>
        </div>

        {/* Map View */}
        {mapView && searchType === 'pharmacies' && (
          <div className="mb-8">
            <PharmacyMap
              pharmacies={filteredResults.length > 0 ? filteredResults : transformedPharmacies}
              userLocation={userLocation}
              height="500px"
              onPharmacySelect={handlePharmacySelect}
              onDirectionsRequest={handleDirectionsRequest}
              showDirections={true}
            />
          </div>
        )}

        {/* Rate Limit Error */}
        {rateLimitError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Search Rate Limit
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Please wait a moment before searching again. We're showing cached results to improve performance.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Results Grid - Only show if not in map view or if searching drugs */}
        {!loading && !mapView && filteredResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {searchType === 'drugs' ? (
                  <DrugCard drug={item} />
                ) : (
                  <PharmacyCard pharmacy={item} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show real data if no search results */}
        {!loading && !searchQuery && searchResults.length === 0 && !mapView && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchType === 'drugs'
              ? mockDrugs.map(drug => (
                  <div key={drug.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <DrugCard drug={drug} />
                  </div>
                ))
              : transformedPharmacies.map(pharmacy => (
                  <div key={pharmacy.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <PharmacyCard pharmacy={pharmacy} />
                  </div>
                ))
            }
          </div>
        )}
      </div>
    </main>
  );
}

// Drug Card Component
function DrugCard({ drug }: { drug: any }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/use-pages/medication/${drug.id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the heart button
    if ((e.target as HTMLElement).closest('button[data-heart]')) {
      return;
    }
    handleViewDetails();
  };

  return (
    <div
      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {drug.name}
          </h3>
          {drug.genericName && (
            <p className="text-sm text-gray-600 mb-2">Generic: {drug.genericName}</p>
          )}
          <p className="text-sm text-blue-600 font-medium">{drug.category}</p>
        </div>
        <button
          data-heart
          className="text-gray-400 hover:text-red-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="font-semibold text-green-600">{formatCfa(drug.price)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Availability:</span>
          <span className={`text-sm font-medium ${
            drug.availability === 'High' ? 'text-green-600' :
            drug.availability === 'Medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {drug.availability}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Pharmacies:</span>
          <span className="text-sm font-medium text-blue-600">{drug.pharmacies} locations</span>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails();
        }}
      >
        View Details
      </button>
    </div>
  );
}

// Pharmacy Card Component
function PharmacyCard({ pharmacy }: { pharmacy: any }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/use-pages/pharmacy/${pharmacy.id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the heart button or map button
    if ((e.target as HTMLElement).closest('button[data-heart]') ||
        (e.target as HTMLElement).closest('button[data-map]')) {
      return;
    }
    handleViewDetails();
  };

  return (
    <div
      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {pharmacy.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{pharmacy.address}</p>
          <div className="flex items-center space-x-4">
            {pharmacy.rating && (
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium ml-1">{pharmacy.rating}</span>
                {pharmacy.totalReviews && (
                  <span className="text-sm text-gray-500 ml-1">({pharmacy.totalReviews})</span>
                )}
              </div>
            )}
            {pharmacy.distance && (
              <span className="text-sm text-blue-600 font-medium">{pharmacy.distance}</span>
            )}
          </div>
        </div>
        <button
          data-heart
          className="text-gray-400 hover:text-red-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${
            pharmacy.isOpenNow ? 'text-green-600' : 'text-red-600'
          }`}>
            {pharmacy.isOpenNow ? 'Open Now' : 'Closed'}
          </span>
        </div>
        {pharmacy.hasDelivery !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Delivery:</span>
            <span className={`text-sm font-medium ${
              pharmacy.hasDelivery ? 'text-green-600' : 'text-gray-500'
            }`}>
              {pharmacy.hasDelivery ? 'Available' : 'Not Available'}
            </span>
          </div>
        )}
        {pharmacy.phone && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Phone:</span>
            <span className="text-sm text-blue-600">{pharmacy.phone}</span>
          </div>
        )}
        {pharmacy.medicationCount && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Medications:</span>
            <span className="text-sm font-medium text-blue-600">{pharmacy.medicationCount}+ items</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          View Details
        </button>
        <button
          data-map
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MapPin size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
