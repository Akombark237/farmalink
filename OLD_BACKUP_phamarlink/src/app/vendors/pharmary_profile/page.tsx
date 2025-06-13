'use client';

// pages/pharmacy/profile.js
import {
    AlertCircle,
    Camera,
    Check,
    CreditCard,
    Edit2,
    Globe,
    Mail,
    MapPin,
    Phone,
    Save
} from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

// Define TypeScript interfaces
interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
}

interface Hours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface DeliveryOptions {
  standard: boolean;
  express: boolean;
  sameDay: boolean;
  deliveryArea: string;
}

interface Pharmacist {
  name: string;
  title: string;
  photo: string;
}

interface PharmacyProfileData {
  name: string;
  logo: string;
  coverPhoto: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  socialMedia: SocialMedia;
  hours: Hours;
  services: string[];
  certifications: string[];
  pharmacists: Pharmacist[];
  deliveryOptions: DeliveryOptions;
  paymentMethods: string[];
}

interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

export default function PharmacyProfile() {
  // const router = useRouter(); // Commented out as it's not being used
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  // Pharmacy profile state
  const [profile, setProfile] = useState<PharmacyProfileData>({
    name: 'LifeCare Pharmacy',
    logo: '/pharmacy-logo.png',
    coverPhoto: '/pharmacy-cover.jpg',
    description: 'Leading healthcare provider with over 25 years of experience serving the community with quality medications and exceptional service.',
    address: '123 Health Avenue, Wellness District, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'contact@lifecarepharmacy.com',
    website: 'www.lifecarepharmacy.com',
    socialMedia: {
      facebook: 'lifecarepharmacy',
      twitter: '@lifecarepharm',
      instagram: '@lifecare_pharmacy'
    },
    hours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: '10:00 AM - 5:00 PM'
    },
    services: [
      'Prescription Filling',
      'Medication Counseling',
      'Medication Therapy Management',
      'Immunizations',
      'Health Screenings',
      'Compounding Services'
    ],
    certifications: [
      'Board of Pharmacy Certification',
      'Joint Commission Accreditation',
      'URAC Accredited'
    ],
    pharmacists: [
      {
        name: 'Dr. Sarah Johnson',
        title: 'Head Pharmacist',
        photo: '/pharmacist1.jpg'
      },
      {
        name: 'Dr. Michael Chen',
        title: 'Clinical Pharmacist',
        photo: '/pharmacist2.jpg'
      }
    ],
    deliveryOptions: {
      standard: true,
      express: true,
      sameDay: true,
      deliveryArea: '15 mile radius'
    },
    paymentMethods: ['Visa', 'Mastercard', 'American Express', 'Insurance', 'Cash']
  });

  // Form state
  const [formData, setFormData] = useState<PharmacyProfileData>({...profile});

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNestedInputChange = (category: keyof PharmacyProfileData, field: string, value: string | boolean) => {
    // Create a type-safe update
    const updatedFormData = { ...formData };

    // Handle each category specifically to maintain type safety
    if (category === 'socialMedia') {
      updatedFormData.socialMedia = {
        ...updatedFormData.socialMedia,
        [field]: value as string
      };
    } else if (category === 'hours') {
      updatedFormData.hours = {
        ...updatedFormData.hours,
        [field]: value as string
      };
    } else if (category === 'deliveryOptions') {
      updatedFormData.deliveryOptions = {
        ...updatedFormData.deliveryOptions,
        [field]: typeof value === 'boolean' ? value : value === 'true'
      };
    }

    setFormData(updatedFormData);
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setProfile(formData);
      setIsEditing(false);
      setIsLoading(false);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully'
      });

      // Auto-dismiss notification
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }, 1500);
  };

  const handleCancel = () => {
    setFormData({...profile});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Pharmacy Profile | MedFind</title>
        <meta name="description" content="Manage your pharmacy profile" />
      </Head>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ?
            <Check className="w-5 h-5" /> :
            <AlertCircle className="w-5 h-5" />
          }
          <p>{notification.message}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Profile</h1>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Photo and Logo */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-64">
                {isEditing ? (
                  <div className="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-500" />
                    <p className="mt-2 text-gray-600">Click to upload cover photo</p>
                  </div>
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <p className="text-white text-lg">Cover Photo Placeholder</p>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>

                <div className="absolute -bottom-16 left-8">
                  <div className="relative h-32 w-32 bg-white rounded-xl shadow-lg p-1">
                    {isEditing ? (
                      <div className="absolute inset-0 rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-500" />
                        <p className="mt-1 text-xs text-gray-600">Upload logo</p>
                      </div>
                    ) : (
                      <div className="h-full w-full rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">LP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-8">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold text-gray-900 block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                )}

                <div className="mt-4 flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent"
                    />
                  ) : (
                    <p>{profile.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">About</h3>
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                ) : (
                  <p className="text-gray-600">{profile.description}</p>
                )}
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Services Offered</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
                {isEditing && (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-gray-500 text-lg">+</span>
                    </div>
                    <span className="text-gray-500">Add service</span>
                  </div>
                )}
              </div>
            </div>

            {/* Staff Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Pharmacists</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.pharmacists.map((pharmacist, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden mr-4">
                      <div className="h-full w-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                        <span className="text-blue-800">{pharmacist.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{pharmacist.name}</h4>
                      <p className="text-sm text-gray-600">{pharmacist.title}</p>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <span className="text-gray-500 text-lg">+</span>
                    </div>
                    <span className="text-gray-500">Add pharmacist</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Contact Information</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mt-1"
                      />
                    ) : (
                      <p className="text-gray-800">{profile.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mt-1"
                      />
                    ) : (
                      <p className="text-gray-800">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mt-1"
                      />
                    ) : (
                      <p className="text-gray-800">{profile.website}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Business Hours</h3>
              <div className="mt-4 space-y-3">
                {Object.entries(profile.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{day}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.hours[day as keyof Hours]}
                        onChange={(e) => handleNestedInputChange('hours', day, e.target.value)}
                        className="w-32 sm:w-40 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <span className="text-gray-600">{hours}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Delivery Options</h3>
              <div className="mt-4 space-y-3">
                {isEditing ? (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="standard"
                        checked={formData.deliveryOptions.standard}
                        onChange={(e) => handleNestedInputChange('deliveryOptions', 'standard', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="standard" className="ml-2 block text-gray-700">Standard Delivery</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="express"
                        checked={formData.deliveryOptions.express}
                        onChange={(e) => handleNestedInputChange('deliveryOptions', 'express', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="express" className="ml-2 block text-gray-700">Express Delivery</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sameDay"
                        checked={formData.deliveryOptions.sameDay}
                        onChange={(e) => handleNestedInputChange('deliveryOptions', 'sameDay', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sameDay" className="ml-2 block text-gray-700">Same Day Delivery</label>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="deliveryArea" className="block text-sm text-gray-500">Delivery Area</label>
                      <input
                        type="text"
                        id="deliveryArea"
                        value={formData.deliveryOptions.deliveryArea}
                        onChange={(e) => handleNestedInputChange('deliveryOptions', 'deliveryArea', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${profile.deliveryOptions.standard ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {profile.deliveryOptions.standard ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="h-4 w-4 text-gray-400">-</span>
                        )}
                      </div>
                      <span className="ml-2 text-gray-700">Standard Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${profile.deliveryOptions.express ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {profile.deliveryOptions.express ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="h-4 w-4 text-gray-400">-</span>
                        )}
                      </div>
                      <span className="ml-2 text-gray-700">Express Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${profile.deliveryOptions.sameDay ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {profile.deliveryOptions.sameDay ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="h-4 w-4 text-gray-400">-</span>
                        )}
                      </div>
                      <span className="ml-2 text-gray-700">Same Day Delivery</span>
                    </div>
                    <div className="mt-4 flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-600">{profile.deliveryOptions.deliveryArea}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Payment Methods</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.paymentMethods.map((method, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <CreditCard className="h-3.5 w-3.5 mr-1" />
                    {method}
                  </span>
                ))}
                {isEditing && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500 cursor-pointer">
                    + Add
                  </span>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">Certifications</h3>
              <div className="mt-4 space-y-3">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
                {isEditing && (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-gray-500 text-lg">+</span>
                    </div>
                    <span className="text-gray-500">Add certification</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}