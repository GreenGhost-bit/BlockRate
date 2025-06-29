import Link from "next/link"
import Image from "next/image"
import { Search, Star, Shield, Database, TrendingUp, Coins, Vote, Gift, Zap, Users, Lock, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ReviewSubmissionForm } from "@/components/review-submission-form"
import { AlgorandStats } from "@/components/algorand-stats"
import { RecentReviews } from "@/components/recent-reviews"
import { GovernancePanel } from "@/components/governance-panel"
import { ExploreSection } from "@/components/explore-section"

export default function Home() {
  const algorandFeatures = [
    {
      icon: Shield,
      title: "Immutable Reviews",
      description: "Once submitted, reviews are permanently stored on Algorand blockchain and cannot be altered or deleted.",
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: "Instant Finality",
      description: "Reviews are confirmed in seconds with Algorand's instant finality - no waiting for multiple confirmations.",
      color: "text-blue-400"
    },
    {
      icon: Coins,
      title: "Earn ALGO Rewards",
      description: "Get rewarded in ALGO tokens for submitting quality reviews and participating in community governance.",
      color: "text-yellow-400"
    },
    {
      icon: Vote,
      title: "Decentralized Governance",
      description: "Token holders vote on platform decisions, review standards, and reward distribution mechanisms.",
      color: "text-purple-400"
    }
  ]

  const platformStats = [
    { label: "Total Reviews", value: "12,847", icon: Database, change: "+234 today" },
    { label: "ALGO Rewards Paid", value: "₳15,623", icon: Coins, change: "+127 this week" },
    { label: "Active Reviewers", value: "3,421", icon: Users, change: "+89 this month" },
    { label: "Trust Score Avg", value: "94.2%", icon: BarChart3, change: "+2.1% this quarter" }
  ]

  return (
    <div className="min-h-screen pt-12">
      <section id="home" className="relative section-spacing px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        </div>
        
        <div className="container-responsive relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-fit">
                  🚀 Powered by Algorand Blockchain
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-poppins text-white">
                  Decentralized Reviews You Can{" "}
                  <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Trust
                  </span>
                </h1>
                <p className="max-w-[600px] text-gray-300 text-lg md:text-xl leading-relaxed">
                  BlockRate leverages Algorand's instant finality and low fees to ensure all reviews are transparent, 
                  immutable, and trustworthy. Earn ALGO rewards for quality contributions.
                </p>
              </div>
              
              <div className="mobile-button-group">
                <ConnectWalletButton />
                <button 
                  className="btn-responsive border border-green-400 text-green-400 hover:bg-green-400 hover:text-black bg-transparent"
                  onClick={() => {
                    const element = document.getElementById('reviews');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Reviews
                </button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">₳127</div>
                  <div className="text-xs text-gray-400">Avg. Monthly Rewards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">4.2s</div>
                  <div className="text-xs text-gray-400">Review Confirmation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-green-500/20">
                <ReviewSubmissionForm />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container-responsive">
          <AlgorandStats />
        </div>
      </section>

      <section id="features" className="section-spacing px-4">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">
              🔗 Blockchain-Powered Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-poppins mb-4 text-white">
              Why Choose Algorand?
            </h2>
            <p className="max-w-[700px] text-gray-300 text-lg mx-auto">
              Experience the next generation of decentralized reviews with Algorand's advanced blockchain technology
            </p>
          </div>
          
          <div className="grid-responsive gap-8">
            {algorandFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all duration-300 group hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 mx-auto mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 bg-gradient-to-b from-slate-800/50 to-transparent">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-poppins mb-4 text-white">
              Platform Statistics
            </h2>
            <p className="max-w-[700px] text-gray-300 text-lg mx-auto">
              Real-time metrics from the Algorand blockchain showing our growing ecosystem
            </p>
          </div>
          
          <div className="grid-responsive gap-6">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-green-500/50 transition-all duration-300 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8 text-green-400" />
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{stat.change}</Badge>
                    </div>
                    <div className="text-3xl font-bold mb-2 text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="reviews">
        <RecentReviews />
      </section>

      <section id="governance" className="section-spacing px-4">
        <div className="container-responsive">
          <GovernancePanel />
        </div>
      </section>

      <ExploreSection />

      <section className="section-spacing px-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
        <div className="container-responsive">
          <Card className="bg-black/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter font-poppins mb-6 text-white">
                Ready to Earn While You Review?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
                Join thousands of users earning ALGO rewards for honest, transparent reviews on the blockchain
              </p>
              <div className="mobile-button-group justify-center">
                <ConnectWalletButton size="lg" />
                <button 
                  className="btn-responsive border border-white text-white hover:bg-white hover:text-black bg-transparent px-8 py-3 text-lg"
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </button>
              </div>
              <div className="mt-8 text-sm opacity-75 text-white">
                🔗 Secured by Algorand • ⚡ Instant Finality • 💰 Low Fees • 🏛️ Decentralized Governance
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}