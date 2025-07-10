import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const telegramChannelUrl = 'https://t.me/Saham963'; 

  const redirectTelegram = () => {
    window.open(telegramChannelUrl, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 :px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Saham Trading</span>
            </div>
            <p className="text-gray-300 text-sm">
              Professional stock market investment platform with MLM opportunities. 
              Join thousands of successful investors building wealth through our platform.
            </p>
            <div className="flex space-x-4">
              <div className="bg-primary-600 rounded-lg p-2 cursor-pointer" onClick={redirectTelegram}>
                <Send className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Investment Packages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Investment Packages</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>vip -  ETB</li>
              <li>vip 4 Stock Package - 40000 ETB</li>
              <li>vip3 Stock Package - 200000 ETB</li>
              <li>vip2 Stock Package - 300000 ETB</li>
              <li>vip1 Stock Package - 100000 ETB</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Sahamtrading11@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+251 9XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Saham Trading. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}