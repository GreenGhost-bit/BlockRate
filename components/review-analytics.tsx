// components/review-analytics.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Calendar, Filter } from "lucide-react"

interface ReviewTrendData {
  date: string
  reviews: number
  averageRating: number
  rewards: number
}

interface SentimentData {
  sentiment: string
  count: number
  percentage: number
  color: string
}

interface CategoryAnalytics {
  category: string
  reviewCount: number
  averageRating: number
  growthRate: number
}

interface CompetitorAnalysis {
  businessName: string
  averageRating: number
  reviewCount: number
  marketShare: number
  trendDirection: 'up' | 'down' | 'stable'
}

export function ReviewAnalytics({ businessId }: { businessId?: string }) {
  const [timeRange, setTimeRange] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState<{
    trends: ReviewTrendData[]
    sentiment: SentimentData[]
    categories: CategoryAnalytics[]
    competitors: CompetitorAnalysis[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, businessId])

  const loadAnalyticsData = async () => {
    setLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockTrends: ReviewTrendData[] = [
      { date: '2024-01-01', reviews: 12, averageRating: 4.2, rewards: 30.5 },
      { date: '2024-01-02', reviews: 18, averageRating: 4.4, rewards: 45.2 },
      { date: '2024-01-03', reviews: 15, averageRating: 4.1, rewards: 37.8 },
      { date: '2024-01-04', reviews: 22, averageRating: 4.6, rewards: 55.0 },
      { date: '2024-01-05', reviews: 19, averageRating: 4.3, rewards: 47.5 },
      { date: '2024-01-06', reviews: 25, averageRating: 4.5, rewards: 62.5 },
      { date: '2024-01-07', reviews: 21, averageRating: 4.4, rewards: 52.5 }
    ]

    const mockSentiment: SentimentData[] = [
      { sentiment: 'Very Positive', count: 156, percentage: 52, color: '#22c55e' },
      { sentiment: 'Positive', count: 89, percentage: 30, color: '#84cc16' },
      { sentiment: 'Neutral', count: 34, percentage: 11, color: '#eab308' },
      { sentiment: 'Negative', count: 15, percentage: 5, color: '#f97316' },
      { sentiment: 'Very Negative', count: 6, percentage: 2, color: '#ef4444' }
    ]

    const mockCategories: CategoryAnalytics[] = [
      { category: 'Food & Beverage', reviewCount: 89, averageRating: 4.3, growthRate: 12.5 },
      { category: 'Technology', reviewCount: 67, averageRating: 4.1, growthRate: 8.2 },
      { category: 'Healthcare', reviewCount: 45, averageRating: 4.6, growthRate: 15.3 },
      { category: 'Finance', reviewCount: 34, averageRating: 3.9, growthRate: -2.1 },
      { category: 'Education', reviewCount: 28, averageRating: 4.4, growthRate: 5.7 }
    ]

    const mockCompetitors: CompetitorAnalysis[] = [
      { businessName: 'Crypto Coffee Roasters', averageRating: 4.8, reviewCount: 247, marketShare: 35, trendDirection: 'up' },
      { businessName: 'DeFi Diner', averageRating: 4.2, reviewCount: 189, marketShare: 28, trendDirection: 'stable' },
      { businessName: 'Blockchain Bistro', averageRating: 4.0, reviewCount: 156, marketShare: 22, trendDirection: 'down' },
      { businessName: 'Smart Contract Cafe', averageRating: 3.8, reviewCount: 98, marketShare: 15, trendDirection: 'up' }
    ]

    setAnalyticsData({
      trends: mockTrends,
      sentiment: mockSentiment,
      categories: mockCategories,
      competitors: mockCompetitors
    })
    setLoading(false)
  }

  const calculateTotalReviews = () => {
    return analyticsData?.trends.reduce((sum, day) => sum + day.reviews, 0) || 0
  }

  const calculateAverageRating = () => {
    if (!analyticsData?.trends.length) return 0
    const total = analyticsData.trends.reduce((sum, day) => sum + day.averageRating, 0)
    return (total / analyticsData.trends.length).toFixed(1)
  }

  const calculateTotalRewards = () => {
    return analyticsData?.trends.reduce((sum, day) => sum + day.rewards, 0).toFixed(1) || '0'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-700 rounded mt-6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review Analytics</h2>
          <p className="text-gray-400">Insights and trends from blockchain-verified reviews</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold">{calculateTotalReviews()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+12.5%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold">{calculateAverageRating()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+0.3</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ALGO Rewards</p>
                <p className="text-2xl font-bold">{calculateTotalRewards()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+8.7%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Response Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
              <span className="text-red-400">-2.1%</span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="competitors">Competition</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Review Trends Over Time</CardTitle>
              <CardDescription>Daily review volume and average ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData?.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }} 
                    />
                    <Line type="monotone" dataKey="reviews" stroke="#3B82F6" strokeWidth={2} name="Reviews" />
                    <Line type="monotone" dataKey="averageRating" stroke="#10B981" strokeWidth={2} name="Avg Rating" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
                <CardDescription>Overall sentiment analysis of reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.sentiment}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ sentiment, percentage }) => `${sentiment}: ${percentage}%`}
                      >
                        {analyticsData?.sentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Sentiment Breakdown</CardTitle>
                <CardDescription>Detailed sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.sentiment.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.sentiment}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{item.count}</div>
                        <div className="text-xs text-gray-400">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Review performance across different business categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">{category.category}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                        <span>{category.reviewCount} reviews</span>
                        <span>★ {category.averageRating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${category.growthRate >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {category.growthRate >= 0 ? '+' : ''}{category.growthRate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>Performance comparison with similar businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{competitor.businessName}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                        <span>★ {competitor.averageRating}</span>
                        <span>{competitor.reviewCount} reviews</span>
                        <span>{competitor.marketShare}% market share</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`
                        ${competitor.trendDirection === 'up' ? 'bg-green-500/20 text-green-400' : 
                          competitor.trendDirection === 'down' ? 'bg-red-500/20 text-red-400' : 
                          'bg-gray-500/20 text-gray-400'}
                      `}>
                        {competitor.trendDirection === 'up' ? '↗' : competitor.trendDirection === 'down' ? '↘' : '→'} 
                        {competitor.trendDirection}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}