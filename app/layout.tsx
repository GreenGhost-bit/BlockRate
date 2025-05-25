import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

/**
 * Initialize font configurations with explicit weight and variable names
 */
const inter = Inter({
  subsets: ["latin"], 
  variable: "--font-inter"
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"], 
  subsets: ["latin"], 
  variable: "--font-poppins"
})

/**
 * Define metadata settings to enhance SEO and information integrity
 */
export const metadata: Metadata = {
  title: "BlockRate - Decentralized Review Platform",
  description: "A blockchain-based platform for transparent and trustworthy reviews",
  generator: "v0.dev",
  authors: [
    { name: "BlockRate Team", url: "https://blockrate.com" }
  ],
  keywords: ["Blockchain", "Reviews", "Transparency", "Algorand", "Decentralized"],
  robots: "index, follow",
  openGraph: {
    title: "BlockRate - Decentralized Review Platform",
    description: "Experience transparent, immutable reviews powered by Algorand blockchain.",
    images: ["https://blockrate.com/og-image.jpg"],
    url: "https://blockrate.com"
  }
}

/**
 * RootLayout Component 
 * 
 * This component serves as the foundational layout structure for the application, 
 * encapsulating global styling, navigation, and footer elements while dynamically 
 * rendering page-specific content within a structured HTML document.
 * 
 * @param {Readonly<{ children: ReactNode }>} props - Contains the dynamically injected page components
 * @returns {JSX.Element} The structured layout of the application
 */
export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-gray-50 text-gray-900`}>
        {/* Global Navigation Bar */}
        <Navbar />
        
        {/* Main Content Section - Dynamically Injected */}
        <main className="container mx-auto px-4 py-8">{children}</main>
        
        {/* Global Footer Component */}
        <Footer />
      </body>
    </html>
  )
}
