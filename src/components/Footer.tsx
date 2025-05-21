
import React from 'react';
import { Heart, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-brand-light to-accent-gray py-12 mt-16 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-16 right-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-tertiary/10 rounded-full blur-3xl -mb-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="font-bold text-2xl mb-2 text-gradient-brand">
              Tenga Pesa
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              A Smart Money Management Feature for M-PESA designed to help you achieve your financial goals
            </p>
            
            <div className="flex flex-col mt-4 space-y-2">
              <span className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2 text-brand-primary" />
                contact@tengapesa.co.ke
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-2 text-brand-primary" />
                +254 700 123 456
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2 text-brand-primary" />
                Nairobi, Kenya
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-16 text-left">
            <div>
              <h4 className="font-semibold mb-4 text-brand-primary">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-600 hover:text-brand-primary transition-colors flex items-center">
                    <ExternalLink size={14} className="mr-1" /> Home
                  </a>
                </li>
                <li>
                  <a href="/feedback" className="text-gray-600 hover:text-brand-primary transition-colors flex items-center">
                    <ExternalLink size={14} className="mr-1" /> Feedback
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors flex items-center">
                    <ExternalLink size={14} className="mr-1" /> FAQ
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-brand-primary">Information</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors flex items-center">
                    <ExternalLink size={14} className="mr-1" /> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors flex items-center">
                    <ExternalLink size={14} className="mr-1" /> Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors flex items-center">
                    <ExternalLink size={14} className="mr-1" /> Contact Us
                  </a>
                </li>
              </ul>
            </div>
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
