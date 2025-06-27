// components/business-profile.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Globe, Phone, Mail, Clock, TrendingUp, Users, Award, ExternalLink } from "lucide-react"

interface BusinessProfile {
  id: string
  name: string
  description: string
  category: string
  verified: boolean
  owner: string
  averageRating: number
  totalReviews: number
  algorandAssetId?: number
  website?: string
  location?: string
  phone?: string
  email?: string
  hours?: string
  images: string[]
  tags: string[]
  establishedDate?: Date
}

interface BusinessStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  monthlyGrowth: number
  verifiedReviews: number
  responseRate: number
}

export function BusinessProfile({ businessId }: { businessId: string }) {
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinessData()
  }, [businessId])

  const loadBusinessData = async () => {
    setLoading(true)
    try {
      const mockBusiness: BusinessProfile = {
        id: businessId,
        name: "Crypto Coffee Roasters",
        description: "Premium coffee roastery accepting ALGO payments. We source the finest beans from sustainable farms and roast them to perfection. Our blockchain-verified supply chain ensures transparency from farm to cup.",
        category: "Food & Beverage",
        verified: true,
        owner: "ALGO123...XYZ789",
        averageRating: 4.8,
        totalReviews: 247,
        algorandAssetId: 12345,
        website: "https://cryptocoffee.algo",
        location: "123 Blockchain Ave, Crypto City, CC 12345",
        phone: "+1 (555) 123-ALGO",
        email: "hello@cryptocoffee.algo",
        hours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-6PM",
        images: ["/coffee-shop-1.jpg", "/coffee-shop-2.jpg", "/coffee-shop-3.jpg"],
        tags: ["Coffee", "Sustainable", "ALGO Payments", "Organic", "Local"],
        establishedDate: new Date("2022-03-15")
      }

      const mockStats: BusinessStats = {
        totalReviews: 247,
        averageRating: 4.8,
        ratingDistribution: { 5: 156, 4: 67, 3: 18, 2: 4, 1: 2 },
        monthlyGrowth: 12.5,
        verifiedReviews: 231,
        responseRate: 94
      }

      setBusiness(mockBusiness)
      setStats(mockStats)
    } catch (error) {
      console.error("Failed to load business data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!business || !stats) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
        <p className="text-gray-400">The requested business profile could not be found.</p>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    {business.verified && (
                      <Badge className="bg-green-500/20 text-green-400">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="mb-3">
                    {business.category}
                  </Badge>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(business.averageRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                        />
                      ))}
                      <span className="font-semibold ml-2">{business.averageRating}</span>
                      <span className="text-gray-400">({business.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{business.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {business.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {business.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{business.location}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      {business.website}
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                )}
                {business.hours && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{business.hours}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    Recent verified reviews from the Algorand blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    Reviews component would be rendered here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold text-green-400">+{stats.monthlyGrowth}%</div>
                    <div className="text-xs text-gray-400">Monthly Growth</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-blue-400">{stats.verifiedReviews}</div>
                    <div className="text-xs text-gray-400">Verified Reviews</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold text-purple-400">{stats.responseRate}%</div>
                    <div className="text-xs text-gray-400">Response Rate</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blockchain" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Blockchain Information</CardTitle>
                  <CardDescription>
                    On-chain data and verification details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Owner Address</div>
                      <div className="font-mono text-sm bg-slate-700 p-2 rounded">
                        {business.owner}
                      </div>
                    </div>
                    {business.algorandAssetId && (
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Asset ID</div>
                        <div className="font-mono text-sm bg-slate-700 p-2 rounded">
                          #{business.algorandAssetId}
                        </div>
                      </div>
                    )}
                    {business.establishedDate && (
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Established</div>
                        <div className="text-sm">{formatDate(business.establishedDate)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Write Review
              </Button>
              <Button variant="outline" className="w-full">
                Contact Business
              </Button>
              <Button variant="outline" className="w-full">
                View on Blockchain
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.ratingDistribution)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([rating, count]) => {
                    const percentage = (count / stats.totalReviews) * 100
                    return (
                      <div key={rating} className="flex items-center space-x-2 text-sm">
                        <span className="w-4">{rating}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-8">{count}</span>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}