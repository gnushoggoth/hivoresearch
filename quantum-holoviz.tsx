import React, { useState, useEffect, useRef } from 'react';
import { Zap, Box, Wifi, Cpu } from 'lucide-react';
import * as d3 from 'd3';

const QuantumHoloViz = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [quantumState, setQuantumState] = useState(0);
  
  // Animation frame control
  useEffect(() => {
    let frameId;
    let particles = Array(200).fill().map(() => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2
    }));

    const animate = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Update quantum state
      setQuantumState(prev => (prev + 0.01) % (Math.PI * 2));

      // Draw quantum field lines
      const drawField = () => {
        ctx.beginPath();
        for (let i = 0; i < dimensions.width; i += 20) {
          ctx.moveTo(i, 0);
          for (let j = 0; j < dimensions.height; j += 10) {
            const angle = quantumState + (i * j) / 5000;
            ctx.lineTo(
              i + Math.cos(angle) * 10,
              j + Math.sin(angle) * 10
            );
          }
        }
        ctx.strokeStyle = `hsla(${(quantumState * 180 / Math.PI) % 360}, 70%, 50%, 0.1)`;
        ctx.stroke();
      };

      // Particle system
      particles.forEach(particle => {
        particle.y = (particle.y + particle.speed) % dimensions.height;
        const hue = (particle.y / dimensions.height * 360 + quantumState * 180 / Math.PI) % 360;
        
        ctx.beginPath();
        ctx.arc(
          particle.x + Math.sin(quantumState + particle.phase) * 10,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
        ctx.fill();
      });

      drawField();
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [dimensions]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Holographic Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      />

      {/* Interface Overlay */}
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Quantum Stats */}
          <div className="backdrop-blur-lg bg-black/30 p-6 rounded-lg border border-cyan-500/30">
            <h3 className="text-cyan-400 font-mono mb-4 flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              QUANTUM METRICS
            </h3>
            <div className="space-y-2 text-sm font-mono text-cyan-300/80">
              <div className="flex justify-between">
                <span>COHERENCE</span>
                <span>{(Math.sin(quantumState) * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>ENTANGLEMENT</span>
                <span>{(Math.cos(quantumState) * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>PHASE SHIFT</span>
                <span>{(quantumState * 180 / Math.PI).toFixed(2)}°</span>
              </div>
            </div>
          </div>

          {/* System Monitor */}
          <div className="backdrop-blur-lg bg-black/30 p-6 rounded-lg border border-fuchsia-500/30">
            <h3 className="text-fuchsia-400 font-mono mb-4 flex items-center">
              <Box className="w-4 h-4 mr-2" />
              SYSTEM STATUS
            </h3>
            <div className="space-y-2 text-sm font-mono text-fuchsia-300/80">
              <div>HOLOVIZ ENGINE: ACTIVE</div>
              <div>QUANTUM CORE: STABLE</div>
              <div>REALITY ANCHOR: SECURE</div>
            </div>
          </div>

          {/* Network Status */}
          <div className="backdrop-blur-lg bg-black/30 p-6 rounded-lg border border-emerald-500/30">
            <h3 className="text-emerald-400 font-mono mb-4 flex items-center">
              <Wifi className="w-4 h-4 mr-2" />
              NETWORK STATUS
            </h3>
            <div className="space-y-2 text-sm font-mono text-emerald-300/80">
              <div>NODES: 7 ACTIVE</div>
              <div>BANDWIDTH: OPTIMAL</div>
              <div>LATENCY: 0.13ms</div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="mt-8 backdrop-blur-lg bg-black/30 p-6 rounded-lg border border-purple-500/30">
          <div className="font-mono text-purple-300/80 text-sm">
            <div>QUANTUM FIELD VISUALIZATION ACTIVE</div>
            <div>PARTICLE SYSTEM ENGAGED</div>
            <div>HOLOGRAPHIC MATRIX STABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumHoloViz;