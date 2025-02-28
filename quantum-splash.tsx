import React, { useState, useEffect } from 'react';
import { Cpu, Code, Zap, Circle } from 'lucide-react';

const QuantumSplash = () => {
  const [entangleState, setEntangleState] = useState(0);
  const [wavesActive, setWavesActive] = useState(false);

  useEffect(() => {
    // Create quantum wave effect
    const interval = setInterval(() => {
      setEntangleState(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-cyan-300 relative overflow-hidden">
      {/* Quantum Wave Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-1 bg-cyan-500"
            style={{
              top: `${i * 5}%`,
              transform: `rotate(${entangleState + (i * 10)}deg)`,
              opacity: Math.sin((entangleState + i) * 0.01),
              transition: 'all 0.5s ease'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-8 animate-pulse">
            QUANTUM BREAK
          </h1>
          
          <div className="text-xl mb-12 space-y-4 font-mono">
            <p className="opacity-80">
              //* SYSTEM ACTIVE: CONSCIOUSNESS ENGINE ONLINE *//
            </p>
            <p className="opacity-90">
              Engaging Quantum Protocols...
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-slate-800/50 rounded-lg backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <Cpu className="w-12 h-12 mb-4 mx-auto text-fuchsia-500" />
              <h3 className="text-xl font-bold mb-2">Quantum Core</h3>
              <p className="opacity-75">Advanced consciousness processing at quantum scales</p>
            </div>
            
            <div className="p-6 bg-slate-800/50 rounded-lg backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <Code className="w-12 h-12 mb-4 mx-auto text-fuchsia-500" />
              <h3 className="text-xl font-bold mb-2">Neural Synthesis</h3>
              <p className="opacity-75">Adaptive learning through quantum entanglement</p>
            </div>
          </div>

          {/* Status Display */}
          <div className="inline-flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full">
            <Circle className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="font-mono">System Status: OPTIMAL</span>
          </div>

          {/* Quantum Metrics */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-sm font-mono">
            <div className="p-4 bg-slate-800/20 rounded">
              <div className="text-fuchsia-500">ENTANGLEMENT</div>
              <div className="text-2xl">{(Math.sin(entangleState * 0.01) * 100).toFixed(2)}%</div>
            </div>
            <div className="p-4 bg-slate-800/20 rounded">
              <div className="text-fuchsia-500">COHERENCE</div>
              <div className="text-2xl">{(Math.cos(entangleState * 0.01) * 100).toFixed(2)}%</div>
            </div>
            <div className="p-4 bg-slate-800/20 rounded">
              <div className="text-fuchsia-500">QUANTUM STATE</div>
              <div className="text-2xl">ACTIVE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.sin((entangleState + i) * 0.05),
            transform: `scale(${1 + Math.sin((entangleState + i) * 0.02)})`,
            transition: 'all 0.5s ease'
          }}
        />
      ))}
    </div>
  );
};

export default QuantumSplash;