'use client';

// src/app/public/home/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Find Medications
              <span className="block gradient-text">Easily</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-12 opacity-90 leading-relaxed">
              Connect with local pharmacies, check medication availability, and get the best prices - all in one place with our AI-powered medical assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/authentication/register" className="glass hover-lift px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-glow">
                🚀 Get Started Free
              </Link>
              <Link href="/use-pages/search" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover-lift">
                💊 Search Medications
              </Link>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 medical-bg relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Why Choose PharmaLink?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of pharmacy services with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass hover-lift p-8 rounded-2xl shadow-soft group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">🔍 Smart Search</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                AI-powered search across multiple pharmacies to find medications instantly with real-time availability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass hover-lift p-8 rounded-2xl shadow-soft group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">💰 Best Prices</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Compare prices across pharmacies and get exclusive discounts with our price guarantee system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass hover-lift p-8 rounded-2xl shadow-soft group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">🤖 AI Assistant</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Get medical guidance from Qala-Lwazi, our AI assistant trained on medical knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 4 simple steps and experience seamless pharmacy services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6 font-bold text-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">🚀 Create Account</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Quick registration to access all platform features and personalized recommendations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6 font-bold text-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">🔍 Smart Search</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                AI-powered search finds medications across multiple pharmacies instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6 font-bold text-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">⚖️ Compare & Choose</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Compare prices, availability, and reviews to make the best decision.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6 font-bold text-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">📦 Get Delivered</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Choose convenient delivery or pickup options for your medications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 pharmacy-bg relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">What Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who trust PharmaLink for their medication needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass hover-lift p-8 rounded-2xl shadow-soft">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mr-4 flex items-center justify-center text-white font-bold text-xl">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Sarah Johnson</h4>
                  <p className="text-blue-600 font-medium">👩‍⚕️ Patient</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "This platform has revolutionized how I manage my medications. The AI assistant is incredibly helpful, and I love being able to compare prices instantly!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="glass hover-lift p-8 rounded-2xl shadow-soft">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mr-4 flex items-center justify-center text-white font-bold text-xl">
                  ML
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Michael Lee</h4>
                  <p className="text-green-600 font-medium">👨‍👩‍👧‍👦 Caregiver</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "Managing medications for my elderly parent has never been easier. The prescription tracking and Qala-Lwazi AI assistant are game-changers!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="glass hover-lift p-8 rounded-2xl shadow-soft">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mr-4 flex items-center justify-center text-white font-bold text-xl">
                  JW
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">James Wilson</h4>
                  <p className="text-purple-600 font-medium">🏪 Pharmacy Owner</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400 mb-2">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "PharmaLink has transformed our business! We've reached more customers and streamlined our operations. It's truly a win-win platform."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to Transform Your
              <span className="block text-yellow-300">Healthcare Experience?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Join thousands of users who are already benefiting from our AI-powered platform.
              Registration is quick, free, and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/authentication/register" className="glass hover-lift px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-glow">
                🚀 Start Free Today
              </Link>
              <Link href="/use-pages/search" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 hover-lift">
                💊 Explore Platform
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2">10K+</div>
                <div className="text-lg opacity-80">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2">500+</div>
                <div className="text-lg opacity-80">Partner Pharmacies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2">24/7</div>
                <div className="text-lg opacity-80">AI Assistant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Trusted by Leading Pharmacies</h2>
            <p className="text-lg text-gray-600">Partnering with the best to serve you better</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            {/* Partner Logos - Using styled placeholders */}
            <div className="w-40 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              PharmaCare
            </div>
            <div className="w-40 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              MediPlus
            </div>
            <div className="w-40 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              HealthHub
            </div>
            <div className="w-40 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              QuickMeds
            </div>
            <div className="w-40 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              CareRx
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
