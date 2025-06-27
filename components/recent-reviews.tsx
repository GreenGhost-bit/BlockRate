"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, Clock } from "lucide-react"
import { useAlgorand } from "./algorand-provider"
import Link from "next/link"

export function RecentReviews() {
  const { reviews } = useAlgorand()

  const sampleReviews = [
    {
      id: "1",
      businessName: "Crypto Coffee Shop",
      rating: 5,
      content: "Amazing service and they accept ALGO payments! Fast transactions and great coffee. The baristas are knowledgeable about blockchain technology.",
      author: "ALGO7X8KMNQP",
      txId: "TXN123ABC456DEF789",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      verified: true,
      assetId: 12345
    },
    {
      id: "2", 
      businessName: "DeFi Restaurant",
      rating: 4,
      content: "Good food, instant payment confirmation. Love the blockchain integration. The smart contract ordering system is innovative.",
      author: "ALGO9M2PXYZ1",
      txId: "TXN456DEF789GHI012",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      verified: true,
      assetId: 12346
    },
    {
      id: "3",
      businessName: "Algorand Gear Store", 
      rating: 5,
      content: "Best place for Algorand merchandise! High quality products and seamless ALGO payments. Fast shipping and excellent customer service.",
      author: "ALGOZ5K3WRT8",
      txId: "TXN789GHI012JKL345",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      verified: true,
      assetId: 12347
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 3) : sampleReviews

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-800/30 to-transparent">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">
            🔗 Live from Blockchain
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-poppins mb-4">
            Recent Blockchain Reviews
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Latest verified reviews submitted to the Algorand blockchain with instant finality
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayReviews.map((review) => (
            <Card key={review.id} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.verified && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(review.timestamp)}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-3 group-hover:text-green-400 transition-colors">
                  {review.businessName}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {review.content}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Author:</span>
                    <span className="font-mono text-green-400">
                      {review.author.slice(0, 8)}...{review.author.slice(-4)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Transaction:</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-mono text-blue-400">
                        {review.txId.slice(0, 8)}...
                      </span>
                      <Link 
                        href={`https://algoexplorer.io/tx/${review.txId}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                  
                  {review.assetId && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Asset ID:</span>
                      <span className="text-purple-400">#{review.assetId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/reviews">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 cursor-pointer hover:bg-green-500/30 transition-colors">
              View All Reviews →
            </Badge>
          </Link>
        </div>
      </div>
    </section>
  )
}