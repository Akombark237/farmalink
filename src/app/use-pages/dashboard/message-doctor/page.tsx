'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  ChevronLeft,
  User,
  Clock,
  CheckCircle2,
  Circle,
  Search,
  Phone,
  Video,
  Paperclip
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Sample doctors and conversations
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    avatar: "👩‍⚕️",
    status: "online",
    lastSeen: "now",
    unreadCount: 2
  },
  {
    id: 2,
    name: "Dr. Michel Kamga",
    specialty: "Cardiology",
    avatar: "👨‍⚕️",
    status: "offline",
    lastSeen: "2 hours ago",
    unreadCount: 0
  },
  {
    id: 3,
    name: "Dr. Fatima Mballa",
    specialty: "Pediatrics",
    avatar: "👩‍⚕️",
    status: "online",
    lastSeen: "5 min ago",
    unreadCount: 1
  }
];

const sampleMessages: {[key: number]: any[]} = {
  1: [
    {
      id: 1,
      sender: "doctor",
      message: "Hello Alex! How are you feeling today?",
      timestamp: "10:30 AM",
      read: true
    },
    {
      id: 2,
      sender: "patient",
      message: "Hi Dr. Johnson, I've been experiencing some mild headaches lately.",
      timestamp: "10:32 AM",
      read: true
    },
    {
      id: 3,
      sender: "doctor",
      message: "I see. How long have you been experiencing these headaches? Are they constant or intermittent?",
      timestamp: "10:35 AM",
      read: false
    },
    {
      id: 4,
      sender: "doctor",
      message: "Also, have you been drinking enough water and getting adequate sleep?",
      timestamp: "10:36 AM",
      read: false
    }
  ],
  3: [
    {
      id: 1,
      sender: "doctor",
      message: "Good morning! I wanted to follow up on your child's vaccination schedule.",
      timestamp: "9:15 AM",
      read: false
    }
  ]
};

export default function MessageDoctorPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [messages, setMessages] = useState(sampleMessages[selectedDoctor.id] || []);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "patient",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    setMessages(sampleMessages[doctor.id] || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/use-pages/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Doctor</h1>
            <p className="text-gray-600 mt-2">Communicate securely with your healthcare providers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Doctors List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Doctors</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedDoctor.id === doctor.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="text-2xl">{doctor.avatar}</div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            doctor.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doctor.name}
                            </p>
                            {doctor.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {doctor.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{doctor.specialty}</p>
                          <p className="text-xs text-gray-400">{doctor.lastSeen}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="text-3xl">{selectedDoctor.avatar}</div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        selectedDoctor.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                      <p className="text-xs text-gray-500">
                        {selectedDoctor.status === 'online' ? 'Online now' : `Last seen ${selectedDoctor.lastSeen}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'patient'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                          {message.sender === 'patient' && (
                            <div className="ml-2">
                              {message.read ? (
                                <CheckCircle2 className="h-3 w-3 text-blue-200" />
                              ) : (
                                <Circle className="h-3 w-3 text-blue-200" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Messages are encrypted and secure. Response time may vary.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Emergency Contact</h3>
                <p className="text-sm text-gray-600">For urgent medical issues</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Schedule Call</h3>
                <p className="text-sm text-gray-600">Book a phone consultation</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Video Call</h3>
                <p className="text-sm text-gray-600">Start a video consultation</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
