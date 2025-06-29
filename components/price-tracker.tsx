"use client"

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export function PriceTracker() {
  const [algoPrice, setAlgoPrice] = useState(0.23);
  const [change, setChange] = useState(5.2);

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      const newPrice = 0.23 + (Math.random() - 0.5) * 0.02;
      const newChange = (Math.random() - 0.5) * 10;
      setAlgoPrice(Number(newPrice.toFixed(4)));
      setChange(Number(newChange.toFixed(2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/80 border-b border-slate-700 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">ALGO:</span>
            <span className="text-white font-mono">${algoPrice}</span>
            <span className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className="w-3 h-3" />
              <span>{change >= 0 ? '+' : ''}{change}%</span>
            </span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Live from Algorand Network</span>
        </div>
      </div>
    </div>
  );
}