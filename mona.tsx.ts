import React, { useState, useEffect, useRef } from 'react';

const ASCIIArtGenerator = () => {
  // Characters ordered by visual density
  const densityMap = '@GPPP5557777333JJJSSS@@@@';
  const [artSize, setArtSize] = useState({ width: 80, height: 40 });
  
  const generateAsciiFrame = () => {
    let art = [];
    const centerX = artSize.width / 2;
    const centerY = artSize.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    for (let y = 0; y < artSize.height; y++) {
      let line = '';
      for (let x = 0; x < artSize.width; x++) {
        // Calculate distance from center for circle effect
        const dx = (x - centerX) / radius;
        const dy = (y - centerY) / (radius * 0.7); // Squash vertically
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create skull-like shape
        const skullShape = Math.sin(distance * Math.PI) * 
                         Math.cos(dx * 2) * 
                         Math.sin(dy * 2);
        
        // Map the shape value to character density
        const index = Math.floor(
          Math.max(0, Math.min(0.99, (skullShape + 1) / 2)) * 
          densityMap.length
        );
        
        line += densityMap[index] || ' ';
      }
      art.push(line);
    }
    return art;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-black text-green-500">
      <pre className="font-mono text-[0.5em] leading-[0.8] whitespace-pre select-none">
        {generateAsciiFrame().join('\n')}
      </pre>
      
      <div className="mt-4 flex gap-4 justify-center">
        <button 
          className="px-4 py-2 bg-green-900 text-green-300 rounded hover:bg-green-800"
          onClick={() => setArtSize(prev => ({
            width: prev.width + 10,
            height: prev.height + 5
          }))}
        >
          Increase Size
        </button>
        <button 
          className="px-4 py-2 bg-green-900 text-green-300 rounded hover:bg-green-800"
          onClick={() => setArtSize(prev => ({
            width: Math.max(20, prev.width - 10),
            height: Math.max(10, prev.height - 5)
          }))}
        >
          Decrease Size
        </button>
      </div>
    </div>
  );
};

export default ASCIIArtGenerator;