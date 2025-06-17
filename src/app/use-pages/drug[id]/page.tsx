'use client';

 import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Info, MapPin, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";

export default function DrugDetailPage() {
  const params = useParams();
  const _id = params.id;

  // Mock data â€” replace with API fetch later
  const drug = {
    name: "Paracetamol 500mg",
    description: "Used to relieve pain and reduce fever. Suitable for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.",
    usage: "Take one tablet every 4-6 hours as needed. Do not exceed 4g per day.",
    sideEffects: "Nausea, allergic reactions, or liver damage in high doses.",
    priceRange: "$3.50 - $5.00",
    availableAt: [
      { name: "HealthPlus Pharmacy", location: "Downtown", price: "$3.50" },
      { name: "CityMed", location: "Main Street", price: "$4.20" },
    ],
    alternatives: ["Ibuprofen 200mg", "Aspirin 300mg"],
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <ShieldCheck className="text-green-600" /> {drug.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Info className="text-blue-600" /> Description
              </h2>
              <p className="text-gray-700">{drug.description}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Usage Instructions</h2>
              <p className="text-gray-700">{drug.usage}</p>
              <h3 className="text-lg font-semibold mt-4">Possible Side Effects</h3>
              <p className="text-gray-700">{drug.sideEffects}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Available at Pharmacies</h2>
              {drug.availableAt.map((pharmacy, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-none">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-purple-600" />
                    <div>
                      <p className="font-medium">{pharmacy.name}</p>
                      <p className="text-gray-500 text-sm">{pharmacy.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{pharmacy.price}</p>
                    <Button size="sm" variant="secondary" className="mt-1">Order</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Price Range</h2>
              <p className="text-2xl font-bold text-green-600">{drug.priceRange}</p>
              <Button className="w-full mt-4">Add to Cart</Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 mt-2">
                <Heart /> Save to Wishlist
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Alternatives</h2>
              <div className="space-y-3">
                {drug.alternatives.map((alt, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-2 w-fit">
                    {alt}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
