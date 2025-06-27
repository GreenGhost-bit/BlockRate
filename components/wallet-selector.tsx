// components/wallet-selector.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Smartphone, Globe, Shield } from "lucide-react"

interface WalletOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  downloadUrl: string
  isInstalled: () => boolean
  connect: () => Promise<boolean>
}

export function WalletSelector({ onConnect }: { onConnect: (walletId: string) => void }) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const wallets: WalletOption[] = [
    {
      id: "algosigner",
      name: "AlgoSigner",
      description: "Browser extension wallet with advanced features",
      icon: <Globe className="w-6 h-6" />,
      downloadUrl: "https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm",
      isInstalled: () => typeof window !== 'undefined' && !!window.AlgoSigner,
      connect: async () => {
        try {
          await window.AlgoSigner.connect()
          return true
        } catch (error) {
          console.error("AlgoSigner connection failed:", error)
          return false
        }
      }
    },
    {
      id: "pera",
      name: "Pera Wallet",
      description: "Mobile-first wallet with seamless DApp integration",
      icon: <Smartphone className="w-6 h-6" />,
      downloadUrl: "https://perawallet.app/",
      isInstalled: () => typeof window !== 'undefined' && !!window.PeraWallet,
      connect: async () => {
        try {
          const PeraWalletConnect = (await import("@perawallet/connect")).PeraWalletConnect
          const peraWallet = new PeraWalletConnect()
          await peraWallet.connect()
          return true
        } catch (error) {
          console.error("Pera Wallet connection failed:", error)
          return false
        }
      }
    },
    {
      id: "defly",
      name: "Defly Wallet",
      description: "Advanced DeFi wallet with portfolio management",
      icon: <Shield className="w-6 h-6" />,
      downloadUrl: "https://defly.app/",
      isInstalled: () => typeof window !== 'undefined' && !!window.DeflyWalletConnect,
      connect: async () => {
        try {
          const DeflyWalletConnect = (await import("@blockshake/defly-connect")).DeflyWalletConnect
          const deflyWallet = new DeflyWalletConnect()
          await deflyWallet.connect()
          return true
        } catch (error) {
          console.error("Defly Wallet connection failed:", error)
          return false
        }
      }
    }
  ]

  const handleConnect = async (wallet: WalletOption) => {
    setIsConnecting(wallet.id)
    const success = await wallet.connect()
    if (success) {
      onConnect(wallet.id)
    }
    setIsConnecting(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {wallets.map((wallet) => {
        const isInstalled = wallet.isInstalled()
        const isLoading = isConnecting === wallet.id

        return (
          <Card key={wallet.id} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-slate-700 rounded-full w-fit">
                {wallet.icon}
              </div>
              <CardTitle className="text-lg">{wallet.name}</CardTitle>
              <CardDescription className="text-sm">{wallet.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {isInstalled ? (
                <Button
                  onClick={() => handleConnect(wallet)}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Connecting..." : "Connect"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center">
                    Not Installed
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(wallet.downloadUrl, '_blank')}
                  >
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}