
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <Layout>
      <div className="bg-mpesa-green py-20">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tenga Pesa</h1>
          <p className="text-xl md:text-2xl mb-8">Budgeting for a Better M-PESA</p>
          <h2 className="text-lg md:text-xl font-medium">A Smart Spending Feature for the Everyday Kenyan</h2>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Executive Summary</h2>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="mb-4"><strong>Product Name:</strong> Tenga Pesa</p>
              <p className="mb-4"><strong>Goal:</strong> Introduce a budgeting feature in M-PESA that helps users control spending, plan expenses, and increase responsible cash flow management.</p>
              <p className="mb-4"><strong>Problem Solved:</strong> Uncontrolled spending habits among low to medium earners.</p>
              <p className="mb-4"><strong>Safaricom's Benefit:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Improved user retention</li>
                <li>Increased M-PESA float (cash retained longer in system)</li>
                <li>Enriched user experience within the ecosystem</li>
              </ul>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-8 text-center">Problem Statement</h2>
          <Card className="mb-12">
            <CardContent className="pt-6">
              <p className="mb-4">Many Kenyans, especially low to medium income earners, live paycheck to paycheck, spending money impulsively. M-PESA currently lacks a built-in structure to help users plan their expenditure.</p>
              
              <p className="font-bold mb-2">Pain Points:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Salaries are spent within days, even before essentials (e.g., rent) are handled.</li>
                <li>No internal saving or budgeting option inside M-PESA.</li>
                <li>No deterrent for early/impulsive withdrawals.</li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-6">We Value Your Input</h2>
            <p className="mb-8">Help us shape the future of financial management in Kenya by providing your feedback on the Tenga Pesa concept.</p>
            <Link to="/feedback">
              <Button className="bg-mpesa-blue hover:bg-mpesa-darkblue text-lg py-6 px-8">
                Take the Feedback Survey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
