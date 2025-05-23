import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, ShieldCheck, Info, Wallet, TrendingUp, LockKeyhole, ArrowRight, CheckCircle2, LineChart, PiggyBank, DollarSign, BadgePercent } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto pt-24 pb-12 md:pt-28 md:pb-16 px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-indigo-600 text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} />
              <span>Research Project</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Tenga Pesa Research
          </h1>
          <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 px-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            Help us understand how we can build better financial management tools for Mpesa app users in Kenya. Your feedback will shape the future of digital finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <Link to="/feedback" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
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
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md flex items-center gap-2"
              >
                <ShieldCheck size={20} />
                <span>Admin Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="shadow-sm border border-indigo-100 bg-white rounded-xl h-full hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group overflow-hidden">
            <CardContent className="pt-6 md:pt-7 p-6">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-indigo-100 p-2.5 rounded-lg mb-4">
                  <Info size={22} className="text-indigo-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">What is Tenga Pesa?</h2>
              </div>
              <p className="text-sm md:text-base text-slate-600 group-hover:text-slate-800 transition-colors duration-300">
                Tenga Pesa is a proposed M-PESA feature designed to help you manage your money more effectively by creating a special savings wallet with customizable withdrawal rules.
              </p>
              <div className="mt-4 pt-4 border-t border-indigo-50 flex justify-end">
                <span className="text-indigo-600 text-sm font-medium flex items-center group-hover:text-indigo-700">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-purple-100 bg-white rounded-xl h-full hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group overflow-hidden">
            <CardContent className="pt-6 md:pt-7 p-6">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-purple-100 p-2.5 rounded-lg mb-4">
                  <PiggyBank size={22} className="text-purple-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">How Does It Work?</h2>
              </div>
              <p className="text-sm md:text-base text-slate-600 group-hover:text-slate-800 transition-colors duration-300">
                You set aside money in a special wallet and create your own rules for when and how you can withdraw it, helping you stick to your financial goals and budget.
              </p>
              <div className="mt-4 pt-4 border-t border-purple-50 flex justify-end">
                <span className="text-purple-600 text-sm font-medium flex items-center group-hover:text-purple-700">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-blue-100 bg-white rounded-xl h-full sm:col-span-2 md:col-span-1 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group overflow-hidden">
            <CardContent className="pt-6 md:pt-7 p-6">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-blue-100 p-2.5 rounded-lg mb-4">
                  <LineChart size={22} className="text-blue-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Why Participate?</h2>
              </div>
              <p className="text-sm md:text-base text-slate-600 group-hover:text-slate-800 transition-colors duration-300">
                Your feedback will help shape the future of financial management tools in Kenya. By sharing your thoughts, you're contributing to creating better financial solutions.
              </p>
              <div className="mt-4 pt-4 border-t border-blue-50 flex justify-end">
                <span className="text-blue-600 text-sm font-medium flex items-center group-hover:text-blue-700">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA Card */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm border border-indigo-100 rounded-xl hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400">
          <CardContent className="pt-8 pb-8 px-6 md:pt-10 md:pb-10 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                  <BadgePercent size={16} />
                  <span>Research Initiative</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-800">
                  Help Us Build Better Financial Tools
                </h3>
                <p className="text-slate-600 mb-6">
                  Your input is crucial for developing features that truly serve the needs of M-PESA users. Share your thoughts and help shape the future of mobile money management.
                </p>
                <Link to="/feedback" className="inline-block">
                  <Button 
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Give Feedback Now</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Circle graphic - visible from sm breakpoint */}
              <div className="hidden sm:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-300/30 opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center max-w-[220px] relative z-10">
                    <div className="w-4/5 h-4/5 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Opinion</h3>
                        <p className="text-slate-500">Matters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Small circle for extra small screens - centered */}
              <div className="sm:hidden mx-auto mt-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-300/30 opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center w-32 relative z-10">
                    <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <DollarSign className="mx-auto mb-1 text-indigo-600" size={20} />
                        <h3 className="text-base font-semibold text-indigo-600">Your</h3>
                        <p className="text-xs text-slate-500">Opinion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional CTA banner */}
        <div className="mt-16 md:mt-20 p-8 md:p-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Join the Financial Future</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-6">
              Your insights are crucial for building financial tools that truly meet the needs of Kenyans. Help us create a more accessible financial future.
            </p>
            <Link to="/feedback">
              <Button 
                className="bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
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
