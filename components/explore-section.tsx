"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Filter, TrendingUp } from 'lucide-react';

export function ExploreSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', count: 1234 },
    { id: 'restaurants', name: 'Restaurants', count: 456 },
    { id: 'coffee', name: 'Coffee Shops', count: 234 },
    { id: 'retail', name: 'Retail', count: 345 },
    { id: 'services', name: 'Services', count: 199 }
  ];

  const featuredBusinesses = [
    {
      id: 1,
      name: 'The Blockchain Café',
      category: 'Coffee Shop',
      rating: 4.8,
      reviews: 127,
      location: 'Downtown District',
      verified: true,
      description: 'First café to accept ALGO payments with instant confirmations'
    },
    {
      id: 2,
      name: 'Crypto Corner Store',
      category: 'Retail',
      rating: 4.6,
      reviews: 89,
      location: 'Tech Quarter',
      verified: true,
      description: 'Your one-stop shop for blockchain merchandise and tech gear'
    },
    {
      id: 3,
      name: 'DeFi Dining',
      category: 'Restaurant',
      rating: 4.7,
      reviews: 203,
      location: 'Financial District',
      verified: false,
      description: 'Fine dining with smart contract ordering and ALGO rewards'
    }
  ];

  const trendingSearches = [
    'coffee shops near me',
    'restaurants accepting crypto',
    'blockchain services',
    'verified businesses',
    'highest rated'
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log('Selected category:', categoryId);
  };

  return (
    <section className="section-spacing px-4 bg-gradient-to-b from-slate-800/30 to-transparent">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            🔍 Explore Businesses
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-poppins mb-4 text-white">
            Discover & Review
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find amazing businesses, read authentic reviews, and earn ALGO rewards for your contributions
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid gap-6 md:grid-cols-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search for restaurants, cafes, shops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategorySelect(category.id)}
                        className={selectedCategory === category.id ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {category.name} ({category.count})
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Trending Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(search)}
                className="text-gray-300 border-slate-600 hover:border-green-500 hover:text-green-400"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6 text-white">Featured Businesses</h3>
          <div className="grid-responsive gap-6">
            {featuredBusinesses.map((business) => (
              <Card key={business.id} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all duration-300 hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-white">{business.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{business.category}</Badge>
                        {business.verified && (
                          <Badge className="bg-green-500/20 text-green-400">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-white">{business.rating}</span>
                      </div>
                      <div className="text-sm text-gray-400">{business.reviews} reviews</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{business.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{business.location}</span>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Write Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            onClick={() => console.log('View all businesses')}
          >
            View All Businesses
          </Button>
        </div>
      </div>
    </section>
  );
}