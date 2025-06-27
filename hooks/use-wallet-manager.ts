// hooks/use-wallet-manager.ts
"use client"

import { useState, useEffect, useCallback } from "react"

interface WalletAccount {
  address: string
  balance: number
  assets: any[]
  name?: string
}

interface WalletManager {
  connectedWallet: string | null
  accounts: WalletAccount[]
  currentAccount: WalletAccount | null
  isConnected: boolean
  connect: (walletId: string) => Promise<boolean>
  disconnect: () => void
  switchAccount: (address: string) => void
  refreshAccounts: () => Promise<void>
}

export function useWalletManager(): WalletManager {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<WalletAccount[]>([])
  const [currentAccount, setCurrentAccount] = useState<WalletAccount | null>(null)

  const connect = useCallback(async (walletId: string): Promise<boolean> => {
    try {
      let accounts: any[] = []
      
      switch (walletId) {
        case "algosigner":
          if (!window.AlgoSigner) return false
          await window.AlgoSigner.connect()
          accounts = await window.AlgoSigner.accounts({ ledger: 'MainNet' })
          break
          
        case "pera":
          const PeraWalletConnect = (await import("@perawallet/connect")).PeraWalletConnect
          const peraWallet = new PeraWalletConnect()
          accounts = await peraWallet.connect()
          break
          
        case "defly":
          const DeflyWalletConnect = (await import("@blockshake/defly-connect")).DeflyWalletConnect
          const deflyWallet = new DeflyWalletConnect()
          accounts = await deflyWallet.connect()
          break
          
        default:
          return false
      }

      if (accounts.length > 0) {
        const formattedAccounts: WalletAccount[] = await Promise.all(
          accounts.map(async (account) => {
            const address = typeof account === 'string' ? account : account.address
            const accountInfo = await getAccountInfo(address)
            return {
              address,
              balance: accountInfo.amount / 1000000,
              assets: accountInfo.assets || [],
              name: `Account ${address.slice(0, 8)}...`
            }
          })
        )

        setConnectedWallet(walletId)
        setAccounts(formattedAccounts)
        setCurrentAccount(formattedAccounts[0])
        
        localStorage.setItem('connectedWallet', walletId)
        localStorage.setItem('walletAccounts', JSON.stringify(formattedAccounts))
        
        return true
      }
      
      return false
    } catch (error) {
      console.error(`Failed to connect to ${walletId}:`, error)
      return false
    }
  }, [])

  const disconnect = useCallback(() => {
    setConnectedWallet(null)
    setAccounts([])
    setCurrentAccount(null)
    localStorage.removeItem('connectedWallet')
    localStorage.removeItem('walletAccounts')
  }, [])

  const switchAccount = useCallback((address: string) => {
    const account = accounts.find(acc => acc.address === address)
    if (account) {
      setCurrentAccount(account)
      localStorage.setItem('currentAccount', address)
    }
  }, [accounts])

  const refreshAccounts = useCallback(async () => {
    if (!connectedWallet || accounts.length === 0) return

    const refreshedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const accountInfo = await getAccountInfo(account.address)
        return {
          ...account,
          balance: accountInfo.amount / 1000000,
          assets: accountInfo.assets || []
        }
      })
    )

    setAccounts(refreshedAccounts)
    
    if (currentAccount) {
      const updatedCurrent = refreshedAccounts.find(acc => acc.address === currentAccount.address)
      if (updatedCurrent) {
        setCurrentAccount(updatedCurrent)
      }
    }
  }, [connectedWallet, accounts, currentAccount])

  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet')
    const savedAccounts = localStorage.getItem('walletAccounts')
    const savedCurrentAccount = localStorage.getItem('currentAccount')

    if (savedWallet && savedAccounts) {
      setConnectedWallet(savedWallet)
      const parsedAccounts = JSON.parse(savedAccounts)
      setAccounts(parsedAccounts)
      
      if (savedCurrentAccount) {
        const current = parsedAccounts.find((acc: WalletAccount) => acc.address === savedCurrentAccount)
        if (current) setCurrentAccount(current)
      } else {
        setCurrentAccount(parsedAccounts[0])
      }
    }
  }, [])

  useEffect(() => {
    if (connectedWallet) {
      const interval = setInterval(refreshAccounts, 30000)
      return () => clearInterval(interval)
    }
  }, [connectedWallet, refreshAccounts])

  return {
    connectedWallet,
    accounts,
    currentAccount,
    isConnected: !!connectedWallet && !!currentAccount,
    connect,
    disconnect,
    switchAccount,
    refreshAccounts
  }
}

async function getAccountInfo(address: string) {
  try {
    const response = await fetch(`https://mainnet-api.algonode.cloud/v2/accounts/${address}`)
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch account info:", error)
    return { amount: 0, assets: [] }
  }
}