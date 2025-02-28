import React, { useState, useEffect } from 'react';
import { Code, FileText, BarChart2, Grid, Terminal } from 'lucide-react';

const LanguageProcessingSystem = () => {
  const [inputText, setInputText] = useState(
    "System access requested. Permission granted. Language processing matrices initialized."
  );
  const [processedTokens, setProcessedTokens] = useState([]);
  const [activeModule, setActiveModule] = useState('tokenize');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [selectedElement, setSelectedElement] = useState(null);
  const [systemLog, setSystemLog] = useState([]);
  const [vizMode, setVizMode] = useState('grid');

  // Add log entry with timestamp
  const addSystemLog = (message) => {
    const timestamp = new Date().toISOString().substr(11, 12);
    setSystemLog(prev => [...prev, { timestamp, message }].slice(-5));
  };

  // Process input
  useEffect(() => {
    if (inputText && inputText.trim() !== '') {
      setProcessingStatus('processing');
      addSystemLog('Initializing language processing routines');
      
      setTimeout(() => {
        const rawTokens = inputText
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
          .split(/\s+/)
          .filter(token => token.length > 0);
          
        // Generate token metadata
        const annotatedTokens = rawTokens.map((token, index) => {
          // Generate pseudo-random but deterministic values
          const hashCode = Array.from(token).reduce(
            (acc, char) => acc * 31 + char.charCodeAt(0), 7
          );
          
          return {
            id: index,
            text: token,
            length: token.length,
            frequency: Math.abs((hashCode % 100) / 100),
            importance: Math.abs((hashCode % 150) / 100) % 1,
            category: determineCategory(token),
            vector: generateVector(token, hashCode),
            coordinates: generateGridCoordinates(index, rawTokens.length)
          };
        });
        
        setProcessedTokens(annotatedTokens);
        setProcessingStatus('complete');
        addSystemLog(`Processed ${annotatedTokens.length} linguistic units`);
      }, 800);
    }
  }, [inputText]);

  // Classify token (deterministic)
  const determineCategory = (token) => {
    const lowerToken = token.toLowerCase();
    const firstChar = lowerToken.charCodeAt(0) || 0;
    
    // Use character code for deterministic but seemingly intelligent categorization
    if (firstChar % 5 === 0) return 'noun';
    if (firstChar % 5 === 1) return 'verb';
    if (firstChar % 5 === 2) return 'adjective';
    if (firstChar % 5 === 3) return 'pronoun';
    return 'function';
  };
  
  // Generate random vector (deterministic)
  const generateVector = (token, seed) => {
    const components = [];
    for (let i = 0; i < 4; i++) {
      components.push(((seed * (i + 1)) % 200 - 100) / 100);
    }
    return components;
  };
  
  // Generate grid coordinates
  const generateGridCoordinates = (index, total) => {
    const gridSize = Math.ceil(Math.sqrt(total));
    return {
      x: index % gridSize,
      y: Math.floor(index / gridSize)
    };
  };

  // Grid rendering parameters
  const renderGridVisualization = () => {
    const gridSize = Math.ceil(Math.sqrt(processedTokens.length));
    const cellSize = 100 / gridSize;
    
    return (
      <div className="relative w-full h-64 bg-black border border-gray-800 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 grid" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(75, 75, 75, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 75, 75, 0.1) 1px, transparent 1px)',
            backgroundSize: `${cellSize}% ${cellSize}%` 
          }}>
        </div>
        
        {/* Tokens */}
        {processedTokens.map((token) => (
          <div 
            key={token.id}
            className="absolute flex items-center justify-center cursor-pointer transition-all duration-300"
            style={{ 
              left: `${token.coordinates.x * cellSize}%`, 
              top: `${token.coordinates.y * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
              transform: selectedElement === token ? 'scale(1.1)' : 'scale(1)',
              zIndex: selectedElement === token ? 10 : 1
            }}
            onClick={() => setSelectedElement(token)}
          >
            <div 
              className="text-center p-1 rounded font-mono text-xs"
              style={{ 
                backgroundColor: `rgba(255, 255, 255, ${0.05 + token.importance * 0.2})`,
                border: `1px solid rgba(255, 255, 255, ${0.1 + token.importance * 0.4})`,
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {token.text}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Vector visualization
  const renderVectorVisualization = () => {
    return (
      <div className="w-full h-64 bg-black border border-gray-800 relative overflow-hidden">
        {/* Coordinate system */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-px bg-gray-800"></div>
          <div className="absolute h-full w-px bg-gray-800"></div>
        </div>
        
        {/* Vector points */}
        {processedTokens.map((token) => (
          <div 
            key={token.id}
            className="absolute w-2 h-2 rounded-full cursor-pointer transition-all duration-300"
            style={{ 
              left: `${50 + token.vector[0] * 40}%`, 
              top: `${50 + token.vector[1] * 40}%`,
              backgroundColor: `rgba(255, 255, 255, ${0.3 + token.importance * 0.7})`,
              boxShadow: selectedElement === token ? `0 0 5px 2px rgba(255, 255, 255, 0.5)` : 'none',
              transform: selectedElement === token ? 'scale(2)' : 'scale(1)',
              zIndex: selectedElement === token ? 10 : 1
            }}
            onClick={() => setSelectedElement(token)}
          />
        ))}
      </div>
    );
  };
  
  // Terminal visualization
  const renderTerminalVisualization = () => {
    return (
      <div className="w-full h-64 bg-black border border-gray-800 font-mono text-xs p-2 overflow-auto">
        <div className="text-gray-400">$ language_processor --input="user_text" --analyze</div>
        <div className="text-gray-600 mt-1">Processing input stream...</div>
        
        {processedTokens.map((token) => (
          <div 
            key={token.id}
            className={`mt-1 cursor-pointer ${selectedElement === token ? 'bg-gray-900' : ''}`}
            onClick={() => setSelectedElement(token)}
          >
            <span className="text-gray-500">[{token.id.toString().padStart(2, '0')}]</span>{' '}
            <span className="text-white">{token.text}</span>{' '}
            <span className="text-gray-600">type={token.category}</span>{' '}
            <span className="text-gray-600">imp={token.importance.toFixed(2)}</span>
          </div>
        ))}
        
        <div className="text-gray-400 mt-2">$ _</div>
      </div>
    );
  };
  
  // Render active visualization
  const renderVisualization = () => {
    if (processingStatus === 'processing') {
      return (
        <div className="w-full h-64 bg-black border border-gray-800 flex items-center justify-center">
          <div className="text-gray-500 font-mono">Processing input stream...</div>
        </div>
      );
    }
    
    if (processedTokens.length === 0) {
      return (
        <div className="w-full h-64 bg-black border border-gray-800 flex items-center justify-center">
          <div className="text-gray-500 font-mono">No data available.</div>
        </div>
      );
    }
    
    switch (vizMode) {
      case 'grid':
        return renderGridVisualization();
      case 'vector':
        return renderVectorVisualization();
      case 'terminal':
        return renderTerminalVisualization();
      default:
        return renderGridVisualization();
    }
  };

  return (
    <div className="bg-gray-950 text-white font-mono p-4 rounded-none border border-gray-800">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
        <div className="text-xs text-gray-400">LANGUAGE PROCESSING SYSTEM v1.02.5</div>
      </div>
      
      {/* Input field */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 mb-1">Input Data Stream:</div>
        <textarea 
          className="w-full bg-black border border-gray-800 rounded-none p-2 text-white text-xs"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      
      {/* Mode selector */}
      <div className="flex mb-3 text-xs gap-px">
        <button 
          className={`px-3 py-1 flex items-center gap-1 ${vizMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-black text-gray-500'}`}
          onClick={() => setVizMode('grid')}
        >
          <Grid size={12} /> GRID
        </button>
        <button 
          className={`px-3 py-1 flex items-center gap-1 ${vizMode === 'vector' ? 'bg-gray-800 text-white' : 'bg-black text-gray-500'}`}
          onClick={() => setVizMode('vector')}
        >
          <BarChart2 size={12} /> VECTOR
        </button>
        <button 
          className={`px-3 py-1 flex items-center gap-1 ${vizMode === 'terminal' ? 'bg-gray-800 text-white' : 'bg-black text-gray-500'}`}
          onClick={() => setVizMode('terminal')}
        >
          <Terminal size={12} /> TERMINAL
        </button>
      </div>
      
      {/* Visualization area */}
      {renderVisualization()}
      
      {/* Selected token details */}
      {selectedElement && (
        <div className="mt-3 p-2 bg-black border border-gray-800 text-xs">
          <div className="flex justify-between">
            <div className="text-gray-400">SELECTED UNIT:</div>
            <div className="text-white">{selectedElement.text}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <div className="text-gray-500">ID:</div>
            <div className="text-white">{selectedElement.id}</div>
            
            <div className="text-gray-500">CATEGORY:</div>
            <div className="text-white">{selectedElement.category.toUpperCase()}</div>
            
            <div className="text-gray-500">LENGTH:</div>
            <div className="text-white">{selectedElement.length}</div>
            
            <div className="text-gray-500">IMPORTANCE:</div>
            <div className="text-white">{selectedElement.importance.toFixed(4)}</div>
            
            <div className="text-gray-500">VECTOR[0:1]:</div>
            <div className="text-white">[{selectedElement.vector.slice(0,2).map(v => v.toFixed(2)).join(', ')}]</div>
          </div>
        </div>
      )}
      
      {/* System log */}
      <div className="mt-3 p-2 bg-black border border-gray-800 text-xs h-24 overflow-y-auto">
        <div className="text-gray-400 mb-1">SYSTEM LOG:</div>
        {systemLog.map((entry, i) => (
          <div key={i} className="text-gray-500">
            <span className="text-gray-600">{entry.timestamp}</span> {entry.message}
          </div>
        ))}
        {systemLog.length === 0 && (
          <div className="text-gray-700">No system activity recorded.</div>
        )}
      </div>
    </div>
  );
};

export default LanguageProcessingSystem;