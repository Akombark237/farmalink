'use client';

// pages/forgot-password.js
import { ArrowLeft, CheckCircle, Mail, Shield } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setFormError('Please enter your email address');
      return;
    }

    setFormError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Reset Your Password | MedFind</title>
        <meta name="description" content="Reset your password to regain access to your MedFind account" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSubmitted ? 'Check your inbox' : 'Reset your password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          {isSubmitted
            ? "We've sent recovery instructions to your email"
            : "Enter your email and we'll send you instructions to reset your password"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border-t-4 border-indigo-500">
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="your-email@example.com"
                  />
                </div>
                {formError && (
                  <p className="mt-2 text-sm text-red-600">{formError}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative overflow-hidden transition-all duration-300 ease-in-out`}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Sending...</span>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    </>
                  ) : (
                    'Send reset instructions'
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <Link href="/authentication/login" className="flex items-center font-medium text-indigo-600 hover:text-indigo-500">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Return to login
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-center text-gray-700">
                  We&apos;ve sent an email to <strong>{email}</strong> with a link to reset your password.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800">Next steps:</h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the reset link in the email</li>
                  <li>Create a new secure password</li>
                </ul>
              </div>

              <div className="pt-4 flex flex-col space-y-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try a different email
                </button>

                <Link
                  href="/authentication/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">
                Need help?
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <Link
                href="/contact"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Contact Support
              </Link>
            </div>
            <div>
              <Link
                href="/authentication/register"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="hidden lg:block fixed top-0 right-0 w-1/4 h-full pointer-events-none">
        <div className="absolute top-24 right-24 h-64 w-64 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-24 right-48 h-48 w-48 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
      </div>
      <div className="hidden lg:block fixed bottom-0 left-0 w-1/4 h-full pointer-events-none">
        <div className="absolute bottom-24 left-24 h-56 w-56 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
}