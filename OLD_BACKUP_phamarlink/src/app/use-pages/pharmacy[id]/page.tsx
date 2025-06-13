'use client';

 import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, ShoppingCart, Star } from "lucide-react";
import { useParams } from "next/navigation";

export default function PharmacyDetail() {
  const params = useParams();
  const id = params.id;

  const pharmacy = {
    name: "HealthFirst Pharmacy",
    address: "123 Wellness Ave, New York, NY",
    phone: "+1 (212) 555-0123",
    hours: "8 AM - 8 PM",
    rating: 4.5,
    stock: [
      { id: 1, name: "Aspirin 500mg", price: 12.0, available: true },
      { id: 2, name: "Cough Syrup", price: 8.5, available: false },
      { id: 3, name: "Vitamin C Tablets", price: 15.0, available: true },
      { id: 4, name: "Antibiotic Cream", price: 22.0, available: true },
    ],
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">{pharmacy.name}</h1>

      {/* Pharmacy Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="text-blue-600" /> Address
            </h2>
            <p>{pharmacy.address}</p>
          </CardContent>
        </Card>

        <Card className="border shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="text-green-600" /> Contact
            </h2>
            <p>{pharmacy.phone}</p>
          </CardContent>
        </Card>

        <Card className="border shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="text-purple-600" /> Hours
            </h2>
            <p>{pharmacy.hours}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <Star className="text-yellow-500" />
        <p className="text-lg font-semibold">{pharmacy.rating} / 5</p>
        <Badge variant="outline">Verified Pharmacy</Badge>
      </div>

      {/* Available Drugs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Medications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacy.stock.map((drug) => (
            <Card key={drug.id} className="border shadow rounded-2xl flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">{drug.name}</h3>
                <p className="text-gray-600">${drug.price}</p>
                {drug.available ? (
                  <Badge variant="default">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
                <Button className="w-full mt-4 flex gap-2" disabled={!drug.available}>
                  <ShoppingCart size={16} /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
