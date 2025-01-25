{
  "files": {
    "package.json": {
      "name": "signal-drift-remix",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start"
      },
      "dependencies": {
        "next": "^13.5.4",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "tailwindcss": "^3.3.3"
      }
    },
    "pages/index.js": `import React, { useState } from 'react';
import Head from 'next/head';

export default function SignalDriftRemix() {
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const remixCategories = [
    'Media Hijack', 
    'Sonic Détournement', 
    'Copyright Violation'
  ];

  const glitchEffect = {
    filter: `contrast(${100 + glitchIntensity * 50}%) 
             brightness(${100 + glitchIntensity * 20}%) 
             hue-rotate(${glitchIntensity * 180}deg)`,
    transition: 'all 0.3s ease-in-out'
  };

  return (
    <div 
      className="min-h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundColor: \`rgba(0,0,0,\${1 - glitchIntensity * 0.3})\`,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Head>
        <title>Signal Drift Remix</title>
        <meta name="description" content="Unauthorized transmissions and media cannibalism" />
      </Head>
      
      <main className="container mx-auto px-4 py-16">
        <header 
          className="text-center mb-12"
          style={glitchEffect}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 break-words">
            SIGNAL DRIFT REMIX
          </h1>
          <p className="mt-4 text-xl text-gray-300 opacity-80">
            Unauthorized Transmissions & Media Cannibalism
          </p>
        </header>
        
        <section 
          className="grid md:grid-cols-3 gap-8"
          style={{ opacity: 1 - glitchIntensity * 0.5 }}
        >
          {remixCategories.map((category) => (
            <div 
              key={category} 
              className="bg-gray-900 border border-red-800 p-6 rounded-lg transform transition-all duration-300 hover:rotate-2"
              style={{
                boxShadow: \`0 0 \${20 + glitchIntensity * 50}px rgba(255,0,0,0.5)\`,
                transform: \`rotate(\${glitchIntensity * 10}deg)\`
              }}
            >
              <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                {category}
              </h2>
              <p className="text-gray-300">
                Tactical media intervention through {category.toLowerCase()}.
              </p>
            </div>
          ))}
        </section>

        <div className="mt-12 text-center">
          <label 
            htmlFor="glitch-slider" 
            className="block mb-4 text-gray-500"
          >
            Media Disruption Intensity
          </label>
          <input 
            type="range" 
            id="glitch-slider"
            min="0" 
            max="1" 
            step="0.1" 
            value={glitchIntensity}
            onChange={(e) => setGlitchIntensity(parseFloat(e.target.value))}
            className="w-full max-w-md"
          />
        </div>
      </main>
      
      <footer className="text-center py-8 bg-gray-900 bg-opacity-50">
        <p className="text-gray-500 text-sm">
          © 2024 Unauthorized Transmission Network. All rights scrambled.
        </p>
      </footer>
    </div>
  );
}`,
    "tailwind.config.js": `module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'glitch-shake': 'glitch 1s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, -2px)' },
          '20%': { transform: 'translate(2px, 2px)' },
          '30%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' }
        }
      }
    },
  },
  plugins: [],
}`
  }
}
