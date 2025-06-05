import React from 'react';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Wallet,
  Headphones,
  ShieldCheck,
  BookOpen,
  MessageCircle,
  Clock,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black py-12 mt-16 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-16 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mb-48"></div>
      <div className="absolute top-20 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4">
        {/* Contact info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-2 rounded-lg">
                <Wallet size={20} className="text-gray-300" />
              </div>
              <h3 className="text-white text-xl font-semibold">TengaPesa</h3>
            </div>
            <p className="text-gray-300/80 mb-4 text-sm">
              Helping Kenyans manage their finances better with innovative budget management tools.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" title="Twitter">
                <Twitter size={18} className="text-gray-300" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" title="Facebook">
                <Facebook size={18} className="text-gray-300" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" title="Instagram">
                <Instagram size={18} className="text-gray-300" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" title="LinkedIn">
                <Linkedin size={18} className="text-gray-300" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <span className="flex items-center text-sm text-gray-300/80 hover:text-white transition-colors">
                <Mail size={16} className="mr-2 text-gray-400" />
                binfred.ke@gmail.com
              </span>
              <span className="flex items-center text-sm text-gray-300/80 hover:text-white transition-colors">
                <Phone size={16} className="mr-2 text-gray-400" />
                +254 700 8611 29
              </span>
              <span className="flex items-center text-sm text-gray-300/80 hover:text-white transition-colors">
                <MapPin size={16} className="mr-2 text-gray-400" />
                Nairobi, Kenya
              </span>
              <span className="flex items-center text-sm text-gray-300/80 hover:text-white transition-colors">
                <Clock size={16} className="mr-2 text-gray-400" />
                Open: 9AM - 5PM EAT
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <ExternalLink size={14} className="mr-2 text-gray-400" /> Home
                </a>
              </li>
              <li>
                <a href="/feedback" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <MessageCircle size={14} className="mr-2 text-gray-400" /> Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <Headphones size={14} className="mr-2 text-gray-400" /> FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <Users size={14} className="mr-2 text-gray-400" /> About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <ShieldCheck size={14} className="mr-2 text-gray-400" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <BookOpen size={14} className="mr-2 text-gray-400" /> Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <Mail size={14} className="mr-2 text-gray-400" /> Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition-colors flex items-center text-sm">
                  <Phone size={14} className="mr-2 text-gray-400" /> Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm text-gray-300/70">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Tenga Pesa - Made with <Heart size={14} className="text-gray-300 animate-pulse" /> in Kenya
          </p>
          <p className="mt-2 text-xs text-gray-300/50">
            This is a concept project for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
