
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-mpesa-green text-white shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-white">Tenga</span>
          <span className="text-white ml-1">Pesa</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-4">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-mpesa-darkgreen">
              Home
            </Button>
          </Link>
          <Link to="/feedback">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-mpesa-darkgreen">
              Feedback
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-mpesa-darkgreen">
              Admin
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-mpesa-green shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 space-y-2">
            <Link to="/" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full text-white justify-start hover:bg-mpesa-darkgreen">
                Home
              </Button>
            </Link>
            <Link to="/feedback" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full text-white justify-start hover:bg-mpesa-darkgreen">
                Feedback
              </Button>
            </Link>
            <Link to="/admin" onClick={toggleMenu}>
              <Button variant="outline" className="w-full bg-transparent border-white text-white justify-start hover:bg-mpesa-darkgreen">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
