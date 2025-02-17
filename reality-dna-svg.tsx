import React from 'react';

const RealityDNA: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8B0000"/>
        <stop offset=".5" stop-color="#FF8C00"/>
        <stop offset="1" stop-color="#FFD700"/>
      </linearGradient>
      <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1E90FF"/> 
        <stop offset=".5" stop-color="#9400D3"/>
        <stop offset="1" stop-color="#000080"/>
      </linearGradient>
      <filter id="displacementFilter">
        <feTurbulence type="turbulence" baseFrequency="0.05"
            numOctaves="2" result="turbulence"/>
        <feDisplacementMap in2="turbulence" in="SourceGraphic"
            scale="20" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="black"/>

    <g filter="url(#displacementFilter)">
      <g transform="translate(400,300) scale(3,3) translate(-50,-50)">
        <path fill="url(#grad1)" d="M50 0 A50 50, 0, 0 0, 100 50 L50 100 L0 50 Z"/>
        <path fill="url(#grad2)" d="M50 0 A50 50, 0, 0 1, 0 50 L50 100 L100 50 Z"/>
        <circle cx="50" cy="50" r="25" fill="white"/>
      </g>
    </g>

    <text x="400" y="200" text-anchor="middle" fill="#FFD700" font-size="24">
      Reality DNA
    </text>
    <text x="400" y="550" text-anchor="middle" fill="#87CEEB" font-size="18">
      Commercially Available
    </text>
    
    <g fill="none" stroke="white" stroke-width="2">
      <path d="M 100 100 Q 400 50 700 100" />
      <path d="M 100 500 Q 400 550 700 500" /> 
      <path d="M 100 300 Q 250 320 400 300 T 700 300" />
    </g>
  </svg>
);

export default RealityDNA;
