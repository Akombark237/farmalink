'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Pill,
  Search,
  Users,
  Shield,
  Clock,
  Award
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { href: '/use-pages/search', label: 'Search Medications', icon: Search },
      { href: '/use-pages/medical-assistant', label: 'AI Assistant', icon: Heart },
      { href: '/authentication/register', label: 'Join Platform', icon: Users },
      { href: '/public/about', label: 'About Us', icon: Award },
    ],
    support: [
      { href: '/public/contact', label: 'Contact Support', icon: Mail },
      { href: '/public/terms', label: 'Terms of Service', icon: Shield },
      { href: '/public/privacy', label: 'Privacy Policy', icon: Shield },
      { href: '/use-pages/heaith/tips', label: 'Health Tips', icon: Heart },
    ],
    forPharmacies: [
      { href: '/vendors/pharmacy_dashboard', label: 'Pharmacy Portal', icon: Pill },
      { href: '/authentication/register', label: 'Join as Pharmacy', icon: Users },
      { href: '/vendors/pharmacy_invertory', label: 'Inventory Management', icon: Clock },
      { href: '/public/contact', label: 'Partnership Inquiry', icon: Mail },
    ]
  };

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
    { href: '#', icon: Twitter, label: 'Twitter', color: 'hover:text-blue-400' },
    { href: '#', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
    { href: '#', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className="text-xl font-bold">PharmaLink</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting patients with local pharmacies for easy medication access, 
              price comparison, and AI-powered health assistance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">support@pharmalink.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">123 Health St, Medical City, MC 12345</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* For Pharmacies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">For Pharmacies</h3>
            <ul className="space-y-3">
              {footerLinks.forPharmacies.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest health tips and platform updates delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} PharmaLink. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/public/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <Link href="/public/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <Link href="/public/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
