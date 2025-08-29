import React from 'react';
import ApplicationForm from '../components/ApplicationForm';

const MainApplication: React.FC = () => {
  const handleShowPayment = () => {
    // Handle payment logic here
    console.log('Payment initiated');
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar">
      <div className="h-full bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <ApplicationForm onSubmit={handleShowPayment} />
        </div>
      </div>
    </div>
  );
};

export default MainApplication;
