'use client';

import React from 'react';

// Simple Dashboard Component without complex dependencies
export default function SimpleDashboard() {
  const userName = "User";

  return (
    <div className="min-h-screen bg-gray-50/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">👤</span>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
              <p className="text-gray-600">Here's your health at a glance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <span className="mr-2">🔔</span>
              <span>Notifications</span>
            </button>
            <button className="bg-gray-200 p-2 rounded-md">
              <span className="text-xl">⚙️</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => window.location.href = '/use-pages/dashboard/schedule-appointment'}
            className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <div className="text-blue-600 mb-2">
              <span className="text-3xl">📅</span>
            </div>
            <span className="font-medium text-gray-800">Schedule Appointment</span>
          </button>

          <button
            onClick={() => window.location.href = '/use-pages/dashboard/message-doctor'}
            className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <div className="text-blue-600 mb-2">
              <span className="text-3xl">💬</span>
            </div>
            <span className="font-medium text-gray-800">Message Doctor</span>
          </button>

          <button
            onClick={() => window.location.href = '/use-pages/dashboard/request-records'}
            className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <div className="text-blue-600 mb-2">
              <span className="text-3xl">📄</span>
            </div>
            <span className="font-medium text-gray-800">Request Records</span>
          </button>

          <button
            onClick={() => window.location.href = '/use-pages/dashboard/refill-prescription'}
            className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <div className="text-blue-600 mb-2">
              <span className="text-3xl">💊</span>
            </div>
            <span className="font-medium text-gray-800">Refill Prescription</span>
          </button>
        </div>

        {/* Key Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-red-100 p-4 rounded-full">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Blood Pressure</p>
              <h3 className="text-xl font-bold">120/80 mmHg</h3>
              <p className="text-green-600 text-xs">Normal range</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-purple-100 p-4 rounded-full">
              <span className="text-2xl">💓</span>
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Heart Rate</p>
              <h3 className="text-xl font-bold">72 BPM</h3>
              <p className="text-green-600 text-xs">Normal range</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">Glucose</p>
              <h3 className="text-xl font-bold">94 mg/dL</h3>
              <p className="text-green-600 text-xs">Normal range</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-green-100 p-4 rounded-full">
              <span className="text-2xl">⚖️</span>
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">BMI</p>
              <h3 className="text-xl font-bold">24.2</h3>
              <p className="text-green-600 text-xs">Healthy weight</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Recent Appointments</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Dr. Sarah Johnson</p>
                  <p className="text-sm text-gray-600">General Check-up</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">May 24, 2025</p>
                  <p className="text-xs text-gray-500">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Dr. Michel Kamga</p>
                  <p className="text-sm text-gray-600">Cardiology</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">June 2, 2025</p>
                  <p className="text-xs text-gray-500">2:15 PM</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.href = '/use-pages/dashboard/schedule-appointment'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
              >
                Schedule New Appointment
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Current Medications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-xl">💊</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Lisinopril</h3>
                    <p className="text-sm text-gray-500">10mg - Once daily</p>
                  </div>
                </div>
                <button className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-medium">
                  Take Now
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-xl">💊</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Metformin</h3>
                    <p className="text-sm text-gray-500">500mg - Twice daily</p>
                  </div>
                </div>
                <button className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-medium">
                  Take Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Stay Hydrated</h3>
              <p className="text-sm text-blue-600">Remember to drink at least 8 glasses of water daily.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">Physical Activity</h3>
              <p className="text-sm text-green-600">Aim for 30 minutes of moderate activity most days.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800">Sleep Well</h3>
              <p className="text-sm text-purple-600">Try to get 7-8 hours of quality sleep each night.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
