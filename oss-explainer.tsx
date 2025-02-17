import React, { useState } from 'react';
import { Terminal, Zap, Globe, Lock, Unlock, Users, Code, Network, Radio, Cpu, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OSSExplainer = () => {
  const [networkNodes, setNetworkNodes] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(false);

  const handleNetworkGrow = () => {
    setNetworkNodes(prev => Math.min(prev + 1, 4));
    setPulseEffect(true);
    setTimeout(() => setPulseEffect(false), 500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-900">
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-cyan-500/30">
        <CardHeader className="border-b border-cyan-500/20">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-cyan-400">
            <Terminal className="text-fuchsia-500" /> OPEN_SOURCE.SYS: Digital Liberation Protocol
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Interactive Network Visualization */}
          <div className="border border-cyan-500/30 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-800/50 
                          transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
               onClick={handleNetworkGrow}>
            <div className="flex items-center gap-4 mb-4">
              <Cpu className={`w-8 h-8 ${networkNodes > 0 ? 'text-fuchsia-500' : 'text-slate-600'}`} />
              <h3 className="text-lg font-mono text-cyan-400">NET.MESH_PROTOCOL</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} 
                     className={`h-16 flex items-center justify-center rounded border-2 
                     ${i < networkNodes 
                       ? 'border-fuchsia-500 bg-fuchsia-900/20' 
                       : 'border-slate-700 border-dashed'}`}>
                  {i < networkNodes && (
                    <Radio className={`text-fuchsia-500 ${pulseEffect ? 'animate-ping' : 'animate-pulse'}`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-cyan-300/70 font-mono text-sm">
              [SYS]: NODE_INJECTION_READY... Click to expand the network.
              {networkNodes === 4 && " MESH_COMPLETE: Maximum node saturation achieved."}
            </p>
          </div>

          {/* Core Concepts */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="text-fuchsia-500" />
                  <h3 className="font-mono text-cyan-400">SOURCE_ACCESS = PUBLIC</h3>
                </div>
                <p className="text-slate-300 font-mono text-sm">Digital algorithms: open for inspection, modification, and redistribution. The code flows freely through the network.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-fuchsia-500" />
                  <h3 className="font-mono text-cyan-400">COLLECTIVE_OVERRIDE</h3>
                </div>
                <p className="text-slate-300 font-mono text-sm">United against corporate control. When we connect, we build systems that serve all users, not just the privileged elite.</p>
              </CardContent>
            </Card>
          </div>

          {/* Net Neutrality Connection */}
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Network className="text-fuchsia-500" />
                <h3 className="font-mono text-cyan-400">NET_NEUTRALITY.PROTECT</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-l-2 border-red-500/30 pl-4">
                  <div className="flex-shrink-0">
                    <Lock className="text-red-500" />
                  </div>
                  <p className="text-slate-300 font-mono text-sm">WARNING: Proprietary protocols detected - traffic manipulation in progress</p>
                </div>
                <div className="flex items-center gap-4 border-l-2 border-fuchsia-500/30 pl-4">
                  <div className="flex-shrink-0">
                    <Shield className="text-fuchsia-500" />
                  </div>
                  <p className="text-slate-300 font-mono text-sm">SOLUTION: Open source guardians maintain network equality - all packets are equal</p>
                </div>
                <div className="flex items-center gap-4 border-l-2 border-cyan-500/30 pl-4">
                  <div className="flex-shrink-0">
                    <Zap className="text-cyan-400" />
                  </div>
                  <p className="text-slate-300 font-mono text-sm">ACTION: Join the resistance. Build tools that keep the network free.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10">
            <p className="text-cyan-400 font-mono">
              <span className="text-fuchsia-500">[SYS]:</span> The network is built by us all. Each contribution strengthens our digital autonomy. 
              <span className="text-fuchsia-500 animate-pulse"> █</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OSSExplainer;