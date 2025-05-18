
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-mpesa-green text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-white">Tenga</span>
          <span className="text-white ml-1">Pesa</span>
        </Link>
        
        <div className="flex gap-4">
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
    </nav>
  );
};

export default Navbar;
