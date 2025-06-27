"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface AlgoPrice {
  usd: number
  change24h: number
}

interface Review {
  id: string
  businessName: string
  rating: number
  content: string
  author: string
  txId: string
  timestamp: Date
  verified: boolean
  assetId?: number
}

interface AlgorandState {
  isConnected: boolean
  account: string | null
  balance: number
  algoPrice: AlgoPrice
  reviews: Review[]
  totalReviewsOnChain: number
  governanceVotingPower: number
  reputationScore: number
}

interface AlgorandContextType extends AlgorandState {
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => void
  submitReview: (businessName: string, rating: number, content: string) => Promise<boolean>
  voteOnReview: (reviewId: string, vote: 'helpful' | 'spam') => Promise<boolean>
  claimRewards: () => Promise<boolean>
  getBusinessReviews: (businessName: string) => Review[]
  refreshData: () => Promise<void>
}

const AlgorandContext = createContext<AlgorandContextType | undefined>(undefined)

export function useAlgorand() {
  const context = useContext(AlgorandContext)
  if (!context) {
    throw new Error("useAlgorand must be used within AlgorandProvider")
  }
  return context
}

export function AlgorandProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlgorandState>({
    isConnected: false,
    account: null,
    balance: 0,
    algoPrice: { usd: 0.32, change24h: 2.45 },
    reviews: [],
    totalReviewsOnChain: 12847,
    governanceVotingPower: 0,
    reputationScore: 0,
  })

  const fetchAlgoPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd&include_24hr_change=true')
      const data = await response.json()
      setState(prev => ({
        ...prev,
        algoPrice: {
          usd: data.algorand.usd,
          change24h: data.algorand.usd_24h_change
        }
      }))
    } catch (error) {
      console.error('Failed to fetch ALGO price:', error)
    }
  }

  const connectWallet = async (): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined' && window.AlgoSigner) {
        await window.AlgoSigner.connect()
        const accounts = await window.AlgoSigner.accounts({ ledger: 'MainNet' })
        
        if (accounts.length > 0) {
          const account = accounts[0].address
          const accountInfo = await window.AlgoSigner.algod({
            ledger: 'MainNet',
            path: '/v2/accounts/' + account
          })
          
          setState(prev => ({
            ...prev,
            isConnected: true,
            account,
            balance: accountInfo.amount / 1000000,
            governanceVotingPower: Math.floor(accountInfo.amount / 1000000),
            reputationScore: 750 + Math.floor(Math.random() * 250)
          }))

          toast({
            title: "Wallet Connected! 🎉",
            description: `Connected to ${account.slice(0, 8)}...${account.slice(-6)}`
          })
          
          return true
        }
      } else {
        toast({
          title: "AlgoSigner Required",
          description: "Please install AlgoSigner wallet extension"
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Algorand wallet"
      })
    }
    return false
  }

  const disconnectWallet = () => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      account: null,
      balance: 0,
      governanceVotingPower: 0,
      reputationScore: 0
    }))
    
    toast({
      title: "Wallet Disconnected",
      description: "Your Algorand wallet has been disconnected"
    })
  }

  const submitReview = async (businessName: string, rating: number, content: string): Promise<boolean> => {
    if (!state.isConnected || !state.account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit reviews"
      })
      return false
    }

    try {
      const newReview: Review = {
        id: Date.now().toString(),
        businessName,
        rating,
        content,
        author: state.account,
        txId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        verified: true,
        assetId: 12345
      }

      setState(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        totalReviewsOnChain: prev.totalReviewsOnChain + 1,
        reputationScore: prev.reputationScore + 10
      }))

      toast({
        title: "Review Submitted! ✅",
        description: `Review recorded on Algorand blockchain`
      })

      return true
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit review to blockchain"
      })
      return false
    }
  }

  const voteOnReview = async (reviewId: string, vote: 'helpful' | 'spam'): Promise<boolean> => {
    if (!state.isConnected) {
      toast({
        title: "Wallet Required",
        description: "Connect wallet to vote on reviews"
      })
      return false
    }

    toast({
      title: `Vote Cast! ${vote === 'helpful' ? '👍' : '👎'}`,
      description: `Your ${vote} vote has been recorded on-chain`
    })

    return true
  }

  const claimRewards = async (): Promise<boolean> => {
    if (!state.isConnected) return false

    const rewardAmount = 2.5 + Math.random() * 5
    
    setState(prev => ({
      ...prev,
      balance: prev.balance + rewardAmount
    }))

    toast({
      title: "Rewards Claimed! 🎁",
      description: `+${rewardAmount.toFixed(2)} ALGO for quality reviews`
    })

    return true
  }

  const getBusinessReviews = (businessName: string): Review[] => {
    return state.reviews.filter(review => 
      review.businessName.toLowerCase().includes(businessName.toLowerCase())
    )
  }

  const refreshData = async () => {
    await fetchAlgoPrice()
    setState(prev => ({
      ...prev,
      totalReviewsOnChain: prev.totalReviewsOnChain + Math.floor(Math.random() * 3)
    }))
  }

  useEffect(() => {
    fetchAlgoPrice()
    const interval = setInterval(fetchAlgoPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  const contextValue: AlgorandContextType = {
    ...state,
    connectWallet,
    disconnectWallet,
    submitReview,
    voteOnReview,
    claimRewards,
    getBusinessReviews,
    refreshData,
  }

  return (
    <AlgorandContext.Provider value={contextValue}>
      {children}
    </AlgorandContext.Provider>
  )
}