'use client';

import React from 'react';
import { SITE_PAGES } from '@/components/ui/SiteMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function ProjectStatusPage() {
  const totalPages = SITE_PAGES.length;
  const activePages = SITE_PAGES.filter(page => page.status === 'active').length;
  const developmentPages = SITE_PAGES.filter(page => page.status === 'development').length;
  const plannedPages = SITE_PAGES.filter(page => page.status === 'planned').length;

  const completionPercentage = Math.round((activePages / totalPages) * 100);

  const categories = [...new Set(SITE_PAGES.map(page => page.category))];
  const userTypes = [...new Set(SITE_PAGES.map(page => page.userType))];

  const getCategoryStats = (category: string) => {
    const categoryPages = SITE_PAGES.filter(page => page.category === category);
    const active = categoryPages.filter(page => page.status === 'active').length;
    const total = categoryPages.length;
    return { active, total, percentage: Math.round((active / total) * 100) };
  };

  const getUserTypeStats = (userType: string) => {
    const userPages = SITE_PAGES.filter(page => page.userType === userType);
    const active = userPages.filter(page => page.status === 'active').length;
    const total = userPages.length;
    return { active, total, percentage: Math.round((active / total) * 100) };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-6">PharmaLink Project Status</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive overview of development progress across all platform features
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 glass shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Overall Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold gradient-text mb-2">{completionPercentage}%</div>
              <p className="text-gray-600">Complete</p>
            </div>
            <Progress value={completionPercentage} className="h-4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{activePages}</div>
                <div className="text-sm text-gray-600">Active Pages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{developmentPages}</div>
                <div className="text-sm text-gray-600">In Development</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">{plannedPages}</div>
                <div className="text-sm text-gray-600">Planned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map(category => {
            const stats = getCategoryStats(category);
            return (
              <Card key={category} className="glass hover-lift shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{stats.percentage}%</div>
                    <div className="text-sm text-gray-600">{stats.active}/{stats.total} pages</div>
                  </div>
                  <Progress value={stats.percentage} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Type Progress */}
        <Card className="mb-8 glass shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Progress by User Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {userTypes.map(userType => {
                const stats = getUserTypeStats(userType);
                const icon = {
                  'public': '🌐',
                  'patient': '👤',
                  'pharmacy': '🏪',
                  'admin': '👑'
                }[userType] || '📄';
                
                return (
                  <div key={userType} className="text-center">
                    <div className="text-4xl mb-2">{icon}</div>
                    <div className="text-lg font-bold capitalize mb-2">{userType}</div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{stats.percentage}%</div>
                    <div className="text-sm text-gray-600">{stats.active}/{stats.total} pages</div>
                    <Progress value={stats.percentage} className="h-2 mt-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass hover-lift shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-bold mb-2">View Site Map</h3>
              <p className="text-gray-600 mb-4">Explore all pages and their organization</p>
              <Link 
                href="/site-map" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Site Map
              </Link>
            </CardContent>
          </Card>

          <Card className="glass hover-lift shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold mb-2">Active Features</h3>
              <p className="text-gray-600 mb-4">Test working functionality</p>
              <Link 
                href="/use-pages/dashboard" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Dashboard
              </Link>
            </CardContent>
          </Card>

          <Card className="glass hover-lift shadow-soft">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-lg font-bold mb-2">AI Assistant</h3>
              <p className="text-gray-600 mb-4">Chat with Qala-Lwazi</p>
              <Link 
                href="/use-pages/medical-assistant" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try AI Chat
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Development Priorities */}
        <Card className="glass shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Development Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-bold text-red-800">High Priority</h4>
                  <p className="text-red-600">Complete pharmacy management system</p>
                </div>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">Urgent</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-bold text-yellow-800">Medium Priority</h4>
                  <p className="text-yellow-600">Enhance admin panel functionality</p>
                </div>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">Soon</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-bold text-blue-800">Low Priority</h4>
                  <p className="text-blue-600">Add more public information pages</p>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Later</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
