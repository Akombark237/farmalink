'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Sample doctors data
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    rating: 4.8,
    experience: "15 years",
    location: "Yaoundé Central Hospital",
    phone: "+237 6XX XXX XXX",
    avatar: "👩‍⚕️",
    availableSlots: [
      { date: "2024-01-15", time: "09:00", available: true },
      { date: "2024-01-15", time: "10:30", available: true },
      { date: "2024-01-15", time: "14:00", available: false },
      { date: "2024-01-16", time: "09:00", available: true },
      { date: "2024-01-16", time: "11:00", available: true },
    ]
  },
  {
    id: 2,
    name: "Dr. Michel Kamga",
    specialty: "Cardiology",
    rating: 4.9,
    experience: "20 years",
    location: "Yaoundé University Hospital",
    phone: "+237 6XX XXX XXX",
    avatar: "👨‍⚕️",
    availableSlots: [
      { date: "2024-01-15", time: "08:00", available: true },
      { date: "2024-01-15", time: "15:30", available: true },
      { date: "2024-01-17", time: "10:00", available: true },
    ]
  },
  {
    id: 3,
    name: "Dr. Fatima Mballa",
    specialty: "Pediatrics",
    rating: 4.7,
    experience: "12 years",
    location: "Mother and Child Center",
    phone: "+237 6XX XXX XXX",
    avatar: "👩‍⚕️",
    availableSlots: [
      { date: "2024-01-15", time: "13:00", available: true },
      { date: "2024-01-16", time: "09:30", available: true },
      { date: "2024-01-16", time: "16:00", available: true },
    ]
  }
];

export default function ScheduleAppointmentPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [appointmentReason, setAppointmentReason] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedSlot && appointmentReason.trim()) {
      setAppointmentBooked(true);
    }
  };

  if (appointmentBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Appointment Scheduled Successfully!
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-medium">{selectedDoctor?.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedSlot?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedSlot?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{selectedDoctor?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason:</span>
                  <span className="font-medium">{appointmentReason}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Reminders:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Arrive 15 minutes before your appointment</li>
                      <li>Bring your ID and insurance card</li>
                      <li>Bring any current medications</li>
                      <li>You'll receive an SMS confirmation shortly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Link href="/use-pages/dashboard" className="flex-1">
                  <Button className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/use-pages/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule Appointment</h1>
            <p className="text-gray-600 mt-2">Book an appointment with our qualified doctors</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctors List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedDoctor?.id === doctor.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{doctor.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{doctor.name}</h3>
                          <Badge variant="secondary">{doctor.specialty}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{doctor.experience} experience</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-500">★</span>
                            <span>{doctor.rating} rating</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{doctor.phone}</span>
                          </div>
                        </div>

                        {selectedDoctor?.id === doctor.id && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-3">Available Time Slots</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {doctor.availableSlots.map((slot, index) => (
                                <button
                                  key={index}
                                  disabled={!slot.available}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`p-2 text-sm rounded-md border transition-colors ${
                                    !slot.available
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : selectedSlot === slot
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white hover:bg-blue-50 border-gray-200'
                                  }`}
                                >
                                  <div className="font-medium">{slot.date}</div>
                                  <div>{slot.time}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDoctor ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Doctor</label>
                      <p className="text-gray-900">{selectedDoctor.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    </div>

                    {selectedSlot && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date & Time</label>
                        <p className="text-gray-900">{selectedSlot.date} at {selectedSlot.time}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Reason for Visit *
                      </label>
                      <textarea
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        placeholder="Please describe your symptoms or reason for the appointment..."
                        className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                        required
                      />
                    </div>

                    <Button 
                      onClick={handleBookAppointment}
                      disabled={!selectedSlot || !appointmentReason.trim()}
                      className="w-full"
                    >
                      Book Appointment
                    </Button>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a doctor to view available appointments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
