
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, ShieldCheck, Info, Wallet, TrendingUp, LockKeyhole } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto pt-24 pb-12 md:pt-28 md:pb-16 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Tenga Pesa Research
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 px-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            Help us understand how we can build better financial management tools for M-PESA users in Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <Link to="/feedback" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Share Your Feedback
              </Button>
            </Link>
            <Link to="/admin-login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 md:px-8 w-full sm:w-auto hover:bg-gray-100 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md flex items-center gap-2"
              >
                <ShieldCheck size={20} />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="shadow-md border-t-4 border-t-emerald-500 h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
            <CardContent className="pt-6 md:pt-7">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                  <Info size={24} className="text-emerald-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold">What is Tenga Pesa?</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                Tenga Pesa is a proposed M-PESA feature designed to help you manage your money more effectively by creating a special savings wallet with customizable withdrawal rules.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-blue-500 h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
            <CardContent className="pt-6 md:pt-7">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Wallet size={24} className="text-blue-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold">How Does It Work?</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                You set aside money in a special wallet and create your own rules for when and how you can withdraw it, helping you stick to your financial goals and budget.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-purple-500 h-full sm:col-span-2 md:col-span-1 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
            <CardContent className="pt-6 md:pt-7">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold">Why Participate?</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                Your feedback will help shape the future of financial management tools in Kenya. By sharing your thoughts, you're contributing to creating better financial solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 shadow-md border-none hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400">
          <CardContent className="pt-8 pb-8 px-6 md:pt-10 md:pb-10 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-5 text-gray-800">Ready to share your thoughts?</h2>
                <p className="text-sm md:text-base text-gray-700 mb-6 md:mb-7">
                  The survey takes approximately 5 minutes to complete. Your responses will help us understand how we can create better tools to help Kenyans manage their finances.
                </p>
                <Link to="/feedback" className="block w-full sm:inline-block sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Start the Questionnaire
                  </Button>
                </Link>
              </div>
              
              {/* Circle graphic with pulsing animation - hidden on mobile, visible from sm breakpoint */}
              <div className="hidden sm:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-blue-300 opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-gradient-to-br from-emerald-200 to-blue-200 flex items-center justify-center max-w-[220px] relative z-10">
                    <div className="w-4/5 h-4/5 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <div className="relative">
                          <LockKeyhole className="mx-auto mb-2 text-emerald-600" size={36} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-emerald-600">Your Opinion</h3>
                        <p className="text-sm md:text-base text-gray-500">Matters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Small circle for extra small screens - centered */}
              <div className="sm:hidden mx-auto mt-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 to-blue-300 opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-gradient-to-br from-emerald-200 to-blue-200 flex items-center justify-center w-32 relative z-10">
                    <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <LockKeyhole className="mx-auto mb-1 text-emerald-600" size={20} />
                        <h3 className="text-base font-semibold text-emerald-600">Your</h3>
                        <p className="text-xs text-gray-500">Opinion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional CTA banner */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 rounded-2xl shadow-sm border border-blue-100 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Join the Financial Future</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Your insights are crucial for building financial tools that truly meet the needs of Kenyans. Help us create a more accessible financial future.
            </p>
            <Link to="/feedback">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Participate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
