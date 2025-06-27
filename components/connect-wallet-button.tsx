"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { useAlgorand } from "./algorand-provider"

interface ConnectWalletButtonProps {
  size?: "default" | "lg" | "sm"
}

export function ConnectWalletButton({ size = "default" }: ConnectWalletButtonProps) {
  const { isConnected, account, balance, connectWallet, disconnectWallet } = useAlgorand()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await connectWallet()
    setIsConnecting(false)
  }

  if (isConnected && account) {
    return (
      <Button 
        onClick={disconnectWallet}
        variant="outline" 
        size={size}
        className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {account.slice(0, 6)}...{account.slice(-4)} ({balance.toFixed(2)} ALGO)
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={isConnecting}
      size={size}
      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Algorand Wallet
        </>
      )}
    </Button>
  )
}