'use client';

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Privacy policy sections with collapsible content
const privacySections = [
  {
    id: 'collection',
    title: 'Information We Collect',
    content: `We collect several types of information to provide and improve our service to you:
      • Personal Data: When you register, we collect your name, email address, and contact details.
      • Usage Data: We automatically collect information about how you interact with our platform.
      • Location Data: With your consent, we collect your approximate location to help you find nearby pharmacies.
      • Health Data: Any prescription information or health-related searches are stored securely.`
  },
  {
    id: 'use',
    title: 'How We Use Your Information',
    content: `Your information helps us provide and improve our services:
      • To facilitate transactions between you and pharmacies
      • To verify your identity and process payments
      • To recommend relevant medications and pharmacies
      • To send important notifications about your orders
      • To improve our platform based on your feedback and usage patterns`
  },
  {
    id: 'sharing',
    title: 'Information Sharing',
    content: `We share your information only in limited circumstances:
      • With pharmacies to fulfill your orders
      • With payment processors to complete transactions
      • With service providers who help us operate our platform
      • When required by law or to protect our rights
      • With your explicit consent in other cases`
  },
  {
    id: 'security',
    title: 'Data Security Measures',
    content: `We implement robust security measures to protect your data:
      • End-to-end encryption for all sensitive information
      • Regular security audits and vulnerability testing
      • Strict access controls for employee access to user data
      • Secure data storage with regular backups
      • Compliance with healthcare data protection standards`
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    content: `We use cookies and similar technologies to enhance your experience:
      • Essential cookies to keep you logged in and maintain your cart
      • Analytics cookies to understand how you use our platform
      • Preference cookies to remember your settings
      • You can manage cookie preferences in your browser settings`
  },
  {
    id: 'rights',
    title: 'Your Privacy Rights',
    content: `Depending on your location, you may have the right to:
      • Access the personal data we hold about you
      • Correct inaccurate or incomplete data
      • Delete your personal data (with certain limitations)
      • Object to our processing of your data
      • Export your data in a portable format
      • Withdraw consent for optional data processing`
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [cookieConsent, setCookieConsent] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Set last updated date on client side
  useEffect(() => {
    // For a real app, this would come from your backend
    setLastUpdated('May 20, 2025');
  }, []);

  const toggleSection = (id: string) => {
    if (activeSection === id) {
      setActiveSection(null);
    } else {
      setActiveSection(id);
    }
  };

  // Interactive privacy assessment
  interface PrivacyAnswers {
    share_location: boolean;
    store_prescriptions: boolean;
    marketing_emails: boolean;
    [key: string]: boolean;
  }

  const [answers, setAnswers] = useState<PrivacyAnswers>({
    share_location: false,
    store_prescriptions: false,
    marketing_emails: false,
  });

  const handleAnswerChange = (question: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const getPrivacyScore = () => {
    const trueCount = Object.values(answers).filter(val => val === true).length;
    if (trueCount === 0) return "Minimal data sharing";
    if (trueCount === 1) return "Balanced privacy";
    return "Maximum features";
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | MedFinder</title>
        <meta name="description" content="Learn how we protect your privacy and handle your data" />
      </Head>

      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen pb-12">
        {/* Hero section */}
        <div className="bg-blue-700 text-white py-12 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="mt-4 text-blue-200">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Introduction */}
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
            <p className="mb-4">
              At MedFinder, we believe in transparency about how we handle your information.
              This policy explains our practices regarding data collection, use, and
              sharing when you use our platform to find medications and connect with pharmacies.
            </p>
            <p className="mb-4">
              We understand the sensitive nature of health-related information and apply stringent
              security measures to protect it. This policy is designed to help you understand what
              information we collect, why we collect it, and how you can manage it.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>This policy applies to all services provided by MedFinder</span>
            </div>
          </motion.div>

          {/* Interactive privacy assessment */}
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Personalize Your Privacy</h2>
            <p className="mb-6">
              Customize how you interact with our platform by selecting your privacy preferences:
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Share location for pharmacy recommendations</p>
                  <p className="text-sm text-gray-600">Help us find the closest pharmacies to you</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={answers.share_location}
                    onChange={(e) => handleAnswerChange('share_location', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Store prescription information</p>
                  <p className="text-sm text-gray-600">Save your prescriptions for faster ordering</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={answers.store_prescriptions}
                    onChange={(e) => handleAnswerChange('store_prescriptions', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Receive personalized health tips</p>
                  <p className="text-sm text-gray-600">Get emails with relevant health information</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={answers.marketing_emails}
                    onChange={(e) => handleAnswerChange('marketing_emails', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium">Your privacy preference: <span className="text-blue-700">{getPrivacyScore()}</span></p>
              <p className="text-sm text-gray-600">You can change these settings anytime in your account preferences</p>
            </div>
          </motion.div>

          {/* Privacy sections */}
          <motion.div
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {privacySections.map((section) => (
              <motion.div
                key={section.id}
                className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
                variants={itemVariants}
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="text-xl font-medium">{section.title}</span>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${activeSection === section.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeSection === section.id && (
                  <motion.div
                    className="px-6 pb-6 pt-2 whitespace-pre-wrap"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-700">{section.content}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Cookie consent banner */}
          {cookieConsent && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                <p className="mb-4 md:mb-0">
                  We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                </p>
                <div className="flex gap-3">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={() => setCookieConsent(false)}
                  >
                    Accept All
                  </button>
                  <button
                    className="bg-transparent border border-white hover:bg-white hover:text-gray-800 px-4 py-2 rounded-md transition-colors"
                    onClick={() => setCookieConsent(false)}
                  >
                    Customize
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact section */}
          <div className="max-w-3xl mx-auto text-center mt-12">
            <h2 className="text-2xl font-semibold mb-4">Have Questions?</h2>
            <p className="mb-6">
              If you have any questions about our privacy practices, please contact our Data Protection Officer at:
            </p>
            <div className="inline-block bg-blue-50 px-6 py-4 rounded-lg">
              <p className="font-medium">privacy@medfinder.example.com</p>
              <p>1234 Pharmacy Street, Med City, MC 12345</p>
            </div>
            <div className="mt-8">
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                Contact Us
              </Link>
              {' · '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}