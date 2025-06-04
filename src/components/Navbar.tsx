
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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

  const handleHomeClick = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleFeedbackClick = () => {
    navigate('/feedback');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <button onClick={handleHomeClick} className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-black">TengaPesa</span>
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center text-black p-2 rounded-full hover:bg-black/5 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-2 items-center">
          <Button 
            onClick={handleHomeClick}
            variant="ghost" 
            className={`text-black hover:text-black hover:bg-black/5 flex gap-2 items-center transition-all duration-200 ${
              isActive('/') ? 'bg-black/5 text-black' : ''
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </Button>
          <Button 
            onClick={handleFeedbackClick}
            variant="ghost" 
            className={`text-black hover:text-black hover:bg-black/5 flex gap-2 items-center transition-all duration-200 ${
              isActive('/feedback') ? 'bg-black/5 text-black' : ''
            }`}
          >
            <MessageCircle size={18} />
            <span>Feedback</span>
          </Button>
          <Link to="/admin-login">
            <Button 
              variant="outline" 
              className={`border-black text-black hover:bg-black hover:text-white flex gap-2 items-center transition-all duration-200 ${
                isActive('/admin') || isActive('/admin-login') ? 'bg-black text-white' : ''
              }`}
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Button>
          </Link>
          <Button 
            variant="ghost"
            size="icon"
            className="rounded-full text-black hover:text-black hover:bg-black/5"
          >
            <BarChart3 size={18} />
          </Button>
        </div>
      </div>

      {/* Mobile navigation menu - animated slide down */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-2">
            <Button 
              onClick={handleHomeClick}
              variant="ghost" 
              className={`w-full text-black justify-start hover:bg-black/5 hover:text-black flex gap-2 items-center ${
                isActive('/') ? 'bg-black/5 text-black' : ''
              }`}
            >
              <Home size={18} />
              <span>Home</span>
              <ChevronRight size={16} className="ml-auto" />
            </Button>
            <Button 
              onClick={handleFeedbackClick}
              variant="ghost" 
              className={`w-full text-black justify-start hover:bg-black/5 hover:text-black flex gap-2 items-center ${
                isActive('/feedback') ? 'bg-black/5 text-black' : ''
              }`}
            >
              <MessageCircle size={18} />
              <span>Feedback</span>
              <ChevronRight size={16} className="ml-auto" />
            </Button>
            <Link to="/admin-login">
              <Button 
                variant="outline" 
                className={`w-full border-black text-black justify-start hover:bg-black hover:text-white flex gap-2 items-center ${
                  isActive('/admin') || isActive('/admin-login') ? 'bg-black text-white' : ''
                }`}
              >
                <ShieldCheck size={18} />
                <span>Admin</span>
                <AlertTriangle size={16} className="ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
