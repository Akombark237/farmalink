'use client';

// src/app/public/home/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen content-over-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white py-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-center mb-6">Find Medications Easily</h1>
          <p className="text-xl text-center max-w-2xl mb-10">
            Connect with local pharmacies, check medication availability, and get the best prices - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/authentication/register" className="bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-md font-semibold text-lg transition">
              Register Now
            </Link>
            <Link href="/use-pages/search" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg transition">
              Search Medications
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Find Medications Fast</h3>
              <p className="text-gray-600 text-center">
                Search across multiple pharmacies to find the medications you need, when you need them.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Compare Prices</h3>
              <p className="text-gray-600 text-center">
                Get the best deals by comparing medication prices across different pharmacies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Manage Prescriptions</h3>
              <p className="text-gray-600 text-center">
                Upload and manage your prescriptions digitally for easier refills and tracking.
              </p>
            </div>

            {/* Feature 4 - AI Medical Assistant */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">AI Medical Assistant</h3>
              <p className="text-gray-600 text-center mb-4">
                Get instant answers to your health questions from our AI-powered medical assistant, Qala-Lwazi.
              </p>
              <div className="text-center">
                <Link href="/use-pages/medical-assistant" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Try Qala-Lwazi
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-center text-gray-600">Register to access all platform features and save your preferences.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Search Medications</h3>
              <p className="text-center text-gray-600">Find medications by name or category across different pharmacies.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Compare Options</h3>
              <p className="text-center text-gray-600">See availability, prices, and reviews to make informed decisions.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Order or Reserve</h3>
              <p className="text-center text-gray-600">Choose delivery or pickup options for your medications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">Patient</p>
                </div>
              </div>
              <p className="text-gray-700">
                "This platform has made managing my medications so much easier. I can quickly see which pharmacy has what I need and compare prices."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Lee</h4>
                  <p className="text-gray-600">Caregiver</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As someone who manages medications for my elderly parent, this service has been a lifesaver. The prescription management feature is invaluable."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-semibold">James Wilson</h4>
                  <p className="text-gray-600">Pharmacy Owner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Joining this platform has helped us reach more customers and streamline our inventory management. It's a win-win for everyone."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600/95 backdrop-blur-sm text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of users who are already benefiting from our platform. Registration is quick and free.
          </p>
          <Link href="/authentication/register" className="bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-md font-semibold text-lg inline-block transition">
            Register Now
          </Link>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {/* Placeholder logos - replace with actual partner logos */}
            <div className="w-32 h-16 bg-gray-200 rounded"></div>
            <div className="w-32 h-16 bg-gray-200 rounded"></div>
            <div className="w-32 h-16 bg-gray-200 rounded"></div>
            <div className="w-32 h-16 bg-gray-200 rounded"></div>
            <div className="w-32 h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
