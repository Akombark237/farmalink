'use client';

import { Layout, Map, Pill, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'drugs' | 'pharmacies'>('drugs');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState(false);

  const mockDrugs = [
    { id: 1, name: 'Paracetamol', category: 'Pain Relief', price: 12.99, availability: 'High' },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', price: 25.50, availability: 'Medium' },
    { id: 3, name: 'Lisinopril', category: 'Blood Pressure', price: 38.75, availability: 'Low' },
  ];

  const mockPharmacies = [
    { id: 1, name: 'HealthPlus Pharmacy', address: '123 Main St', rating: 4.8, openNow: true },
    { id: 2, name: 'MedExpress', address: '456 Oak Ave', rating: 4.5, openNow: true },
    { id: 3, name: 'CareFirst Drugs', address: '789 Pine Rd', rating: 4.2, openNow: false },
  ];

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let results = [];
      
      if (searchType === 'drugs') {
        results = mockDrugs.filter(drug => 
          searchQuery === '' || 
          drug.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        results = mockPharmacies.filter(pharmacy => 
          searchQuery === '' || 
          pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [performSearch, searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Find What You Need</h1>
          <p className="text-blue-100 max-w-2xl">
            Search for medications or pharmacies near you.
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
                className={`px-4 py-2 font-medium text-sm flex-1 transition-colors ${
                  searchType === 'drugs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSearchType('drugs')}
              >
                <Pill size={16} className="inline mr-1" /> Drugs
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex-1 transition-colors ${
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
                placeholder={`Search for ${searchType === 'drugs' ? 'medications...' : 'pharmacies...'}`}
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

            {/* View Toggle */}
            <div className="hidden md:block">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors"
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
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && searchResults.length > 0 && !mapView && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => router.push((searchType === 'drugs' ? '/drug/' : '/pharmacy/') + item.id)}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                {searchType === 'drugs' && (
                  <p className="text-blue-600 font-bold">${item.price?.toFixed(2)}</p>
                )}
                {searchType === 'pharmacies' && (
                  <p className="text-gray-600">{item.address}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Search size={36} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try searching for different {searchType}.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}