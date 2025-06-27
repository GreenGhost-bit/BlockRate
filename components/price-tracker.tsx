"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useAlgorand } from "./algorand-provider"

export function PriceTracker() {
  const { algoPrice, totalReviewsOnChain } = useAlgorand()
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-2 px-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-medium">ALGO</span>
            <span className="font-bold">${algoPrice.usd.toFixed(4)}</span>
            <span className={`flex items-center text-xs ${algoPrice.change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {algoPrice.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(algoPrice.change24h).toFixed(2)}%
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3" />
            <span className="text-xs">
              <span className="font-semibold">{totalReviewsOnChain.toLocaleString()}</span> Reviews On-Chain
            </span>
          </div>
          
          <div className="hidden md:block text-xs opacity-75">
            Powered by Algorand Blockchain • Instant finality • Low fees
          </div>
        </div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/70 hover:text-white text-xs"
        >
          
        </button>
      </div>
    </div>
  )
}