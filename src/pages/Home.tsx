import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, ShieldCheck, Info, Wallet, LineChart, PiggyBank, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto pt-24 pb-12 md:pt-28 md:pb-16 px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">          <div className="inline-block border border-gray-800 rounded-full px-3 py-1 text-gray-900 text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-black" />
              <span>Research Project</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Tenga Pesa Research
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 px-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            Help us understand how we can build better financial management tools for Mpesa app users in Kenya. Your feedback will shape the future of digital finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <Link to="/feedback" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-900 text-white px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
              >
                <MessageCircle size={20} />
                <span>Share Your Feedback</span>
                <ArrowRight size={18} className="ml-1" />
              </Button>
            </Link>
            <Link to="/admin-login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 text-gray-900 hover:bg-gray-50 px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md flex items-center gap-2"
              >
                <ShieldCheck size={20} />
                <span>Admin Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="shadow-sm border-2 border-gray-900 bg-white rounded-xl h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group overflow-hidden">
            <CardContent className="pt-6 md:pt-7 p-6">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-black p-2.5 rounded-lg mb-4">
                  <Info size={22} className="text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">What is Tenga Pesa?</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                Tenga Pesa is a proposed M-PESA feature designed to help you manage your money more effectively by creating a special savings wallet with customizable withdrawal rules.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <span className="text-gray-900 text-sm font-medium flex items-center group-hover:text-black">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
            <Card className="shadow-sm border-2 border-gray-900 bg-white rounded-xl h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group overflow-hidden">
            <CardContent className="pt-6 md:pt-7 p-6">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-black p-2.5 rounded-lg mb-4">
                  <PiggyBank size={22} className="text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">How Does It Work?</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                You set aside money in a special wallet and create your own rules for when and how you can withdraw it, helping you stick to your financial goals and budget.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <span className="text-gray-900 text-sm font-medium flex items-center group-hover:text-black">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
            <Card className="shadow-sm border-2 border-gray-900 bg-white rounded-xl h-full sm:col-span-2 md:col-span-1 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group overflow-hidden">
            <CardContent className="pt-6 md:pt-7 p-6">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-black p-2.5 rounded-lg mb-4">
                  <LineChart size={22} className="text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Why Participate?</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                Your feedback will help shape the future of financial management tools in Kenya. By sharing your thoughts, you're contributing to creating better financial solutions.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <span className="text-gray-900 text-sm font-medium flex items-center group-hover:text-black">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA Card */}        <Card className="bg-black shadow-sm border-2 border-gray-900 rounded-xl hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400">
          <CardContent className="pt-8 pb-8 px-6 md:pt-10 md:pb-10 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
                  <Wallet size={16} className="text-white" />
                  <span>Research Initiative</span>
                </div>                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                  Help Us Build Better Financial Tools
                </h3>
                <p className="text-gray-300 mb-6">
                  Your input is crucial for developing features that truly serve the needs of M-PESA users. Share your thoughts and help shape the future of mobile money management.
                </p>
                <Link to="/feedback" className="inline-block">
                  <Button 
                    size="lg"
                    className="bg-black hover:bg-gray-900 text-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Give Feedback Now</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Circle graphic - visible from sm breakpoint */}
              <div className="hidden sm:flex justify-center">
                <div className="relative">                  <div className="absolute inset-0 rounded-full bg-white opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-white flex items-center justify-center max-w-[220px] relative z-10 border-2 border-gray-900">
                    <div className="w-4/5 h-4/5 rounded-full bg-gray-900/5 flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900">Your Opinion</h3>
                        <p className="text-gray-600">Matters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                {/* Small circle for extra small screens - centered */}
              <div className="sm:hidden mx-auto mt-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-white flex items-center justify-center w-32 relative z-10 border-2 border-gray-900">
                    <div className="w-3/4 h-3/4 rounded-full bg-gray-900/5 flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <DollarSign className="mx-auto mb-1 text-gray-900" size={20} />
                        <h3 className="text-base font-semibold text-gray-900">Your</h3>
                        <p className="text-xs text-gray-600">Opinion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          {/* Additional CTA banner */}
        <div className="mt-16 md:mt-20 p-8 md:p-10 bg-white border-2 border-black rounded-xl shadow-md animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4">Join the Financial Future</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Your insights are crucial for building financial tools that truly meet the needs of Kenyans. Help us create a more accessible financial future.
            </p>
            <Link to="/feedback">
              <Button 
                className="bg-white hover:bg-gray-100 text-black hover:text-gray-900 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
              >
                <MessageCircle size={18} />
                <span>Participate Now</span>
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
