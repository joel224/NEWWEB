import React from 'react';

const CuteBall = () => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leftPillarGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ea2f2f" />
          <stop offset="45%" stopColor="#f43c7b" />
          <stop offset="100%" stopColor="#ff2e93" />
        </linearGradient>

        <linearGradient id="leftFlapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2e93" />
          <stop offset="50%" stopColor="#f43c7b" />
          <stop offset="100%" stopColor="#c5221f" />
        </linearGradient>

        <linearGradient id="centerVGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c5221f" />
          <stop offset="35%" stopColor="#ea4335" />
          <stop offset="70%" stopColor="#e53935" />
          <stop offset="100%" stopColor="#b71c1c" />
        </linearGradient>

        <linearGradient id="rightFlapGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c5221f" />
          <stop offset="35%" stopColor="#ea4335" />
          <stop offset="65%" stopColor="#ff7043" />
          <stop offset="100%" stopColor="#ffca28" />
        </linearGradient>

        <linearGradient id="rightPillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9ccc65" />
          <stop offset="15%" stopColor="#34a853" />
          <stop offset="45%" stopColor="#00e5ff" />
          <stop offset="80%" stopColor="#2979ff" />
          <stop offset="100%" stopColor="#1565c0" />
        </linearGradient>

        <filter id="premiumShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="-0.6" dy="1.2" stdDeviation="1.0" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* Main Ball Body */}
      

     
    <path 
        d="M 18 20 Q 100 127 102 5" 
        fill="none" 
        stroke="url(#leftPillarGrad)" 
        strokeWidth="0.2" 
        strokeLinecap="round" 
      />
       <path 
        d="M -18 -20 Q -100 127 102 5" 
        fill="none" 
        stroke="url(#rightPillarGrad)" 
        strokeWidth="0.2" 
        strokeLinecap="round" 
      />
       <path 
        d="M 208 20 Q 100 127 102 5" 
        fill="none" 
        stroke="url(#leftPillarGrad)" 
        strokeWidth="0.2" 
        strokeLinecap="round" 
      />
        <path 
        d="M 608 20 Q 200 127 102 5" 
        fill="none" 
        stroke="url(#rightPillarGrad)" 
        strokeWidth="0.2" 
        strokeLinecap="round" 
      />
      {/* Small Tiny Smile */}
      <path 
        d="M 88 115 Q 100 127 112 115" 
        fill="none" 
        stroke="url(#rightPillarGrad)" 
        strokeWidth="0.9" 
        strokeLinecap="round" 
      />
      

       
    </svg>
  );
};

export default CuteBall;