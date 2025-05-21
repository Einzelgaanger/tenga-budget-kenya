
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  ShieldCheck, 
  Info, 
  Wallet, 
  TrendingUp, 
  LockKeyhole,
  Target,
  PiggyBank,
  CalendarClock,
  ArrowRight,
  ChevronRight,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto pt-24 pb-12 md:pt-28 md:pb-16 px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-tertiary rounded-full blur-xl opacity-60 animate-pulse-slow"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-blue rounded-full blur-xl opacity-40 animate-float"></div>
          
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-gradient-brand leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Tenga Pesa Research
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-gray-700 mb-8 md:mb-10 px-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
              Help us understand how we can build better financial management tools for M-PESA users in Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <Link to="/feedback" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  Share Your Feedback
                </Button>
              </Link>
              <Link to="/admin-login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-6 md:px-8 w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md flex items-center gap-2"
                >
                  <ShieldCheck size={20} />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Card className="shadow-md border-t-4 border-t-brand-primary h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group card-gradient-1">
            <CardContent className="pt-6 md:pt-7">
              <div className="bg-brand-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto group-hover:bg-brand-primary/20 transition-colors">
                <Info size={30} className="text-brand-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-3 text-center">What is Tenga Pesa?</h2>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-center">
                Tenga Pesa is a proposed M-PESA feature designed to help you manage your money more effectively by creating a special savings wallet with customizable withdrawal rules.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-brand-secondary h-full hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group card-gradient-2">
            <CardContent className="pt-6 md:pt-7">
              <div className="bg-brand-secondary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto group-hover:bg-brand-secondary/20 transition-colors">
                <PiggyBank size={30} className="text-brand-secondary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-3 text-center">How Does It Work?</h2>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-center">
                You set aside money in a special wallet and create your own rules for when and how you can withdraw it, helping you stick to your financial goals and budget.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-accent-purple h-full sm:col-span-2 md:col-span-1 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group card-gradient-3">
            <CardContent className="pt-6 md:pt-7">
              <div className="bg-brand-tertiary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto group-hover:bg-brand-tertiary/20 transition-colors">
                <Target size={30} className="text-brand-tertiary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-3 text-center">Why Participate?</h2>
              <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-center">
                Your feedback will help shape the future of financial management tools in Kenya. By sharing your thoughts, you're contributing to creating better financial solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gradient-brand">Key Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tenga Pesa offers several advantages to help you manage your finances effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-accent-green rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Target size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Goal-Based Saving</h3>
              <p className="text-gray-600 text-sm">Set specific financial targets and create rules to help you achieve them.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-accent-blue rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <CalendarClock size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Time Restrictions</h3>
              <p className="text-gray-600 text-sm">Create time-based conditions for accessing your funds to avoid impulse spending.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-accent-pink rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <LockKeyhole size={24} className="text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Customized Control</h3>
              <p className="text-gray-600 text-sm">Design your own withdrawal rules based on your personal financial habits.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="bg-accent-yellow rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Financial Growth</h3>
              <p className="text-gray-600 text-sm">Watch your savings grow as you build better money management habits.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-brand-light to-accent-purple/20 shadow-md border-none hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-400 mb-16 md:mb-20">
          <CardContent className="pt-8 pb-8 px-6 md:pt-10 md:pb-10 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-5 text-brand-primary">Ready to share your thoughts?</h2>
                <p className="text-sm md:text-base text-gray-700 mb-6 md:mb-7">
                  The survey takes approximately 5 minutes to complete. Your responses will help us understand how we can create better tools to help Kenyans manage their finances.
                </p>
                <Link to="/feedback" className="block w-full sm:inline-block sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white w-full sm:w-auto transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Start the Questionnaire
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
              
              {/* Circular graphic with animation */}
              <div className="hidden sm:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary/50 to-brand-secondary/50 opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center max-w-[220px] relative z-10">
                    <div className="w-4/5 h-4/5 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <div className="relative">
                          <Sparkles className="mx-auto mb-2 text-brand-primary animate-bounce-subtle" size={36} />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-brand-primary">Your Opinion</h3>
                        <p className="text-sm md:text-base text-gray-500">Matters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Small circle for mobile */}
              <div className="sm:hidden mx-auto mt-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary/50 to-brand-secondary/50 opacity-50 animate-pulse"></div>
                  <div className="aspect-square rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center w-32 relative z-10">
                    <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <Sparkles className="mx-auto mb-1 text-brand-primary animate-bounce-subtle" size={20} />
                        <h3 className="text-base font-semibold text-brand-primary">Your</h3>
                        <p className="text-xs text-gray-500">Opinion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Section */}
        <div className="mb-16 md:mb-20 py-10 px-6 bg-accent-gray/50 rounded-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-primary">Why Your Input Matters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join others who have already contributed to shaping the future of financial tools in Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2 flex items-center justify-center">
                <Users size={32} className="mr-2 text-brand-secondary" />
                <span className="counter">500+</span>
              </div>
              <p className="text-gray-600">Participants So Far</p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2 flex items-center justify-center">
                <Clock size={32} className="mr-2 text-brand-secondary" />
                <span className="counter">5</span>
                <span className="text-xl ml-1">min</span>
              </div>
              <p className="text-gray-600">Average Completion Time</p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-primary mb-2 flex items-center justify-center">
                <Sparkles size={32} className="mr-2 text-brand-secondary" />
                <span className="counter">100%</span>
              </div>
              <p className="text-gray-600">Valuable Feedback</p>
            </div>
          </div>
        </div>
        
        {/* Final CTA banner */}
        <div className="p-8 md:p-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl shadow-md border border-brand-tertiary/20 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-32 -mr-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -ml-24"></div>
          
          <div className="text-center relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Join the Financial Future of Kenya</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-6 text-sm md:text-base">
              Your insights are crucial for building financial tools that truly meet the needs of Kenyans. Help us create a more accessible financial future.
            </p>
            <Link to="/feedback">
              <Button 
                className="bg-white text-brand-primary hover:bg-white/90 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
              >
                Participate Now
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
