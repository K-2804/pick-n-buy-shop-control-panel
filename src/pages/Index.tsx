
import React from 'react';
import AuthForm from '@/components/AuthForm';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Left side with image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-auth-pattern" />
      
      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mx-auto mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <span className="bg-picknpay-purple text-white text-2xl font-bold rounded-md p-2">P&P</span>
            <h1 className="text-3xl font-bold ml-3">Pick-n-Pay</h1>
          </div>
          <p className="text-gray-600">Shop Owner Dashboard</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default Index;
