import React, { useState, useEffect } from 'react';
import { Terminal, Database, Network } from 'lucide-react';

const ArchiveInterface = () => {
  const [systemTime, setSystemTime] = useState(Date.now());
  const [accessCode, setAccessCode] = useState('');
  const [quantumState, setQuantumState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(Date.now());
      setQuantumState(prev => (prev + 1) % 256);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono overflow-hidden p-4">
      {/* System Header */}
      <header className="border border-green-500 p-4 mb-8">
        <div className="flex justify-between items-center">
          <div>QUANTUM ARCHIVE SYSTEM [v2.5.9]</div>
          <div>{new Date(systemTime).toISOString()}</div>
        </div>
        <div className="mt-2 text-xs">
          ACCESS LEVEL: RESTRICTED || NODE: QUANTUM.7.b || PROTOCOL: SECURE
        </div>
      </header>

      {/* Main Terminal */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* Left Column - System Stats */}
        <div className="col-span-3 border border-green-500 p-4">
          <Terminal className="w-6 h-6 mb-4" />
          <div className="space-y-2 text-xs">
            <div>QUANTUM STATE: {quantumState.toString(16).padStart(2, '0')}</div>
            <div>ENTROPY: {(Math.sin(quantumState * 0.01) * 100).toFixed(2)}%</div>
            <div>COHERENCE: MAINTAINED</div>
            <div>WAVEFRONT: STABLE</div>
          </div>
        </div>

        {/* Center Column - Main Display */}
        <div className="col-span-6 border border-green-500 p-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl mb-4">[QUANTUM CONSCIOUSNESS ENGINE]</h1>
            <div className="text-xs opacity-75 mb-4">
              AUTHORIZED ACCESS ONLY - MONITORING ACTIVE
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span>SYSTEM INTEGRITY:</span>
              <span className="text-green-400">
                {'[' + '='.repeat(20) + ']'} 100%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>QUANTUM BUFFER:</span>
              <span className="text-green-400">
                {'[' + '='.repeat(16) + '-'.repeat(4) + ']'} 82%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>ENTANGLEMENT:</span>
              <span className="text-green-400">
                {'[' + '='.repeat(18) + '-'.repeat(2) + ']'} 92%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Network Status */}
        <div className="col-span-3 border border-green-500 p-4">
          <Network className="w-6 h-6 mb-4" />
          <div className="space-y-2 text-xs">
            <div>NODES ACTIVE: 7</div>
            <div>NETWORK: SECURE</div>
            <div>PING: 0.13ms</div>
            <div>UPTIME: 768h</div>
          </div>
        </div>
      </div>

      {/* Bottom Terminal */}
      <div className="border border-green-500 p-4">
        <div className="flex items-center mb-4">
          <Database className="w-4 h-4 mr-2" />
          <span>TERMINAL ACCESS</span>
        </div>
        <div className="font-mono text-sm space-y-1">
          <div>> quantum.consciousness.initialize()</div>
          <div className="opacity-75">[OK] Engine initialized</div>
          <div>> quantum.buffer.verify()</div>
          <div className="opacity-75">[OK] Buffer stable</div>
          <div className="flex items-center">
            <span>></span>
            <span className="w-2 h-4 bg-green-500 ml-2 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* System Messages */}
      <div className="fixed top-0 right-0 p-4 text-xs opacity-75">
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ opacity: 1 - (i * 0.2) }}>
            [SYSTEM] Quantum state verified - {(systemTime - (i * 1000)).toString(16)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchiveInterface;