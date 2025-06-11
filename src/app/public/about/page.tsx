// app/about/page.tsx

import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | MedConnect',
  description: 'Learn about our mission to connect patients with pharmacies and improve healthcare accessibility.',
};

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">About MedConnect</h1>
            <p className="text-xl text-blue-100">
              Bridging the gap between patients and pharmacies for better healthcare access.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              At MedConnect, we&apos;re committed to revolutionizing how patients access medication by creating a seamless
              connection between consumers and pharmacies. We believe that healthcare should be accessible,
              transparent, and convenient for everyone.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our platform allows patients to quickly search for medications, compare prices across pharmacies,
              and have prescriptions filled without the hassle of calling around or visiting multiple locations.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 my-8">
              <blockquote className="text-xl italic text-gray-800">
                &quot;We envision a world where accessing vital medications is as simple as a few clicks â€“ saving time,
                reducing stress, and ultimately improving health outcomes.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <p className="text-lg text-gray-700 mb-4">
                  MedConnect was founded in 2023 by a team of healthcare professionals and technology innovators who
                  recognized a critical gap in the pharmaceutical supply chain.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  After witnessing patients struggle to find medications during shortages and spending hours calling
                  different pharmacies to compare prices, our founders set out to build a solution that would bring
                  transparency and efficiency to medication access.
                </p>
                <p className="text-lg text-gray-700">
                  What began as a simple idea has grown into a comprehensive platform connecting thousands of patients
                  with pharmacies across the country, streamlining the medication fulfillment process for everyone involved.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src="/api/placeholder/600/400"
                    alt="MedConnect team collaborating"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-gray-700">
                We believe healthcare should be accessible to everyone, regardless of location or circumstances.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-gray-700">
                Clear information about medication availability, pricing, and options empowers better decisions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-700">
                Building connections between patients, pharmacies, and healthcare providers creates a stronger ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/api/placeholder/200/200"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-blue-600 mb-2">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm">Former healthcare executive with 15+ years of experience in pharmaceutical logistics.</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/api/placeholder/200/200"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">David Chen</h3>
              <p className="text-blue-600 mb-2">CTO & Co-Founder</p>
              <p className="text-gray-600 text-sm">Tech innovator who previously built healthcare solutions at leading tech companies.</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/api/placeholder/200/200"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Michael Rodriguez</h3>
              <p className="text-blue-600 mb-2">Head of Pharmacy Relations</p>
              <p className="text-gray-600 text-sm">Licensed pharmacist with extensive experience in retail and hospital pharmacy management.</p>
            </div>

            {/* Team Member 4 */}
            <div className="text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/api/placeholder/200/200"
                  alt="Team member"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Lisa Patel</h3>
              <p className="text-blue-600 mb-2">Head of User Experience</p>
              <p className="text-gray-600 text-sm">UX specialist with a background in designing accessible healthcare applications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
            <p className="text-xl text-blue-100 mb-8">
              Whether you&apos;re a patient looking for easier access to medications or a pharmacy wanting to
              reach more customers, MedConnect is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/authentication/register" className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors">
                Sign Up Today
              </Link>
              <Link href="/contact" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;