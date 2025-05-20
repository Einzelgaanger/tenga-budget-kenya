
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 md:py-12 px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Tenga Pesa Research
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 px-2">
            Help us understand how we can build better financial management tools for M-PESA users in Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link to="/feedback" className="w-full sm:w-auto">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-8 w-full sm:w-auto">
                Share Your Feedback
              </Button>
            </Link>
            <Link to="/admin-login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="px-4 md:px-8 w-full sm:w-auto">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="shadow-md border-t-4 border-t-emerald-500 h-full">
            <CardContent className="pt-5 md:pt-6">
              <h2 className="text-lg md:text-xl font-bold mb-2">What is Tenga Pesa?</h2>
              <p className="text-sm md:text-base text-gray-600">
                Tenga Pesa is a proposed M-PESA feature designed to help you manage your money more effectively by creating a special savings wallet with customizable withdrawal rules.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-blue-500 h-full">
            <CardContent className="pt-5 md:pt-6">
              <h2 className="text-lg md:text-xl font-bold mb-2">How Does It Work?</h2>
              <p className="text-sm md:text-base text-gray-600">
                You set aside money in a special wallet and create your own rules for when and how you can withdraw it, helping you stick to your financial goals and budget.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-purple-500 h-full sm:col-span-2 md:col-span-1">
            <CardContent className="pt-5 md:pt-6">
              <h2 className="text-lg md:text-xl font-bold mb-2">Why Participate?</h2>
              <p className="text-sm md:text-base text-gray-600">
                Your feedback will help shape the future of financial management tools in Kenya. By sharing your thoughts, you're contributing to creating better financial solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 shadow-md border-none">
          <CardContent className="pt-6 pb-6 px-4 md:pt-8 md:pb-8 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">Ready to share your thoughts?</h2>
                <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                  The survey takes approximately 5 minutes to complete. Your responses will help us understand how we can create better tools to help Kenyans manage their finances.
                </p>
                <Link to="/feedback" className="block w-full sm:inline-block sm:w-auto">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                    Start the Questionnaire
                  </Button>
                </Link>
              </div>
              
              {/* Circle graphic - hidden on mobile, visible from sm breakpoint */}
              <div className="hidden sm:block mx-auto">
                <div className="aspect-square rounded-full bg-gradient-to-br from-emerald-200 to-blue-200 flex items-center justify-center max-w-[200px] md:max-w-none">
                  <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl font-semibold text-emerald-600">Your Opinion</h3>
                      <p className="text-sm md:text-base text-gray-500">Matters</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Small circle for extra small screens - centered */}
              <div className="sm:hidden mx-auto mt-4">
                <div className="aspect-square rounded-full bg-gradient-to-br from-emerald-200 to-blue-200 flex items-center justify-center w-24">
                  <div className="w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <h3 className="text-base font-semibold text-emerald-600">Your</h3>
                      <p className="text-xs text-gray-500">Opinion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
