'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Heart, Pill, Brain, Shield, Clock, Users, Star, ArrowLeft, X, Home, Sparkles, Zap, CheckCircle } from 'lucide-react';
import MedicalChat, { MedicalChatRef } from '@/components/MedicalChat';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MedicalAssistantPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const chatRef = React.useRef<MedicalChatRef>(null);

  useEffect(() => {
    // Generate session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);

    // Check service status
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/medical-chat');
        setServiceStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        setServiceStatus('offline');
      }
    };

    checkStatus();
  }, []);

  const handleQuickQuestion = (question: string) => {
    // Send the quick question to the chat component
    if (chatRef.current) {
      chatRef.current.sendQuickMessage(question);
    }
  };

  const quickQuestions = [
    { text: "What are the side effects of ibuprofen?", icon: <Pill className="h-4 w-4" />, category: "Medication" },
    { text: "How should I store my medications?", icon: <Shield className="h-4 w-4" />, category: "Storage" },
    { text: "What's the difference between generic and brand name drugs?", icon: <Brain className="h-4 w-4" />, category: "Information" },
    { text: "Can I take multiple vitamins together?", icon: <Heart className="h-4 w-4" />, category: "Supplements" },
    { text: "What should I do if I miss a dose?", icon: <Clock className="h-4 w-4" />, category: "Dosage" },
    { text: "How do I know if I'm allergic to a medication?", icon: <CheckCircle className="h-4 w-4" />, category: "Safety" }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Intelligence",
      description: "Advanced medical knowledge with RAG-enhanced accuracy",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Safe & Reliable",
      description: "Evidence-based information with safety guidelines",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Responses",
      description: "Get medical guidance in seconds, not minutes",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Professional Grade",
      description: "Developed with healthcare professionals",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50"
    }
  ];

  if (serviceStatus === 'offline') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-orange-100/20 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <Bot className="h-20 w-20 mx-auto text-red-400 relative z-10" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
                  Medical Assistant Unavailable
                </h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  The medical assistant service is currently offline. Please try again later or contact support.
                </p>
                <div className="space-y-4">
                  <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                    <Link href="/use-pages/heaith/tips" className="flex items-center justify-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Browse Health Tips</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-xl">
                    <Link href="/public/contact" className="flex items-center justify-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Contact Support</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 rounded-lg px-3 py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back</span>
              </Button>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 rounded-lg px-3 py-2">
                <Home className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {serviceStatus === 'online' && (
                <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-3 py-1 rounded-full shadow-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="font-medium">Online</span>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 rounded-lg p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
                  <Bot className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="ml-6 text-left">
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Qala-Lwazi Medical Assistant
                </h1>
                <p className="text-blue-100 text-lg font-medium">Powered by Ukuqala Labs</p>
              </div>
            </div>

            <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered medical companion for health questions and medication guidance.
              Get instant, reliable answers to your medical queries with advanced RAG technology.
            </p>

            <div className="flex items-center justify-center space-x-4 flex-wrap gap-3">
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300">
                <Shield className="h-4 w-4 mr-2" />
                <span className="font-medium">Safe & Reliable</span>
              </Badge>
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="font-medium">Enhanced with RAG</span>
              </Badge>
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300">
                <Zap className="h-4 w-4 mr-2" />
                <span className="font-medium">24/7 Available</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0 h-full relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                </div>

                {serviceStatus === 'checking' ? (
                  <div className="flex items-center justify-center h-full relative z-10">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                        <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-10 animate-pulse"></div>
                        <Bot className="h-20 w-20 mx-auto text-blue-500 relative z-10 animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-700 text-xl font-semibold">Connecting to Qala-Lwazi...</p>
                        <p className="text-gray-500 text-sm">Please wait while we establish connection</p>
                        <div className="flex justify-center space-x-1 mt-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <MedicalChat
                    ref={chatRef}
                    sessionId={sessionId}
                    onSessionChange={setSessionId}
                    className="h-full border-0 shadow-none bg-transparent relative z-10"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-3 shadow-lg">
                    <Pill className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold">Quick Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-4 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-xl border border-transparent hover:border-blue-200 hover:shadow-md group"
                    onClick={() => handleQuickQuestion(question.text)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 flex-shrink-0">
                        {question.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs text-gray-500 mb-1 font-medium">{question.category}</div>
                        <span className="text-gray-700 group-hover:text-blue-700 leading-relaxed">{question.text}</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100/50">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg mr-3 shadow-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold">Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {features.map((feature, index) => (
                  <div key={index} className={`p-4 rounded-xl bg-gradient-to-r ${feature.bgGradient} border border-white/50 hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">{feature.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-0 shadow-xl rounded-2xl overflow-hidden border-amber-200/50">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 border-b border-amber-200/50">
                <CardTitle className="flex items-center text-amber-800">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg mr-3 shadow-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">Important Notice</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-amber-700 leading-relaxed">
                  This AI assistant provides general medical information and should not replace professional medical advice.
                  Always consult with healthcare professionals for personalized medical guidance and treatment decisions.
                </p>
              </CardContent>
            </Card>

            {/* Related Links */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100/50">
                <CardTitle className="flex items-center text-gray-800">
                  <div className="p-2 bg-gradient-to-br from-gray-600 to-slate-700 rounded-lg mr-3 shadow-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">Related Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <Button variant="ghost" asChild className="w-full justify-start text-sm h-auto p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300 rounded-xl border border-transparent hover:border-red-200 hover:shadow-md group">
                  <Link href="/use-pages/heaith/tips" className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg group-hover:from-red-200 group-hover:to-pink-200 transition-all duration-300">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">Health Tips</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-sm h-auto p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 rounded-xl border border-transparent hover:border-blue-200 hover:shadow-md group">
                  <Link href="/use-pages/search" className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                      <Pill className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Find Medications</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-start text-sm h-auto p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-300 rounded-xl border border-transparent hover:border-green-200 hover:shadow-md group">
                  <Link href="/use-pages/priscriptions" className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Manage Prescriptions</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
