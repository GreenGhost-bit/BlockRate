// components/advanced-search.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Star, Calendar, TrendingUp, X } from "lucide-react"

interface SearchFilters {
  query: string
  category: string[]
  location: string
  minRating: number
  maxDistance: number
  verifiedOnly: boolean
  hasAlgoPayments: boolean
  sortBy: 'relevance' | 'rating' | 'reviews' | 'newest' | 'distance'
  dateRange: 'all' | 'week' | 'month' | 'year'
  priceRange: 'all' | 'low' | 'medium' | 'high'
}

interface SearchResult {
  id: string
  name: string
  description: string
  category: string
  rating: number
  reviewCount: number
  verified: boolean
  acceptsAlgo: boolean
  distance?: number
  imageUrl: string
  priceLevel: 'low' | 'medium' | 'high'
  trending: boolean
}

const categories = [
  "Food & Beverage", "Technology", "Healthcare", "Finance", "Education",
  "Entertainment", "Shopping", "Services", "Travel", "Sports", "Beauty"
]

const mockResults: SearchResult[] = [
  {
    id: "1",
    name: "Crypto Coffee Roasters",
    description: "Premium coffee with ALGO payments",
    category: "Food & Beverage",
    rating: 4.8,
    reviewCount: 247,
    verified: true,
    acceptsAlgo: true,
    distance: 0.5,
    imageUrl: "/coffee-shop.jpg",
    priceLevel: "medium",
    trending: true
  },
  {
    id: "2",
    name: "DeFi Dental Care",
    description: "Modern dental practice accepting crypto",
    category: "Healthcare",
    rating: 4.9,
    reviewCount: 156,
    verified: true,
    acceptsAlgo: true,
    distance: 1.2,
    imageUrl: "/dental-clinic.jpg",
    priceLevel: "high",
    trending: false
  },
  {
    id: "3",
    name: "Blockchain Bookstore",
    description: "Tech books and educational resources",
    category: "Education",
    rating: 4.6,
    reviewCount: 89,
    verified: false,
    acceptsAlgo: true,
    distance: 2.1,
    imageUrl: "/bookstore.jpg",
    priceLevel: "low",
    trending: true
  }
]

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: [],
    location: "",
    minRating: 0,
    maxDistance: 50,
    verifiedOnly: false,
    hasAlgoPayments: false,
    sortBy: 'relevance',
    dateRange: 'all',
    priceRange: 'all'
  })

  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    performSearch()
  }, [filters])

  const performSearch = async () => {
    setIsSearching(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredResults = mockResults.filter(result => {
      if (filters.query && !result.name.toLowerCase().includes(filters.query.toLowerCase())) {
        return false
      }
      if (filters.category.length > 0 && !filters.category.includes(result.category)) {
        return false
      }
      if (filters.minRating > 0 && result.rating < filters.minRating) {
        return false
      }
      if (filters.verifiedOnly && !result.verified) {
        return false
      }
      if (filters.hasAlgoPayments && !result.acceptsAlgo) {
        return false
      }
      if (filters.priceRange !== 'all' && result.priceLevel !== filters.priceRange) {
        return false
      }
      return true
    })

    switch (filters.sortBy) {
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filteredResults.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'distance':
        filteredResults.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        break
      default:
        break
    }

    setResults(filteredResults)
    setIsSearching(false)
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: [],
      location: "",
      minRating: 0,
      maxDistance: 50,
      verifiedOnly: false,
      hasAlgoPayments: false,
      sortBy: 'relevance',
      dateRange: 'all',
      priceRange: 'all'
    })
  }

  const activeFiltersCount = [
    filters.category.length > 0,
    filters.minRating > 0,
    filters.verifiedOnly,
    filters.hasAlgoPayments,
    filters.priceRange !== 'all',
    filters.dateRange !== 'all'
  ].filter(Boolean).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Businesses</h1>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search businesses, services, or products..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-green-500 text-white ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {showFilters && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Advanced Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categories</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.category.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <span className="text-sm">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                  <div className="space-y-2">
                    <Slider
                      value={[filters.minRating]}
                      onValueChange={([value]) => updateFilter('minRating', value)}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{filters.minRating}+ stars</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={filters.priceRange} onValueChange={(value: any) => updateFilter('priceRange', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">$ Budget-friendly</SelectItem>
                      <SelectItem value="medium">$$ Moderate</SelectItem>
                      <SelectItem value="high">$$$ Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.verifiedOnly}
                      onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)}
                    />
                    <span className="text-sm">Verified businesses only</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.hasAlgoPayments}
                      onCheckedChange={(checked) => updateFilter('hasAlgoPayments', checked)}
                    />
                    <span className="text-sm">Accepts ALGO payments</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-gray-400">
          {isSearching ? "Searching..." : `${results.length} businesses found`}
        </div>
        {filters.query && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Search results for:</span>
            <Badge variant="outline">"{filters.query}"</Badge>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map(result => (
          <Card key={result.id} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg">{result.name}</h3>
                    {result.trending && (
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {result.category}
                  </Badge>
                </div>
                {result.verified && (
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {result.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(result.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                    />
                  ))}
                  <span className="font-semibold ml-1">{result.rating}</span>
                  <span className="text-gray-400 text-sm">({result.reviewCount})</span>
                </div>
                {result.distance !== undefined && (
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>{result.distance} mi</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.acceptsAlgo && (
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                      ALGO Pay
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {result.priceLevel === 'low' ? '$' : result.priceLevel === 'medium' ? '$$' : '$$$'}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && !isSearching && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search criteria or removing some filters
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}
    </div>
  )
}