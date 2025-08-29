import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="fullscreen-section gradient-bg">
      <div className="text-center max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto mb-8 bg-white rounded-full shadow-2xl flex items-center justify-center animate-pulse-soft">
            <svg 
              className="w-24 h-24 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            Получите права быстро и легально
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Оформление водительского удостоверения любой категории с гарантией подлинности
          </p>
          
          <button
            onClick={onNext}
            className="btn-primary text-lg px-8 py-4 group relative overflow-hidden"
          >
            <span className="relative z-10">Начать оформление</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
        
        <div className="animate-bounce mt-16">
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-sm mb-2">Узнать больше</span>
            <ChevronDownIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
