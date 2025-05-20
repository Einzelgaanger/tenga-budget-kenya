
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Tenga Pesa
            </h3>
            <p className="text-sm text-gray-600">A Smart Money Management Feature for M-PESA</p>
          </div>
          
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Tenga Pesa - Made with <Heart size={14} className="text-red-500 animate-pulse" /> in Kenya
          </p>
          <p className="mt-2 text-xs text-gray-500">
            This is a concept project for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
