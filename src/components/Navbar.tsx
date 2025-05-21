
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, ShieldCheck, Menu, X, ChevronRight, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-brand-primary/95 shadow-lg backdrop-blur-md' : 'bg-brand-primary'
    }`}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold flex items-center group">
          <Sparkles size={24} className="text-white mr-2 animate-pulse-slow" />
          <span className="text-white">Tenga</span>
          <span className="text-white relative ml-1">
            Pesa
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/">
            <Button 
              variant="ghost" 
              className={`text-white hover:text-white hover:bg-brand-dark/30 flex gap-2 items-center transition-all duration-200 ${
                isActive('/') ? 'bg-brand-dark/50' : ''
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Button>
          </Link>
          <Link to="/feedback">
            <Button 
              variant="ghost" 
              className={`text-white hover:text-white hover:bg-brand-dark/30 flex gap-2 items-center transition-all duration-200 ${
                isActive('/feedback') ? 'bg-brand-dark/50' : ''
              }`}
            >
              <MessageCircle size={18} />
              <span>Feedback</span>
            </Button>
          </Link>
          <Link to="/admin-login">
            <Button 
              variant="outline" 
              className={`bg-transparent border-white text-white hover:bg-brand-dark/30 flex gap-2 items-center transition-all duration-200 ${
                isActive('/admin') || isActive('/admin-login') ? 'bg-brand-dark/30' : ''
              }`}
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile navigation menu - animated slide down */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-primary shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-2">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`w-full text-white justify-start hover:bg-brand-dark/30 flex gap-2 items-center ${
                  isActive('/') ? 'bg-brand-dark/50' : ''
                }`}
              >
                <Home size={18} />
                <span>Home</span>
                <ChevronRight size={16} className="ml-auto" />
              </Button>
            </Link>
            <Link to="/feedback">
              <Button 
                variant="ghost" 
                className={`w-full text-white justify-start hover:bg-brand-dark/30 flex gap-2 items-center ${
                  isActive('/feedback') ? 'bg-brand-dark/50' : ''
                }`}
              >
                <MessageCircle size={18} />
                <span>Feedback</span>
                <ChevronRight size={16} className="ml-auto" />
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button 
                variant="outline" 
                className={`w-full bg-transparent border-white text-white justify-start hover:bg-brand-dark/30 flex gap-2 items-center ${
                  isActive('/admin') || isActive('/admin-login') ? 'bg-brand-dark/30' : ''
                }`}
              >
                <ShieldCheck size={18} />
                <span>Admin</span>
                <ChevronRight size={16} className="ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
