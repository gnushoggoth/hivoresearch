import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Book, Play, Settings } from 'lucide-react';

const CodeBlock = ({ children }) => (
  <pre className="bg-black/90 p-4 rounded-lg overflow-x-auto text-green-400 font-mono text-sm">
    {children}
  </pre>
);

export default function CUDATutorial() {
  const [activeTab, setActiveTab] = useState('setup');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-thin tracking-wider mb-4">CUDA Differential Solver</h1>
        <p className="text-gray-400 italic">A Journey Through Computational Physics</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings size={16} />
            Setup
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <Book size={16} />
            Theory
          </TabsTrigger>
          <TabsTrigger value="implementation" className="flex items-center gap-2">
            <Code size={16} />
            Implementation
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Play size={16} />
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card className="p-6 bg-black/30 border-gray-800">
            <h2 className="text-2xl font-thin mb-4">Environment Setup</h2>
            <p className="mb-4">First, ensure you have the CUDA toolkit installed:</p>
            <CodeBlock>
              # Check CUDA version
              nvcc --version
              
              # Compile the solver
              nvcc -o diff_solver main.cu -std=c++11
            </CodeBlock>
          </Card>
        </TabsContent>

        <TabsContent value="theory" className="space-y-6">
          <Card className="p-6 bg-black/30 border-gray-800">
            <h2 className="text-2xl font-thin mb-4">Mathematical Foundation</h2>
            <p className="mb-4">The library implements three fundamental differential equations:</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border border-gray-800 rounded-lg">
                <h3 className="text-xl mb-2">Heat Equation</h3>
                <p className="text-gray-400">∂u/∂t = α∇²u</p>
              </div>
              <div className="p-4 border border-gray-800 rounded-lg">
                <h3 className="text-xl mb-2">Wave Equation</h3>
                <p className="text-gray-400">∂²u/∂t² = c²∇²u</p>
              </div>
              <div className="p-4 border border-gray-800 rounded-lg">
                <h3 className="text-xl mb-2">Advection Equation</h3>
                <p className="text-gray-400">∂u/∂t + v∇u = 0</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card className="p-6 bg-black/30 border-gray-800">
            <h2 className="text-2xl font-thin mb-4">Usage Example</h2>
            <CodeBlock>
{`#include "cuda_diff_solver.cuh"
#include <vector>

int main() {
    // Parameters
    const int N = 1000;          // Spatial points
    const float dt = 0.001;      // Time step
    const float dx = 0.01;       // Spatial step
    const float alpha = 0.1;     // Thermal diffusivity
    
    // Create solver
    HeatSolver solver(N, dt, dx, alpha);
    
    // Initial conditions
    std::vector<float> initial(N, 0.0f);
    for(int i = N/4; i < 3*N/4; i++) {
        initial[i] = 1.0f;
    }
    
    // Set initial conditions
    solver.setInitialCondition(initial.data());
    
    // Time evolution
    for(int t = 0; t < 1000; t++) {
        solver.step();
    }
    
    // Get results
    std::vector<float> result(N);
    solver.getSolution(result.data());
    
    return 0;
}`}
            </CodeBlock>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="p-6 bg-black/30 border-gray-800">
            <h2 className="text-2xl font-thin mb-4">Common Applications</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border border-gray-800 rounded-lg">
                <h3 className="text-xl mb-2">Heat Transfer</h3>
                <p className="text-gray-400">Model temperature distribution in materials</p>
                <CodeBlock>
                  HeatSolver heat_solver(1000, 0.001, 0.01, 0.1);
                </CodeBlock>
              </div>
              <div className="p-4 border border-gray-800 rounded-lg">
                <h3 className="text-xl mb-2">Wave Propagation</h3>
                <p className="text-gray-400">Simulate mechanical waves or electromagnetic fields</p>
                <CodeBlock>
                  WaveSolver wave_solver(1000, 0.001, 0.01, 1.0);
                </CodeBlock>
              </div>
              <div className="p-4 border border-gray-800 rounded-lg">
                <h3 className="text-xl mb-2">Fluid Flow</h3>
                <p className="text-gray-400">Study material transport phenomena</p>
                <CodeBlock>
                  AdvectionSolver flow_solver(1000, 0.001, 0.01, 0.5);
                </CodeBlock>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
