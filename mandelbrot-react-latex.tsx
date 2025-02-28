import React, { useState, useRef, useEffect } from 'react';

// Mandelbrot set calculation function
const calculateMandelbrot = (width, height, maxIter) => {
  const imageData = new Uint8ClampedArray(width * height * 4);
  
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Map pixel coordinates to complex plane
      const x0 = (px / width) * 4 - 2;
      const y0 = (py / height) * 4 - 2;
      
      let x = 0;
      let y = 0;
      let iteration = 0;
      
      while (x*x + y*y <= 4 && iteration < maxIter) {
        const xTemp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = xTemp;
        iteration++;
      }
      
      // Color mapping
      const index = (py * width + px) * 4;
      if (iteration === maxIter) {
        // Inside the set (black)
        imageData[index] = 0;
        imageData[index + 1] = 0;
        imageData[index + 2] = 0;
      } else {
        // Outside the set (colorful)
        const hue = iteration / maxIter;
        const rgb = hslToRgb(hue, 1, 0.5);
        
        imageData[index] = rgb[0];
        imageData[index + 1] = rgb[1];
        imageData[index + 2] = rgb[2];
      }
      imageData[index + 3] = 255; // Full opacity
    }
  }
  
  return imageData;
};

// Helper function to convert HSL to RGB
const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const hueToRgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
};

// Main React Component
const MandelbrotExplorer = () => {
  const canvasRef = useRef(null);
  const [maxIterations, setMaxIterations] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Calculate and render Mandelbrot set
    const imageData = calculateMandelbrot(canvas.width, canvas.height, maxIterations);
    const canvasImageData = new ImageData(imageData, canvas.width, canvas.height);
    ctx.putImageData(canvasImageData, 0, 0);
  }, [maxIterations]);

  return (
    <div className="mandelbrot-container">
      <h1>Mandelbrot Set Exploration</h1>
      
      {/* Mathematical Description */}
      <div className="math-explanation">
        <h2>The Mathematical Foundation</h2>
        
        <p>The Mandelbrot set is defined by the iterative complex function:</p>
        
        <div className="math-block">
          z<sub>n+1</sub> = z<sub>n</sub><sup>2</sup> + c
        </div>
        
        <p>Where:</p>
        <ul>
          <li>z<sub>0</sub> = 0</li>
          <li>c is a complex number representing each point in the plane</li>
        </ul>
        
        <p>The set is defined by the points c for which the function does not diverge when iterated from z<sub>0</sub> = 0.</p>
      </div>
      
      {/* Visualization Controls */}
      <div className="visualization-controls">
        <label>
          Max Iterations: {maxIterations}
          <input 
            type="range" 
            min="50" 
            max="500" 
            value={maxIterations}
            onChange={(e) => setMaxIterations(Number(e.target.value))}
          />
        </label>
      </div>
      
      {/* Canvas Visualization */}
      <canvas 
        ref={canvasRef}
        width={600}
        height={400}
        className="mandelbrot-canvas"
      />
      
      {/* Additional Mathematical Insights */}
      <div className="math-details">
        <h3>Interesting Properties</h3>
        <div className="math-block">
          lim<sub>n → ∞</sub> |z<sub>n</sub>| = {"{"}
            bounded if c is in the set,
            unbounded if c is outside the set
          {"}"}
        </div>
        
        <p>The boundary of the Mandelbrot set is known for its infinite complexity and self-similarity.</p>
      </div>
    </div>
  );
};

export default MandelbrotExplorer;
