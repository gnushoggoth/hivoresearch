import React, { useState, useEffect } from 'react';

const DarkSakuraInteractive = () => {
  // State for interactive elements
  const [moonPhase, setMoonPhase] = useState(0);
  const [blossomCount, setBlossomCount] = useState(5);
  const [symbolRotation, setSymbolRotation] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 400, y: 300 });
  const [isNightIntense, setIsNightIntense] = useState(false);

  // Handle mouse movement to affect wisps
  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setCursorPosition({ x, y });
  };

  // Increment symbol rotation over time
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setSymbolRotation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(rotationInterval);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden"
         onMouseMove={handleMouseMove}>
      
      <svg viewBox="0 0 800 600" className="w-full h-full">
        <defs>
          {/* Ethereal glow filter */}
          <filter id="darkGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Dark gradient for background */}
          <linearGradient id="darkSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: isNightIntense ? '#050008' : '#0a0014'}}/>
            <stop offset="100%" style={{stopColor: isNightIntense ? '#0d001a' : '#1a0033'}}/>
          </linearGradient>

          {/* Blood moon gradient */}
          <radialGradient id="bloodMoon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#ff1a1a'}}/>
            <stop offset="100%" style={{stopColor: '#660000'}}/>
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="800" height="600" fill="url(#darkSky)"/>

        {/* Blood moon that changes with interaction */}
        <circle 
          cx="650" 
          cy="150" 
          r="60" 
          fill="url(#bloodMoon)" 
          filter="url(#darkGlow)"
          opacity={0.5 + (moonPhase * 0.1)}
          onClick={() => setMoonPhase((prev) => (prev + 1) % 5)}
          className="cursor-pointer"
        />

        {/* Ancient symbols that rotate */}
        <g 
          fill="none" 
          stroke="#660033" 
          strokeWidth="1" 
          opacity="0.3" 
          filter="url(#darkGlow)"
          transform={`rotate(${symbolRotation} 400 300)`}>
          <path d="M400,300 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0"/>
          <path d="M400,300 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0"/>
        </g>

        {/* Dynamic falling blossoms */}
        {[...Array(blossomCount)].map((_, i) => (
          <g key={i} filter="url(#darkGlow)">
            <path 
              d="M10,10 Q15,5 20,10 Q25,15 20,20 Q15,25 10,20 Q5,15 10,10" 
              fill="#4d0019"
              opacity="0.7"
              transform={`translate(${200 + (i * 80)}, ${(i * 100) % 600})`}>
              <animateTransform 
                attributeName="transform"
                type="translate"
                values={`${200 + (i * 80)},0; ${180 + (i * 80)},600`}
                dur={`${15 + i}s`}
                repeatCount="indefinite"/>
            </path>
          </g>
        ))}

        {/* Interactive wisps that follow cursor */}
        <circle 
          cx={cursorPosition.x} 
          cy={cursorPosition.y} 
          r="4" 
          fill="#660033" 
          filter="url(#darkGlow)"
          opacity="0.6">
          <animate 
            attributeName="r"
            values="4;6;4"
            dur="2s"
            repeatCount="indefinite"/>
        </circle>
      </svg>

      {/* Interactive controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <button 
          onClick={() => setBlossomCount(prev => Math.min(prev + 1, 10))}
          className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 transition-colors">
          Add Blossom
        </button>
        <button 
          onClick={() => setIsNightIntense(prev => !prev)}
          className="ml-2 px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 transition-colors">
          Toggle Night Intensity
        </button>
      </div>

      {/* Instruction text */}
      <div className="absolute top-4 left-4 text-purple-300 opacity-70">
        <p>Click the moon to change its phase</p>
        <p>Move your cursor to guide the wisps</p>
        <p>Use buttons to add blossoms and deepen the night</p>
      </div>
    </div>
  );
};

export default DarkSakuraInteractive;