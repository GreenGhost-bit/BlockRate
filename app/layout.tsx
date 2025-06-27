import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlgorandProvider } from "@/components/algorand-provider"
import { PriceTracker } from "@/components/price-tracker"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "BlockRate - Algorand-Powered Review Platform",
  description: "A blockchain-based platform for transparent and trustworthy reviews powered by Algorand",
  generator: 'Algorand BlockRate',
  keywords: ["blockchain", "reviews", "algorand", "transparent", "decentralized"],
  openGraph: {
    title: "BlockRate - Algorand Review Platform",
    description: "Transparent blockchain reviews on Algorand",
    images: ["/blockrate-og.png"],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-screen`}>
        <AlgorandProvider>
          <div className="relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="relative z-10">
              <PriceTracker />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </div>
          </div>
          <Toaster />
        </AlgorandProvider>
      </body>
    </html>
  )
}