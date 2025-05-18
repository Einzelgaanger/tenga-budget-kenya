
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-16">
      <div className="container mx-auto text-center text-gray-600">
        <p>© {new Date().getFullYear()} Tenga Pesa - A Smart Spending Feature for the Everyday Kenyan</p>
        <p className="mt-2 text-sm">This is a concept project for demonstration purposes only.</p>
      </div>
    </footer>
  );
};

export default Footer;
