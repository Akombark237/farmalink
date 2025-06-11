'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Home, Wifi, WifiOff } from 'lucide-react';
import SimpleMedicalChat, { SimpleMedicalChatRef } from '@/components/SimpleMedicalChat';

export default function MedicalAssistantPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [serviceStatus, setServiceStatus] = useState('checking');
  const chatRef = useRef<SimpleMedicalChatRef>(null);

  useEffect(() => {
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);

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

  const quickQuestions = [
    "What are the symptoms of diabetes?",
    "How do I manage high blood pressure?",
    "What medications interact with aspirin?",
    "Tell me about common side effects"
  ];

  const handleQuickQuestion = (question: string) => {
    console.log('Quick question clicked:', question);
    if (chatRef.current && chatRef.current.sendQuickMessage) {
      chatRef.current.sendQuickMessage(question);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={() => router.push('/use-pages/dashboard')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {serviceStatus === 'checking' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                ) : serviceStatus === 'online' ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className={'text-sm font-medium ' + (
                  serviceStatus === 'online' ? 'text-green-600' : 
                  serviceStatus === 'offline' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {serviceStatus === 'checking' ? 'Checking...' : 
                   serviceStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden py-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-2xl">
                <Bot className="h-16 w-16 text-white" />
              </div>
              <div className="ml-6 text-left">
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Qala-Lwazi Medical Assistant
                </h1>
                <p className="text-gray-600 text-lg font-medium">Powered by Ukuqala Labs</p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-xl text-gray-600 leading-relaxed">
                Get instant, reliable medical information and guidance from our AI-powered assistant. 
                Ask questions about medications, symptoms, treatments, and general health advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="h-[700px] bg-white shadow-2xl rounded-2xl overflow-hidden">
              {sessionId ? (
                <SimpleMedicalChat
                  ref={chatRef}
                  sessionId={sessionId}
                  onSessionChange={setSessionId}
                  className="h-full border-0 shadow-none"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-blue-400 animate-pulse" />
                    <p className="text-gray-600">Loading medical assistant...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Quick Questions</h3>
                </div>
                
                <div className="space-y-3">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:bg-blue-600 transition-colors"></div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed">
                          {question}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Be specific with your questions for better answers. Include symptoms, duration, and any relevant medical history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
