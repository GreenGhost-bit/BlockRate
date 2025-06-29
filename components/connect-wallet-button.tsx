"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { useAlgorand } from './algorand-provider';

interface ConnectWalletButtonProps {
  size?: 'default' | 'sm' | 'lg';
}

export function ConnectWalletButton({ size = 'default' }: ConnectWalletButtonProps) {
  const { isConnected, address, connectWallet, disconnectWallet } = useAlgorand();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connectWallet();
    setIsConnecting(false);
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
          <CheckCircle className="w-4 h-4" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="outline" onClick={disconnectWallet} size={size}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isConnecting}
      size={size}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}