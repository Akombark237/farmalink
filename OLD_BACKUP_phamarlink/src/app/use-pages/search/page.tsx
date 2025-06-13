'use client';

import { ChevronDown, ChevronUp, Filter, Heart, Layout, Map, MapPin, Pill, Search, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import('../../../components/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 flex items-center justify-center">
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
  const [searchType, setSearchType] = useState('drugs'); // 'drugs' or 'pharmacies'
  const [filters, setFilters] = useState({
    availability: false,
    distance: 5,
    rating: 0,
    price: { min: 0, max: 500 },
    openNow: false,
    hasDelivery: false,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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
    { id: 1, name: 'Paracetamol', category: 'Pain Relief', price: 12.99, availability: 'High', image: '/api/placeholder/80/80', pharmacies: 32 },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', price: 25.50, availability: 'Medium', image: '/api/placeholder/80/80', pharmacies: 18 },
    { id: 3, name: 'Lisinopril', category: 'Blood Pressure', price: 38.75, availability: 'Low', image: '/api/placeholder/80/80', pharmacies: 9 },
    { id: 4, name: 'Metformin', category: 'Diabetes', price: 22.30, availability: 'High', image: '/api/placeholder/80/80', pharmacies: 26 },
    { id: 5, name: 'Atorvastatin', category: 'Cholesterol', price: 45.20, availability: 'Medium', image: '/api/placeholder/80/80', pharmacies: 14 },
  ];

  const mockPharmacies = [
    { id: '1', name: 'HealthPlus Pharmacy', address: '123 Main St, New York, NY 10001', distance: '0.8 km', rating: 4.8, isOpenNow: true, hasDelivery: true, image: '/api/placeholder/80/80', phone: '(555) 123-4567', medicationCount: 450 },
    { id: '2', name: 'MedExpress', address: '456 Oak Ave, New York, NY 10002', distance: '1.2 km', rating: 4.5, isOpenNow: true, hasDelivery: false, image: '/api/placeholder/80/80', phone: '(555) 234-5678', medicationCount: 320 },
    { id: '3', name: 'CareFirst Drugs', address: '789 Pine Rd, New York, NY 10003', distance: '2.1 km', rating: 4.2, isOpenNow: false, hasDelivery: true, image: '/api/placeholder/80/80', phone: '(555) 345-6789', medicationCount: 280 },
    { id: '4', name: 'Community Pharmacy', address: '321 Elm St, New York, NY 10004', distance: '3.5 km', rating: 4.7, isOpenNow: true, hasDelivery: true, image: '/api/placeholder/80/80', phone: '(555) 456-7890', medicationCount: 520 },
    { id: '5', name: 'QuickMeds', address: '654 Birch Ln, New York, NY 10005', distance: '4.2 km', rating: 4.0, isOpenNow: false, hasDelivery: false, image: '/api/placeholder/80/80', phone: '(555) 567-8901', medicationCount: 180 },
  ];

  // Effect to handle search and initial load
useEffect(() => {
  setLoading(true);

  // Call real API
  const searchAPI = async () => {
    try {
      let url;
      if (searchQuery.trim() === '') {
        // Load all items when no search query
        if (searchType === 'drugs') {
          url = '/api/medications?limit=50';
        } else {
          url = '/api/search?q=&type=pharmacies&limit=50';
        }
      } else {
        // Search with query
        url = `/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}&limit=20`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Transform data to match expected format
        if (searchType === 'drugs' && searchQuery.trim() === '') {
          // Transform medications API response
          const transformedData = data.data.map(med => ({
            id: med.id,
            name: med.name,
            category: med.category,
            price: parseFloat(med.price?.replace('$', '') || '0'),
            availability: med.inStock ? 'High' : 'Low',
            image: '/api/placeholder/80/80',
            pharmacies: Math.floor(Math.random() * 30) + 5, // Mock pharmacy count
            genericName: med.genericName,
            manufacturer: med.manufacturer,
            requiresPrescription: med.requiresPrescription,
            rating: med.rating
          }));
          setSearchResults(transformedData);
        } else {
          setSearchResults(data.data);
        }
      } else {
        console.error('Search failed:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search only when there's a query
  if (searchQuery.trim() === '') {
    searchAPI();
  } else {
    const timer = setTimeout(searchAPI, 500);
    return () => clearTimeout(timer);
  }
}, [searchQuery, searchType]);

  // Filter toggle handler
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle pharmacy selection from map
  const handlePharmacySelect = (pharmacy) => {
    console.log('Selected pharmacy:', pharmacy);
    // You can add logic here to show pharmacy details or navigate to pharmacy page
  };

  // Handle distance filter change from map
  const handleDistanceChange = (distance) => {
    setFilters(prev => ({
      ...prev,
      distance: distance
    }));
  };

  // Filter search results based on current filters
  const filteredResults = searchResults.filter(result => {
    if (searchType === 'pharmacies') {
      // Apply pharmacy filters
      if (filters.openNow && !result.isOpenNow) return false;
      if (filters.hasDelivery && !result.hasDelivery) return false;
      if (filters.rating > 0 && result.rating < filters.rating) return false;

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
                    <Map size={16} className="mr-1" /> Map View
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
                  <Map size={16} className="mr-1" /> Map
                </>
              )}
            </button>
          </div>
        </div>

        {/* Map View */}
        {mapView && searchType === 'pharmacies' && (
          <div className="mb-8">
            <MapContainer
              pharmacies={filteredResults.length > 0 ? filteredResults : mockPharmacies}
              onPharmacySelect={handlePharmacySelect}
              onDistanceChange={handleDistanceChange}
              className="h-96 rounded-xl overflow-hidden shadow-md"
            />
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

        {/* Show mock data if no search results */}
        {!loading && !searchQuery && searchResults.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchType === 'drugs'
              ? mockDrugs.map(drug => (
                  <div key={drug.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <DrugCard drug={drug} />
                  </div>
                ))
              : mockPharmacies.map(pharmacy => (
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
function DrugCard({ drug }) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{drug.name}</h3>
          {drug.genericName && (
            <p className="text-sm text-gray-600 mb-2">Generic: {drug.genericName}</p>
          )}
          <p className="text-sm text-blue-600 font-medium">{drug.category}</p>
        </div>
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="font-semibold text-green-600">${drug.price}</span>
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

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
        View Details
      </button>
    </div>
  );
}

// Pharmacy Card Component
function PharmacyCard({ pharmacy }) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{pharmacy.name}</h3>
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
        <button className="text-gray-400 hover:text-red-500 transition-colors">
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
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
          View Details
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <MapPin size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
