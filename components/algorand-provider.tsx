"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Review {
  id: string;
  businessName: string;
  rating: number;
  content: string;
  author: string;
  txId: string;
  timestamp: Date;
  verified: boolean;
  assetId?: number;
}

interface AlgorandContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  reviews: Review[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  submitReview: (review: Omit<Review, 'id' | 'timestamp' | 'txId' | 'verified'>) => Promise<void>;
}

const AlgorandContext = createContext<AlgorandContextType | undefined>(undefined);

export function AlgorandProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  const connectWallet = async () => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setAddress('ALGO7X8KMNQPABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');
      setBalance(127.5);
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
  };

  const submitReview = async (reviewData: Omit<Review, 'id' | 'timestamp' | 'txId' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      txId: 'TXN' + Math.random().toString(36).substr(2, 12).toUpperCase(),
      verified: true
    };
    
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <AlgorandContext.Provider value={{
      isConnected,
      address,
      balance,
      reviews,
      connectWallet,
      disconnectWallet,
      submitReview
    }}>
      {children}
    </AlgorandContext.Provider>
  );
}

export function useAlgorand() {
  const context = useContext(AlgorandContext);
  if (context === undefined) {
    throw new Error('useAlgorand must be used within an AlgorandProvider');
  }
  return context;
}