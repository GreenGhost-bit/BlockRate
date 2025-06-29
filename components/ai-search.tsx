// components/ai-search.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Brain, 
  TrendingUp, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  Sparkles,
  Target,
  Zap,
  ThumbsUp,
  Eye,
  MessageSquare,
  Sliders
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';

interface BusinessResult {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  distance: number;
  address: string;
  description: string;
  matchScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  popularTimes: number[];
  features: string[];
  aiRecommendationReason: string;
}

interface SearchFilter {
  category: string[];
  priceRange: [number, number];
  rating: number;
  distance: number;
  openNow: boolean;
  features: string[];
}

interface SearchSuggestion {
  text: string;
  type: 'semantic' | 'trending' | 'location' | 'category';
  confidence: number;
}

interface ReviewSentiment {
  reviewId: string;
  businessId: string;
  content: string;
  rating: number;
  sentiment: {
    score: number;
    magnitude: number;
    emotions: {
      joy: number;
      anger: number;
      fear: number;
      sadness: number;
      surprise: number;
    };
  };
  topics: string[];
  keywords: string[];
}

export function AISearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilter>({
    category: [],
    priceRange: [1, 4],
    rating: 0,
    distance: 10,
    openNow: false,
    features: []
  });

  const [sentimentAnalysis, setSentimentAnalysis] = useState<ReviewSentiment[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<BusinessResult[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);

  const mockBusinessResults: BusinessResult[] = [
    {
      id: '1',
      name: 'The Artisan Café',
      category: 'Coffee Shop',
      rating: 4.6,
      reviewCount: 248,
      priceLevel: 2,
      distance: 0.8,
      address: '123 Main St, Downtown',
      description: 'Cozy café with locally roasted coffee and artisanal pastries',
      matchScore: 0.92,
      sentiment: 'positive',
      popularTimes: [20, 45, 70, 85, 90, 75, 60, 45, 30, 25, 20, 15],
      features: ['WiFi', 'Outdoor Seating', 'Vegan Options'],
      aiRecommendationReason: 'Highly rated for coffee quality and atmosphere, matches your preference for cozy environments'
    },
    {
      id: '2',
      name: 'Sakura Sushi Bar',
      category: 'Japanese Restaurant',
      rating: 4.4,
      reviewCount: 312,
      priceLevel: 3,
      distance: 1.2,
      address: '456 Oak Ave, Midtown',
      description: 'Authentic Japanese cuisine with fresh sashimi and creative rolls',
      matchScore: 0.87,
      sentiment: 'positive',
      popularTimes: [15, 25, 40, 60, 80, 95, 85, 70, 50, 30, 20, 10],
      features: ['Takeout', 'Delivery', 'Date Night'],
      aiRecommendationReason: 'Excellent reviews for freshness and authenticity, popular for dinner experiences'
    },
    {
      id: '3',
      name: 'Green Garden Bistro',
      category: 'Vegetarian Restaurant',
      rating: 4.3,
      reviewCount: 189,
      priceLevel: 2,
      distance: 2.1,
      address: '789 Pine St, Westside',
      description: 'Farm-to-table vegetarian cuisine with seasonal ingredients',
      matchScore: 0.81,
      sentiment: 'positive',
      popularTimes: [25, 35, 50, 65, 75, 80, 70, 55, 40, 30, 25, 20],
      features: ['Organic', 'Gluten-Free', 'Local Sourcing'],
      aiRecommendationReason: 'Strong environmental values align with health-conscious dining preferences'
    }
  ];

  const performSemanticSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const searchTerms = query.toLowerCase().split(' ');
    const results = mockBusinessResults.map(business => {
      let score = 0;
      
      searchTerms.forEach(term => {
        if (business.name.toLowerCase().includes(term)) score += 0.3;
        if (business.category.toLowerCase().includes(term)) score += 0.4;
        if (business.description.toLowerCase().includes(term)) score += 0.2;
        if (business.features.some(f => f.toLowerCase().includes(term))) score += 0.1;
      });
      
      if (query.includes('good') || query.includes('best')) {
        score += business.rating * 0.1;
      }
      
      if (query.includes('cheap') || query.includes('affordable')) {
        score += (5 - business.priceLevel) * 0.1;
      }
      
      if (query.includes('near') || query.includes('close')) {
        score += (10 - business.distance) * 0.05;
      }
      
      return { ...business, matchScore: Math.min(1, score) };
    });
    
    const filteredResults = results
      .filter(business => business.matchScore > 0.1)
      .sort((a, b) => b.matchScore - a.matchScore);
    
    setSearchResults(filteredResults);
    setIsSearching(false);
  }, []);

  const generateSuggestions = useCallback((query: string) => {
    const suggestions: SearchSuggestion[] = [];
    
    if (query.length > 2) {
      const semanticSuggestions = [
        { text: `${query} with outdoor seating`, type: 'semantic' as const, confidence: 0.8 },
        { text: `${query} near me`, type: 'location' as const, confidence: 0.9 },
        { text: `best ${query} downtown`, type: 'semantic' as const, confidence: 0.7 },
        { text: `${query} with vegan options`, type: 'semantic' as const, confidence: 0.6 }
      ];
      suggestions.push(...semanticSuggestions);
    }
    
    const trendingSuggestions = [
      { text: 'cozy coffee shops', type: 'trending' as const, confidence: 0.9 },
      { text: 'romantic dinner spots', type: 'trending' as const, confidence: 0.8 },
      { text: 'family friendly restaurants', type: 'trending' as const, confidence: 0.7 },
      { text: 'late night eats', type: 'trending' as const, confidence: 0.6 }
    ];
    
    if (query.length < 3) {
      suggestions.push(...trendingSuggestions);
    }
    
    setSuggestions(suggestions.slice(0, 6));
  }, []);

  const analyzeSentiment = useCallback((businessId: string, reviews: any[]) => {
    const analysis: ReviewSentiment[] = reviews.map(review => ({
      reviewId: review.id,
      businessId,
      content: review.content,
      rating: review.rating,
      sentiment: {
        score: (review.rating - 3) * 0.5,
        magnitude: Math.abs(review.rating - 3) * 0.3,
        emotions: {
          joy: review.rating >= 4 ? 0.8 : 0.2,
          anger: review.rating <= 2 ? 0.7 : 0.1,
          fear: 0.1,
          sadness: review.rating <= 2 ? 0.4 : 0.1,
          surprise: Math.random() * 0.3
        }
      },
      topics: extractTopics(review.content),
      keywords: extractKeywords(review.content)
    }));
    
    setSentimentAnalysis(analysis);
  }, []);

  const extractTopics = (content: string): string[] => {
    const topicKeywords = {
      'food': ['food', 'meal', 'dish', 'taste', 'flavor', 'delicious', 'tasty'],
      'service': ['service', 'staff', 'waiter', 'waitress', 'server', 'friendly', 'helpful'],
      'atmosphere': ['atmosphere', 'ambiance', 'cozy', 'loud', 'quiet', 'busy', 'relaxing'],
      'value': ['price', 'expensive', 'cheap', 'value', 'worth', 'affordable', 'cost'],
      'cleanliness': ['clean', 'dirty', 'hygiene', 'sanitary', 'tidy', 'mess']
    };
    
    const topics: string[] = [];
    const contentLower = content.toLowerCase();
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics;
  };

  const extractKeywords = (content: string): string[] => {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const generatePersonalizedRecommendations = useCallback(() => {
    const userPreferences = {
      preferredCategories: ['Coffee Shop', 'Italian Restaurant', 'Bookstore'],
      pricePreference: 2,
      ratingThreshold: 4.0,
      distancePreference: 3,
      features: ['WiFi', 'Outdoor Seating', 'Parking']
    };
    
    const recommendations = mockBusinessResults.map(business => {
      let score = 0;
      
      if (userPreferences.preferredCategories.includes(business.category)) score += 0.4;
      if (Math.abs(business.priceLevel - userPreferences.pricePreference) <= 1) score += 0.2;
      if (business.rating >= userPreferences.ratingThreshold) score += 0.3;
      if (business.distance <= userPreferences.distancePreference) score += 0.1;
      
      const featureMatches = business.features.filter(f => 
        userPreferences.features.includes(f)
      ).length;
      score += featureMatches * 0.05;
      
      return { ...business, matchScore: score };
    })
    .filter(business => business.matchScore > 0.3)
    .sort((a, b) => b.matchScore - a.matchScore);
    
    setPersonalizedRecommendations(recommendations);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      performSemanticSearch(query);
      setActiveTab('results');
    } else {
      setSearchResults([]);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    performSemanticSearch(suggestion.text);
    setActiveTab('results');
  };

  const applyFilters = (results: BusinessResult[]): BusinessResult[] => {
    return results.filter(business => {
      if (filters.category.length > 0 && !filters.category.includes(business.category)) return false;
      if (business.priceLevel < filters.priceRange[0] || business.priceLevel > filters.priceRange[1]) return false;
      if (business.rating < filters.rating) return false;
      if (business.distance > filters.distance) return false;
      if (filters.features.length > 0 && !filters.features.some(f => business.features.includes(f))) return false;
      
      return true;
    });
  };

  const getBusinessRecommendationScore = (business: BusinessResult): number => {
    const weights = {
      rating: 0.3,
      reviewCount: 0.2,
      sentiment: 0.25,
      distance: 0.15,
      match: 0.1
    };
    
    const ratingScore = business.rating / 5;
    const reviewScore = Math.min(business.reviewCount / 500, 1);
    const sentimentScore = business.sentiment === 'positive' ? 1 : business.sentiment === 'neutral' ? 0.5 : 0;
    const distanceScore = Math.max(0, 1 - business.distance / 10);
    const matchScore = business.matchScore;
    
    return (
      ratingScore * weights.rating +
      reviewScore * weights.reviewCount +
      sentimentScore * weights.sentiment +
      distanceScore * weights.distance +
      matchScore * weights.match
    );
  };

  useEffect(() => {
    generateSuggestions(searchQuery);
  }, [searchQuery, generateSuggestions]);

  useEffect(() => {
    generatePersonalizedRecommendations();
    setTrendingSearches([
      'best brunch spots',
      'coffee shops with wifi',
      'romantic restaurants',
      'family friendly dining',
      'late night food'
    ]);
  }, [generatePersonalizedRecommendations]);

  const filteredResults = applyFilters(searchResults);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI-Powered Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Ask for anything... 'cozy coffee shop with wifi' or 'best sushi near downtown'"
                className="pl-10 pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Sliders className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isSearching}
                >
                  {isSearching ? <Sparkles className="w-4 h-4 animate-pulse" /> : 'Search'}
                </Button>
              </div>
            </div>

            {suggestions.length > 0 && searchQuery && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            )}

            {showFilters && (
              <Card className="p-4 bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price Range</label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                      max={4}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$</span>
                      <span>$$$$</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Minimum Rating</label>
                    <Slider
                      value={[filters.rating]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
                      max={5}
                      min={0}
                      step={0.5}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {filters.rating}+ stars
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Distance</label>
                    <Slider
                      value={[filters.distance]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                      max={25}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Within {filters.distance} miles
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">
            Search Results ({filteredResults.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            For You ({personalizedRecommendations.length})
          </TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="sentiment">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {isSearching ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">AI is analyzing your search...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((business) => (
                <Card key={business.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        <p className="text-sm text-muted-foreground">{business.category} • {business.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{business.rating}</span>
                          <span className="text-sm text-muted-foreground">({business.reviewCount})</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {'$'.repeat(business.priceLevel)} • {business.distance}mi
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-4">{business.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {business.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-blue-900">AI Recommendation</div>
                          <div className="text-sm text-blue-800">{business.aiRecommendationReason}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{business.sentiment}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Match: {(business.matchScore * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Write Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Personalized for You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalizedRecommendations.map((business) => (
                  <div key={business.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{business.name}</h4>
                          <p className="text-sm text-muted-foreground">{business.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{business.rating}</span>
                          </div>
                          <div className="text-xs text-green-600">
                            {(getBusinessRecommendationScore(business) * 100).toFixed(0)}% match
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{business.aiRecommendationReason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Trending Searches</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => handleSearch(search)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span>{search}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Sentiment</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Positive
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Joy</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Concerns</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Food Quality</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      92% Positive
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Service</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      76% Positive
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Atmosphere</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      88% Positive
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Value</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      68% Positive
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}