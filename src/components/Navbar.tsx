import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MessageCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight, 
  LogOut, 
  AlertTriangle,
  Bell,
  Wallet,
  BarChart3
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TengaBudget</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-2 items-center">
          <Link to="/">
            <Button 
              variant="ghost" 
              className={`text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 flex gap-2 items-center transition-all duration-200 ${
                isActive('/') ? 'bg-indigo-50 text-indigo-600' : ''
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Button>
          </Link>
          <Link to="/feedback">
            <Button 
              variant="ghost" 
              className={`text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 flex gap-2 items-center transition-all duration-200 ${
                isActive('/feedback') ? 'bg-indigo-50 text-indigo-600' : ''
              }`}
            >
              <MessageCircle size={18} />
              <span>Feedback</span>
            </Button>
          </Link>
          <Link to="/admin-login">
            <Button 
              variant="outline" 
              className={`border-indigo-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 flex gap-2 items-center transition-all duration-200 ${
                isActive('/admin') || isActive('/admin-login') ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : ''
              }`}
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Button>
          </Link>
          <Button 
            variant="ghost"
            size="icon"
            className="rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <BarChart3 size={18} />
          </Button>
        </div>
      </div>

      {/* Mobile navigation menu - animated slide down */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-2">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`w-full text-slate-700 justify-start hover:bg-indigo-50 hover:text-indigo-600 flex gap-2 items-center ${
                  isActive('/') ? 'bg-indigo-50 text-indigo-600' : ''
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
                className={`w-full text-slate-700 justify-start hover:bg-indigo-50 hover:text-indigo-600 flex gap-2 items-center ${
                  isActive('/feedback') ? 'bg-indigo-50 text-indigo-600' : ''
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
                className={`w-full border-indigo-200 text-slate-700 justify-start hover:bg-indigo-50 hover:text-indigo-600 flex gap-2 items-center ${
                  isActive('/admin') || isActive('/admin-login') ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : ''
                }`}
              >
                <ShieldCheck size={18} />
                <span>Admin</span>
                <AlertTriangle size={16} className="ml-auto text-amber-500" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
