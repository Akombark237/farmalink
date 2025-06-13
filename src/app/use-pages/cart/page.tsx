"use client";

import {
    AlertCircle,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Clock,
    ShoppingBag,
    Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  // State for cart items with dummy data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Amoxicillin 500mg",
      image: "/api/placeholder/80/80",
      price: 12.99,
      quantity: 2,
      pharmacy: "HealthPlus Pharmacy",
      pharmacyId: "health-plus",
      prescription: true,
      prescriptionVerified: true,
      inStock: true,
      estimatedDelivery: "Today, 2-4 hours",
      originalPrice: 15.99,
    },
    {
      id: 2,
      name: "Vitamin D3 5000 IU",
      image: "/api/placeholder/80/80",
      price: 8.49,
      quantity: 1,
      pharmacy: "MediCare Drugs",
      pharmacyId: "medicare",
      prescription: false,
      inStock: true,
      estimatedDelivery: "Tomorrow, 9am-1pm",
      originalPrice: 8.49,
    },
    {
      id: 3,
      name: "Digital Thermometer",
      image: "/api/placeholder/80/80",
      price: 19.95,
      quantity: 1,
      pharmacy: "HealthPlus Pharmacy",
      pharmacyId: "health-plus",
      prescription: false,
      inStock: true,
      estimatedDelivery: "Today, 2-4 hours",
      originalPrice: 24.95,
    },
    {
      id: 4,
      name: "Ibuprofen 200mg",
      image: "/api/placeholder/80/80",
      price: 5.99,
      quantity: 1,
      pharmacy: "QuickMeds",
      pharmacyId: "quick-meds",
      prescription: false,
      inStock: false,
      estimatedDelivery: "Out of stock - 3 day wait",
      originalPrice: 5.99,
    }
  ]);

  // State for order summary
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 4.99,
    tax: 0,
    discount: 0,
    total: 0,
  });

  // State for promo code
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Calculate summary whenever cart changes
  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax rate
    setSummary({
      subtotal,
      shipping: cartItems.length > 0 ? 4.99 : 0,
      tax,
      discount: promoApplied ? subtotal * 0.1 : 0, // 10% discount if promo applied
      total: subtotal + tax + (cartItems.length > 0 ? 4.99 : 0) - (promoApplied ? subtotal * 0.1 : 0),
    });
  }, [cartItems, promoApplied]);

  // Handle quantity update
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle item removal
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "health10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Try 'HEALTH10'");
    }
  };

  // Group items by pharmacy
  const itemsByPharmacy = cartItems.reduce((acc: any, item: any) => {
    if (!acc[item.pharmacyId]) {
      acc[item.pharmacyId] = {
        name: item.pharmacy,
        items: [],
      };
    }
    acc[item.pharmacyId].items.push(item);
    return acc;
  }, {});

  // Save for later functionality
  const saveForLater = (id: number) => {
    // In a real app, this would move item to a saved items list
    alert(`Item ${id} saved for later!`);
    removeItem(id);
  };

  // Count prescription items
  const prescriptionItemsCount = cartItems.filter(item => item.prescription).length;
  
  // Check if any out of stock items
  const hasOutOfStockItems = cartItems.some(item => !item.inStock);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          <p className="text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any medications or health products to your cart yet.
            </p>
            <Link 
              href="/use-pages/pharmacy/1" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-3 gap-8">
            {/* Cart items (2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prescription notice */}
              {prescriptionItemsCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Prescription verification required
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          {prescriptionItemsCount} {prescriptionItemsCount === 1 ? "item" : "items"} in your cart {prescriptionItemsCount === 1 ? "requires" : "require"} a valid prescription. Please ensure your prescription is uploaded before checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Items grouped by pharmacy */}
              {Object.values(itemsByPharmacy).map((pharmacy: any, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Pharmacy header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="font-medium text-gray-800 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2 text-blue-600" />
                      {pharmacy.name}
                    </h3>
                  </div>

                  {/* Items from this pharmacy */}
                  <div className="divide-y">
                    {pharmacy.items.map((item: any) => (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Item image */}
                          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-100 border">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-cover object-center w-full h-full"
                            />
                          </div>

                          {/* Item details */}
                          <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <div className="mt-1 flex items-center">
                                  {item.prescription && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                      Prescription
                                    </span>
                                  )}
                                  {!item.inStock && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {item.estimatedDelivery}
                                </div>
                              </div>
                              <p className="text-gray-900 font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>

                            {/* Price and quantity controls */}
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex items-center">
                                {item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-500 line-through mr-2">
                                    ${item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                                <span className="text-gray-900">
                                  ${item.price.toFixed(2)} each
                                </span>
                              </div>

                              <div className="flex items-center">
                                <button
                                  onClick={() => saveForLater(item.id)}
                                  className="text-sm text-blue-600 hover:text-blue-800 mr-6"
                                >
                                  Save for later
                                </button>
                                
                                <div className="flex items-center border rounded">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 focus:outline-none"
                                    disabled={item.quantity <= 1}
                                  >
                                    <ChevronDown className={`h-4 w-4 ${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
                                  </button>
                                  <span className="px-4 py-2 text-center w-10">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 focus:outline-none"
                                  >
                                    <ChevronUp className="h-4 w-4 text-gray-600" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="ml-4 text-gray-400 hover:text-red-500 focus:outline-none"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">You might also like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Recommendation items */}
                  {[
                    {
                      id: "rec1",
                      name: "Digital Blood Pressure Monitor",
                      price: 34.99,
                      image: "/api/placeholder/100/100"
                    },
                    {
                      id: "rec2",
                      name: "Multivitamin Complex",
                      price: 15.99,
                      image: "/api/placeholder/100/100"
                    },
                    {
                      id: "rec3",
                      name: "Hand Sanitizer 250ml",
                      price: 3.99,
                      image: "/api/placeholder/100/100"
                    }
                  ].map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4 flex flex-col">
                      <div className="mx-auto mb-3">
                        <Image
                          src={rec.image}
                          alt={rec.name}
                          width={100}
                          height={100}
                          className="rounded"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{rec.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">${rec.price.toFixed(2)}</p>
                      <button className="mt-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
                        Add to cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                
                {/* Summary details */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p>${summary.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Shipping</p>
                    <p>${summary.shipping.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Estimated tax</p>
                    <p>${summary.tax.toFixed(2)}</p>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <p>Discount (10%)</p>
                      <p>-${summary.discount.toFixed(2)}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium text-gray-900">
                      <p>Order total</p>
                      <p>${summary.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Promo code input */}
                <div className="mt-6">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 border rounded-l py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-gray-100 text-gray-700 text-sm py-2 px-4 rounded-r hover:bg-gray-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="mt-2 text-xs text-red-600">{promoError}</p>
                  )}
                  {promoApplied && (
                    <p className="mt-2 text-xs text-green-600">
                      Promo code 'HEALTH10' applied!
                    </p>
                  )}
                </div>

                {/* Checkout button */}
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className={`block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium ${
                      hasOutOfStockItems ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    } transition-colors`}
                    aria-disabled={hasOutOfStockItems}
                  >
                    Proceed to Checkout
                  </Link>
                  
                  {hasOutOfStockItems && (
                    <p className="mt-2 text-xs text-red-600 text-center">
                      Please remove out of stock items before proceeding
                    </p>
                  )}
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center mb-4">
                    Secure payment processing
                  </p>
                  <div className="flex justify-center space-x-4">
                    {/* Replace with actual payment method icons in a real implementation */}
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Help section */}
              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h4 className="font-medium text-blue-800 mb-2">Need help?</h4>
                <p className="text-sm text-blue-700 mb-4">
                  Our customer service team is available 24/7 to assist you with your order.
                </p>
                <Link href="/contact" className="text-sm text-blue-600 font-medium hover:text-blue-800">
                  Contact support â†’
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}