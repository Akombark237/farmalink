'use client';

import { Check, ChevronsRight, Clock, CreditCard, Home, Mail, MapPin, Package, Phone, ShoppingCart, Truck } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define types for our data
type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

type AddressInfo = {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
};

type DeliveryMethodType = 'pickup' | 'standard' | 'express';
type PaymentMethodType = 'card' | 'paypal' | 'cash';

export default function Checkout() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [address, setAddress] = useState<AddressInfo>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  });

  // Mock cart data - in a real app, this would come from your cart state management
  useEffect(() => {
    // Simulate fetching cart data
    const mockCart = [
      { id: 1, name: 'Amoxicillin 500mg', quantity: 1, price: 12.99, image: '/api/placeholder/100/100' },
      { id: 2, name: 'Lisinopril 10mg', quantity: 1, price: 8.50, image: '/api/placeholder/100/100' },
      { id: 3, name: 'Vitamin D3 1000IU', quantity: 2, price: 11.25, image: '/api/placeholder/100/100' },
    ];
    setCart(mockCart);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'express' ? 9.99 : deliveryMethod === 'standard' ? 4.99 : 0;
  const tax = subtotal * 0.07; // Assuming 7% tax
  const total = subtotal + deliveryFee + tax;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to process order
    setTimeout(() => {
      setLoading(false);
      router.push('/order-confirmation');
    }, 2000);
  };

  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout | MedFind</title>
        <meta name="description" content="Complete your medication order" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Progress Bar */}
        <div className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <MapPin size={20} />
                </div>
                <span className="mt-2 text-sm font-medium">Delivery</span>
              </div>

              <div className={`h-1 flex-1 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

              <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <CreditCard size={20} />
                </div>
                <span className="mt-2 text-sm font-medium">Payment</span>
              </div>

              <div className={`h-1 flex-1 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

              <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <Check size={20} />
                </div>
                <span className="mt-2 text-sm font-medium">Review</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Checkout Form */}
            <div className="lg:w-2/3">
              {/* Step 1: Delivery Options */}
              {activeStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Options</h2>

                  <div className="space-y-4 mb-6">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer flex items-start ${deliveryMethod === 'pickup' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setDeliveryMethod('pickup')}
                    >
                      <div className="mr-4 mt-1">
                        <Package size={24} className={deliveryMethod === 'pickup' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800">Pharmacy Pickup</h3>
                          <span className="ml-auto font-medium text-green-600">Free</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">Pick up your order at the pharmacy within 2 hours after processing</p>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer flex items-start ${deliveryMethod === 'standard' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setDeliveryMethod('standard')}
                    >
                      <div className="mr-4 mt-1">
                        <Truck size={24} className={deliveryMethod === 'standard' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800">Standard Delivery</h3>
                          <span className="ml-auto font-medium">$4.99</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">Delivery within 24 hours</p>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer flex items-start ${deliveryMethod === 'express' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setDeliveryMethod('express')}
                    >
                      <div className="mr-4 mt-1">
                        <Clock size={24} className={deliveryMethod === 'express' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800">Express Delivery</h3>
                          <span className="ml-auto font-medium">$9.99</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">Delivery within 3 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Delivery Address</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={address.fullName}
                          onChange={handleAddressChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={address.street}
                          onChange={handleAddressChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Main St"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={address.city}
                            onChange={handleAddressChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="New York"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={address.state}
                            onChange={handleAddressChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="NY"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                          <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={address.zip}
                            onChange={handleAddressChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={address.phone}
                          onChange={handleAddressChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(123) 456-7890"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={address.email}
                          onChange={handleAddressChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </form>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center"
                    >
                      Continue to Payment <ChevronsRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {activeStep === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>

                  <div className="space-y-4 mb-6">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer flex items-start ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="mr-4 mt-1">
                        <CreditCard size={24} className={paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Credit / Debit Card</h3>
                        <p className="text-gray-600 text-sm mt-1">Pay with Visa, Mastercard, or other cards</p>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer flex items-start ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="mr-4 mt-1">
                        <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">P</div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">PayPal</h3>
                        <p className="text-gray-600 text-sm mt-1">Pay with your PayPal account</p>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer flex items-start ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <div className="mr-4 mt-1">
                        <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">$</div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Cash on Delivery</h3>
                        <p className="text-gray-600 text-sm mt-1">Pay when your medications arrive</p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Card Details</h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <input
                            type="text"
                            id="cardName"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            id="cardNumber"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              id="expiry"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              placeholder="MM/YY"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              id="cvv"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="text-blue-600 py-3 px-6 rounded-lg border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Back
                    </button>

                    <button
                      onClick={nextStep}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center"
                    >
                      Continue to Review <ChevronsRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {activeStep === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Order</h2>

                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Order Summary</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Delivery Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Delivery Method</h4>
                        <div className="flex items-center">
                          {deliveryMethod === 'pickup' && <Package size={18} className="text-blue-600 mr-2" />}
                          {deliveryMethod === 'standard' && <Truck size={18} className="text-blue-600 mr-2" />}
                          {deliveryMethod === 'express' && <Clock size={18} className="text-blue-600 mr-2" />}
                          <p className="text-gray-800">
                            {deliveryMethod === 'pickup' ? 'Pharmacy Pickup' :
                             deliveryMethod === 'standard' ? 'Standard Delivery' :
                             'Express Delivery'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Estimated Delivery</h4>
                        <p className="text-gray-800">
                          {deliveryMethod === 'pickup' ? 'Ready in 2 hours' :
                           deliveryMethod === 'standard' ? 'Within 24 hours' :
                           'Within 3 hours'}
                        </p>
                      </div>
                    </div>

                    {deliveryMethod !== 'pickup' && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Delivery Address</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start">
                            <Home size={18} className="text-gray-400 mr-2 mt-1" />
                            <div>
                              <p className="text-gray-800 text-sm font-medium">{address.fullName}</p>
                              <p className="text-gray-600 text-sm">{address.street}</p>
                              <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zip}</p>
                            </div>
                          </div>
                          <div className="flex items-center mt-2">
                            <Phone size={16} className="text-gray-400 mr-2" />
                            <p className="text-gray-600 text-sm">{address.phone}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            <p className="text-gray-600 text-sm">{address.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                    <div className="flex items-center">
                      {paymentMethod === 'card' && <CreditCard size={18} className="text-blue-600 mr-2" />}
                      {paymentMethod === 'paypal' && <div className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs mr-2">P</div>}
                      {paymentMethod === 'cash' && <div className="bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs mr-2">$</div>}
                      <p className="text-gray-800">
                        {paymentMethod === 'card' ? 'Credit / Debit Card' :
                         paymentMethod === 'paypal' ? 'PayPal' :
                         'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-800">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-gray-800">Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="text-blue-600 py-3 px-6 rounded-lg border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center disabled:bg-blue-400"
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>Place Order <Check size={18} className="ml-2" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

                {cart.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-800">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-medium">
                        <span className="text-gray-800">Total</span>
                        <span className="text-blue-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                    <p className="text-gray-500 mb-4">Add medications to your cart</p>
                    <Link href="/use-pages/pharmacy/1" className="text-blue-600 hover:text-blue-800 font-medium">
                      Browse Medications
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}