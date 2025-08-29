import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-full gradient-bg flex flex-col items-center justify-center relative">
      {/* Police Officer Icon */}
      <div className="mb-16 animate-fade-in">
        <div className="w-40 h-40 mx-auto mb-8 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 shadow-2xl flex items-center justify-center police-icon">
          {/* ДПС Police Officer SVG */}
          <svg 
            className="w-24 h-24 text-white" 
            fill="currentColor" 
            viewBox="0 0 100 100"
          >
            {/* Police Hat */}
            <ellipse cx="50" cy="25" rx="25" ry="8" fill="currentColor" opacity="0.9"/>
            <rect x="25" y="20" width="50" height="10" rx="5" fill="currentColor"/>
            
            {/* Badge on Hat */}
            <circle cx="50" cy="25" r="6" fill="gold" stroke="currentColor" strokeWidth="1"/>
            <text x="50" y="29" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">ДПС</text>
            
            {/* Head */}
            <circle cx="50" cy="45" r="15" fill="currentColor" opacity="0.8"/>
            
            {/* Body */}
            <rect x="35" y="55" width="30" height="35" rx="5" fill="currentColor" opacity="0.7"/>
            
            {/* Arms */}
            <rect x="20" y="60" width="12" height="20" rx="6" fill="currentColor" opacity="0.7"/>
            <rect x="68" y="60" width="12" height="20" rx="6" fill="currentColor" opacity="0.7"/>
            
            {/* Badge on Chest */}
            <rect x="45" y="62" width="10" height="8" rx="2" fill="gold"/>
            <text x="50" y="68" textAnchor="middle" fontSize="4" fill="currentColor" fontWeight="bold">ГИБДД</text>
            
            {/* Legs */}
            <rect x="40" y="85" width="8" height="15" rx="4" fill="currentColor" opacity="0.6"/>
            <rect x="52" y="85" width="8" height="15" rx="4" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            ГИБДД Онлайн
          </h1>
          <p className="text-white/80 text-lg">
            Водительские права
          </p>
        </div>
      </div>
      
      {/* Loading Spinner at Bottom */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full spinner-enhanced"></div>
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">
            Загрузка...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
