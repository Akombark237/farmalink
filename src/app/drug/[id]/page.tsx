'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Info, MapPin, ShieldCheck, Phone, Star, Navigation, AlertCircle, Clock, Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { formatCfa } from "@/utils/currency";
import { getMedicationById } from "@/utils/medications";
import { useEffect, useState } from "react";

export default function DrugDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [drug, setDrug] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const medicationData = getMedicationById(id);
      setDrug(medicationData);
      setLoading(false);
    }
  }, [id]);

  const getDirections = (pharmacy: any) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(pharmacy.address)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medication details...</p>
        </div>
      </div>
    );
  }

  if (!drug) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Medication Not Found</h1>
          <p className="text-gray-600 mb-4">The medication with ID "{id}" could not be found in our database.</p>
          <Button onClick={() => router.push('/use-pages/search')} className="bg-blue-600 hover:bg-blue-700">
            Browse All Medications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <ShieldCheck className="text-green-600" /> {drug.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {drug.category}
            </Badge>
            <span className="text-sm text-gray-600">
              Available at {drug.availableAt.length} pharmacy(ies)
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Information */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Info className="text-blue-600" /> Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{drug.description}</p>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Usage Instructions</h2>
              <p className="text-gray-700 leading-relaxed">{drug.usage}</p>
              
              <h3 className="text-lg font-semibold mt-6 text-orange-600">⚠️ Possible Side Effects</h3>
              <p className="text-gray-700 leading-relaxed">{drug.sideEffects}</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Always consult with a healthcare professional before taking any medication. 
                  This information is for educational purposes only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Available at Pharmacies */}
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="text-purple-600" />
                Available at Pharmacies ({drug.availableAt.length})
              </h2>
              
              <div className="space-y-4">
                {drug.availableAt
                  .sort((a: any, b: any) => a.medication.price - b.medication.price)
                  .map((item: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">{item.pharmacy.name}</h3>
                            {item.pharmacy.isOpenNow ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Open
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Closed
                              </span>
                            )}
                          </div>
                          {item.pharmacy.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{item.pharmacy.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{item.pharmacy.address}</p>
                        
                        {item.pharmacy.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <Phone className="h-3 w-3" />
                            <span>{item.pharmacy.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <Package className="h-3 w-3" />
                            <span>In Stock: {item.medication.quantity} units</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          {formatCfa(item.medication.price)}
                        </p>
                        <div className="space-y-2">
                          <Button 
                            size="sm" 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!item.medication.inStock}
                          >
                            {item.medication.inStock ? 'Order Now' : 'Out of Stock'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full flex items-center justify-center gap-1"
                            onClick={() => getDirections(item.pharmacy)}
                          >
                            <Navigation className="h-3 w-3" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Price Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lowest Price:</span>
                  <span className="font-semibold text-green-600">{formatCfa(drug.minPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest Price:</span>
                  <span className="font-semibold text-red-600">{formatCfa(drug.maxPrice)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Average Price:</span>
                  <span className="font-bold text-blue-600">{formatCfa(drug.averagePrice)}</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4" /> 
                  Save to Wishlist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alternatives */}
          {drug.alternatives && drug.alternatives.length > 0 && (
            <Card className="rounded-2xl border shadow-md">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Alternative Medications</h2>
                <div className="space-y-3">
                  {drug.alternatives.map((alt: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-3 py-2 w-full justify-center cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push('/use-pages/search')}
                    >
                      {alt}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Click on alternatives to search for them
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/use-pages/search')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Nearby Pharmacies
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/use-pages/medical-assistant')}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Ask Medical Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
