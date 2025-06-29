"use client"

import { useState } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Button } from "./ui/button";
import { Menu, X, Home, Search, FileText, Users, Settings } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (section: string) => {
    setIsMobileMenuOpen(false);
    
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
              BlockRate
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => handleNavClick('home')}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Features</span>
              </button>
              <button
                onClick={() => handleNavClick('reviews')}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Reviews</span>
              </button>
              <button
                onClick={() => handleNavClick('governance')}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Governance</span>
              </button>
              <ConnectWalletButton />
            </div>

            <div className="lg:hidden flex items-center space-x-4">
              <ConnectWalletButton size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-700">
            <div className="container-responsive py-4 space-y-4">
              <button
                onClick={() => handleNavClick('home')}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-3"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-3"
              >
                <Search className="w-5 h-5" />
                <span>Features</span>
              </button>
              <button
                onClick={() => handleNavClick('reviews')}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-3"
              >
                <FileText className="w-5 h-5" />
                <span>Reviews</span>
              </button>
              <button
                onClick={() => handleNavClick('governance')}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-3"
              >
                <Users className="w-5 h-5" />
                <span>Governance</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}