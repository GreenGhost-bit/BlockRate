// components/user-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  User, Star, Award, TrendingUp, Coins, Calendar, 
  MessageSquare, ThumbsUp, Shield, Target, Gift, Crown
} from "lucide-react"
import { useAlgorand } from "./algorand-provider"

interface UserStats {
  totalReviews: number
  averageRating: number
  helpfulVotes: number
  totalRewards: number
  reputationScore: number
  reviewStreak: number
  joinDate: Date
  verificationLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress?: number
  maxProgress?: number
}

interface UserReview {
  id: string
  businessName: string
  rating: number
  content: string
  date: Date
  helpfulVotes: number
  businessResponse?: string
  txId: string
  rewardEarned: number
}

export function UserDashboard() {
  const { account, balance, reputationScore } = useAlgorand()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userReviews, setUserReviews] = useState<UserReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [account])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const mockStats: UserStats = {
        totalReviews: 47,
        averageRating: 4.6,
        helpfulVotes: 342,
        totalRewards: 127.5,
        reputationScore: reputationScore || 875,
        reviewStreak: 12,
        joinDate: new Date("2023-06-15"),
        verificationLevel: 'Gold',
        achievements: [
          {
            id: "first_review",
            title: "First Steps",
            description: "Submitted your first review",
            icon: "🌟",
            unlockedAt: new Date("2023-06-16"),
            rarity: 'common'
          },
          {
            id: "ten_reviews",
            title: "Reviewer",
            description: "Submitted 10 quality reviews",
            icon: "📝",
            unlockedAt: new Date("2023-07-20"),
            rarity: 'common'
          },
          {
            id: "helpful_reviewer",
            title: "Helpful Voice",
            description: "Received 100 helpful votes",
            icon: "👍",
            unlockedAt: new Date("2023-08-15"),
            rarity: 'rare'
          },
          {
            id: "algo_enthusiast",
            title: "ALGO Enthusiast",
            description: "Earned 100+ ALGO in rewards",
            icon: "💎",
            unlockedAt: new Date("2023-09-10"),
            rarity: 'epic'
          },
          {
            id: "streak_master",
            title: "Consistency Champion",
            description: "Maintained a 10-day review streak",
            icon: "🔥",
            unlockedAt: new Date("2023-10-01"),
            rarity: 'rare'
          }
        ]
      }

      const mockReviews: UserReview[] = [
        {
          id: "1",
          businessName: "Crypto Coffee Roasters",
          rating: 5,
          content: "Excellent coffee and seamless ALGO payments. The baristas are knowledgeable about blockchain technology and the atmosphere is perfect for crypto discussions.",
          date: new Date("2024-01-15"),
          helpfulVotes: 23,
          businessResponse: "Thank you for the wonderful review! We're glad you enjoyed our blockchain-friendly environment.",
          txId: "TXN123ABC456",
          rewardEarned: 2.5
        },
        {
          id: "2",
          businessName: "DeFi Dental Care",
          rating: 4,
          content: "Professional service with crypto payment options. The digital records system using blockchain is innovative.",
          date: new Date("2024-01-10"),
          helpfulVotes: 18,
          txId: "TXN789DEF012",
          rewardEarned: 2.5
        },
        {
          id: "3",
          businessName: "Blockchain Books",
          rating: 5,
          content: "Great selection of tech books and educational materials. Love that they accept ALGO for instant payments.",
          date: new Date("2024-01-05"),
          helpfulVotes: 31,
          txId: "TXN345GHI678",
          rewardEarned: 3.0
        }
      ]

      setUserStats(mockStats)
      setUserReviews(mockReviews)
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getVerificationColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-amber-600'
      case 'Silver': return 'text-gray-400'
      case 'Gold': return 'text-yellow-400'
      case 'Platinum': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500'
      case 'rare': return 'border-blue-500'
      case 'epic': return 'border-purple-500'
      case 'legendary': return 'border-orange-500'
      default: return 'border-gray-500'
    }
  }

  const calculateLevel = (reputation: number) => {
    return Math.floor(reputation / 100) + 1
  }

  const calculateLevelProgress = (reputation: number) => {
    return (reputation % 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!userStats) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard Unavailable</h1>
        <p className="text-gray-400">Please connect your wallet to access your dashboard.</p>
      </div>
    )
  }

  const userLevel = calculateLevel(userStats.reputationScore)
  const levelProgress = calculateLevelProgress(userStats.reputationScore)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
        
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/user-avatar.jpg" />
                <AvatarFallback className="bg-green-600 text-white text-xl">
                  {account?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : 'User'}
                  </h2>
                  <Badge className={`${getVerificationColor(userStats.verificationLevel)} border-current`}>
                    <Crown className="w-3 h-3 mr-1" />
                    {userStats.verificationLevel}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{userStats.totalReviews}</div>
                    <div className="text-xs text-gray-400">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{userStats.totalRewards}</div>
                    <div className="text-xs text-gray-400">ALGO Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userLevel}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userStats.helpfulVotes}</div>
                    <div className="text-xs text-gray-400">Helpful Votes</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {userLevel} Progress</span>
                    <span>{levelProgress}/100</span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Current Balance</div>
                <div className="text-2xl font-bold text-green-400">{balance.toFixed(2)} ALGO</div>
                <div className="text-sm text-gray-400">≈ ${(balance * 0.32).toFixed(2)} USD</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{userStats.averageRating}</div>
                <div className="text-xs text-gray-400">Avg Rating Given</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold">{userStats.reviewStreak}</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{userStats.reputationScore}</div>
                <div className="text-xs text-gray-400">Reputation Score</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">
                  {Math.floor((Date.now() - userStats.joinDate.getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs text-gray-400">Days Active</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {userReviews.map(review => (
              <Card key={review.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{review.businessName}</h3>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">
                          {review.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 mb-2">
                        +{review.rewardEarned} ALGO
                      </Badge>
                      <div className="text-xs text-gray-400">
                        TX: {review.txId.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{review.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpfulVotes} found this helpful</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  
                  {review.businessResponse && (
                    <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Business Response:</div>
                      <p className="text-sm text-gray-300">{review.businessResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userStats.achievements.map(achievement => (
              <Card key={achievement.id} className={`bg-slate-800/50 border-2 ${getRarityColor(achievement.rarity)}`}>
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                  <Badge className={`${getRarityColor(achievement.rarity)} border-current`}>
                    {achievement.rarity}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-2">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Reward Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Earned:</span>
                    <span className="font-bold text-green-400">{userStats.totalRewards} ALGO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-bold text-blue-400">12.5 ALGO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available to Claim:</span>
                    <span className="font-bold text-purple-400">2.5 ALGO</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  <Gift className="w-4 h-4 mr-2" />
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Bonus Multipliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Review Quality Bonus:</span>
                    <Badge className="bg-green-500/20 text-green-400">+20%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Streak Bonus:</span>
                    <Badge className="bg-orange-500/20 text-orange-400">+15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verification Bonus:</span>
                    <Badge className="bg-purple-500/20 text-purple-400">+25%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}