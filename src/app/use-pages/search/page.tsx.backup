'use client';

import { ChevronDown, ChevronUp, Filter, Heart, Layout, Map, MapPin, Pill, Search, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sample data - would come from API in real implementation
  const mockDrugs = [
    { id: 1, name: 'Paracetamol', category: 'Pain Relief', price: 12.99, availability: 'High', image: '/api/placeholder/80/80', pharmacies: 32 },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', price: 25.50, availability: 'Medium', image: '/api/placeholder/80/80', pharmacies: 18 },
    { id: 3, name: 'Lisinopril', category: 'Blood Pressure', price: 38.75, availability: 'Low', image: '/api/placeholder/80/80', pharmacies: 9 },
    { id: 4, name: 'Metformin', category: 'Diabetes', price: 22.30, availability: 'High', image: '/api/placeholder/80/80', pharmacies: 26 },
    { id: 5, name: 'Atorvastatin', category: 'Cholesterol', price: 45.20, availability: 'Medium', image: '/api/placeholder/80/80', pharmacies: 14 },
  ];

  const mockPharmacies = [
    { id: 1, name: 'HealthPlus Pharmacy', address: '123 Main St', distance: '0.8 km', rating: 4.8, openNow: true, hasDelivery: true, image: '/api/placeholder/80/80' },
    { id: 2, name: 'MedExpress', address: '456 Oak Ave', distance: '1.2 km', rating: 4.5, openNow: true, hasDelivery: false, image: '/api/placeholder/80/80' },
    { id: 3, name: 'CareFirst Drugs', address: '789 Pine Rd', distance: '2.1 km', rating: 4.2, openNow: false, hasDelivery: true, image: '/api/placeholder/80/80' },
    { id: 4, name: 'Community Pharmacy', address: '321 Elm St', distance: '3.5 km', rating: 4.7, openNow: true, hasDelivery: true, image: '/api/placeholder/80/80' },
    { id: 5, name: 'QuickMeds', address: '654 Birch Ln', distance: '4.2 km', rating: 4.0, openNow: false, hasDelivery: false, image: '/api/placeholder/80/80' },
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from 'lucide-react';
import { useRef } from 'react';
  // Render drug card
 // Render drug card
const DrugCard = ({ drug }) => {
  const router = useRouter();
  
  const handleDrugClick = () => {
    router.push(`/use-pages/drug/${drug.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
            <Pill size={32} className="text-blue-600" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{drug.name}</h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
          {drug.genericName && (
            <p className="text-sm text-gray-500 italic">{drug.genericName}</p>
          )}
          <p className="text-sm text-gray-500">{drug.category}</p>
          {drug.manufacturer && (
            <p className="text-xs text-gray-400">by {drug.manufacturer}</p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-blue-600">
              ${typeof drug.price === 'string' ? drug.price : drug.price?.toFixed(2) || 'N/A'}
            </span>
            <div className="flex items-center space-x-1">
              <Pill size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">
                Available at {drug.pharmacies || drug.pharmacyCount || 'multiple'} pharmacies
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              drug.requiresPrescription ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {drug.requiresPrescription ? 'Prescription Required' : 'Over-the-Counter'}
            </span>
            {drug.availability && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                drug.availability === 'High' ? 'bg-green-100 text-green-800' :
                drug.availability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {drug.availability} Availability
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3">
        <button 
          onClick={handleDrugClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
  // Render pharmacy card
  // Render pharmacy card
const PharmacyCard = ({ pharmacy }) => {
  const router = useRouter();
  
  const handlePharmacyClick = () => {
    router.push(`/use-pages/pharmacy/${pharmacy.id}`);
  };

  const handleContactPharmacy = () => {
    console.log('Contact pharmacy:', pharmacy.id);
    // Add contact functionality here
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center">
            <Layout size={32} className="text-green-600" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{pharmacy.name}</h3>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
          <div className="flex items-center mt-1">
            <MapPin size={16} className="text-gray-500 mr-1" />
            <p className="text-sm text-gray-500">
              {pharmacy.address || `${pharmacy.city}, ${pharmacy.state}`} 
              {pharmacy.distance && ` (${pharmacy.distance})`}
            </p>
          </div>
          <div className="mt-2 flex items-center space-x-3">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{pharmacy.rating || '4.5'}</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              pharmacy.isOpenNow || pharmacy.openNow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {pharmacy.isOpenNow || pharmacy.openNow ? 'Open Now' : 'Closed'}
            </span>
            {(pharmacy.hasDelivery || Math.random() > 0.5) && (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                Delivers
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex space-x-2">
        <button 
          onClick={handlePharmacyClick}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          View Details
        </button>
        <button 
          onClick={handleContactPharmacy}
          className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors"
        >
          Contact
        </button>
      </div>
    </div>
  );
};
  // Toggle between list and map view
  const toggleView = () => {
    setMapView(!mapView);
  };

  // Mobile filter drawer
  const MobileFilterDrawer = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileFilter(false)}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Filters</h3>
          <button onClick={() => setShowMobileFilter(false)} className="text-gray-500">
            <X size={24} />
          </button>
        </div>

        <FilterControls />

        <div className="mt-6 flex space-x-3">
          <button
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
            onClick={() => {
              setFilters({
                availability: false,
                distance: 5,
                rating: 0,
                price: { min: 0, max: 500 },
                openNow: false,
                hasDelivery: false,
              });
            }}
          >
            Reset
          </button>
          <button
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium"
            onClick={() => setShowMobileFilter(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  // Common filter controls used in both desktop and mobile
  const FilterControls = () => (
    <div className="space-y-6">
      {searchType === 'drugs' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">${filters.price.min}</span>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.price.max}
                onChange={(e) => handleFilterChange('price', { ...filters.price, max: parseInt(e.target.value) })}
                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-500">${filters.price.max}</span>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
          </div>
        </>
      )}

      {searchType === 'pharmacies' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">0</span>
              <input
                type="range"
                min="1"
                max="20"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-500">{filters.distance} km</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleFilterChange('rating', star)}
                  className={`p-1 rounded-full ${filters.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star size={24} fill={filters.rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Open Now</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasDelivery}
                onChange={(e) => handleFilterChange('hasDelivery', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Delivery Available</span>
            </label>
          </div>
        </>
      )}
    </div>
  );

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
                onClick={toggleView}
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

            {/* Mobile Controls */}
            <div className="flex space-x-2 md:hidden">
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center"
                onClick={toggleView}
              >
                {mapView ? <Layout size={16} /> : <Map size={16} />}
              </button>
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center"
                onClick={() => setShowMobileFilter(true)}
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Desktop Filter Panel */}
          {filtersVisible && (
            <div className="hidden md:block mt-4 pt-4 border-t border-gray-200">
              <FilterControls />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && <MobileFilterDrawer />}

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count & Sorting */}
        {searchResults.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-700">
              Showing <span className="font-semibold">{searchResults.length}</span> results
            </p>
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Sort by:</span>
              <select className="border border-gray-300 rounded-lg py-1 px-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Search size={36} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any {searchType} matching "{searchQuery}". Try using different keywords or filters.
            </p>
          </div>
        )}

        {/* Empty State - No Search */}
{!loading && !searchQuery && searchResults.length === 0 && (
  <div className="text-center py-12">
    <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
      {searchType === 'drugs' ? <Pill size={36} className="text-blue-500" /> : <Layout size={36} className="text-blue-500" />}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      {searchType === 'drugs' ? 'Browse Medications' : 'Browse Pharmacies'}
    </h3>
    <p className="text-gray-600 max-w-md mx-auto">
      Click the "{searchType === 'drugs' ? 'Drugs' : 'Pharmacies'}" button above to see all available {searchType === 'drugs' ? 'medications' : 'pharmacies'} from our database.
    </p>
  </div>
)}
        {/* Map View */}
        {mapView && searchResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-96 mb-8">
            <div className="h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-600 text-center">
                Interactive map would display here with {searchType} locations.
                <br/>
                <span className="text-sm">(Actual map implementation would use Google Maps or similar API)</span>
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !mapView && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(item => (
              <div key={item.id}>
                {searchType === 'drugs' ? (
                  <DrugCard drug={item} />
                ) : (
                  <PharmacyCard pharmacy={item} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

