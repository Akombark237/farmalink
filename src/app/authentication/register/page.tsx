'use client';

// pages/register.js
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus
} from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  pharmacyName: string;
  pharmacyAddress: string;
  licenseNumber: string;
  [key: string]: string;
}

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Additional pharmacy fields
    pharmacyName: '',
    pharmacyAddress: '',
    licenseNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    // Basic validation
    if (formStep === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
    } else if (formStep === 2) {
      if (userType === 'patient' && (!formData.firstName || !formData.lastName || !formData.phone)) {
        setError('Please fill in all required fields');
        return false;
      }
      if (userType === 'pharmacy' && (!formData.pharmacyName || !formData.pharmacyAddress || !formData.licenseNumber)) {
        setError('Please fill in all pharmacy information');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setFormStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate API call
    try {
      // In a real app, you would send the data to your API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        if (userType === 'pharmacy') { router.push('/admin_panel/admin_dashboard'); } else { router.push('/use-pages/dashboard'); }
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchUserType = (type: string) => {
    setUserType(type);
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="mt-2 text-gray-600">Your account has been created. Redirecting you to the dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>Register | PHARMALING</title>
        <meta name="description" content="Join PHARMALING to find the right medications at the best price" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left side - Colorful illustration area */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-500 to-indigo-600 p-12 text-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="25" r="20" fill="white" />
                <circle cx="25" cy="75" r="15" fill="white" />
                <path d="M20,20 L80,80 M80,20 L20,80" stroke="white" strokeWidth="2" />
                <rect x="40" y="40" width="20" height="20" fill="white" />
              </svg>
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-6">Join MedFind</h1>
              <p className="text-xl mb-8">Find medications, compare prices, and order from local pharmacies all in one place.</p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Easy Medication Search</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Compare Prices</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">Convenient Delivery Options</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm text-white text-opacity-80">Already have an account?</p>
                <Link href="/authentication/login" className="inline-block mt-2 text-white font-medium border-b-2 border-white hover:border-opacity-70 transition-all">
                  Sign in to your account
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Registration form */}
          <div className="lg:w-1/2 p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600 mb-8">
                {formStep === 1 ? "Let's get started with your account details" : "Complete your profile information"}
              </p>

              {/* User type selection */}
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => switchUserType('patient')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    userType === 'patient'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="inline h-4 w-4 mr-1" />
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => switchUserType('pharmacy')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    userType === 'pharmacy'
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building className="inline h-4 w-4 mr-1" />
                  Pharmacy
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="ml-2 text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={formStep === 1 ? handleNextStep : handleSubmit}>
                {formStep === 1 ? (
                  /* Step 1: Account Information */
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email Address
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                          <Mail className="h-5 w-5" />
                        </span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full rounded-r-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        Password
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                          <Lock className="h-5 w-5" />
                        </span>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block w-full rounded-r-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="••••••••"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                          <Lock className="h-5 w-5" />
                        </span>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="block w-full rounded-r-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Step 2: Profile Information */
                  <div className="space-y-4">
                    {userType === 'patient' ? (
                      /* Patient specific fields */
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                              First Name
                            </label>
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                              required
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="John"
                            />
                          </div>
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                              Last Name
                            </label>
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              autoComplete="family-name"
                              required
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                            Phone Number
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                              <Phone className="h-5 w-5" />
                            </span>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              autoComplete="tel"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="block w-full rounded-r-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="(123) 456-7890"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Pharmacy specific fields */
                      <>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pharmacyName">
                            Pharmacy Name
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                              <Building className="h-5 w-5" />
                            </span>
                            <input
                              id="pharmacyName"
                              name="pharmacyName"
                              type="text"
                              required
                              value={formData.pharmacyName}
                              onChange={handleInputChange}
                              className="block w-full rounded-r-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="HealthCare Pharmacy"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pharmacyAddress">
                            Pharmacy Address
                          </label>
                          <input
                            id="pharmacyAddress"
                            name="pharmacyAddress"
                            type="text"
                            required
                            value={formData.pharmacyAddress}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123 Main St, City, State, ZIP"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="licenseNumber">
                            Pharmacy License Number
                          </label>
                          <input
                            id="licenseNumber"
                            name="licenseNumber"
                            type="text"
                            required
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="PHR-123456789"
                          />
                          <p className="mt-1 text-xs text-gray-500">License will be verified before account approval</p>
                        </div>
                      </>
                    )}

                    <div className="flex items-center mt-2">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <div className="pt-4 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="w-1/3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-2/3 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-5 w-5" />
                            Create Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
