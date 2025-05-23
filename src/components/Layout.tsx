
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-brand-dark to-brand-primary">
      <Navbar />
      <main className="flex-grow pt-16 relative">
        {/* Enhanced decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-60 right-1/4 w-48 h-48 bg-accent-green/10 rounded-full blur-2xl animate-bounce-subtle"></div>
          <div className="absolute bottom-80 left-1/3 w-56 h-56 bg-accent-red/10 rounded-full blur-2xl"></div>
          <div className="absolute top-40 right-1/3 w-40 h-40 bg-accent-purple/10 rounded-full blur-2xl"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
